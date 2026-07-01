# FixIt Backend API Report & Summary

## 🏗️ Architecture & Tech Stack
The FixIt backend is a modular, enterprise-grade REST API designed to facilitate secure home service bookings, upfront payments, and strict role-based access control (RBAC).

- **Framework:** NestJS (Node.js/TypeScript)
- **Database:** PostgreSQL (with TypeORM)
- **Authentication:** Dual JWT (15m Access / 7d Refresh) + WhatsApp OTP Verification
- **Payments:** Stripe API (Manual Capture flows + Webhooks)
- **Integrations:** Meta WhatsApp Cloud API
- **Testing:** TestSprite Autonomous AI testing agent

---

## 🔒 Security & Data Integrity
1. **Strict RBAC:** Endpoints are heavily protected utilizing `@UseGuards(JwtAuthGuard, RolesGuard)`. Actions are strictly partitioned across `CONSUMER`, `TECHNICIAN`, and `ADMIN` roles.
2. **PostgreSQL GiST Constraint:** At the database level, the system utilizes a `tsrange` exclusion constraint. It is mathematically impossible for a technician to be double-booked for overlapping time slots.
3. **Session Rotation:** Refresh tokens are securely hashed via bcrypt. Token reuse detection is enabled—if an old refresh token is used, all active sessions for that user are immediately invalidated.
4. **Resilient URL Mapping:** An internal proxy middleware automatically catches and corrects requests missing the `/api/v1` prefix to gracefully handle misconfigured frontend/QA requests.

---

## 🔌 Complete REST API Endpoints

All endpoints are prefixed with `BASE_URL = /api/v1`

### 1. Authentication (`/auth`)
Handles secure onboarding, WhatsApp verification, and session management.

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Creates a user account and triggers a 6-digit WhatsApp OTP. Returns 201 Created. |
| `POST` | `/auth/verify-otp` | Public | Validates the OTP. If valid, marks `is_verified: true` and issues JWT token pair. |
| `POST` | `/auth/login` | Public | Authenticates via phone/password. Rejects users if `is_verified` is false. |
| `POST` | `/auth/resend-otp` | Public | Generates a new 6-digit OTP and fires a WhatsApp payload. |
| `POST` | `/auth/refresh` | Public | Rotates the JWT session using a valid refresh token. |
| `POST` | `/auth/logout` | `JWT` | Invalidates the active refresh token hash in the database. |
| `GET` | `/auth/me` | `JWT` | Returns the profile data of the currently authenticated user. |

### 2. Service Catalog (`/services`)
Manages the upfront, fixed-price Pakistani home services catalog (pre-seeded with 25 realistic services).

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/services` | Public | Returns the full array of available home repair services and prices. |
| `GET` | `/services/:id` | Public | Returns a specific service category by its UUID. |
| `POST` | `/services` | `ADMIN` | Adds a new service category to the catalog. |
| `PATCH`| `/services/:id` | `ADMIN` | Modifies an existing service's base price or duration. |
| `DELETE`| `/services/:id`| `ADMIN` | Permanently deletes a service from the catalog. |

### 3. Bookings (`/bookings`)
The core transactional engine managing the lifecycle of a repair job.

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/bookings` | `CONSUMER` | Initializes a booking. Automatically calls Stripe to generate a manual `PaymentIntent` authorization hold. Returns the booking object and Stripe `client_secret`. |
| `GET` | `/bookings/availability` | `JWT` | Queries the DB for technicians that do *not* have an overlapping `tsrange` for a specific `service_id` and `scheduled_start`. |
| `GET` | `/bookings/my` | `CONSUMER` | Returns all active and historical bookings for the logged-in Consumer. |
| `GET` | `/bookings/agenda` | `TECHNICIAN` | Returns the upcoming scheduled jobs specifically assigned to the logged-in Technician. |
| `PATCH`| `/bookings/:id/status` | `TECHNICIAN` | State machine transition. Moves booking from `CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED`. **Critical:** Transitioning to `COMPLETED` automatically triggers the Stripe Capture API to finalize the funds. |
| `DELETE`| `/bookings/:id` | `CONSUMER` | Cancels the booking and automatically issues a Stripe refund/cancellation of the payment hold. |

### 4. Payments (`/payments`)
Financial reporting and Webhook listeners.

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments/webhook` | Public | Stripe Webhook Listener. Bypasses standard JSON parsers to use `rawBody` for cryptographic signature verification. Listens for async confirmation and cancellation events. |
| `GET` | `/payments/transactions/my` | `CONSUMER` | Retrieves the ledger of authorization holds, captures, and refunds for the Consumer. |
| `GET` | `/payments/earnings` | `TECHNICIAN` | Aggregates the Technician's total completed jobs and total cleared PKR earnings for the current week. |
