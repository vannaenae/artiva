# Artiva — Nigerian Estate Artisan Marketplace Website

Artiva is a two-sided home-services marketplace website connecting residents of gated estates in Nigeria with vetted local artisans (plumbers, electricians, cleaners, AC repair technicians, appliance repairers, carpenters, and painters).

---

## 🚀 1. Core Architecture & Features Built

- **Responsive Website**: Full marketing homepage (`/`), directory, artisan profiles, resident/artisan dashboards, single booking timelines, dispute resolution portal, and mock OTP login/signup.
- **Client-Side Navigation**: Shareable hash URLs (`/#/`, `/#/directory`, `/#/artisan/:id`, `/#/bookings/:id`, `/#/artisan-dashboard`, `/#/admin/verifications`, `/#/disputes`, `/#/login`, `/#/signup`).
- **Unified In-Memory State Layer**: Centralized state in `src/context/AppContext.tsx` with `localStorage` fallback. State updates propagate instantly across Resident, Artisan, and Admin views.
- **Proximity-Sorted Directory**: Nearest-first distance sorting relative to registered Nigerian estates (Lekki Phase 1, VGC, Ikota, Chevron).
- **Interactive Escrow State Machine**: Real-time state transitions (`requested` → `accepted`/`declined` → `in_progress` → `completed` → `confirmed` → `paid_out`).
- **Dual Completion Confirmation**: Payments are released from escrow only after both resident and artisan confirm job completion.
- **Dispute & Trust Layer**: Freeze escrow on dispute creation, photo evidence preview, and admin dispute resolution.
- **Internal Admin Verification Review**: Panel to evaluate submitted NIN credentials and approve/reject verification badges live.

---

## 📊 2. Seed Dataset Overview (`src/data/seedData.ts`)

- **18 Sample Artisans**: Across 7 categories (13 verified, 4 pending, 1 rejected) with profile bios, skills arrays, ratings, hourly rates (₦7,500 – ₦15,000/hr), completed job counts, and customer reviews.
- **6 Sample Residents**: Nigerian estate addresses in Lekki Phase 1, VGC, Ikota Villa, Chevron Drive.
- **12 Sample Bookings**: Representing **every single lifecycle status** (`requested`, `accepted`, `declined`, `in_progress`, `completed`, `confirmed`, `paid_out`, `disputed`).
- **3 Sample Disputes**: `open`, `under_review`, and `resolved`.

---

## 🔄 3. How to Swap Dummy State for a Real Backend

The app is architected with a decoupled context store (`src/context/AppContext.tsx`). To connect a real backend (e.g. Firebase Firestore, Supabase, or Node.js/PostgreSQL):

1. **Authentication**: Replace `loginWithOtp` / `signupResident` in `AppContext.tsx` with Firebase Auth (`signInWithPhoneNumber`) or Supabase Auth.
2. **Artisan Catalog**: Replace `SEED_ARTISANS` initial state with a database fetch (`GET /api/artisans?estateId=...`).
3. **Booking Lifecycle**: Wire state transition functions (`acceptBooking`, `completeJobByArtisan`, `confirmJobByResident`) to backend API endpoints (`PATCH /api/bookings/:id/status`) and Paystack Escrow Subaccount transfers.
4. **Dispute System**: Connect `createDispute` and `resolveDispute` to backend admin dispute ticket queues.

---

## 💻 4. Development & Build Verification Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run TypeScript compilation check & Vite production build
npm run build
```