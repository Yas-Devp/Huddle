# Auth API

### 1. Register

**POST** `/auth/register`

```json
{
  "nom": "Boulhout",
  "prenom": "Yassine",
  "email": "test@huddle.com",
  "password": "password123",
  "telephone": "+212600000000" // or null
}
```

_Returns 201 on success. Returns 409 if email exists._

### 2. Login

**POST** `/auth/login`

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
  "token": "eyJhbGciOiJIUzI1...",
  "user": { "id": 1, "nom": "Boulhout", "role": "user" }
}
```

### 3. Test Middleware (Protected Route)

**GET** `/auth/me`
**Headers:** `Authorization: Bearer <token>`

---

### Frontend Guide (Next.js)

**Saving the token:**
When login succeeds, save the token:
`localStorage.setItem('token', data.token);`

**Accessing protected routes:**

```javascript
fetch("http://localhost:5000/auth/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```
