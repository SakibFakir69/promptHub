<div align="center">

# 🧠 PromptHub — Backend API

**A production-ready REST API powering PromptHub — a social marketplace where creators publish, discover, vote on, and share AI prompts.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-OTP%20%26%20Cache-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

[Live Frontend](https://prompthub-client-murex.vercel.app) · [API Docs](#-api-documentation) · [Getting Started](#-getting-started) · [Report a Bug](https://github.com/SakibFakir69/promptHub/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker](#-docker)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🧩 Overview

PromptHub gives creators a home to publish AI prompts and lets users **discover, follow, vote, save, and share** them. The backend handles everything from authentication and push notifications to feeds, search, and trending discovery — all exposed through a well-documented, versioned REST API (`/api/v1`).

**Built with a modular, layered architecture** (`Route → Controller → Service → Model`) so business logic stays testable and independent of the HTTP layer.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based auth** — short-lived access tokens + long-lived refresh tokens, delivered via secure `httpOnly` cookies
- **Google OAuth 2.0** login via Passport.js with frontend redirect flow
- Password hashing with **bcrypt**
- **Redis-backed OTP flow** for email verification and password reset (with resend throttling)
- Change / reset password, token refresh, and session-aware logout

### ✍️ Prompt Management
- Full CRUD for prompts — create, update, delete, list my prompts, view details
- **Image uploads** via Multer → **Cloudinary** (public-id tracked for cleanup on delete)
- **Voting system** — upvote/downvote with smart toggle & switch behavior; `upVotedBy` / `downVotedBy` tracking prevents double-voting
- **Save / bookmark prompts** — dedicated collection with a unique compound index (no duplicate saves)
- **Visibility controls** (public/private) enforced at the query level

### 🔍 Discovery & Social
- **Explore** — browse all publicly visible prompts
- **Feed** — prompt feed for the home timeline
- **Trending** — top tags and top categories via MongoDB aggregation
- **People search** — find creators, follow / unfollow
- **Discover** — suggested people to follow

<<<<<<< HEAD
### 🔔 Notifications & Email
- **Firebase Cloud Messaging (FCM)** push notifications with device-token register/unregister
- Transactional emails (OTP, verification) via **Brevo** with **EJS-rendered** templates
=======
### Real-Time & Notifications

- Firebase Cloud Messaging (FCM) push notifications
- EJS-rendered transactional emails via Nodemailer
>>>>>>> a4f6fd8f39228fa74b8124021ce4e4c5b276891e

### 🛡 Security & Reliability
- `helmet` for secure HTTP headers, strict **CORS whitelist**, and global **rate limiting**
- Input validation with **Zod** on every module
- Centralized error handler + catch-all 404 responses
- **Graceful shutdown** — handles `SIGINT` / `SIGTERM`, unhandled rejections, and uncaught exceptions with a forced-exit fallback
- Sensitive fields (passwords) excluded at the query layer

---

## 🛠 Tech Stack

<<<<<<< HEAD
| Layer | Technology |
|---|---|
| Runtime | Node.js 22 (Alpine in Docker) |
| Language | TypeScript 5.9 |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 8 |
| Cache / OTP store | Redis |
| Authentication | JWT (access + refresh), Passport.js (Google OAuth 2.0), bcryptjs |
| Validation | Zod 4 |
| File Storage | Multer + Cloudinary |
| Push Notifications | Firebase Admin SDK (FCM) |
| Email | Brevo + Nodemailer + EJS templates |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, express-rate-limit, CORS |
| Testing | Jest + ts-jest + Supertest |
| Code Quality | ESLint 9 (flat config) + Prettier |
| Containerization | Docker + Docker Compose |
=======
| Layer            | Technology                                  |
|-------------------|----------------------------------------------|
| Runtime           | Node.js                                      |
| Language          | TypeScript                                   |
| Framework         | Express.js                                   |
| Database          | MongoDB (Mongoose)                           |
| Caching / OTP     | Redis                                        |
|                                     
| Authentication    | JWT (Access + Refresh), Passport.js (Google OAuth) |
| Push Notifications| Firebase Cloud Messaging (FCM)               |
| Email             | Nodemailer + EJS templates                   |
| Validation        | Zod                                          |
| API Docs          | Swagger UI                                   |

| Containerization  | Docker                                       |

| Testing           | Jest                                         |
>>>>>>> a4f6fd8f39228fa74b8124021ce4e4c5b276891e

---

## 🏗 Architecture

The project follows a **modular, feature-first layered architecture**:

```
Request → Route → Middleware (auth / validation) → Controller → Service → Model → MongoDB
```

- **Routes** define endpoints, apply middleware, and carry Swagger JSDoc annotations
- **Controllers** handle request/response mapping only
- **Services** own business logic and database interaction
- **Models** define Mongoose schemas, indexes, and types
- **Each module is self-contained**: `*.route.ts`, `*.controller.ts`, `*.services.ts`, `*.model.ts`, `*.validation.ts`, `*.interface.ts`

This separation makes it straightforward to add new features (payments, moderation, analytics) without touching unrelated code.

---

## 🔗 API Endpoints

Base URL: `/api/v1`

| Module | Base Route | Highlights |
|---|---|---|
| Auth | `/auth` | `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`, `GET /google`, `POST /change-password`, `POST /reset-password`, `POST /reset-email`, `POST /reset-code` |
| Users | `/user` | `POST /users` (register), profile update |
| OTP | `/otp` | `POST /send-otp`, `POST /verify-otp` |
| Prompts | `/prompt` | `POST /create-prompt`, `PUT /update-prompt/:id`, `DELETE /delete-prompt/:id`, `GET /get-prompt`, `GET /prompt-details/:id`, `POST /upVote`, `POST /downVote`, `POST·GET·DELETE /save-prompt`, `GET /trending`, `POST /prompt-image` |
| Explore | `/explore` | `GET /` — all public prompts |
| Feed | `/feed` | `GET /feed` — home feed |
| Discover | `/discover` | `GET /` — people suggestions |
| People | `/people` | `GET /search`, `POST /follow` |
| Notifications | `/notifications` | `POST /register-token`, `POST /unregister-token`, `POST /test-push` |

> Full request/response schemas are available in [Swagger UI](#-api-documentation).

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 20 (22 LTS recommended)
- **MongoDB** instance (local or [Atlas](https://www.mongodb.com/atlas))
- **Redis** instance (local or hosted)
- Accounts/keys for: **Cloudinary**, **Firebase**, **Brevo**, **Google OAuth** (see [Environment Variables](#-environment-variables))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SakibFakir69/promptHub.git
cd promptHub/server

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env   # then fill in the values below

# 4. Start in development mode
npm run dev
```

The API is now available at `http://localhost:5000` and interactive docs at `http://localhost:5000/api-docs`.

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# ── Server ────────────────────────────────────────────
NODE_ENV=development
PORT=5000
FRONT_END_URL=http://localhost:3000

# ── Database ──────────────────────────────────────────
DATABASE_URL=mongodb://localhost:27017/prompthub

# ── Redis ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Auth / JWT ────────────────────────────────────────
BCRYPT_SECRECT_KEY=your_access_token_secret
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret
SESSION_SECRET=your_session_secret
SALT=10

# ── Google OAuth ──────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── Cloudinary (image uploads) ────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Email (Brevo) ─────────────────────────────────────
BREVO_API=your_brevo_api_key
SENDER_EMAIL=noreply@yourdomain.com

# ── Firebase (push notifications) ─────────────────────
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ **Never commit your `.env` file.** Keep secrets out of version control and use an `.env.example` to document required keys.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server with `ts-node` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm test` | Run the Jest test suite |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run pretty` | Format the codebase with Prettier |

---

## 📚 API Documentation

Interactive **Swagger UI** is served by the app itself:

```
http://localhost:5000/api-docs
```

Every route is annotated inline with OpenAPI 3.0 JSDoc — request bodies, response schemas, auth requirements, and example payloads included.

---

## 🧪 Testing

```bash
npm test
```

- **Jest + ts-jest** for unit/integration tests
- **Supertest** for HTTP-level endpoint testing
- **Redis client is mocked** (`__mocks__/`) so tests run without live infrastructure

---

## 🐳 Docker

Build and run the production image:

```bash
# Build
docker build -t prompthub-api .

# Run (pass your .env)
docker run --env-file .env -p 5000:5000 prompthub-api
```

The `Dockerfile` uses **Node 22 Alpine**, layer-cached dependency installs, and runs the compiled `dist/` build — ready for platforms like Render, Railway, or any container host.

---

## 📂 Project Structure

```
server/
├── app/
│   ├── constants/                # Shared constants
│   └── src/
│       ├── index.ts              # Express app: CORS, helmet, rate-limit, swagger, routes
│       ├── server.ts             # Bootstrap: DB connect, listen, graceful shutdown
│       ├── config/
│       │   ├── cloudniary/       # Cloudinary setup
│       │   ├── firebase/         # Firebase Admin (FCM)
│       │   ├── passport/         # Google OAuth strategy
│       │   └── redis/            # Redis client (+ test mocks)
│       ├── middleware/           # verifyToken (JWT), rate limiting
│       ├── helper/               # Global error handler, response helper
│       ├── utils/                # Tokens, cookies, OTP generator, multer, email
│       ├── types/                # Express req.user augmentation, Cloudinary types
│       └── modules/              # Feature modules
│           ├── auth/
│           ├── users/
│           ├── otp/
│           ├── prompt/
│           ├── feed/
│           ├── explore/
│           ├── discover/
│           ├── people/
│           └── notification/
│               └── *.route.ts | *.controller.ts | *.services.ts
│                   *.model.ts | *.validation.ts | *.interface.ts
├── template/                     # EJS email templates
├── test/                         # Jest test suites
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
└── package.json
```

---

## 🛡 Security

- 🔒 `httpOnly` cookies for tokens — inaccessible to client-side JS
- 🪖 `helmet` sets secure HTTP headers
- 🚦 Global rate limiting via `express-rate-limit`
- 🌐 Strict CORS origin whitelist with credentials support
- ✅ Zod validation on all inbound payloads
- 🔑 Bcrypt-hashed passwords, never returned by queries
- ⏱ OTP resend throttling backed by Redis TTLs

Found a vulnerability? Please open a private report rather than a public issue.

---

## 🗺 Roadmap

- [ ] Stripe payment integration (paid prompts & creator earnings)
- [ ] Prompt versioning and revision history
- [ ] Creator analytics dashboard
- [ ] Content moderation tooling
- [ ] Tiered API rate limits
- [ ] Real-time updates via WebSockets

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m "feat: add amazing feature"`
4. Push and open a Pull Request

Please run `npm run lint` and `npm test` before submitting.

---

## 👤 Author

**Sakib Fakir**
GitHub: [@SakibFakir69](https://github.com/SakibFakir69)

---

<div align="center">

⭐ If this project helped you, consider giving it a star!

</div>
