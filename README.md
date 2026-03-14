# Sara7a App — Backend

> RESTful API backend for **Sara7a App**, built with Node.js and Express.  
> **Status:** *Under active development.*

---

## Description

Sara7a App Backend is a modular Node.js API that provides authentication and user management. It uses a layered architecture, centralized error handling, and security best practices (hashing, JWT, encryption for sensitive fields). The codebase is structured for scalability and maintainability as features are added.

---

## Project Status

This project is **ongoing**. Implemented features are production-ready within the current scope; additional modules and endpoints are planned. Implemented vs. planned features are clearly separated below.

---

## Tech Stack

| Category   | Technologies                                      |
| ---------- | ------------------------------------------------- |
| Runtime    | Node.js (ES Modules)                              |
| Framework  | Express 5                                         |
| Database   | MongoDB + Mongoose                                |
| Auth       | JWT (jsonwebtoken), bcrypt                        |
| Security   | CryptoJS (AES) for sensitive data encryption      |
| Config     | dotenv                                            |

---

## Architecture

- **Modular structure** — Auth module, database layer, and shared utilities in separate modules.
- **Layered flow** — Controllers → Services → Database layer.
- **Reusable database layer** — Generic helpers: `findOne`, `findById`, `insertOne`, `insertMany`, `findAll`, `findOneAndUpdate`, `findOneAndDelete`.
- **Bootstrap pattern** — Single entry point: connect DB, mount routes, register global error handler, then start server.
- **Response helpers** — Unified success responses and custom exceptions (e.g. `BadRequestException`, `NotFoundException`, `ConflictException`, `UnauthorizedException`).
- **Global error handler** — Centralized error handling; stack traces only in development.

---

## Security

- **Password hashing** — bcrypt with configurable salt rounds.
- **JWT authentication** — Signed tokens with expiration (e.g. 1 day).
- **Sensitive data encryption** — AES (CryptoJS) for fields like phone number before storage.
- **Safe serialization** — Password and `__v` excluded from JSON responses via Mongoose `toJSON`.
- **Multi-provider readiness** — User schema supports System and Google (OAuth-ready).

---

## Database (Mongoose)

- **Schema validation** — Required fields, min/max length, trim, lowercase, unique where needed.
- **Virtuals** — `userName` derived from `firstName` and `lastName`.
- **Pre-save hooks** — Auto hashing of password and encryption of sensitive fields on save.
- **Instance methods** — `comparePassword` for login verification.
- **Timestamps** — `createdAt` and `updatedAt` enabled on schemas.

---

## Implemented Features

- User **sign-up** (email, password, phone, provider).
- User **login** (email/password, returns user + JWT).
- **Get user by ID** (protected by JWT in `Authorization` header).
- Duplicate-email handling (409 Conflict).
- Invalid credentials handling (404).
- Missing/invalid token handling (401).

---

## Upcoming Features

- Route protection middleware applied consistently across all protected endpoints.
- User profile update (e.g. `updateLoginData`).
- Google OAuth login (schema prepared).
- Additional API modules and routes as the product evolves.

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/A7MEDRAGAB82/SARA7A.git
   cd SARA7A
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file inside the `config` folder (`config/.env`) with the following variables:

   ```env
   PORT=
   DATABASE_URI=
   MOOD=
   SALT=
   JWT_SECRET_KEY=your secret key
   ENC_KEY=your encryption key
   ```

   | Variable        | Description                                |
   | --------------- | ------------------------------------------ |
   | `PORT`          | Server port                                |
   | `DATABASE_URI`  | MongoDB connection string                   |
   | `MOOD`          | `dev` or `prod` (affects error details)    |
   | `SALT`          | bcrypt salt rounds (e.g. 10)               |
   | `JWT_SECRET_KEY`| Secret for signing JWT                     |
   | `ENC_KEY`       | Key for AES encryption of sensitive data   |

4. **Run the project**

   ```bash
   npm start
   ```

   The server runs with `node --watch src/main.js` (auto-restart on file changes). Default base URL: `http://localhost:<PORT>`.

---

## API Overview

**Base path:** `/auth`

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/auth/sign-up`    | Register a new user            |
| POST   | `/auth/login`      | Login (returns user + JWT)     |
| GET    | `/auth/get-user-by-id` | Get user profile (requires `Authorization` header with JWT) |

**Example request (login):**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Example response (success):**

```json
{
  "status": 200,
  "message": "user login successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Repository

- **GitHub:** [SARA7A](https://github.com/A7MEDRAGAB82/SARA7A)
- **Issues:** [Report a bug or request a feature](https://github.com/A7MEDRAGAB82/SARA7A/issues)

---

## License

ISC
