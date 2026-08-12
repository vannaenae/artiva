# Deploying Artiva

The app is deployment-ready: `vercel.json` handles SPA routing, the build is
verified, and all Firebase access is driven by environment variables. What
remains are the steps that require your Firebase and Vercel accounts.

---

## 1. Firebase

### 1a. Enable the services

In the [Firebase console](https://console.firebase.google.com), open your
project and enable:

| Service | Where | Setting |
| --- | --- | --- |
| **Phone Auth** | Build → Authentication → Sign-in method | Enable **Phone** |
| **Firestore** | Build → Firestore Database → Create database | Start in **production mode** |
| **Storage** | Build → Storage → Get started | Start in **production mode** |

Production mode is correct here — the repo ships its own rules (step 1c) that
are stricter than the test-mode defaults.

> **Note on Phone Auth:** real SMS delivery requires the project to be on the
> **Blaze (pay-as-you-go)** plan. There's a free monthly quota, but a billing
> account must be attached. If you'd rather not enable billing yet, leave
> `VITE_USE_DEMO_OTP=true` in Vercel and the app stays in demo mode (any
> 6-digit code works) while everything else — Firestore, Storage, uploads —
> runs for real.
>
> For testing without burning SMS quota, add fixed test numbers under
> Authentication → Sign-in method → Phone → *Phone numbers for testing*.

### 1b. Grab the web config

Project Settings (gear icon) → **General** → *Your apps*. If there's no Web
app yet, click the `</>` icon to add one (no need to set up Hosting).

Copy the values from the `firebaseConfig` snippet — you'll paste them into
Vercel in step 2b. These map to the env vars like so:

| `firebaseConfig` key | Env var |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

Copy `storageBucket` exactly as shown — newer projects use
`<project-id>.firebasestorage.app`, older ones `<project-id>.appspot.com`.

These values are **not secrets**. Firebase web config ships inside the client
bundle by design; access is controlled by the security rules in step 1c, not
by hiding the config.

### 1c. Deploy the security rules

The repo includes `firestore.rules` and `storage.rules`, which restrict every
user to their own `users/{uid}` document and `verification/{uid}/**` files.
Deploy them from your machine:

```bash
npm install -g firebase-tools
firebase login
firebase use --add        # select your project
firebase deploy --only firestore:rules,storage:rules
```

**Don't skip this.** Without it, production mode denies all reads/writes and
the app silently fails to save profiles.

### 1d. Authorize your Vercel domain

After step 2 gives you a live URL, come back to Authentication → **Settings**
→ *Authorized domains* and add your Vercel domains:

- `<your-project>.vercel.app`
- any custom domain you attach

Phone Auth's reCAPTCHA check rejects unlisted domains, so sign-in will fail
on the deployed site until this is done. `localhost` is authorized by default.

---

## 2. Vercel

### 2a. Import the repo

Go to [vercel.com/new](https://vercel.com/new) → import **`vannaenae/artiva`**.

Vercel auto-detects Vite and infers the right settings (`npm run build`,
output `dist`), so you can leave the build config untouched.

Importing from git — rather than uploading a build — is what gives you
auto-deploys on every push to `main` plus a preview URL on every PR.

### 2b. Add the environment variables

In the import screen (or later under Settings → **Environment Variables**),
add the six `VITE_FIREBASE_*` values from step 1b. Apply them to
**Production, Preview, and Development**.

Optionally add `VITE_USE_DEMO_OTP=true` to keep demo OTP on. Leave it unset
for real SMS.

> These are read by Vite at **build time**, not runtime — so after changing
> any of them you must redeploy for the change to take effect.

### 2c. Deploy

Hit **Deploy**. Then finish step 1d with the URL you get back.

---

## Verifying it worked

Open the deployed URL and walk the flow:

1. **Splash → phone entry** — if it lands here, the app booted cleanly.
2. **Enter a phone number → Send OTP.** Real SMS arrives if Phone Auth and
   Blaze are set up; otherwise any 6 digits work in demo mode.
3. **Pick a role, accept terms.** Then check Firestore → a `users/{uid}`
   document should now exist with `role` and `agreedToTermsAt` set. This is
   the single best signal that config + rules are both correct.
4. **Upload an ID photo.** Check Storage → a file should appear under
   `verification/{uid}/`.

### If something's off

| Symptom | Cause |
| --- | --- |
| Console warns "Firebase env vars are not set" | Env vars missing or not applied to that environment — add them and **redeploy** |
| Sign-in fails with a domain/reCAPTCHA error | Vercel domain missing from Firebase authorized domains (step 1d) |
| `permission-denied` writing the profile | Security rules not deployed (step 1c) |
| OTP accepts any code in production | `VITE_USE_DEMO_OTP` is still `true`, or the Firebase config is incomplete |
| Deep links 404 | `vercel.json` missing from the deployed commit |
