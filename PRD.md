# Product Requirement Document (PRD): FixIt Platform

## 1. Executive Summary
**Product Name:** FixIt  
**Product Vision:** To eliminate the friction and anxiety of hiring home service professionals in the Pakistani market by providing a transparent, upfront-pricing platform. Consumers can book verified technicians for exact time slots with guaranteed pricing, bypassing unpredictable overcharging and stressful manual negotiations. To ensure platform integrity and eliminate fraudulent bookings, all consumer and technician accounts are secured via mandatory WhatsApp OTP (One-Time Password) verification.

---

## 2. Technology Stack Specification

| Layer | Technology | Primary Function |
| :--- | :--- | :--- |
| **Frontend** | Next.js, Tailwind CSS | Client-facing UI, server-side rendering, and responsive bento-grid layouts optimized for both mobile and desktop screens. |
| **Backend** | NestJS | Modular enterprise REST API, handling business logic, dependency injection, and strict role-based routing. |
| **Database** | PostgreSQL | ACID-compliant relational data storage for handling structured financial records and strict transactional booking states. |
| **Infrastructure** | Docker | Containerization via `docker-compose.yml` to maintain absolute parity between local development and production environments. |
| **QA / Automation** | TestSprite | Autonomous AI testing agent integrated via an MCP (Model Context Protocol) server for hands-free E2E and API validation. |
| **Payments** | Stripe API | Securely executing authorized payment holds and final captures to enforce upfront pricing integrity. |
| **Communication**| Meta WhatsApp Cloud API | Delivering secure, pre-approved "Authentication" templates for OTP verification codes directly to user devices. |

---

## 3. Complete Database Schema (PostgreSQL)

This schema uses UUIDs for primary keys to enhance security, stores all monetary values in `INTEGER` (exact Pakistani Rupees / PKR) to avoid floating-point errors, and utilizes `JSONB` for flexible object storage where necessary.

### 3.1. Users Table
Manages accounts, handles Role-Based Access Control (RBAC), and governs WhatsApp OTP state.
*   `id`: UUID (Primary Key, Default: `gen_random_uuid()`)
*   `full_name`: TEXT (Not Null)
*   `phone_number`: VARCHAR(15) (Not Null, Unique) — *e.g., +923131123595*
*   `role`: ENUM ('CONSUMER', 'TECHNICIAN', 'ADMIN') (Not Null)
*   `password_hash`: TEXT (Not Null)
*   `is_verified`: BOOLEAN (Default: false)
*   `otp_code`: VARCHAR(6) (Nullable) — *Temporarily stores the active 6-digit WhatsApp code.*
*   `otp_expires_at`: TIMESTAMP (Nullable) — *Tracks exactly when the code becomes invalid.*
*   `created_at`: TIMESTAMP (Default: `NOW()`)

### 3.2. ServiceCategories Table
The master fixed-price catalog of available home repairs.
*   `id`: UUID (Primary Key, Default: `gen_random_uuid()`)
*   `title`: TEXT (Not Null) — *e.g., "1.5 Ton AC Deep Clean"*
*   `base_price`: INTEGER (Not Null) 
*   `estimated_duration_mins`: SMALLINT (Not Null, Default: 60)
*   `metadata`: JSONB (Nullable)

### 3.3. Bookings Table
The central transactional table governing appointments and blocking scheduling overlaps.
*   `id`: UUID (Primary Key, Default: `gen_random_uuid()`)
*   `consumer_id`: UUID (Foreign Key -> `Users.id`, Not Null)
*   `technician_id`: UUID (Foreign Key -> `Users.id`, Not Null)
*   `service_id`: UUID (Foreign Key -> `ServiceCategories.id`, Not Null)
*   `scheduled_time`: TSRANGE (Not Null) 
*   `address_details`: JSONB (Not Null) 
*   `status`: ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') (Default: 'PENDING_PAYMENT')
*   **Database Constraints:** 
    *   `EXCLUDE USING GiST (technician_id WITH =, scheduled_time WITH &&)` 
    *   *Engineering Note:* This constraint runs natively inside PostgreSQL to block any overlapping timestamp ranges (`&&`) for the same technician (`=`).

