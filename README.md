# 🧠 Prompt Hub — Backend

A secure, scalable backend powering **Prompt Hub**, an AI prompt marketplace where users can create, share, discover, and sell AI prompts.

Built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**, following a clean, modular, service-oriented architecture designed for long-term maintainability and growth.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Docker](#-docker)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🧩 Overview

Prompt Hub gives creators a home to publish AI prompts and lets users discover, follow, save, and purchase them. The backend handles everything from authentication and real-time notifications to content moderation, feeds, and trending discovery — all exposed through a well-documented REST API.

**Core capabilities:**

- ✍️ Create, edit, delete, and publish AI prompts (free or paid)
- 🔍 Explore and search prompts, tags, categories, and creators
- 👤 User profiles, following/followers, balances, and purchase history
- 🔒 Secure authentication with JWT (access + refresh tokens) and Google OAuth
- 🔔 Real-time notifications via Socket.IO and Firebase Cloud Messaging
- 📈 Trending and personalized feed powered by MongoDB aggregation pipelines
- 💰 Transaction tracking with Stripe-ready payment integration

---

## 🚀 Features

### Authentication & Authorization
- JWT-based auth with short-lived **access tokens** and long-lived **refresh tokens**
- Tokens delivered via secure, `httpOnly` cookies
- Google OAuth login via Passport.js
- Password hashing with `bcrypt`
- Redis-backed OTP flow for email verification / password reset

### Prompt Management
- Create, edit, delete, and view prompts
- Support for free and paid prompts
- Like, save, and copy tracking
- Visibility controls (public/private) enforced at the query level

### Discovery & Feed
- Cursor-based pagination for infinite scroll feeds
- Trending tags and categories via MongoDB aggregation (`trendScore`)
- Explore endpoint returns only publicly visible prompts
- People/search system with follow and unfollow support

### Real-Time & Notifications

- Firebase Cloud Messaging (FCM) push notifications
- EJS-rendered transactional emails via Nodemailer

### Transactions & Payments
- Tracks prompt purchases and creator earnings
- Stripe-ready integration layer for future payment processing

### Security & Reliability
- `.select("-password")` ensures sensitive fields never leave the database layer
- `helmet` middleware for secure HTTP headers
- Environment-based configuration for development, staging, and production
- Input validation with Zod
- Swagger UI for interactive, self-documenting API exploration

---

## 🛠 Tech Stack

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

---

## 🏗 Architecture

The project follows a modular, layered architecture:

```
Route → Controller → Service → Model
```

- **Routes** define endpoints and apply middleware (auth, validation)
- **Controllers** handle request/response logic
- **Services** contain business logic and database interactions
- **Models** define Mongoose schemas and types

This separation keeps business logic testable and independent of the HTTP layer, making it straightforward to add new features (e.g. payments, moderation) without touching unrelated code.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB instance (local or Atlas)
- Redis instance
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/SakibFakir69/promptHub.git
cd promptHub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then fill in the required values (see below)

# Run in development mode
npm run dev
```

The API will be available at `http://localhost:<PORT>` by default.

---

## 🔑 Environment Variables

Create a `.env` file in the project root. Typical variables include:

```env
NODE_ENV=development
PORT=5000

# Database
DB_URL=mongodb://localhost:27017/prompthub

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Stripe (optional, future use)
STRIPE_SECRET_KEY=
```

> ⚠️ Never commit your `.env` file. Use `.env.example` to document required keys without exposing secrets.

---

## 📜 Available Scripts

| Script              | Description                              |
|----------------------|-------------------------------------------|
| `npm run dev`        | Start the server in development mode with hot reload |
| `npm run build`      | Compile TypeScript to JavaScript          |
| `npm start`          | Run the compiled production build         |
| `npm test`           | Run the Jest test suite                   |
| `npm run lint`       | Run ESLint checks                         |

---

## 📚 API Documentation

Interactive API documentation is available via Swagger UI once the server is running:

```
http://localhost:<PORT>/api-docs
```

This includes all available endpoints, request/response schemas, and authentication requirements.

---


## 📂 Project Structure

```
promptHub/
├── app/                # Application source (routes, controllers, services, models)
├── template/           # Email templates (EJS)
├── test/               # Jest test suites
├── .github/workflows/  # CI/CD pipelines
├── Dockerfile
├── docker-compose.yml
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗺 Roadmap

- [ ] Full Stripe payment integration
- [ ] Prompt versioning and revision history
- [ ] Creator analytics dashboard
- [ ] Content moderation tooling
- [ ] Public API rate limiting tiers

---

## 📄 License

This project currently has no explicit license. Contact the repository owner for usage permissions.

---

## 👤 Author

**Sakib Fakir** — [@SakibFakir69](https://github.com/SakibFakir69)
