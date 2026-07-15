# FixIt - Home Services Platform (Frontend)

FixIt is a premium, full-stack home services platform that connects consumers with verified professionals for seamless service scheduling, tracking, and payments. This repository contains the Frontend application built with modern web technologies, prioritizing a rich, responsive, and aesthetic user experience.

## 🚀 Key Highlights

- **Dual-Role Dashboard:** Dedicated, contextual experiences for both Consumers and Technicians.
- **Dynamic Service Booking:** Interactive scheduling with real-time API integrations and Stripe checkout.
- **Custom Job Marketplace:** Consumers can post custom jobs specifying their budget and requirements, which technicians can claim from a live Job Board.
- **Premium Aesthetics:** Built with a design-first approach utilizing Plus Jakarta Sans typography, micro-animations, glassmorphism, and responsive CSS variables.

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 
- **Icons & Fonts:** Material Symbols Outlined, Lucide React, Plus Jakarta Sans (Google Fonts)
- **Animations:** Framer Motion
- **Payments:** Stripe.js / React Stripe Elements
- **Deployment:** Vercel

## 🛠️ How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulhadi-js/Fixit-Frontend.git
   cd Fixit-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe Publishable Key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📱 Project Structure Highlights

- `src/app/(consumer)/`: All routes and dashboards specific to consumers.
- `src/app/(technician)/`: All routes, job boards, and earnings ledgers specific to technicians.
- `src/components/`: Reusable, atomic UI components (Buttons, Inputs, Cards, Navbars).
- `src/hooks/`: Custom React hooks for interacting with the backend APIs (`useBookings`, `useTechAgenda`, etc.).
- `src/lib/api/`: Centralized fetch client handling JWT authentication and global error handling.

---

*Part of the FixIt ecosystem. Designed and built with ❤️*
