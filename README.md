<div align="center">

# 🛠️ FixIt — Premium Home Services Platform

**FixIt** is a full-stack, production-grade home services platform that connects consumers with skilled technicians. It supports real-time job scheduling, secure payments via Stripe, OTP-based authentication, and dedicated dashboards for both consumers and technicians.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)
![Railway](https://img.shields.io/badge/Deployed_on-Railway-purple)
![License](https://img.shields.io/badge/License-Proprietary-blue)

🌐 **Live Consumer/Tech Portal:** [https://fixit-beige.vercel.app](https://fixit-beige.vercel.app)

🔌 **Live API Endpoint:** [https://fixit-production-b37f.up.railway.app/api/v1](https://fixit-production-b37f.up.railway.app/api/v1)

</div>

---

## 📐 Architecture

![FixIt Cloud Architecture](./docs/architecture.jpg)

The application runs on a highly scalable, decoupled cloud infrastructure. The frontend is served via Vercel's Edge Network for global performance and SEO optimization. The backend runs as a containerized NestJS API hosted on Railway, securely connected to a fully managed Railway PostgreSQL database.

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4 |
| **Backend** | NestJS 10, TypeScript, Node.js |
| **Database** | PostgreSQL 15 |
| **Payments** | Stripe API (Payment Intents + Webhooks) |
| **Authentication**| JSON Web Tokens (JWT) + Refresh Rotation |
| **Frontend Cloud** | Vercel Edge Network |
| **Backend Cloud** | Railway (PaaS) |

---

## ✨ Core Features

### 👤 Authentication
- Secure authentication flows
- JWT access tokens and refresh tokens securely stored
- Role-based access control (Consumer vs Technician)

### 🛒 Consumer Features
- Browse a full service catalog (Plumbing, Electrical, AC, Cleaning, etc.)
- Book standard services with date, time, and address picker
- Submit **custom job requests** with descriptions and photos
- Choose payment method — **Stripe (online) or Cash on Delivery**
- Consumer dashboard with booking history and real-time status tracking

### 🔧 Technician Features
- Daily job agenda view
- Accept/reject custom job quotes
- Real-time status updates: En-Route → In Progress → Completed
- Weekly earnings ledger and payment history

### 💳 Payments
- Stripe Integration for secure, PCI-compliant credit/debit card processing
- Cash on Delivery option
- Webhook integration to confirm payments and securely update booking status

---

## ☁️ Cloud Infrastructure & CI/CD

The application utilizes a continuous deployment model seamlessly linked to GitHub.

```text
git push → main
      │
      ├──► Vercel (Frontend)
      │     1. Detects changes in `/frontend`
      │     2. Builds Next.js optimized static & serverless pages
      │     3. Deploys to Vercel Global Edge Network
      │
      └──► Railway (Backend)
            1. Detects changes in `/backend`
            2. Builds Docker container (NestJS)
            3. Rolling zero-downtime deployment
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)
- [Stripe Account](https://stripe.com/) (For test API keys)

### 1. Clone the Repository
```bash
git clone https://github.com/abdulhadi-js/Fixit.git
cd Fixit
```

### 2. Configure Backend Environment
Create a `.env` file inside `/backend`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=fixit

JWT_SECRET=supersecret_jwt
JWT_REFRESH_SECRET=supersecret_refresh

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=3001
```

### 3. Run the Backend (NestJS API)
```bash
cd backend
npm install
npm run seed       # Seeds the database with default services
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

## 📁 Project Structure

```text
Fixit/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # JWT authentication and guards
│   │   ├── bookings/         # Job bookings & scheduling module
│   │   ├── payments/         # Stripe payment integration
│   │   ├── services/         # Service catalog module
│   │   └── users/            # User role management
│   ├── database/             # Seeder scripts
│   └── Dockerfile            # Railway container definition
│
├── frontend/                 # Next.js Frontend
│   ├── src/app/
│   │   ├── (consumer)/       # Consumer-facing pages
│   │   │   ├── checkout/     # Stripe payment page
│   │   │   └── dashboard/    # Consumer booking dashboard
│   │   ├── (technician)/     # Technician-facing pages
│   │   │   ├── technician/dashboard/ # Job agenda & status updates
│   │   │   └── technician/earnings/  # Weekly earnings ledger
│   │   └── (public)/         # Auth & Service Catalog
│   ├── src/components/       # Reusable Bento grids, Marquees, UI
│   └── src/lib/api/          # API Client layer
│
├── docs/                     # Architecture diagrams
├── .gitignore
└── README.md
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved © FixIt 2026.
