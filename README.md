# Sara7a App — Backend

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-ES%20Modules-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.x-blue?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209.x-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Redis](https://img.shields.io/badge/Redis-5.x-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger%20UI-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

**A modular, production-ready Node.js backend for anonymous social messaging.**

</div>

---

## 📖 Overview

**Sara7a App** is a clean-architecture Node.js/Express backend that powers a secure anonymous messaging platform. Users can register, authenticate, and send/receive anonymous messages via a well-structured REST API. The project enforces strict separation of concerns through a layered Controller → Service → Database approach, centralized error handling, role-based access control, and robust Redis-powered session management.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (ES Modules — `"type": "module"`) |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB via Mongoose 9.x |
| **Cache / Sessions** | Redis 5.x (refresh tokens + OTP storage) |
| **Validation** | Joi 18.x |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) |
| **Password Hashing** | Bcrypt 6.x |
| **Encryption** | CryptoJS 4.x (phone encryption) |
| **File Uploads** | Multer 2.x (local disk storage) |
| **Email** | Nodemailer 8.x |
| **API Docs** | Swagger JSDoc + Swagger UI Express |
| **Config** | dotenv 17.x |

---

## 🏗️ Architecture

The project follows a **feature-first modular architecture** with a strict layered pattern:

```
Request → Router (Controller) → Service → Database Layer → MongoDB
                    ↓
              Middlewares (auth, validation, RBAC)
                    ↓
           Centralized Error Handler
```

- **Controllers** — Express routers only. Handle HTTP concerns: request parsing, calling services, sending responses.
- **Services** — Business logic layer. Orchestrates DB calls, token generation, Redis interactions, and email dispatch.
- **Database Layer** — Generic CRUD helpers (`findOne`, `insertOne`, `findById`, etc.) wrap Mongoose for reusability.
- **Common** — Shared utilities: enums, hashing, encryption, token security, response helpers, OTP generation.
- **Middlewares** — `verifyToken`, `allowedTo` (RBAC), `validateRequest` (Joi), `asyncWrapper`, `multer_local`.

---

## ✅ Features

### Authentication & Security
- [x] **Sign Up** — Register with userName, email, password, phone, gender, DOB, and optional profile picture
- [x] **Login** — Credentials-based login returning `accessToken` + `refreshToken`
- [x] **Logout** — Invalidates refresh token in Redis
- [x] **Refresh Tokens** — Rotate access & refresh tokens via Redis-backed refresh token
- [x] **Forgot Password** — OTP sent via email (hashed OTP stored in Redis with TTL)
- [x] **Reset Password** — OTP verification then password reset
- [x] **Update Password** — Requires old password confirmation
- [x] **JWT Access Tokens** — Short-lived (30 min), signed with issuer `sara7a-app` and audience (`Admin`/`User`)
- [x] **Role-Based Access Control** — `allowedTo` middleware enforces `Admin` / `User` roles per route
- [x] **Phone Encryption** — Phone numbers encrypted at rest using CryptoJS

### User Management
- [x] **Get User Profile** — Authenticated self-profile lookup
- [x] **Update Login Data** — Update userName, phone, gender, DOB
- [x] **Delete User** — Admin-only soft/hard deletion

### Data Safety
- [x] **Password Hashing** — Bcrypt on every `pre('save')` hook
- [x] **Password Stripped from Responses** — `toJSON` transform removes `password` and `__v`
- [x] **Virtual `userName`** — Composed from `firstName` + `lastName`; settable as a single string
- [x] **`passwordChangedAt` Tracking** — Updated on every password change
- [x] **Global Error Handler** — Unified error shape; stack trace visible in `dev` mode only

### Infrastructure
- [x] **Multer Local Storage** — Auto-creates `upload/<customPath>` directories; timestamped filenames
- [x] **Static File Serving** — `/upload` served as static assets
- [x] **Async Wrapper** — `asyncWrapper` eliminates repetitive `try/catch` in route handlers
- [x] **Joi Request Validation** — Schema-validated body for every mutating endpoint
- [x] **Swagger API Documentation** — Integrated via `swagger-jsdoc` + `swagger-ui-express`

---

## 📦 Project Structure

<details>
<summary>Click to expand</summary>

