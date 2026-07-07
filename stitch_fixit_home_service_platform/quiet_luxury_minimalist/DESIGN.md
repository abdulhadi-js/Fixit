---
name: Quiet Luxury Minimalist
colors:
  surface: '#f5fbf5'
  surface-dim: '#d5dcd6'
  surface-bright: '#f5fbf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5ef'
  surface-container: '#e9efe9'
  surface-container-high: '#e4eae4'
  surface-container-highest: '#dee4de'
  on-surface: '#171d19'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#2c322e'
  inverse-on-surface: '#ecf2ec'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e6'
  on-secondary-container: '#656467'
  tertiary: '#9b3e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5551'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#7f2928'
  background: '#f5fbf5'
  on-background: '#171d19'
  surface-variant: '#dee4de'
  canvas: '#FAFAFA'
  surface-high: '#FFFFFF'
  surface-muted: '#F4F4F5'
  text-primary: '#18181B'
  text-secondary: '#71717A'
  border-soft: '#E4E4E7'
  accent-hover: '#047857'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-x: 2rem
  gap-standard: 1.5rem
  gap-tight: 1rem
---

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
    *   `text-xl` (Semibold) - Card & Section Heading
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
