# Huddle API Documentation

## 🔐 Auth API

### 1. Register

**POST** `/auth/register`
**Body (JSON):**

```json
{
  "nom": "Boulhout",
  "prenom": "Yassine",
  "email": "test@huddle.com",
  "password": "password123",
  "telephone": "+212600000000"
}
```

_Note: `telephone` is optional. Returns 201 on success, 409 if email exists._

### 2. Login

**POST** `/auth/login`
**Body (JSON):**

```json
{
  "email": "test@huddle.com",
  "password": "password123"
}
```

**Returns (200):**

```json
{
  "message": "Connexion réussie.",
  "user": { "id": 1, "nom": "Boulhout", "role": "user" }
}
```

_⚠️ **CRITICAL:** The JWT token is now returned in a secure `httpOnly` cookie named `access_token`. It is NOT in the JSON body anymore._

### 3. Test Auth (Protected Route)

**GET** `/auth/me`
_(Requires the `access_token` cookie)_

---

## 🗺️ Maps API

### 1. Get All Available Maps

**GET** `/maps`
_(Requires auth)_
**Returns (200):**

```json
{
  "maps": [
    {
      "id": 1,
      "nom": "cafeteria",
      "url": "./assets/rooms/cafeteria.json",
      "mapWidth": 480,
      "mapHeight": 320
    }
  ]
}
```

---

## 🏢 Workspaces API

### 1. Create Workspace

**POST** `/workspaces/create`
_(Requires auth)_
**Body (JSON):**

```json
{
  "nom": "Cafeteria Team",
  "description": "Our virtual office",
  "mapId": 1
}
```

_Automatically makes the creator an `admin` member._

### 2. Get My Workspaces

**GET** `/workspaces`
_(Requires auth)_
**Returns (200):**

```json
{
  "count": 1,
  "workspaces": [
    {
      "id": 3,
      "nom": "Cafeteria Team",
      "mapId": 1,
      "map": {
        "url": "./assets/rooms/cafeteria.json",
        "mapWidth": 480,
        "mapHeight": 320
      }
    }
  ]
}
```

### 3. Join Workspace With a Key

**POST** `/workspaces/join`
_(Requires auth, rate limited)_
**Body (JSON):**

```json
{
  "code": "K7QM-3XPD-9R"
}
```

The code is the workspace key (`WorkspaceInvitation.code`). Lowercase and
dashes are accepted. The server validates `isActive`, `expiresAt` and
`maxUses`, consumes one use and creates the `Member` row in one transaction.

Returns `201` on success, `200` when already a member, `400` for every
unusable key, and `429` after too many attempts.

### 4. Get My Workspace By ID

**GET** `/workspaces/:id`
_(Requires auth, MUST be a member of the workspace — `403` otherwise)_
**Returns (200):**

```json
{
  "workspace": {
    "id": 3,
    "nom": "Cafeteria Team",
    "map": {
      "url": "./assets/rooms/cafeteria.json",
      "mapWidth": 480,
      "mapHeight": 320
    }
  },
  "membership": { "id": 1, "role": "admin", "posX": 400, "posY": 300 },
  "members": [
    {
      "id": 1,
      "role": "admin",
      "user": { "nom": "Boulhout", "prenom": "Yassine" }
    }
  ],
  "invitation": { "code": "K7QM3XPD9R", "usedCount": 0 }
}
```

`invitation` is only returned to workspace admins.

### 5. Manage Keys (admin only)

- `GET /workspaces/:id/invitations` — list keys with usage.
- `POST /workspaces/:id/invitations` — body `{ "maxUses": 20, "expiresAt": "..." }` (both optional).
- `PATCH /workspaces/:id/invitations/:invitationId` — body `{ "isActive": false }` to revoke.

---

## 💻 Frontend Implementation Guide (Next.js)

### 1. Setup (Crucial for Cookies)

Because we are using `httpOnly` cookies, you **must** include `credentials: 'include'` in EVERY fetch request. Otherwise, the browser will not send or save the cookie.

**Create a fetch wrapper (or add this to all fetches):**

```javascript
const response = await fetch("http://localhost:5000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // <--- MUST HAVE THIS
  body: JSON.stringify({ email, password }),
});
```

### 2. Handling the Login

When login succeeds, **do not** save the token in localStorage. The browser saves the cookie automatically.

```javascript
if (response.ok) {
  const data = await response.json();
  // Just save the user info to display it in the UI
  localStorage.setItem("user", JSON.stringify(data.user));
  // Redirect to dashboard
}
```

### 3. Accessing Protected Routes

```javascript
const response = await fetch("http://localhost:5000/workspaces", {
  method: "GET",
  credentials: "include", // <--- MUST HAVE THIS
  // No headers needed! The cookie is sent automatically.
});
```

### 4. Logging Out

To log out, you need to clear the cookie. Since it's `httpOnly`, you cannot clear it with JavaScript. The backend needs a `/auth/logout` route.
_(Note: I will add the `/auth/logout` route to the backend tomorrow so you can wire up the logout button)._
