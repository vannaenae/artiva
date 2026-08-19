# Artiva Backend Migration Plan

Artiva started as a fully client-side app (React + `localStorage`, seeded
demo data). This doc tracks the phased migration to a real backend, so each
step ships independently instead of one big rewrite.

## Phase 1 — Real Phone Auth + Firestore Profiles + CI/CD ✅ Complete

- **Two-step Firebase Phone Auth** (`src/lib/phoneAuth.ts`): send SMS OTP →
  confirm code. Falls back to an honest mock flow (no SMS, any 4-6 digit
  code confirms) when Firebase env vars aren't set, so local/demo usage is
  unaffected.
- **Firestore profile docs** (`src/lib/firestoreUsers.ts`): a `users/{uid}`
  doc is upserted on every verified sign-in/sign-up, in addition to (not
  instead of) the existing `localStorage` state. This is a best-effort sync
  layer — a failed Firestore write never blocks sign-in.
- **Security rules** (`firestore.rules`, `storage.rules`): owner-scoped
  reads/writes for `users`, `artisans`, `residents`, `bookings`, `disputes`,
  and verification/dispute file uploads.
- **CI/CD** (`.github/workflows/firebase-deploy.yml`): every push to `main`
  builds the app and deploys Hosting + Firestore/Storage rules to
  `artiva-hub`.

**What Phase 1 deliberately does *not* do:** move booking/artisan/dispute
state off `localStorage`, or add real backend-verified admin auth. Those are
later phases.

## Phase 2 — Artisan & Resident Directory in Firestore

- Move `SEED_ARTISANS` / `SEED_RESIDENTS` from `AppContext` state into
  Firestore collections (`artisans/{id}`, `residents/{id}`), read live via
  `onSnapshot` instead of `localStorage`.
- Artisan verification review (`AdminVerificationPage`) writes directly to
  the artisan's Firestore doc instead of local component state.

## Phase 3 — Bookings & Escrow State Machine in Firestore

- Move `bookings/{id}` into Firestore. Every state transition
  (`acceptBooking`, `startJob`, `completeJobByArtisan`,
  `confirmJobByResident`, …) becomes a Firestore write instead of a local
  `setState`.
- Real-time updates via `onSnapshot` so both parties on a booking see status
  changes live, without a page refresh.

## Phase 4 — Disputes in Firestore

- Move `disputes/{id}` into Firestore, following the same pattern as Phase
  3. Dispute evidence photos already have a Storage path reserved
  (`disputes/{disputeId}/...` in `storage.rules`).

## Phase 5 — Real Admin Authentication

- Replace the client-bundled `VITE_ADMIN_PASSCODE` speed bump with real
  backend-verified admin auth — e.g. a Firebase custom claim (`admin: true`)
  set via a Cloud Function or manually in the Firebase console, checked
  server-side by `firestore.rules`' `isAdmin()` (already written to expect
  this claim).

## Phase 6 — Payment Backend Enforcement

- Paystack payment confirmation currently trusts the client. Add a Cloud
  Function (Paystack webhook) that verifies the transaction server-side
  before marking a booking's escrow as `held`, closing the gap where a
  client could otherwise claim a payment succeeded without one.

---

Each phase should ship as its own PR: build a backend-backed path
alongside the existing local/mock one, verify it end-to-end against a real
`artiva-hub` project, then remove the now-unused local fallback in a
follow-up once it's confirmed working in production.
