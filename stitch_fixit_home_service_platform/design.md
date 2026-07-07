# Design System & Wireframe Specification: FixIt Platform
This document outlines the visual layout, design tokens, component hierarchies, and low-fidelity structural layouts for the FixIt web application. The design language emphasizes a modern, minimalist "quiet luxury" aesthetic—relying on high whitespace, clean borders, crisp typography, and a structured bento-grid layout.
---
## 1. Design Tokens & Visual Identity
### 1.1. Color Palette (Tailwind CSS Mapping)
The palette uses a highly refined, desaturated neutral scale with a single functional emerald accent to represent trust, reliability, and successful transactions.
| Token | Class Name | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Canvas** | `bg-zinc-50` | `#FAFAFA` | Main application background |
| **Surface High** | `bg-white` | `#FFFFFF` | Bento cards, containers, dialogs |
| **Surface Muted** | `bg-zinc-100` | `#F4F4F5` | Input fields, table headers, borders |
| **Text Primary** | `text-zinc-900` | `#18181B` | Headings, primary body text |
| **Text Secondary**| `text-zinc-500` | `#71717A` | Subheadings, placeholder text, captions |
| **Accent Primary**| `bg-emerald-600`| `#059669` | Primary CTAs, active states, success badges |
| **Accent Hover**  | `hover:bg-emerald-700` | `#047857` | Hover states for primary buttons |
| **Border Soft**   | `border-zinc-200` | `#E4E4E7` | Thin structural card dividers |
### 1.2. Typography
*   **Primary Font Family:** `Inter` or `Geist Sans` (Clean, highly readable sans-serif).
*   **Scale:**
    *   `text-3xl` (Bold, Tracking-tight) - Hero Titles
    *   `text-xl` (Semibold) - Card & Section Headings
    *   `text-base` (Regular) - Body Copy, Form Labels
    *   `text-sm` (Medium) - Buttons, Badges, Table Headers
### 1.3. Layout & Spacing Rules
*   **Card Base:** `rounded-xl border border-zinc-200 bg-white shadow-sm p-6`
*   **Outer Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`
*   **Grid Gap Standard:** `gap-4` or `gap-6` (Maintains tight, cohesive bento layouts)
---
## 2. Core Layout Architecture & Wireframes
### 2.1. Global Navigation Bar Component
A persistent top bar present on all public-facing consumer pages.