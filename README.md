# Artiva

Artiva is a two-sided services marketplace ("hire" vs. "provide"). This app
implements the **onboarding + identity verification flow** ("Verifix") from
the [Figma file](https://www.figma.com/design/vK27oIGb5Cteo40AT6Nbxk/Verifix-%E2%80%94-Verification-Screens),
page 5, built with **React + TypeScript + Vite**, styled with **Tailwind CSS**,
and backed by **Firebase** (Phone Auth, Firestore, Storage).

## Flow implemented

Splash → Phone entry → OTP verify → Role selection (customer/provider) →
Terms & Privacy consent → Verification intro → Verification checklist →
Government ID upload (front/back) → Selfie capture/preview → Trade
certificate (providers only) → Proof of address → Background check consent →
Pending review → Verified / Rejected result → Home.

Plus the supporting utility screens: Switch Role, Camera Permission Denied,
Upload Failed, Document Unreadable, and Notification Permission Prompt.

Provider/customer marketplace screens beyond verification (search, booking,
payouts, etc.) are out of scope for this pass — `HomeScreen` is a light
post-verification landing stub with pointers to where those would plug in.

## Tech stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** — design tokens (colors, fonts) in `src/index.css` `@theme`, extracted from the Figma file
- **React Router** for navigation between screens
- **Firebase**: Auth (Phone/OTP), Firestore (user + verification profile), Storage (ID/selfie/document uploads)
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

The app runs out of the box in **demo mode** with no Firebase project
configured: sign-in accepts any 6-digit OTP code, and profile data / uploaded
files are persisted to `localStorage` instead of Firestore/Storage. This
makes the whole flow explorable without a paid phone-auth-enabled Firebase
project.

## Connecting a real Firebase project

1. Create (or open) a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication → Phone** sign-in, plus **Firestore** and **Storage**.
3. Add a Web app to the project and copy its config.
4. Copy `.env.example` to `.env.local` and fill in the `VITE_FIREBASE_*` values.
5. Leave `VITE_USE_DEMO_OTP` unset once you want real SMS delivery (requires
   the Blaze plan; reCAPTCHA runs automatically via the invisible
   `#recaptcha-container` on the phone entry screen).
6. Deploy the included security rules:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add   # pick your project
   firebase deploy --only firestore:rules,storage:rules
   ```

`firestore.rules` and `storage.rules` restrict every user to reading/writing
only their own `users/{uid}` profile document and `verification/{uid}/**`
files.

## Deploying

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full Firebase + Vercel setup
walkthrough, including the gotchas (authorized domains, deploying rules,
build-time env vars).

## iOS / TestFlight

The app is also wrapped as a native iOS project via
[Capacitor](https://capacitorjs.com) (`ios/`). See
**[TESTFLIGHT.md](./TESTFLIGHT.md)** for the Xcode → App Store Connect →
TestFlight walkthrough — building and signing the `.ipa` requires a Mac and
can't be done from this repo alone.

## Project structure

```
src/
  components/
    layout/          # AppHeader (dark top bar)
    ui/               # Button, Checkbox, IconCircle
    verification/     # OtpInput, UploadBox, ChecklistItem, StatusScreen
  context/
    AppContext.tsx     # auth + profile state, Firebase/demo-mode backend switch
  lib/
    firebase.ts         # Firebase app/auth/firestore/storage init
    backend.ts           # Firestore+Storage calls, with localStorage demo fallback
    flow.ts                # canonical "what screen comes next" logic
  screens/
    auth/, onboarding/, verification/, status/, home/
  types/                 # UserProfile, VerificationSteps, etc.
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run oxlint
