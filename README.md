# Prompt Hub Backend

> A secure and scalable backend for **Prompt Hub**, an AI prompt marketplace where users can create, share, and sell AI prompts.

---

## 🧩 Project Overview

**Prompt Hub** is a platform that allows users to:

- ✍️ Create, share, and sell AI prompts
- 💰 Buy prompts securely
- 👤 Manage user profiles, balances, and purchased prompts
- 🔒 Authenticate users using JWT (Access + Refresh Tokens)
- 📈 Track prompt popularity, likes, and transactions

This backend is built with **Node.js, TypeScript, Express, and MongoDB**, following a modular architecture for scalability and maintainability.

---

## 🚀 Features

### Authentication
- Secure **JWT-based authentication** with **access + refresh tokens**
- `httpOnly` and `secure` cookies for secure session handling
- Passwords are hashed with bcrypt

### Prompt Management
- Users can **create, edit, delete, and view prompts**
- Supports **paid and free prompts**
- Likes and transaction tracking

### Transactions & Payments
- Tracks prompt purchases and earnings
- Integration-ready with Stripe for payment processing

### Security
- `.select("-password")` ensures sensitive data never leaves the backend
- Environment-based configs for production (`NODE_ENV`)
- Input validation ready (Zod/Joi recommended)

### Modular Architecture
- Separate **controller**, **service**, and **route** layers
- Scalable folder structure for future features

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Authentication | JWT (Access + Refresh Tokens) |
| File Storage | Cloudinary / Supabase (optional) |
| Payments | Stripe (future integration) |
| Validation | Zod / Joi |
| Environment | dotenv |

---





## 🗂 Folder Structure