### 3.4. Transactions Table
Tracks the lifecycle of the Stripe authorization holds and final captures.
*   `id`: UUID (Primary Key, Default: `gen_random_uuid()`)
*   `booking_id`: UUID (Foreign Key -> `Bookings.id`, Not Null)
*   `stripe_payment_intent_id`: TEXT (Not Null, Unique)
*   `amount`: INTEGER (Not Null)
*   `status`: ENUM ('HOLD', 'CAPTURED', 'REFUNDED') (Not Null)
*   `updated_at`: TIMESTAMP (Default: `NOW()`)

---

## 4. Complete Core User Flows

### 4.1. Account Registration & WhatsApp Verification (Flow A)
1.  **Registration:** The user (Consumer or Technician) inputs their full name, role, and phone number (+92 format) on the Sign-Up interface.
2.  **Code Generation:** The NestJS backend generates a secure 6-digit random code, calculates the `otp_expires_at` to exactly 5 minutes from `NOW()`, and saves both parameters to the `Users` table.
3.  **WhatsApp Dispatch:** NestJS utilizes the Meta WhatsApp Cloud API to fire an approved "Authentication" template containing the payload variable directly to the user's WhatsApp client.
4.  **Input:** The user is redirected to the Verification UI and enters the 6-digit code.
5.  **Validation:** The backend validates that the submitted code matches the database record and confirms that `NOW()` is less than `otp_expires_at`.
6.  **Success:** The system updates `is_verified` to `true`, nullifies the `otp_code`, and returns an authorized JWT to the client.

### 4.2. Consumer Booking & Payment Hold (Flow B)
1.  **Discovery:** The consumer browses the Next.js landing page, exploring categories utilizing the visual bento-grid components.
2.  **Selection:** The consumer chooses a service and reviews the rigid, upfront price.
3.  **Scheduling:** The consumer interacts with a calendar UI. Next.js fires a request to the NestJS backend, filtering out technicians with overlapping time blocks. 
4.  **Checkout Initialization:** The consumer confirms the address. NestJS creates a row in the `Bookings` table set to `PENDING_PAYMENT`.
5.  **Payment Processing:** NestJS communicates with Stripe to create a manual `PaymentIntent`, placing a temporary hold on the user's card for the exact PKR amount.
6.  **Fulfillment Confirmation:** Upon receiving successful authorization, NestJS updates the booking status to `CONFIRMED`, logs the payment as a `HOLD`, and redirects the consumer to their dashboard.

### 4.3. Technician Fulfillment & Final Capture (Flow C - Mobile-First)
1.  **Authentication:** The technician opens the web app on their mobile browser, inputs their phone number, and logs in securely via the WhatsApp OTP verification flow.
2.  **Agenda Viewing:** The technician is routed to their "Today's Agenda" dashboard. They view a chronological, vertical list of `CONFIRMED` jobs, tapping the current job card to expand it and view the exact house address and consumer contact details.
3.  **Dispatch & Transit:** The technician taps a prominent "Mark En-Route" button. This updates the PostgreSQL database status, instantly reflecting on the consumer's dashboard. A "View Map" link on the card opens native device navigation (e.g., Google Maps) pre-loaded with the destination.
4.  **Job Initiation:** Upon arriving at the service location and preparing to work, the technician taps "Start Repair Session". The NestJS API updates the `Bookings` table status to `IN_PROGRESS`, serving as a digital timestamp for labor initiation.
5.  **Completion & Financial Capture:** Once the repair is finished, the technician taps the massive "Complete Job" CTA. The NestJS backend detects the `COMPLETED` state and automatically communicates with the Stripe API to capture the funds that were placed on hold during checkout. The transaction status changes to `CAPTURED`.
6.  **Earnings Review:** The technician scrolls to the bottom of their dashboard to view a sticky "Weekly Balance" chart, fetching data from the `Transactions` table to display total cleared earnings and completed jobs for the cycle.

