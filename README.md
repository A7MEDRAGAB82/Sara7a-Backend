# Sara7a App — Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.x-blue?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)]
[![Redis](https://img.shields.io/badge/Redis-Session%20Store-red?logo=redis)]
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

**Sara7a App** is a modular, production-ready Node.js/Express backend for secure user management and authentication. It leverages modern best practices, robust security, and a scalable architecture.

---

## 🚀 Tech Stack

- **Node.js** (ES Modules)
- **Express.js** 5.x
- **MongoDB** with **Mongoose**
- **Redis** (Session & OTP management)
- **Multer** (File uploads)
- **Joi** (Request validation)
- **Bcrypt** (Password hashing)

---

## 🏗️ Architecture

- **Modular Structure:** Each feature (e.g., Auth) is organized in its own folder with controller, service, router, and validation files.
- **Layered Approach:** Controllers → Services → Database Layer.
- **Centralized Error Handling** and **Reusable Middlewares**.

---

## ✅ Completed Features

- [x] **JWT Authentication:** Sign-up, Login, Logout
- [x] **Session Management:** Refresh tokens & blacklisting via Redis
- [x] **File Uploads:** Profile picture upload (Multer, stored in `/upload`)
- [x] **Password Hashing:** Secure with Bcrypt
- [x] **OTP Password Reset:** OTPs managed in Redis
- [x] **Request Validation:** Joi-based input validation
- [x] **Static File Serving:** Uploaded images served as static assets

---

## 📦 Project Structure

<details>
<summary>Click to expand</summary>

```
src/
├── modules/
│   └── auth/
│       ├── auth.controller.js
│       ├── auth.service.js
│       ├── auth.validation.js
│       └── ...
├── middlewares/
│   ├── multer.js
│   ├── verifyToken.js
│   └── ...
├── common/
│   ├── encryption/
│   ├── enums/
│   ├── hash/
│   └── utils/
│       ├── sendEmail.js
│       ├── sendOTP.js
│       └── validators.js
├── database/
│   ├── connection.js
│   ├── models/
│   │   └── user.model.js
│   └── ...
└── main.js
```

</details>

---

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/A7MEDRAGAB82/sara7aApp.git
   cd sara7aApp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the root directory with the following:

   ```
   PORT=3000
   DB_URL=your_mongodb_connection_string
   REDIS_URL=your_redis_url
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   ```

4. **Run the server:**
   ```bash
   npm start
   ```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

**Sara7a App** — Secure, modular, and production-ready authentication for modern web apps.
