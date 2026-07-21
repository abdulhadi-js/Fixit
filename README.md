<div align="center">

# 🛠️ FixIt — Premium Home Services Platform

**FixIt** is a full-stack, production-grade home services platform that connects consumers with skilled technicians. It supports real-time job scheduling, secure payments via Stripe, email OTP-based authentication, forgot password flow, and dedicated dashboards for both consumers and technicians.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)
![Railway](https://img.shields.io/badge/Deployed_on-Railway-purple)
![License](https://img.shields.io/badge/License-Proprietary-blue)

🌐 **Live Consumer/Tech Portal:** [https://fixit-beige.vercel.app](https://fixit-beige.vercel.app)

🔌 **Live API Endpoint:** [https://fixit-production-b37f.up.railway.app/api/v1](https://fixit-production-b37f.up.railway.app/api/v1)

</div>

---

## 📐 Architecture

The application runs on a highly scalable, decoupled cloud infrastructure. The frontend is served via **Vercel's Edge Network** for global performance and SEO. The backend runs as a **containerized NestJS API** on Railway, connected to a fully managed **PostgreSQL** database.

```text
                          ┌─────────────────────────┐
  User Browser  ────────► │   Vercel Edge Network    │ (Next.js 16, SSR + Static)
                          └────────────┬────────────┘
                                       │ HTTPS REST API
                          ┌────────────▼────────────┐
                          │    Railway (Docker)       │ (NestJS 10 API)
                          └────────────┬────────────┘
                                       │
               ┌───────────────────────┼───────────────────┐
               │                       │                   │
  ┌────────────▼──────┐   ┌────────────▼──────┐  ┌────────▼────────┐
  │ Railway PostgreSQL │   │    Stripe API      │  │  SendGrid API   │
  │    (Database)      │   │   (Payments)       │  │    (Emails)     │
  └───────────────────┘   └───────────────────┘  └─────────────────┘
```

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | NestJS 10, TypeScript, Node.js 20 |
| **Database** | PostgreSQL 15 (Railway managed) |
| **ORM** | TypeORM |
| **Authentication** | Email OTP + JWT Access/Refresh Token Rotation |
| **Email Service** | SendGrid (HTTP API — Railway compatible) |
| **Payments** | Stripe API (Payment Intents + Webhooks) |
| **Frontend Cloud** | Vercel Edge Network (Auto-deploy from GitHub) |
| **Backend Cloud** | Railway PaaS (Docker container) |
| **Security** | Helmet, bcrypt, throttling, role-based guards |

---

## ✨ Core Features

### 🔐 Authentication & Security
- **Email OTP verification** on registration — 6-digit code sent via SendGrid
- **Forgot Password** flow — request a reset code via email, set a new password
- **JWT Access + Refresh Token** rotation for session management
- **Role-based access control** — separate Consumer and Technician experiences
- Passwords hashed with **bcrypt**; OTP codes expire after 5 minutes

### 👤 Consumer Features
- Browse a rich service catalog (Plumbing, Electrical, AC, Cleaning, etc.)
- Book services with a date, time, and address picker
- Submit **custom job requests** with descriptions and photos
- Choose payment method — **Stripe (credit/debit) or Cash on Delivery**
- Consumer dashboard with booking history and real-time status tracking

### 🔧 Technician Features
- Daily job agenda view with full job details
- Accept / reject custom job quotes
- Real-time status updates: `CONFIRMED` → `IN_PROGRESS` → `COMPLETED`
- Weekly earnings ledger and payment history

### 💳 Payments
- **Stripe Payment Intents** for secure, PCI-compliant card processing
- **Cash on Delivery** option
- Stripe **Webhook** integration to confirm payments and update booking status server-side

---

## ☁️ CI/CD Pipeline

Every `git push` to `main` automatically triggers both deployments with zero downtime.

```text
git push → main
      │
      ├──► Vercel (Frontend)
      │     1. Detects changes in /frontend
      │     2. Builds Next.js optimized static & serverless pages
      │     3. Deploys to Vercel Global Edge Network (~30s)
      │
      └──► Railway (Backend)
            1. Detects changes in /Backend
            2. Builds Docker container (node:20-alpine, multi-stage)
            3. Rolling zero-downtime deployment (~60s)
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (running locally or via Docker)
- [Stripe Account](https://stripe.com/) (for test API keys)
- [SendGrid Account](https://sendgrid.com/) (free tier, for OTP emails)

### 1. Clone the Repository
```bash
git clone https://github.com/abdulhadi-js/Fixit.git
cd Fixit
```

### 2. Configure Backend Environment
Create a `.env` file inside `/Backend`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=fixit

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
MAIL_FROM=your-verified-sender@gmail.com

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

PORT=3001
```

### 3. Run the Backend (NestJS API)
```bash
cd Backend
npm install
npm run seed       # Seeds the database with default services & categories
npm run start:dev
# ✅ API running at http://localhost:3001
```

### 4. Configure Frontend Environment
Create a `.env.local` file inside `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Run the Frontend (Next.js)
```bash
cd ../frontend
npm install
npm run dev
# ✅ UI running at http://localhost:3000
```

---

## 🚀 Production Deployment Variables

These environment variables must be set in your **Railway** backend service:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Railway PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `SENDGRID_API_KEY` | Your SendGrid API key (`SG.xxx...`) |
| `MAIL_FROM` | Email address verified in SendGrid Sender Identity |
| `STRIPE_SECRET_KEY` | Stripe live/test secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PORT` | `3001` |

---

## 📁 Project Structure

```text
Fixit/
├── Backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/               # JWT auth, OTP, forgot/reset password
│   │   ├── mail/               # SendGrid email service
│   │   ├── bookings/           # Job booking & scheduling module
│   │   ├── payments/           # Stripe payment integration
│   │   ├── services/           # Service catalog module
│   │   └── users/              # User entity & role management
│   ├── Dockerfile              # Multi-stage Docker build for Railway
│   └── package.json
│
├── frontend/                   # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/       # Auth pages
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── verify-otp/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   ├── dashboard/      # Consumer booking dashboard
│   │   │   ├── checkout/       # Stripe payment page
│   │   │   └── technician/     # Technician dashboard & earnings
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/              # Custom React hooks (useAuth, etc.)
│   │   └── lib/api/            # Typed API client layer
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔑 Auth Flow

```text
Register (email + password)
      │
      ▼
OTP sent to email via SendGrid
      │
      ▼
User enters 6-digit OTP ──► Account Verified
      │
      ▼
Login (email + password) ──► JWT Access Token + Refresh Token
      │
      ▼
Protected routes use Bearer token in Authorization header
```

**Forgot Password Flow:**
```text
Enter email ──► OTP sent to email ──► Enter OTP + new password ──► Login
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved © FixIt 2026.