### 4.4. TestSprite Autonomous QA (Flow D)
1.  **Ingestion:** The developer initializes the TestSprite MCP server inside their workspace. TestSprite parses this exact PRD to infer system design and validation rules.
2.  **Generation:** TestSprite autonomously generates API integration assertions and End-to-End browser simulations.
3.  **Execution:** The AI agent uses secure cloud sandboxes to simulate concurrent consumer checkouts and OTP verifications to ensure the database constraints hold up under stress.

---

## 5. UI / UX Page Specifications

### 5.1. Landing Page
*   **Hero Section:** Minimalist headline explaining the fixed-rate structure. Includes a wide, centralized auto-suggest search field.
*   **Trust Banner:** A modern badge strip highlighting "Verified Professionals", "No Hidden Charges", and "Post-Repair Work Warranty".
*   **Popular Services Grid:** A responsive bento-grid layout utilizing clean text overlays and vivid imagery.

### 5.2. User Registration Page
*   **Role Selector:** A visual toggle block allowing the user to select "I am a Consumer" (house icon) or "I am a Technician" (wrench icon).
*   **Input Fields:** Minimalist text inputs for "Full Name", "Phone Number", and "Password" featuring zinc-50 backgrounds and emerald-600 focus states.
*   **Primary Action:** A massive, full-width "Create Account" CTA button in emerald-600.

### 5.3. WhatsApp OTP Verification Page
*   **Header Element:** A bold H1 "Check your WhatsApp" accompanied by a subtitle "We sent a secure 6-digit code to your WhatsApp number +92 3XX XXXXXXX" and a minimal WhatsApp brand icon.
*   **OTP Input Group:** A horizontal row of 6 distinct, square input boxes (w-12 h-14) featuring subtle borders. The active focus state utilizes a strict emerald-600 ring.
*   **Action Engine:** A full-width "Verify Code" button.
*   **Fallback Footer:** A dynamically updating countdown timer text reading "Didn't receive a WhatsApp message? Resend in 0:59".

### 5.4. Service Catalog
*   **Layout Structure:** A split-pane screen featuring a fixed left-side sticky navigation sidebar for selecting major verticals (HVAC, Electrical, Plumbing) and a scrollable right-side product layout.
*   **Service Display Cards:** Compact components detailing the exact service scope, estimated duration, a clean display of the flat price in PKR, and an "Add to Booking" button.

### 5.5. Service Details & Scheduling
*   **Inclusions Block:** A prominent split layout where the left column details everything covered under the flat price, and the right column clearly calls out common exclusions.
*   **Date & Time Picker Grid:** An intuitive calendar component where unavailable dates are disabled, revealing a responsive grid of fixed 2-hour window blocks that dynamically checks real-time technician availability.
*   **Address Ingestion Card:** Input fields tailored for local addressing standards, requiring Area/Sector, Street/Block Number, and House/Apartment Number.

### 5.6. Secure Checkout
*   **Order Summary Panel:** A clean, containerized receipt column calculating the subtotal, platform fee, and final PKR breakdown.
*   **Secure Stripe Container:** An embedded, iframe-isolated Stripe Element input zone capturing card details cleanly.
*   **Action Directive:** A full-width CTA button displaying "Authorize Secure Payment hold of Rs. X".

### 5.7. Consumer Dashboard
*   **Active Tracking Timeline:** A sleek vertical line component indicating the live state of upcoming bookings (`CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED`).
*   **Historical Ledger:** A structured table displaying past completed bookings with downloadable invoices.

### 5.8. Technician Dashboard (Role-Restricted)
*   **Agenda Stream:** A bold, simplified interface built for mobile viewports, charting out the day’s scheduled repair locations and exact timeslots.
*   **Fulfillment Control Cards:** Expandable item blocks containing action triggers to push state notifications ("Mark En-Route", "Begin Repair Session", "Complete Job").
*   **Weekly Balance Chart:** A clean tracking graph displaying finalized earnings and pending payouts.