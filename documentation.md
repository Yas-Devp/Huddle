# Huddle: Project Documentation

Huddle is a workspace-based virtual office. Teams create or join a workspace, pick a 2D office map, and meet in a shared space instead of switching between calls. The planned experience is proximity-based: audio and video connect when avatars are near each other.

This document describes the repository as it is today: architecture, setup, data model, API, frontend, security posture, known issues, and the suggested next steps.

> **Source snapshot:** branch `feature/workspaces`, commit `89196a1`, 18 November 2026, plus the workspace-key work.
> **Verification status:** `npm run build` and `npm run lint` pass in `client/`. The API compiles and its routing was smoke-tested (`/api/users` 200, unknown path 404, protected routes 401). No MySQL instance was available, so the database-backed flows below are reviewed but not exercised end to end.

---

## Table of contents

1. [Overview](#1-overview)
2. [Feature status](#2-feature-status)
3. [Tech stack](#3-tech-stack)
4. [Repository structure](#4-repository-structure)
5. [Architecture](#5-architecture)
6. [Getting started](#6-getting-started)
7. [Environment variables](#7-environment-variables)
8. [Database and data model](#8-database-and-data-model)
9. [API reference](#9-api-reference)
10. [Frontend guide](#10-frontend-guide)
11. [Server guide](#11-server-guide)
12. [Key user flows](#12-key-user-flows)
13. [Scripts reference](#13-scripts-reference)
14. [Git branching strategy](#14-git-branching-strategy)
15. [Troubleshooting](#15-troubleshooting)
16. [Glossary](#16-glossary)

- [Appendix A: Key file map](#appendix-a-key-file-map)
- [Appendix B: API quick reference](#appendix-b-api-quick-reference)

---

## 1. Overview

Huddle is two applications in one repository:

| Part      | Responsibility                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `client/` | Next.js App Router frontend: landing page, auth screens, dashboard, workspace creation and join forms, and the workspace screen. |
| `server/` | Express 5 REST API: JWT authentication in an HttpOnly cookie, workspace membership, maps, and Prisma access to MariaDB/MySQL.    |
| `shared/` | Markdown notes and an earlier API draft. Not runtime code, and partly out of date.                                               |

There is no root `package.json`. Install and run `client/` and `server/` separately.

The root `README.md` describes real-time features built on Phaser 3, Socket.io, and WebRTC. None of those are in the current code: neither `phaser` nor `socket.io` appears in either dependency list. What exists today is the foundation: accounts, workspaces, maps, a dashboard, and the workspace UI shell.

---

## 2. Feature status

| Area                                 | Status          | Notes                                                                                                                     |
| ------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Landing page                         | Implemented     | `/`, responsive hero, theme toggle, auth-aware navbar.                                                                    |
| Register                             | Implemented     | Client and server validation, bcrypt hashing.                                                                             |
| Login and logout                     | Implemented     | JWT stored in an HttpOnly `access_token` cookie.                                                                          |
| Session restore                      | Implemented     | `GET /auth/me` runs on app mount through `AuthProvider`.                                                                  |
| Profile page                         | Implemented     | `/me` is read-only.                                                                                                       |
| Dashboard                            | Implemented     | Lists the user's workspaces, with search, create and join entry points, and card menus.                                   |
| Create workspace                     | Implemented     | Posts to `POST /workspaces/create`. Requires a numeric map ID typed by the user. Returns the first workspace key.         |
| Join by invitation code              | Implemented     | `POST /workspaces/join` takes a key, consumes one use transactionally, and creates the membership.                        |
| Workspace keys                       | Implemented     | Admins see the key in the space sidebar, copy it or its link, and rotate it. The API also supports expiry and use limits. |
| Workspace access control             | Implemented     | Every workspace route requires a `Member` row. The room screen sends non-members to the key form.                         |
| Workspace screen shell               | Partial         | Icon rail, sidebar, people list, invite card, and media bar work. The map area is a placeholder.                          |
| Illustrated office scene             | Present, unused | `OfficeScene.js` contains an SVG scene that nothing imports.                                                              |
| Real-time presence and proximity A/V | Not started     | No Socket.io, WebRTC, or Phaser code.                                                                                     |
| Chat and conversations               | Schema only     | Models exist. No endpoints or UI.                                                                                         |
| Automated tests                      | None            | No test files or runner.                                                                                                  |
| CI, Docker, `.env.example`           | None            | No workflows, container files, or example env files.                                                                      |

---

## 3. Tech stack

### Frontend (`client/`)

| Package                                         | Version             | Purpose                                                        |
| ----------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| `next`                                          | 16.4.5              | App Router, Turbopack, React Compiler, Cache Components.       |
| `react`, `react-dom`                            | 19.3.0              | UI runtime.                                                    |
| `tailwindcss`, `@tailwindcss/turbopack`         | ^4                  | CSS-first styling. There is no `tailwind.config` file.         |
| `shadcn`                                        | ^4.23.0             | Component CLI. Components are vendored in `src/components/ui`. |
| `@base-ui/react`                                | ^1.9.0              | Primitives behind the shadcn components. Not Radix.            |
| `lucide-react`, `@hugeicons/*`, `react-icons`   | various             | Icon sets. Lucide is the default.                              |
| `react-hook-form`, `@hookform/resolvers`, `zod` | ^7.91 / ^7.0 / ^4.6 | Form state and validation.                                     |
| `axios`                                         | ^1.21.0             | HTTP client with `withCredentials`.                            |
| `next-themes`                                   | ^0.4.6              | Light, dark, and system theme.                                 |
| `sonner`                                        | ^2.0.8              | Toast notifications.                                           |
| `date-fns`                                      | ^4.4.0              | Relative timestamps on workspace cards.                        |
| `class-variance-authority`, `tw-animate-css`    | ^0.7.1 / ^1.4.0     | Variants and animation utilities.                              |

Dev tooling: ESLint 9 with `eslint-config-next/core-web-vitals`, the Babel React Compiler plugin, and the Turbopack pipeline.

### Backend (`server/`)

| Package                              | Version          | Purpose                                            |
| ------------------------------------ | ---------------- | -------------------------------------------------- |
| `express`                            | ^5.3.0           | HTTP API. ESM (`"type": "module"`).                |
| `@prisma/client`, `prisma`           | ^7.10.1          | ORM and CLI.                                       |
| `@prisma/adapter-mariadb`, `mariadb` | ^7.10.1 / ^3.5.5 | Driver adapter and MariaDB/MySQL driver.           |
| `bcrypt`                             | ^6.0.0           | Password hashing, cost factor 10.                  |
| `jsonwebtoken`                       | ^9.0.3           | JWT signing and verification, 24-hour expiry.      |
| `cookie-parser`, `cors`, `dotenv`    | various          | Cookies, cross-origin access, environment loading. |
| `nodemon`                            | ^3.1.14          | Development auto-restart.                          |

### Data and tooling

- **Database:** MySQL-compatible. Runtime uses Prisma 7's MariaDB adapter.
- **Schema and migrations:** `server/prisma/schema.prisma` and `server/prisma/migrations/`.
- **Generated client:** `server/generated/prisma/`, gitignored, created by `npm run db:generate`.
- **Language:** JavaScript throughout. `jsconfig.json` defines only the `@/*` alias.
- **Package manager:** npm. Each app has its own lockfile.

---

## 4. Repository structure

```text
Huddle/
├─ client/
│  ├─ public/logo/                       Logo PNG and SVG variants
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (auth)/
│  │  │  │  ├─ dashbord/                 Dashboard (spelling is intentional in the route)
│  │  │  │  │  ├─ (components)/          WorkspaceCard, ResourcesMenu
│  │  │  │  │  └─ page.js
│  │  │  │  ├─ login/page.js
│  │  │  │  ├─ me/page.js
│  │  │  │  ├─ register/page.js
│  │  │  │  └─ spaces/
│  │  │  │     ├─ create/page.js
│  │  │  │     └─ join/
│  │  │  │        ├─ page.js              Invitation-code form (UI only)
│  │  │  │        └─ [id_space]/
│  │  │  │           ├─ (components)/     IconRail, MediaBar, OfficeScene,
│  │  │  │           │                     WorkspaceMap, WorkspaceSidebar,
│  │  │  │           │                     clipboard.js, data.js
│  │  │  │           └─ page.js
│  │  │  ├─ (main)/
│  │  │  │  ├─ layout.js                 Adds the public navbar
│  │  │  │  └─ page.js                   Landing page
│  │  │  ├─ globals.css
│  │  │  └─ layout.js                    Root layout, providers, fonts
│  │  ├─ components/
│  │  │  ├─ context/auth.js              AuthProvider and useAuth
│  │  │  ├─ forms/                       Auth shell, visual, login, register, password
│  │  │  ├─ navbar/                      Navbar, UserAuth
│  │  │  ├─ router/                      Connect_Auth and Connect_Dash API wrappers
│  │  │  ├─ ui/                          Vendored shadcn / Base UI primitives
│  │  │  ├─ mode-toggle.js
│  │  │  └─ theme-provider.js
│  │  └─ lib/
│  │     ├─ axios.js                     Axios instance
│  │     ├─ utils.js                     cn re-export
│  │     └─ validations/                 auth.js, space.js (Zod schemas)
│  ├─ components.json                    shadcn config
│  ├─ eslint.config.mjs
│  ├─ jsconfig.json
│  ├─ next.config.mjs
│  └─ package.json
├─ server/
│  ├─ prisma/
│  │  ├─ migrations/
│  │  │  ├─ 20261107234509_stap_all_tables/
│  │  │  └─ 20261118185629_add_workspace_invitations/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ controllers/                    login, logout, register, workspace, map
│  │  ├─ lib/prisma.js                   Prisma client with MariaDB adapter
│  │  ├─ middleware/auth.js              verifyToken
│  │  ├─ routes/                         auth, workspace, map, user
│  │  ├─ app.js                          Express app and route mounting
│  │  └─ server.js                       Process entry point
│  ├─ prisma.config.ts
│  ├─ RunDatabase.md
│  └─ package.json
├─ shared/
│  ├─ readme.md                          Earlier API draft (partly outdated)
│  └─ frontend.md                        Notes on the workspace UI
├─ README.md
├─ LICENSE                               MIT
└─ text.txt                              Historical task prompt, not application code
```

### Structure notes

- Route groups `(auth)` and `(main)` do not appear in URLs. They only decide which layout applies.
- `(components)` folders are colocated with the page that owns them.
- `client/src/components/router/` holds API wrappers despite the name.
- The dashboard route is `/dashbord` everywhere. Links depend on that spelling, so renaming it means updating every reference.

---

## 5. Architecture

### High-level view

```mermaid
flowchart LR
  B[Browser]
  C["Next.js client<br/>localhost:3000"]
  A["Express API<br/>localhost:5000"]
  P["Prisma 7<br/>MariaDB adapter"]
  D[("MySQL / MariaDB")]

  B -->|pages, forms| C
  C -->|"Axios + cookies<br/>withCredentials"| A
  A -->|queries| P
  P -->|SQL| D
  A -->|"Set-Cookie: access_token"| C
```

### Client

- Next.js App Router. Interactive pages begin with `"use client"`. The landing page and layouts are server components.
- One React context, `AuthProvider`, owns the current user and session state.
- All API calls go through two wrapper objects: `Connect_Auth` and `Connect_Dash`.
- UI state is local (`useState`). There is no global store and no data-fetching library.
- Sonner toasts are mounted once in the root layout.
- `next-themes` manages the theme. No screen forces a theme: the dashboard, key pages, workspace screen and auth screens all follow the selected light/dark/system preference, and `globals.css` sets `color-scheme` for each.

### Server

- The Express app is built in `src/app.js`. `src/server.js` starts the listener.
- Middleware order: CORS, JSON body parser, URL-encoded parser, cookie parser, route mounts, then the debug routes.
- Routes are thin. Controllers hold the logic and call the shared Prisma client directly.
- A single `verifyToken` middleware reads `req.cookies.access_token` and verifies it with `JWT_SECRET`.
- There is no service or repository layer yet.

### Request lifecycle

1. A page calls a wrapper, for example `Connect_Dash.getWorkspaces()`.
2. Axios sends the request to `NEXT_PUBLIC_BACKEND_URL` with `withCredentials: true`.
3. CORS allows the configured client origin with credentials.
4. `cookie-parser` exposes the `access_token` cookie.
5. `verifyToken` (on protected routes) verifies the JWT and sets `req.user`.
6. The controller validates input, runs Prisma queries, and returns JSON.
7. The client updates state and shows a toast if needed.

### Session lifecycle

```mermaid
sequenceDiagram
  participant U as User
  participant C as Next.js client
  participant A as Express API
  participant D as MariaDB

  U->>C: Submit login form
  C->>A: POST /auth/login { email, password }
  A->>D: SELECT user WHERE email = ?
  D-->>A: user row
  A->>A: bcrypt.compare(password, hash)
  A-->>C: 200 { token, user } + Set-Cookie access_token (HttpOnly)
  C->>C: AuthProvider stores user in memory
  C-->>U: Redirect

  Note over C,A: On every full page load
  C->>A: GET /auth/me (cookie sent automatically)
  A->>A: Verify JWT
  A->>D: SELECT user by id
  A-->>C: 200 { user } or 401
```

Key properties:

- The JWT expires after **24 hours**. There is no refresh flow; once it expires, the next `/auth/me` fails and the user is signed out.
- The cookie is `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` when `NODE_ENV=production`.
- The client does not write the token to `localStorage`. The login response also includes the token in the body, which is not needed.

### Route protection

Protection is client-side only, and the API is the real enforcement point:

- `AuthProvider` restores the session on mount and exposes `isLoading`, `isAuthenticated`, and `user`.
- `/dashbord` sends unauthenticated users to `/me` after loading. `/me` then sends them to `/login`.
- `/login` and `/register` send authenticated users to `/dashbord`.
- The workspace screen calls `GET /workspaces/:id`. A `403` sends the visitor to `/spaces/join?next=<id>`, an unauthenticated visitor goes to `/login`. The API is what actually enforces membership; the redirect is only the user interface for it.
- Protected API endpoints return 401 when the cookie is missing, invalid or expired, and 403 when the caller is signed in but not allowed.

---

## 6. Getting started

### Prerequisites

- **Node.js 20.9 or newer** (Next.js 16 requirement).
- **MySQL 8** or **MariaDB 10.11+**, or a compatible hosted database.
- npm and two terminals.

### 1. Install the server

```bash
cd server
npm install
```

### 2. Create `server/.env`

```dotenv
DATABASE_URL="mysql://huddle:huddle@localhost:3306/huddle"
PORT=5000
JWT_SECRET="replace-with-a-long-random-string"
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
```

Create the database and a user with privileges on it first:

```sql
CREATE DATABASE huddle CHARACTER SET utf8mb4;
CREATE USER 'huddle'@'localhost' IDENTIFIED BY 'huddle';
GRANT ALL PRIVILEGES ON huddle.* TO 'huddle'@'localhost';
```

### 3. Generate the Prisma client and apply migrations

```bash
npm run db:generate
npm run db:deploy
```

- `db:generate` writes the client to `server/generated/prisma`.
- `db:deploy` applies committed migrations without creating new ones.
- Use `npm run db:migrate` only when you are changing the schema.

**There is no seed script.** The `maps` table starts empty, and workspace creation fails without a valid `mapId`. Add at least one map first:

```sql
INSERT INTO maps (nom, url, map_width, map_height, update_at)
VALUES ('Cafeteria', '/assets/rooms/cafeteria.json', 480, 320, NOW(3));
```

### 4. Start the API

```bash
npm run dev
```

The server listens on `http://localhost:5000` and logs `Server running at http://localhost:5000`.

### 5. Install and configure the client

```bash
cd client
npm install
```

Create `client/.env`:

```dotenv
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"
```

Use the origin only, with **no `/api` suffix**. Routes are mounted at the root (`/auth/login`, `/workspaces`).

### 6. Start the client

```bash
npm run dev
```

Open `http://localhost:3000`, register at `/register`, and sign in at `/login`.

### Summary

| Service  | Directory | Command       | URL                        |
| -------- | --------- | ------------- | -------------------------- |
| API      | `server/` | `npm run dev` | `http://localhost:5000`    |
| Web      | `client/` | `npm run dev` | `http://localhost:3000`    |
| Database | external  | MySQL/MariaDB | `localhost:3306` (example) |

> There is no root `package.json`. Running `npm run dev` at the repository root fails.

---

## 7. Environment variables

### Server (`server/.env`)

| Variable       | Required | Default                 | Purpose                                                                                                 |
| -------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | none                    | MariaDB/MySQL connection string. Read by `src/lib/prisma.js` and `prisma.config.ts`.                    |
| `PORT`         | No       | `5000`                  | Express listening port.                                                                                 |
| `JWT_SECRET`   | Yes      | none                    | HMAC secret for signing and verifying tokens. Use at least 32 random bytes. The server has no fallback. |
| `NODE_ENV`     | No       | none                    | When `production`, the auth cookie gets the `Secure` flag.                                              |
| `CLIENT_URL`   | No       | `http://localhost:3000` | Allowed CORS origin, read in `app.js`. Not present in the current `.env` example.                       |

### Client (`client/.env`)

| Variable                  | Required | Purpose                                                                  |
| ------------------------- | -------- | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_BACKEND_URL` | Yes      | API origin, for example `http://localhost:5000`. Visible to the browser. |

### Handling secrets

- `client/.gitignore` ignores `.env*`. `server/.gitignore` ignores `.env`.
- Add `server/.env.example` and `client/.env.example` with placeholder values. Neither exists yet.
- Only variables prefixed with `NEXT_PUBLIC_` reach the browser. Never put `DATABASE_URL` or `JWT_SECRET` in a client variable.

---

## 8. Database and data model

### Setup

- Prisma provider: `mysql`. Runtime adapter: MariaDB.
- `server/src/lib/prisma.js` builds the adapter from the URL with a connection limit of 5.
- The generated client is not committed. Run `npm run db:generate` after cloning and after every schema change.

### Entity-relationship diagram

```mermaid
erDiagram
  USER ||--o{ WORKSPACE : owns
  WORKSPACE_MAP o|--o{ WORKSPACE : "used by"
  USER ||--o{ MEMBER : joins
  WORKSPACE ||--o{ MEMBER : has
  MEMBER ||--o{ CONVERSATION : creates
  WORKSPACE ||--o{ CONVERSATION : hosts
  CONVERSATION ||--o{ MESSAGE : contains
  WORKSPACE ||--o{ MESSAGE : scopes
  MEMBER ||--o{ MESSAGE : sends
  CONVERSATION ||--o{ CONVERSATION_INVITATION : invites
  WORKSPACE ||--o{ CONVERSATION_INVITATION : scopes
  MEMBER ||--o{ CONVERSATION_INVITATION : inviter
  MEMBER ||--o{ CONVERSATION_INVITATION : invitee
  CONVERSATION ||--o{ CONVERSATION_PARTICIPANT : includes
  WORKSPACE ||--o{ CONVERSATION_PARTICIPANT : scopes
  MEMBER ||--o{ CONVERSATION_PARTICIPANT : participates
  WORKSPACE ||--o{ WORKSPACE_INVITATION : has
  USER ||--o{ WORKSPACE_INVITATION : creates
```

### Models

Models use integer auto-increment primary keys and snake_case table names. Timestamps are `createdAt` and `updatedAt`, mapped to `create_at` and `update_at`, except where noted.

#### `User` → `users`

| Field                     | Type       | Notes                                                 |
| ------------------------- | ---------- | ----------------------------------------------------- |
| `id`                      | `Int`      | Primary key.                                          |
| `nom`                     | `String`   | Last name.                                            |
| `prenom`                  | `String`   | First name.                                           |
| `email`                   | `String`   | Unique.                                               |
| `password`                | `String`   | bcrypt hash.                                          |
| `telephone`               | `String?`  | Optional.                                             |
| `role`                    | `String`   | Defaults to `"user"`. Not used for authorization yet. |
| `createdAt` / `updatedAt` | `DateTime` | Mapped to `create_at` / `update_at`.                  |

#### `WorkspaceMap` → `maps`

| Field                     | Type       | Notes                                             |
| ------------------------- | ---------- | ------------------------------------------------- |
| `id`                      | `Int`      | Primary key.                                      |
| `nom`                     | `String`   | Map name.                                         |
| `url`                     | `String`   | Asset path or URL, for example a Phaser JSON map. |
| `mapWidth` / `mapHeight`  | `Int`      | Mapped to `map_width` / `map_height`.             |
| `createdAt` / `updatedAt` | `DateTime` | Timestamps.                                       |

#### `Workspace` → `workspaces`

| Field                     | Type       | Notes                                |
| ------------------------- | ---------- | ------------------------------------ |
| `id`                      | `Int`      | Primary key.                         |
| `nom`                     | `String`   | Name.                                |
| `description`             | `String?`  | Optional.                            |
| `ownerId`                 | `Int`      | FK to `users.id`, mapped `owner_id`. |
| `mapId`                   | `Int?`     | FK to `maps.id`, mapped `map_id`.    |
| `createdAt` / `updatedAt` | `DateTime` | Timestamps.                          |

#### `Member` → `members`

A user's membership in a workspace. Conversations and map positions refer to members, not users.

| Field                     | Type       | Notes                                                        |
| ------------------------- | ---------- | ------------------------------------------------------------ |
| `id`                      | `Int`      | Primary key.                                                 |
| `userId`                  | `Int`      | FK to `users.id`, mapped `user_id`.                          |
| `workspaceId`             | `Int`      | FK to `workspaces.id`, mapped `workspace_id`.                |
| `role`                    | `String`   | Defaults to `"member"`. The creator gets `"admin"`.          |
| `posX` / `posY`           | `Float`    | Map position, mapped `pos_x` / `pos_y`. Spawn is (400, 300). |
| `createdAt` / `updatedAt` | `DateTime` | Timestamps.                                                  |

Unique constraint: `(userId, workspaceId)`.

#### `Conversation` → `conversations`

| Field                   | Type                     | Notes                                       |
| ----------------------- | ------------------------ | ------------------------------------------- |
| `id`                    | `Int`                    | Primary key.                                |
| `createdById`           | `Int`                    | FK to `members.id`, mapped `created_by_id`. |
| `workspaceId`           | `Int`                    | FK to `workspaces.id`.                      |
| `type`                  | `String`                 | Free text today. An enum would be safer.    |
| `status`                | `String`                 | Defaults to `"active"`.                     |
| `startedAt` / `endedAt` | `DateTime` / `DateTime?` | Mapped `started_at` / `ended_at`.           |

#### `Message` → `messages`

| Field            | Type       | Notes                              |
| ---------------- | ---------- | ---------------------------------- |
| `id`             | `Int`      | Primary key.                       |
| `conversationId` | `Int`      | FK to `conversations.id`, indexed. |
| `workspaceId`    | `Int`      | FK to `workspaces.id`.             |
| `senderMemberId` | `Int`      | FK to `members.id`.                |
| `content`        | `String`   | Message body.                      |
| `createdAt`      | `DateTime` | Mapped `create_at`.                |

#### `ConversationInvitation` → `conversation_invitations`

| Field                                     | Type                | Notes                                                   |
| ----------------------------------------- | ------------------- | ------------------------------------------------------- |
| `id`                                      | `Int`               | Primary key.                                            |
| `conversationId`, `workspaceId`           | `Int`               | Foreign keys.                                           |
| `inviterMemberId`, `inviteeMemberId`      | `Int`               | Foreign keys to `members.id`.                           |
| `status`                                  | `String`            | Defaults to `"pending"`.                                |
| `createdAt` / `respondedAt` / `expiresAt` | `DateTime` variants | Mapped to `created_at` / `responded_at` / `expires_at`. |

#### `ConversationParticipant` → `conversation_participants`

| Field                                       | Type                     | Notes                           |
| ------------------------------------------- | ------------------------ | ------------------------------- |
| `id`                                        | `Int`                    | Primary key.                    |
| `conversationId`, `workspaceId`, `memberId` | `Int`                    | Foreign keys.                   |
| `joinedAt` / `leftAt`                       | `DateTime` / `DateTime?` | Mapped `joined_at` / `left_at`. |

Unique constraint: `(conversationId, memberId)`.

#### `WorkspaceInvitation` → `workspace_invitations`

Invitation codes for joining a workspace.

| Field         | Type        | Notes                                  |
| ------------- | ----------- | -------------------------------------- |
| `id`          | `Int`       | Primary key.                           |
| `code`        | `String`    | Unique.                                |
| `workspaceId` | `Int`       | Indexed. Cascades on workspace delete. |
| `createdById` | `Int`       | FK to `users.id`.                      |
| `maxUses`     | `Int?`      | Optional cap.                          |
| `usedCount`   | `Int`       | Defaults to `0`.                       |
| `isActive`    | `Boolean`   | Defaults to `true`.                    |
| `expiresAt`   | `DateTime?` | Optional expiry.                       |
| `createdAt`   | `DateTime`  | Mapped `created_at`.                   |

The model **is** the workspace key. `POST /workspaces/join` looks the code up, checks `isActive`, `expiresAt` and `maxUses`, claims one use with an atomic `UPDATE ... WHERE used_count < max_uses`, and creates the `Member` row in the same transaction. Admins manage keys through `/workspaces/:id/invitations`.

Codes are generated with `crypto.randomBytes` from a 32-symbol alphabet with no `I`, `L`, `O` or `U`, 10 characters long (50 bits). They are stored uppercase and display as `K7QM-3XPD-9R`. Lookups normalize case and dashes first, so every common way of typing a key works.

### Migrations

| Migration                                  | Contents                                                                                                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `20261107234509_stap_all_tables`           | Creates `users`, `maps`, `workspaces`, `members`, `conversations`, `messages`, `conversation_invitations`, `conversation_participants`, and their foreign keys. |
| `20261118185629_add_workspace_invitations` | Creates `workspace_invitations` with a unique `code`, an index on `workspace_id`, and foreign keys.                                                             |

Foreign-key behavior:

- Deleting a user is blocked while they own workspaces or have memberships.
- Deleting a map sets `workspaces.map_id` to `NULL`.
- Deleting a workspace cascades to its workspace invitations.

### Prisma commands

| Command               | Effect                                                |
| --------------------- | ----------------------------------------------------- |
| `npm run db:generate` | Regenerate the client into `generated/prisma`.        |
| `npm run db:migrate`  | Create and apply a development migration.             |
| `npm run db:deploy`   | Apply existing migrations (use in CI and production). |
| `npm run db:studio`   | Open Prisma Studio.                                   |
| `npm run db:validate` | Validate the schema.                                  |
| `npm run db:format`   | Format the schema.                                    |
| `npm run db:pull`     | Introspect the database into the schema.              |

---

## 9. API reference

### Conventions

| Item           | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Base URL (dev) | `http://localhost:5000`                                                             |
| Format         | JSON. URL-encoded bodies are also accepted.                                         |
| Authentication | HttpOnly cookie `access_token` containing a JWT. No `Authorization` header support. |
| Token lifetime | 24 hours.                                                                           |
| CORS           | One origin from `CLIENT_URL`, credentials enabled.                                  |
| Error shape    | `{ "message": "..." }`. Some handlers also include `error`.                         |

Protected endpoints return:

- **401** `{ "message": "Unauthorized" }` when the cookie is missing or the JWT is invalid/expired.
- **403** when the caller is authenticated but not allowed, for example not a member of the workspace.

### Endpoint summary

| Method  | Path                                        | Auth   | Purpose                                                         |
| ------- | ------------------------------------------- | ------ | --------------------------------------------------------------- |
| `POST`  | `/auth/register`                            | No     | Create an account.                                              |
| `POST`  | `/auth/login`                               | No     | Authenticate and set the cookie.                                |
| `POST`  | `/auth/logout`                              | No     | Clear the cookie.                                               |
| `GET`   | `/auth/me`                                  | Cookie | Return the current user.                                        |
| `GET`   | `/workspaces`                               | Cookie | List the caller's workspaces.                                   |
| `POST`  | `/workspaces/create`                        | Cookie | Create a workspace, an admin membership, and its first key.     |
| `POST`  | `/workspaces/join`                          | Cookie | Redeem a workspace key.                                         |
| `GET`   | `/workspaces/:id`                           | Member | Workspace, members, your role, and the key if you are an admin. |
| `GET`   | `/workspaces/:id/invitations`               | Admin  | List the workspace keys.                                        |
| `POST`  | `/workspaces/:id/invitations`               | Admin  | Create a key, optionally with `maxUses` / `expiresAt`.          |
| `PATCH` | `/workspaces/:id/invitations/:invitationId` | Admin  | Revoke a key (`isActive: false`) or change its expiry.          |
| `GET`   | `/maps`                                     | Cookie | List maps.                                                      |
| `GET`   | `/api/users`                                | None   | Debug check that the user router is mounted.                    |

### Auth endpoints

#### `POST /auth/register`

Required fields: `email`, `password`, `nom`, `prenom`. `telephone` is optional. The password is hashed with bcrypt (cost 10). The role is always set to `"user"`, regardless of the request body.

Request:

```json
{
  "nom": "Boulhout",
  "prenom": "Yassine",
  "email": "test@huddle.com",
  "password": "password123",
  "telephone": "+212600000000"
}
```

**201 Created**

```json
{
  "message": "user created successfully!",
  "user": {
    "id": 1,
    "email": "test@huddle.com",
    "nom": "Boulhout",
    "prenom": "Yassine",
    "role": "user"
  }
}
```

| Status | Cause                                                  |
| ------ | ------------------------------------------------------ |
| 400    | Missing fields, or password shorter than 6 characters. |
| 409    | Email already registered.                              |
| 500    | Unexpected failure.                                    |

> The API accepts passwords of 6 characters or more. The client requires 8 to 72. The client rule is the one users see.

#### `POST /auth/login`

Request:

```json
{ "email": "test@huddle.com", "password": "password123" }
```

**200 OK**. The response includes the user and a token, and sets the cookie:

```json
{
  "message": "Login successful.",
  "token": "<jwt>",
  "user": {
    "id": 1,
    "email": "test@huddle.com",
    "nom": "Boulhout",
    "prenom": "Yassine",
    "telephone": "+212600000000",
    "role": "user"
  }
}
```

Cookie attributes: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=86400`, and `Secure` in production.

| Status | Cause                                                                     |
| ------ | ------------------------------------------------------------------------- |
| 400    | Missing email or password.                                                |
| 401    | Unknown email or wrong password. Both return the same message on purpose. |
| 500    | Unexpected failure.                                                       |

#### `POST /auth/logout`

Clears `access_token` with matching path and security attributes. It does not require a valid token, so it works after the session has expired.

**200 OK**

```json
{ "message": "Logged out successfully" }
```

#### `GET /auth/me` (protected)

```json
{
  "message": "Vous êtes authentifié !",
  "user": {
    "id": 1,
    "email": "test@huddle.com",
    "nom": "Boulhout",
    "prenom": "Yassine",
    "telephone": "+212600000000",
    "role": "user"
  }
}
```

If the token is valid but the user has been deleted, the response is `200` with `user: null`. The client treats that as signed out.

### Workspace endpoints

#### `GET /workspaces` (protected)

Returns workspaces where the caller has a `Member` row, each with its map.

```json
{
  "count": 1,
  "workspaces": [
    {
      "id": 3,
      "nom": "Cafeteria Team",
      "description": "Our virtual office",
      "ownerId": 1,
      "mapId": 1,
      "createdAt": "2026-11-18T18:00:00.000Z",
      "updatedAt": "2026-11-18T18:00:00.000Z",
      "map": {
        "id": 1,
        "nom": "Cafeteria",
        "url": "/assets/rooms/cafeteria.json",
        "mapWidth": 480,
        "mapHeight": 320
      }
    }
  ]
}
```

The dashboard search filters on `nom`, which is the field the API returns.

#### `POST /workspaces/create` (protected)

```json
{ "nom": "Cafeteria Team", "description": "Our virtual office", "mapId": 1 }
```

- `nom` and `mapId` are required. `mapId` is parsed with `parseInt`.
- The map must exist.
- The creator becomes a `Member` with role `"admin"` at position (400, 300).
- The workspace, its admin membership and its first key are created in one transaction. A workspace without a key would be unreachable by anyone else.

**201 Created**

```json
{
  "message": "Workspace created successfully.",
  "workspace": {
    "id": 3,
    "nom": "Cafeteria Team",
    "description": "Our virtual office",
    "ownerId": 1,
    "mapId": 1,
    "createdAt": "2026-11-18T18:00:00.000Z",
    "updatedAt": "2026-11-18T18:00:00.000Z"
  },
  "invitation": {
    "id": 4,
    "code": "K7QM3XPD9R",
    "workspaceId": 3,
    "createdById": 1,
    "maxUses": null,
    "usedCount": 0,
    "isActive": true,
    "expiresAt": null,
    "createdAt": "2026-11-18T18:00:00.000Z"
  }
}
```

The client shows `invitation.code` on the success screen. It is the only time the create response exposes it, but admins can read it again through `GET /workspaces/:id`.

| Status | Cause                   |
| ------ | ----------------------- |
| 400    | Missing name or map ID. |
| 404    | Map not found.          |
| 500    | Unexpected failure.     |

#### `POST /workspaces/join` (protected, rate limited)

Redeems a **workspace key**. This is the only way to become a member from outside; there is no join-by-id path any more.

```json
{ "code": "k7qm-3xpd-9r" }
```

The code is normalized (uppercase, separators removed) before lookup. Ten failed or successful attempts per 15 minutes per IP + user return `429`.

| Status | Cause                                                                      |
| ------ | -------------------------------------------------------------------------- |
| 201    | Joined. Returns the workspace and the new `Member` row.                    |
| 200    | Already a member (`alreadyMember: true`); the room can be opened directly. |
| 400    | Missing, wrong, expired, revoked or exhausted key — one generic message.   |
| 401    | No or invalid `access_token` cookie.                                       |
| 429    | Rate limit hit. `Retry-After` is set.                                      |

Success response:

```json
{
  "message": "You have joined the workspace.",
  "alreadyMember": false,
  "workspace": { "id": 3, "nom": "Cafeteria Team", "mapId": 1 },
  "member": {
    "id": 7,
    "userId": 1,
    "workspaceId": 3,
    "role": "member",
    "posX": 400,
    "posY": 300
  }
}
```

The key is never echoed back, and every failure mode uses the same
`{ "code": "INVALID_INVITE", "message": "This key is invalid, expired, or no longer usable." }` so a wrong code cannot be distinguished from an expired one.

#### `GET /workspaces/:id` (member only)

Returns everything the workspace screen needs. `403` for non-members — this is the check that actually keeps people out of the room.

```json
{
  "workspace": {
    "id": 3,
    "nom": "Cafeteria Team",
    "description": "Our virtual office",
    "ownerId": 1,
    "mapId": 1,
    "createdAt": "2026-11-18T18:00:00.000Z",
    "map": {
      "id": 1,
      "nom": "Cafeteria",
      "url": "/assets/rooms/cafeteria.json",
      "mapWidth": 480,
      "mapHeight": 320
    }
  },
  "membership": { "id": 1, "role": "admin", "posX": 400, "posY": 300 },
  "members": [
    {
      "id": 1,
      "role": "admin",
      "posX": 400,
      "posY": 300,
      "user": { "id": 1, "nom": "Boulhout", "prenom": "Yassine" }
    }
  ],
  "invitation": {
    "id": 4,
    "code": "K7QM3XPD9R",
    "maxUses": null,
    "usedCount": 2,
    "isActive": true,
    "expiresAt": null,
    "createdAt": "2026-11-18T18:00:00.000Z"
  }
}
```

`invitation` is `null` for regular members: only admins can read and share the key.

#### `POST /workspaces/:id/invitations` (admin)

```json
{ "maxUses": 20, "expiresAt": "2026-12-31T23:59:59.000Z" }
```

Both fields are optional; with neither, the result is a permanent key. The
workspace creator receives one automatically at creation, so normal use never
needs this call.

| Status | Cause                                  |
| ------ | -------------------------------------- |
| 201    | Key created. Returns `{ invitation }`. |
| 400    | Invalid `maxUses` or `expiresAt`.      |
| 403    | Not a member, or not an admin.         |

#### `GET /workspaces/:id/invitations` (admin)

Returns every key with `usedCount`, `isActive` and `expiresAt`. Codes are visible to admins so they can re-share them; they are never stored in the client bundle.

#### `PATCH /workspaces/:id/invitations/:invitationId` (admin)

```json
{ "isActive": false }
```

Revoking is immediate: the code stops redeeming at once. Existing members keep their access — remove them as members for that. The room screen's **New key** button calls this endpoint and then creates a replacement.

#### Removed: `GET /`

The public debug dump of every member, workspace and email was removed. Unknown paths now return `404 { "message": "Not found." }`.

### Map endpoints

#### `GET /maps` (protected)

```json
{
  "count": 1,
  "maps": [
    {
      "id": 1,
      "nom": "Cafeteria",
      "url": "/assets/rooms/cafeteria.json",
      "mapWidth": 480,
      "mapHeight": 320,
      "createdAt": "2026-11-18T18:00:00.000Z",
      "updatedAt": "2026-11-18T18:00:00.000Z"
    }
  ]
}
```

### Utility and debug endpoints

#### `GET /api/users`

```json
{ "message": "User route is working" }
```

#### `GET /` (removed)

The unauthenticated dump of every member, workspace and email was deleted.
Unknown paths, including `/`, now return `404 { "message": "Not found." }`.

### Testing with curl

```bash
# Log in and store the cookie
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"test@huddle.com","password":"password123"}' \
  http://localhost:5000/auth/login

# Call protected routes with the cookie
curl -b cookies.txt http://localhost:5000/auth/me
curl -b cookies.txt http://localhost:5000/workspaces
```

### Testing the key flow with curl

Run from `server/` with a seed map in `maps` (see [Getting started](#6-getting-started)).

```bash
# 1. Owner creates a workspace; copy invitation.code from the 201
curl -s -b owner.txt -H "Content-Type: application/json" \
  -d '{"nom":"Cafeteria Team","description":"Workshop","mapId":1}' \
  http://localhost:5000/workspaces/create | jq .

# 2. The old backdoor is gone: an id-only body must fail
curl -s -b attacker.txt -H "Content-Type: application/json" \
  -d '{"workspaceId":3}' http://localhost:5000/workspaces/join
# -> 400 {"code":"INVALID_INVITE",...}

# 3. A wrong key fails the same way
curl -s -b attacker.txt -H "Content-Type: application/json" \
  -d '{"code":"AAAAAAAAAA"}' http://localhost:5000/workspaces/join

# 4. The real key joins, once
curl -s -b attacker.txt -H "Content-Type: application/json" \
  -d '{"code":"K7QM-3XPD-9R"}' http://localhost:5000/workspaces/join
# -> 201, then 200 {"alreadyMember":true} on a second call

# 5. Non-members are locked out of the room data, members are not
curl -s -b outsider.txt http://localhost:5000/workspaces/3   # -> 403
curl -s -b attacker.txt http://localhost:5000/workspaces/3   # -> 200

# 6. Brute force is throttled
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "%{http_code}\n" -b attacker.txt \
    -H "Content-Type: application/json" \
    -d '{"code":"AAAAAAAAAA"}' http://localhost:5000/workspaces/join
done
# -> 400 ... then 429
```

### Status code summary

| Code | Meaning in this API                                      |
| ---- | -------------------------------------------------------- |
| 200  | Successful read, login, logout, or already a member.     |
| 201  | Created: user, workspace, membership, or invitation.     |
| 400  | Invalid input, weak password, or unusable workspace key. |
| 401  | Missing or invalid cookie, or wrong credentials.         |
| 403  | Signed in, but not a workspace member or not an admin.   |
| 404  | Workspace, map, invitation, or route not found.          |
| 409  | Email already registered.                                |
| 429  | Too many key-redeem attempts; `Retry-After` is set.      |
| 500  | Unhandled database or runtime failure.                   |

---

## 10. Frontend guide

### Routes

| Route                     | File                                            | Access       | Behavior                                                   |
| ------------------------- | ----------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `/`                       | `src/app/(main)/page.js`                        | Public       | Hero with "Start Now" (register) and a login icon button.  |
| `/login`                  | `src/app/(auth)/login/page.js`                  | Public       | Sign-in. Redirects signed-in users to `/dashbord`.         |
| `/register`               | `src/app/(auth)/register/page.js`               | Public       | Account creation.                                          |
| `/me`                     | `src/app/(auth)/me/page.js`                     | Client guard | Profile. Redirects to `/login` when signed out.            |
| `/dashbord`               | `src/app/(auth)/dashbord/page.js`               | Client guard | Workspace grid, search, create and join actions.           |
| `/spaces/create`          | `src/app/(auth)/spaces/create/page.js`          | Via API      | Create-workspace form.                                     |
| `/spaces/join`            | `src/app/(auth)/spaces/join/page.js`            | Public UI    | Invitation-code form. Local validation only.               |
| `/spaces/join/[id_space]` | `src/app/(auth)/spaces/join/[id_space]/page.js` | No guard     | Workspace shell. The `id_space` parameter is not yet used. |
| `/about`, `/contact`      | none                                            | n/a          | Linked from the navbar. **Both return 404.**               |

### Layouts and providers

**`src/app/layout.js`**

- Loads Inter via `next/font/google` as `--font-inter`.
- Metadata: title `Huddle`.
- Providers: `AuthProvider`, `ThemeProvider` (`defaultTheme="system"`, class attribute), and `<Toaster position="bottom-right" richColors />`.

**`src/app/(main)/layout.js`** adds the public `Navbar` to the landing page only.

### Auth context

`src/components/context/auth.js` exports `AuthProvider` and `useAuth()`.

| Value             | Type             | Description                                                          |
| ----------------- | ---------------- | -------------------------------------------------------------------- |
| `user`            | object or `null` | Current user from `/auth/me` or login.                               |
| `isAuthenticated` | boolean          | True when `user` is non-null.                                        |
| `isLoading`       | boolean          | True during the initial session check.                               |
| `login(value)`    | async            | Posts credentials, stores the user, shows a toast, navigates to `/`. |
| `signup(value)`   | async            | Posts registration, shows a toast, navigates to `/login`.            |
| `logout()`        | async            | Posts logout and clears state. A 401 counts as already signed out.   |
| `checkAuth()`     | async            | Re-runs `/auth/me` and updates state.                                |

There is no global route middleware. Each page runs its own guard effect.

### API access

**`src/lib/axios.js`** creates an Axios instance with `baseURL: process.env.NEXT_PUBLIC_BACKEND_URL`, `withCredentials: true`, and JSON headers. There are no interceptors, retries, or refresh logic.

| Wrapper (file)                            | Method                                     | Request                                          |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `Connect_Auth` (`router/connect_auth.js`) | `postLogin(data)`                          | `POST auth/login`                                |
|                                           | `postRegister(data)`                       | `POST auth/register`                             |
|                                           | `postLogout()`                             | `POST auth/logout`                               |
|                                           | `getMe()`                                  | `GET auth/me`                                    |
| `Connect_Dash` (`router/connect_dash.js`) | `getWorkspaces()`                          | `GET workspaces`                                 |
|                                           | `postWorkspace(data)`                      | `POST workspaces/create`                         |
|                                           | `postJoinWorkspace(code)`                  | `POST workspaces/join`                           |
|                                           | `getWorkspace(id)`                         | `GET workspaces/:id`                             |
|                                           | `getInvitations(id)`                       | `GET workspaces/:id/invitations`                 |
|                                           | `createInvitation(id, data)`               | `POST workspaces/:id/invitations`                |
|                                           | `updateInvitation(id, invitationId, data)` | `PATCH workspaces/:id/invitations/:invitationId` |

Paths are relative, so the base URL must contain the origin only.

### Pages

#### Landing (`/`)

- Hero with a beta badge and a short product description.
- "Start Now" goes to `/register`. The fingerprint button goes to `/login`.
- Radial `.brand-glow` background. No data fetching.

#### Login (`/login`)

- Split layout: form on the left, `AuthVisual` decorative SVG on the right (large screens only).
- Fields: email, password (with show and hide), a "Remember me" checkbox that does not persist anything, and a "Forgot password?" placeholder.
- Validation: `loginSchema` (email format, non-empty password).
- Errors appear as a toast and inline text.

#### Register (`/register`)

- Fields: first name, last name, email, phone, password, and confirmation.
- Validation (`registerSchema`): names 3 to 24 letters; valid email; phone exactly 10 digits; password 8 to 72 characters; confirmation must match.
- On success: a toast, then navigation to `/login`.

#### Profile (`/me`)

- Shows initials, full name, email, and phone. Read-only. There is no endpoint to edit a profile.

#### Dashboard (`/dashbord`)

- Calls `Connect_Dash.getWorkspaces()` on mount.
- Renders a card per workspace: checkerboard preview, name, relative creation date, and a menu.
- Card menu: **Open** goes to `/spaces/join/{id}`. **Duplicate** and **Delete** show "not active yet" toasts.
- Search filters by `nom`, the field the API returns.
- Empty and no-match states are handled.
- Header: Resources menu (placeholder links), Join Space, Create Space, user menu.

#### Create space (`/spaces/create`)

- Fields: name (`nom`), numeric map ID (`mapId`), and optional description.
- Validation (`CreateSchema`): name 3 to 24 letters, digits, or underscores; numeric map ID; description up to 200 characters.
- Posts to `/workspaces/create`. On success it replaces the form with the **space is ready** panel: the generated key, **copy key**, **copy invite link**, **open the space**, and back to dashboard.
- There is no map picker, even though `GET /maps` exists. Users must know the ID.

#### Join space (`/spaces/join`)

- Local schema: required, up to 64 characters, letters, digits, and hyphens.
- Prefills `?code=` from an invite link and remembers `?next=` so a locked-space redirect returns to that space after a successful unlock.
- Calls `POST /workspaces/join` and handles `200 alreadyMember`, `400` invalid key, `401` signed out, and `429` rate limited.

#### Workspace screen (`/spaces/join/[id_space]`)

Layout:

- Large screens: 56px icon rail, collapsible 280px sidebar, and the map area.
- Smaller screens: map area with a menu button that opens a left drawer (88vw, max 320px).
- `h-dvh`, no page scrolling. Follows the selected theme; the map canvas uses `--workspace-canvas` (`#e6e3dc` light, `#83827e` dark).

Data and guard:

- Calls `GET /workspaces/:id` on mount behind a `<Suspense>` boundary (Next 16 requires it for `useParams`).
- `403` → `/spaces/join?next=<id>`, `401` → `/login`, `404` → "space does not exist" panel.
- Members and the workspace name come from the API; nothing is rendered before the check passes.

Components:

- **IconRail:** dashboard logo, search trigger, sidebar toggle, notifications menu (mark read or mute), share menu (copy invite link when the caller is an admin), and settings or profile links.
- **WorkspaceSidebar:** workspace name, people count, key card (admins see the key, copy key, copy link, and **New key**; members see "ask an admin"), people search, collapsible Members group, empty state, and a "Back to dashboard" link in the drawer.
- **MediaBar:** avatar, microphone and speaker toggles with device menus, and a reactions menu with a floating emoji animation. All state is local. No devices are accessed.
- **WorkspaceMap:** placeholder `div`. The SVG scene in `OfficeScene.js` is not imported.

Keyboard: `Ctrl+F` or `Cmd+F` focuses the people search and opens the sidebar first if it is closed.

Copy actions use `navigator.clipboard` with a hidden-textarea fallback.

### Shared components

| Component                                                  | Location                     | Purpose                                       |
| ---------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `AuthProvider`, `useAuth`                                  | `components/context/auth.js` | Session state and auth actions.               |
| `Navbar`, `UserAuth`                                       | `components/navbar/`         | Public navbar, mobile sheet, avatar dropdown. |
| `ModeToggle`                                               | `components/mode-toggle.js`  | Light, dark and system theme dropdown.        |
| `AuthShell`, `AuthVisual`                                  | `components/forms/`          | Split auth layout and decorative panel.       |
| `LoginForm`, `RegisterForm`, `PasswordField`               | `components/forms/`          | Auth forms and password input.                |
| `WorkspaceCard`                                            | `dashbord/(components)/`     | Workspace card and actions menu.              |
| `IconRail`, `WorkspaceSidebar`, `WorkspaceMap`, `MediaBar` | workspace `(components)/`    | Workspace shell pieces.                       |
| `OfficeScene`                                              | workspace `(components)/`    | Unused SVG office scene.                      |
| `data.js`                                                  | workspace `(components)/`    | Hard-coded demo people.                       |

### UI primitives

Vendored shadcn / Base UI components in `src/components/ui/`: avatar, badge, button, card, checkbox, dropdown-menu, field, input-group, input, kbd, label, separator, sheet, sonner, spinner, textarea, and toast.

Base UI uses a `render` prop instead of Radix's `asChild`:

```jsx
<Button render={<Link href="/register" />} nativeButton={false}>
  Register
</Button>
```

**Base UI rule:** a `DropdownMenuLabel` must sit inside a `DropdownMenuGroup` or `DropdownMenuRadioGroup`. Otherwise opening the menu throws "MenuGroupContext is missing". Some menus use a plain `<div>` heading to avoid this.

### Design tokens

Defined in `src/app/globals.css` and exposed through Tailwind's `@theme inline`:

| Token           | Light     | Dark                   |
| --------------- | --------- | ---------------------- |
| Brand / primary | `#9564DD` | `#9564DD`              |
| Brand text      | n/a       | `#a78bfa`              |
| Background      | `#f5f5f5` | `#0a0a0a`              |
| Card            | `#ffffff` | `#141417`              |
| Muted           | `#f1f1f4` | `#1f1f24`              |
| Border          | `#e5e5ea` | `rgba(255,255,255,.1)` |
| Ring            | `#9564DD` | `#a78bfa`              |
| Sidebar         | `#f1efef` | `#141417`              |

Workspace-specific value: the map canvas uses `--workspace-canvas` (`#e6e3dc` light, `#83827e` dark). Everything else in the workspace screen uses the shared tokens (`bg-background` rail, `bg-card` sidebar, `bg-muted` key card, `text-foreground`/`text-muted-foreground`, `border-border`, `ring-ring`), so it switches with the theme.

Typography: Inter throughout. Shapes: pill buttons, rounded cards and inputs. Icons: Lucide by default.

### Accessibility

- Icon-only controls use `aria-label` or `title`. Toggles use `aria-pressed`. Collapsible groups use `aria-expanded`. The active rail item uses `aria-current`.
- Sheets include screen-reader titles and descriptions.
- Decorative icons use `aria-hidden`.
- `Ctrl+F` / `Cmd+F` is intercepted to focus the people search.
- Gaps: no skip link, no reduced-motion handling for the reaction animation, and no focus audit beyond Base UI defaults.

---

## 11. Server guide

### Bootstrap

`src/server.js` loads `dotenv`, imports the app, and listens on `PORT` (default 5000).

`src/app.js`:

1. Creates the Express app.
2. Enables CORS with `origin: process.env.CLIENT_URL || "http://localhost:3000"` and `credentials: true`.
3. Adds `express.json()` and `express.urlencoded({ extended: true })`.
4. Adds `cookie-parser`.
5. Mounts `/auth`, `/workspaces`, and `/maps`.
6. Defines the debug `GET /` handler.
7. Mounts `/api/users`.

There is **no 404 handler, no error middleware, no helmet, no rate limiter, and no request logger.**

### Middleware

`verifyToken` (`src/middleware/auth.js`):

```js
const token = req.cookies.access_token;
if (!token) return res.status(401).json({ message: "Unauthorized" });
try {
  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
} catch {
  return res.status(401).json({ message: "Invalid or expired token." });
}
```

The payload contains `userId` and `role`. Authentication failures are `401`; `403` is reserved for authorization, such as a non-member opening a workspace. Global `role` is not used for workspace permissions: those come from the `Member` row.

### Controllers

| Controller                | Responsibility                                                        |
| ------------------------- | --------------------------------------------------------------------- |
| `register.controller.js`  | Validate input, reject duplicate emails, hash password, create user.  |
| `login.controller.js`     | Find user, compare hash, sign JWT, set cookie, return user.           |
| `logout.controller.js`    | Clear the cookie.                                                     |
| `workspace.controller.js` | List memberships, create workspace with admin member, join workspace. |
| `map.controller.js`       | List maps.                                                            |

Controllers return `500 { message: "Internal server error." }` on unexpected errors and log the error.

### Adding an endpoint

1. Add a function in `src/controllers/`.
2. Wire it into a router in `src/routes/`.
3. Add `verifyToken` if it needs a signed-in user.
4. Take the caller's identity from `req.user.userId`. Never take a user ID from the body for ownership checks.
5. Check authorization, not just authentication. Joining a workspace, for example, should require an invitation or an existing membership.
6. Return `{ message, ... }`.
7. Update this document and `shared/readme.md`.

---

## 12. Key user flows

### 1. Create an account

1. The user submits `/register`. The client validates the form.
2. `signup` posts to `/auth/register`.
3. The server checks required fields and password length, rejects duplicate emails with 409, hashes the password, and inserts the user.
4. The client shows a toast and navigates to `/login`.

### 2. Sign in and restore a session

1. The user submits `/login`. The server verifies the password and signs `{ userId, role }` for 24 hours.
2. The cookie is set. The body also includes the token and the user.
3. The client stores the user in context and navigates. The login page also redirects signed-in users to `/dashbord`.
4. On reload, `AuthProvider` calls `/auth/me`. A valid cookie restores the user. Otherwise state is cleared.

### 3. Sign out

1. `logout()` posts to `/auth/logout`. The server clears the cookie.
2. The client clears state and navigates to `/login`.

### 4. Create a workspace

1. The user opens `/spaces/create` and enters a name, a numeric map ID, and an optional description.
2. The client validates and posts to `/workspaces/create`.
3. The server confirms the map exists and, in one transaction, creates the workspace, an admin membership at (400, 300), and the workspace's first key.
4. The success screen shows the key with copy buttons and a link into the room. **Copy invite link** shares `origin/spaces/join?code=<key>`.
5. Opening the room later works because the creator is already a member.

### 5. Browse and open a workspace

1. `/dashbord` calls `GET /workspaces` and renders the cards. The list only contains workspaces where the caller has a `Member` row, so every card is openable.
2. The card's **Open** action navigates to `/spaces/join/{id}`.
3. The screen checks `GET /workspaces/:id` before rendering anything; the map area is still a placeholder.

### 6. Join with a workspace key

1. The user opens `/spaces/join` (from the dashboard's **Join Space**, or from an invite link that prefills `?code=`).
2. The client validates the format only; the API decides.
3. `POST /workspaces/join { code }` normalizes the code, checks it is active, not expired and not exhausted, then claims one use and creates the `Member` row in a single transaction.
4. `201` navigates to `/spaces/join/{workspaceId}` (or to `?next=` when the user was redirected there from a locked space). `200 alreadyMember` does the same without consuming a use.
5. Every other answer shows the generic "invalid, expired, or no longer usable" message; `429` asks the user to wait.

### 7. Open the workspace screen

1. Navigate to `/spaces/join/3`. The page reads `id_space` and calls `GET /workspaces/:id`.
2. `403` redirects to `/spaces/join?next=3` so the visitor can type the key; `401` sends them to `/login`; `404` shows a "space does not exist" panel.
3. When the answer is `200`, the rail, sidebar, media bar and people list render from the API. The sidebar shows the real members and, for admins, the current key.
4. `Ctrl+F` focuses search. The sidebar collapses. The drawer opens below the large-screen breakpoint.
5. Microphone, speaker, and reaction controls change local UI state only.

### 8. Rotate or revoke a key

1. An admin opens the space sidebar's **New key** action.
2. The client revokes the current key (`PATCH .../invitations/:id { isActive: false }`), creates a new one, and refetches the workspace so the sidebar and rail show the new code.
3. People who already entered keep access, because membership is what the API checks afterwards. The old link stops working for everyone else.

---

## 13. Scripts reference

### Client (`client/package.json`)

| Script          | Command      | Description                        |
| --------------- | ------------ | ---------------------------------- |
| `npm run dev`   | `next dev`   | Development server with Turbopack. |
| `npm run build` | `next build` | Production build.                  |
| `npm run start` | `next start` | Serve the production build.        |
| `npm run lint`  | `eslint`     | Lint. Passes on this branch.       |

### Server (`server/package.json`)

| Script         | Command                 | Description                          |
| -------------- | ----------------------- | ------------------------------------ |
| `npm run dev`  | `nodemon src/server.js` | Development server with restart.     |
| `npm start`    | `node src/server.js`    | Production-style start.              |
| `npm run db:*` | Prisma CLI              | See [section 8](#prisma-commands).   |
| `npm test`     | placeholder             | Exits with an error. No tests exist. |

There is no root `package.json`.

---

## 14. Git branching strategy

Huddle uses a trunk-based workflow: `main` is always buildable, and all work lands through short-lived branches and pull requests.

#### Branches

| Branch                   | Purpose                                                                  | Lifetime      |
| ------------------------ | ------------------------------------------------------------------------ | ------------- |
| `main`                   | Production-ready code. Protected: no direct pushes.                      | Permanent     |
| `feature/<scope>-<desc>` | New functionality, for example `feature/workspace-invitations`.          | Until merged  |
| `fix/<scope>-<desc>`     | Bug fixes, for example `fix/dashboard-search-nom`.                       | Until merged  |
| `chore/<desc>`           | Tooling, dependencies, docs, lint. For example `chore/add-env-examples`. | Until merged  |
| `hotfix/<desc>`          | Urgent fix branched from `main` and merged back quickly.                 | Hours to days |

The current long-running branch, `feature/workspaces`, should be merged into `main` through a pull request once its known bugs (dashboard search, lint errors, password policy) are fixed. Do not keep adding unrelated work to it.

Naming rules:

- Lowercase, words separated by hyphens.
- Use the area first: `workspace`, `auth`, `map`, `client`, `server`, `db`.
- Keep names under about 50 characters.

#### Workflow for a change

```bash
git checkout main
git pull origin main
git checkout -b feature/workspace-invitations

# work, then commit in small, logical steps
git add server/src/controllers/invitation.controller.js
git commit -m "feat(workspace): add invitation redeem endpoint"

# keep up to date with main while you work
git fetch origin
git rebase origin/main

git push -u origin feature/workspace-invitations
# open a pull request into main
```

- Rebase your own branch onto `main` before opening the PR, and again if `main` moves during review.
- Use `git push --force-with-lease` only on your own feature branch. Never force-push `main` or a branch others are using.
- Delete the branch after it is merged, both locally and on the remote.

#### Commit messages

Use Conventional Commits so the history can be scanned and, later, used to generate changelogs:

```text
<type>(<scope>): <short imperative summary>

<optional body: why the change was made, not what the diff already shows>
```

| Type       | When to use it                        |
| ---------- | ------------------------------------- |
| `feat`     | A new user-visible capability.        |
| `fix`      | A bug fix.                            |
| `refactor` | Code change with no behavior change.  |
| `docs`     | Documentation only.                   |
| `test`     | Tests only.                           |
| `chore`    | Dependencies, configuration, tooling. |
| `db`       | Schema change and its migration.      |

Examples:

- `feat(auth): rate-limit login attempts per IP`
- `fix(dashboard): filter workspaces by nom instead of title`
- `db(workspace): add expiry index to workspace_invitations`

Keep the subject under 72 characters.

#### Pull requests

A pull request into `main` should:

- Contain one logical change. Split unrelated work into separate PRs.
- Pass `npm run build` and `npm run lint` in `client/`, and `npx prisma validate` in `server/`.
- Describe what changed, how it was tested, and any follow-up work.
- Include screenshots for UI changes.
- Be squash-merged, so `main` gets one commit per PR with a clean message.

#### Database changes

- Change `schema.prisma` and create the migration in the same branch, using `npm run db:migrate`.
- Commit the generated migration folder with the schema change. Never commit the generated Prisma client.
- Never edit a migration that has already been merged into `main`. Add a new migration instead.
- Mention any destructive migration (dropped column or table, changed type) explicitly in the PR description.

#### Files that must never be committed

- `.env` and any real secrets. Commit `.env.example` instead.
- `server/generated/`, `client/.next/`, and `node_modules/`.
- Local editor and OS files, such as `.vscode/` and `.DS_Store`. Add them to `.gitignore` if they appear.

#### Hotfix process

1. Branch from `main`: `git checkout -b hotfix/login-500 main`.
2. Fix, test, and open a PR into `main`.
3. Merge after one review.
4. Confirm the fix is on `main`. Feature branches should rebase onto `main` afterwards.

#### Project notes

- `client/AGENTS.md` warns that this Next.js version may differ from older documentation. Check the bundled docs before using unfamiliar APIs.

---

## 15. Troubleshooting

### `npm run dev` fails at the repository root

There is no root `package.json`. Run the command inside `client/` or `server/`.

### Port already in use

Defaults: web 3000, API 5000. On Windows:

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess
taskkill /PID <pid> /F
```

Or change `PORT` in `server/.env` and `NEXT_PUBLIC_BACKEND_URL` in `client/.env` to match.

### Prisma client missing or outdated

Symptoms: `Cannot find module '../../generated/prisma/client.ts'`, or type errors after a schema change.

```bash
cd server
npm run db:generate
```

### Database connection errors

- Confirm MySQL or MariaDB is running and the database exists.
- Check user, password, host, port, and database in `DATABASE_URL`.
- URL-encode special characters in the password (`@` becomes `%40`).
- Confirm the user has privileges on the schema.
- Run `npm run db:validate`.

### Migrations not applied

```bash
cd server
npm run db:deploy
```

Use `db:migrate` only when you are creating a new migration.

### `401` or `403` on protected calls

- The cookie is missing or expired (24-hour lifetime). Sign in again.
- Use the same host for client and API. `localhost` and `127.0.0.1` are different cookie scopes.
- In production the cookie is `Secure`, so it will not be sent over plain HTTP.
- Confirm Axios has `withCredentials: true`.

### CORS errors

- The API allows only `CLIENT_URL`, which defaults to `http://localhost:3000`.
- Start the client on that exact origin, or change `CLIENT_URL` and restart the server.
- Wildcard origins do not work with credentials.

### Requests go to the Next.js server

`NEXT_PUBLIC_BACKEND_URL` is missing or wrong. Set it to the API origin, restart `next dev`, and confirm there is no `/api` suffix.

### A workspace key is rejected

All unusable keys share one answer: wrong, expired, revoked or used up. Check
`isActive`, `expiresAt` and `maxUses` / `usedCount` in `GET /workspaces/:id/invitations`
as an admin. Repeated attempts from the same account and IP return `429` for 15
minutes.

### A space opens on the key screen instead of the room

Expected for non-members: `GET /workspaces/:id` answers `403` and the client
redirects to `/spaces/join?next=<id>`. Entering a valid key takes the visitor
straight back to that space.

### An invite link does not contain a key

Only admins receive `invitation.code` from the API, so only admins can copy a
link that carries it. Regular members share the plain join URL and the admin
shares the key separately.

### Dashboard search shows nothing

Fixed: the filter now reads `nom`, the field the API returns.

### Workspace map area is empty

Expected on this branch. `WorkspaceMap` is a placeholder. Importing `OfficeScene` and adding a real map and participant layer is the next step.

### Lint fails

`npm run lint` passes on this branch. If it fails after a change, run it before opening a PR: the config treats `react-hooks/set-state-in-effect` and `react/no-unescaped-entities` as errors.

### Node version errors

Next.js 16 requires Node 20.9 or newer. Upgrade Node and reinstall dependencies.

---

## 16. Glossary

| Term                      | Meaning                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Huddle**                | The product. Also used for the workspace shell's name.                                             |
| **Workspace / Space**     | A team area backed by a `Workspace` row, with members and an optional map. "Space" is the UI word. |
| **Map**                   | A background layout in `maps` with a URL and dimensions.                                           |
| **Member**                | A user's membership in a workspace, including role and map position.                               |
| **Owner**                 | The user who created the workspace (`ownerId`).                                                    |
| **Admin**                 | A member with role `"admin"` (the creator). Required to manage keys.                               |
| **Workspace key**         | A 10-character `WorkspaceInvitation.code`. The only way to become a member from outside.           |
| **JWT**                   | A signed token valid for 24 hours, stored in the `access_token` cookie.                            |
| **HttpOnly cookie**       | A cookie that JavaScript cannot read, which reduces token theft through XSS.                       |
| **Base UI**               | The primitive library behind the shadcn components. Uses `render` instead of `asChild`.            |
| **Proximity audio/video** | Planned behavior where media connects based on avatar distance. Not implemented.                   |

---

## Appendix A: Key file map

| Path                                                              | Purpose                                     |
| ----------------------------------------------------------------- | ------------------------------------------- |
| `client/src/app/layout.js`                                        | Root providers, font, metadata, toaster.    |
| `client/src/app/globals.css`                                      | Tailwind import, theme tokens, brand glow.  |
| `client/src/app/(main)/page.js`                                   | Landing page.                               |
| `client/src/components/context/auth.js`                           | Auth state and session restore.             |
| `client/src/components/forms/login-form.js`, `register-form.js`   | Auth forms.                                 |
| `client/src/lib/axios.js`                                         | Axios base URL and cookies.                 |
| `client/src/components/router/connect_auth.js`, `connect_dash.js` | API wrappers.                               |
| `client/src/app/(auth)/dashbord/page.js`                          | Dashboard.                                  |
| `client/src/app/(auth)/dashbord/(components)/WorkspaceCard.js`    | Workspace card and menu.                    |
| `client/src/app/(auth)/spaces/create/page.js`                     | Create-workspace form.                      |
| `client/src/app/(auth)/spaces/join/page.js`                       | Key entry form; redeems the key.            |
| `client/src/lib/invite.js`                                        | Code formatting and invite-link building.   |
| `client/src/lib/clipboard.js`                                     | Copy key and invite link helpers.           |
| `client/src/app/(auth)/spaces/join/[id_space]/page.js`            | Workspace shell and membership guard.       |
| `client/src/app/(auth)/spaces/join/[id_space]/(components)/*.js`  | Rail, sidebar, map, media bar, scene.       |
| `server/src/app.js`                                               | Express app, CORS, route mounts, 404/error. |
| `server/src/server.js`                                            | Process entry and port.                     |
| `server/src/middleware/auth.js`                                   | Cookie JWT verification.                    |
| `server/src/middleware/workspaceAccess.js`                        | Member/admin authorization.                 |
| `server/src/middleware/rateLimit.js`                              | In-memory limit on key redemption.          |
| `server/src/controllers/*.js`                                     | Request logic.                              |
| `server/src/lib/inviteCode.js`                                    | Key generation and normalization.           |
| `server/src/lib/invitations.js`                                   | Unique-key creation (transaction aware).    |
| `server/src/lib/prisma.js`                                        | Prisma and MariaDB adapter.                 |
| `server/prisma/schema.prisma`                                     | Data model.                                 |
| `server/prisma/migrations/`                                       | SQL history.                                |
| `server/prisma.config.ts`                                         | Prisma config and env loading.              |
| `client/next.config.mjs`                                          | Turbopack, React Compiler, cache settings.  |
| `client/components.json`                                          | shadcn style, aliases, icon library.        |

---

## Appendix B: API quick reference

```text
POST   /auth/register        public   Create account
POST   /auth/login           public   Set access_token cookie
POST   /auth/logout          public   Clear cookie
GET    /auth/me              cookie   Current user

GET    /workspaces              cookie  Caller's workspaces
POST   /workspaces/create       cookie  Create workspace, admin membership, first key
POST   /workspaces/join         cookie  Redeem a key (rate limited)
GET    /workspaces/:id          member  Workspace, members, role, key for admins
GET    /workspaces/:id/invitations      admin   List keys
POST   /workspaces/:id/invitations      admin   Create a key
PATCH  /workspaces/:id/invitations/:id  admin   Revoke / change expiry

GET    /maps                 cookie   List maps

GET    /api/users            public   Debug check
```

Environment:

```text
server/.env   DATABASE_URL, PORT, JWT_SECRET, NODE_ENV, CLIENT_URL (optional)
client/.env   NEXT_PUBLIC_BACKEND_URL
```

Start:

```bash
cd server && npm install && npm run db:generate && npm run db:deploy && npm run dev
cd client && npm install && npm run dev
```

---

_End of documentation._