```
sara7aApp/
├── config/
│   ├── env.service.js          # Environment variable loader & validator
│   └── index.js
├── src/
│   ├── main.js                 # App entry point
│   ├── app.controller.js       # App bootstrap (Express setup, DB, Redis, routing)
│   │
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.controller.js   # All auth routes (Router)
│   │       ├── auth.service.js      # Auth business logic
│   │       └── auth.validation.js   # Joi schemas for auth endpoints
│   │
│   ├── middlewares/
│   │   ├── allowedTo.js        # Role-based access control (RBAC)
│   │   ├── asyncWrapper.js     # Async error boundary for route handlers
│   │   ├── multer.js           # Multer local disk storage factory
│   │   ├── validation.js       # Joi request validation middleware
│   │   ├── verifyToken.js      # JWT verification middleware
│   │   └── index.js
│   │
│   ├── common/
│   │   ├── enums/
│   │   │   └── enum.service.js     # GenderEnums, ProviderEnums, roleEnums
│   │   ├── hash/                   # Bcrypt generateHash / compareHash
│   │   ├── encryption/             # CryptoJS encrypt / decrypt
│   │   ├── security/
│   │   │   └── token.security.js   # generateToken (JWT) + generateRandomToken
│   │   ├── utils/
│   │   │   ├── sendEmail.js        # Nodemailer email dispatch
│   │   │   ├── sendOTP.js          # OTP generation, hashing & Redis storage
│   │   │   ├── validators.js       # validateExists helper
│   │   │   └── response/
│   │   │       ├── success.response.js   # SuccessResponse helper
│   │   │       ├── error.response.js     # Exception factories + globalErrorHandler
│   │   │       └── index.js
│   │   └── index.js
│   │
│   └── database/
│       ├── connection.js           # Mongoose connection
│       ├── redis.config.js         # Redis client setup & connect
│       ├── database.service.js     # Generic CRUD helpers (findOne, findAll, insertOne, …)
│       ├── models/
│       │   └── user.model.js       # User Mongoose schema & model
│       └── index.js
│
├── uploads/                        # Uploaded files (gitignored)
├── .gitignore
├── package.json
└── README.md
```

</details>

---

## 🌐 API Endpoints

Base URL: `http://localhost:<PORT>`

### Auth — `/auth`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/auth/sign-up` | ❌ | — | Register a new user |
| `POST` | `/auth/login` | ❌ | — | Login and receive tokens |
| `POST` | `/auth/logout` | ❌ | — | Invalidate refresh token |
| `POST` | `/auth/refresh-token` | ❌ | — | Rotate access & refresh tokens |
| `POST` | `/auth/forgot-password` | ❌ | — | Send OTP to email |
| `PATCH` | `/auth/reset-password` | ❌ | — | Reset password using OTP |
| `GET` | `/auth/get-user-by-id` | ✅ | Admin, User | Get authenticated user's profile |
| `PATCH` | `/auth/update-login-data` | ✅ | Admin, User | Update profile fields |
| `PATCH` | `/auth/update-password` | ✅ | Admin, User | Change password |
| `DELETE` | `/auth/delete-user` | ✅ | Admin only | Delete user account |

> **Token format:** `Authorization: Bearer <accessToken>` or `token: <accessToken>` header.

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (local or Atlas)
- Redis (local or cloud)

### 1. Clone the repository

```bash
git clone https://github.com/A7MEDRAGAB82/SARA7A.git
cd SARA7A
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
MOOD=dev        # dev | prod  (controls error stack visibility)

# Database
DB_URL=

# Redis
REDIS_URL=

# App
BASE_URL=

# Email (Nodemailer)
EMAIL_USER=your_email@example.com
```
### 4. Run the development server

```bash
npm start
```

> The server uses `node --watch` for hot-reloading in development.

---

## 🔐 Security Design

| Concern | Approach |
|---|---|
| Password storage | Bcrypt (rounds via `generateHash`) |
| Phone storage | CryptoJS symmetric encryption |
| Session tokens | Short-lived JWT (30 min) + long-lived Redis refresh token (30 days) |
| OTP | 6-digit code, hashed with Bcrypt before Redis storage, auto-expired |
| Token blacklisting | Refresh token deleted from Redis on logout / rotation |
| Role enforcement | JWT `audience` claim (`Admin` / `User`) checked by `allowedTo` middleware |
| Error exposure | Stack traces shown only in `MOOD=dev` |

---

## 📋 Enums Reference

```js
// Gender
GenderEnums = { Male: 0, Female: 1 }

// Auth Provider
ProviderEnums = { System: 0, Google: 1 }

// User Role
roleEnums = { Admin: 0, User: 1 }
```

---

## 📄 License

This project is licensed under the **ISC License**.


<div align="center">
  <strong>Sara7a App</strong> — Secure, modular, and production-ready backend for anonymous messaging.
</div>
