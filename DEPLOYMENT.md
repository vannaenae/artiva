# Deploying Artiva

The app is deployment-ready: `vercel.json` handles SPA routing, the build is
verified, and all Firebase access is driven by environment variables. What
remains are the steps that require your Firebase and Vercel accounts.

## Current status — `artiva-hub`

| Service | Status |
| --- | --- |
| Web app registered | ✅ (config values below) |
| Phone Auth | ✅ enabled |
| Firestore | ✅ created — production mode, `eur3` (Europe multi-region) |
| Storage | ❌ not provisioned — requires the Blaze plan; project is on Spark |
| Security rules deployed | ❌ not yet — do this before real traffic (step 1c) |

```
VITE_FIREBASE_API_KEY=AIzaSyDLzICjGxW-bI-IYKj1PXEycT0rryZm2n0
VITE_FIREBASE_AUTH_DOMAIN=artiva-hub.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=artiva-hub
VITE_FIREBASE_STORAGE_BUCKET=artiva-hub.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=896166890194
VITE_FIREBASE_APP_ID=1:896166890194:web:2a97ebb038624ded4ffb0b
```

**On the Storage gap:** the app now handles this gracefully. When Firebase
Storage is configured but not actually usable (no bucket provisioned), every
upload transparently falls back to local browser storage instead of failing
— the verification flow, including ID/selfie/document uploads, still works
end to end. A visible banner ("Cloud storage isn't set up…") appears at the
top of the app the moment this happens, so it's never silently pretending to
be real. Uploaded files in this mode only exist in the uploader's own
browser — fine for demos and review, not for real user data. Provisioning
Storage later (Blaze plan → Storage → Get started, same `eur3` region) makes
the fallback stop triggering with no code changes.

---

## 1. Firebase

### 1a. Enable the services

Already done for `artiva-hub` — see the status table above. If you're
setting up a different/second project, in the
[Firebase console](https://console.firebase.google.com) enable:

| Service | Where | Setting |
| --- | --- | --- |
| **Phone Auth** | Build → Authentication → Sign-in method | Enable **Phone** |
| **Firestore** | Build → Firestore Database → Create database | Start in **production mode** |
| **Storage** *(optional, needs Blaze)* | Build → Storage → Get started | Start in **production mode** |

Production mode is correct — the repo ships its own rules (step 1c) that are
stricter than the test-mode defaults. Storage can be added later; see the
fallback note above.

> **Note on Phone Auth:** real SMS delivery requires the **Blaze**
> (pay-as-you-go) plan — there's a free monthly quota, but a billing account
> must be attached. `artiva-hub` is on Spark, so real SMS won't send yet even
> though Phone Auth is enabled. Leave `VITE_USE_DEMO_OTP=true` in Vercel
> until you're ready for that (Firestore still works for real either way).
>
> For testing without burning SMS quota once on Blaze, add fixed test
> numbers under Authentication → Sign-in method → Phone → *Phone numbers for
> testing*.

### 1b. Grab the web config

Already have it — see the block above. (For future reference, it comes from
Project Settings → General → *Your apps* → the `</>` Web app.)

These values are **not secrets**. Firebase web config ships inside the client
bundle by design; access is controlled by the security rules in step 1c, not
by hiding the config.

### 1c. Deploy the security rules

The repo includes `firestore.rules` and `storage.rules`, which restrict every
user to their own `users/{uid}` document and `verification/{uid}/**` files.
Deploy them from your machine (this needs your own `firebase login` — it
can't be scripted from here):

```bash
npm install -g firebase-tools
firebase login
firebase use --add                      # select artiva-hub
firebase deploy --only firestore:rules  # do this now
```

**Don't skip this.** Without it, production mode denies all reads/writes and
the app silently fails to save profiles.

Hold off on `storage:rules` until Storage is actually provisioned — deploying
rules against a bucket that doesn't exist yet will fail. Once you add
Storage, run:

```bash
firebase deploy --only storage:rules
```

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
add the six `VITE_FIREBASE_*` values from the status block above. Apply them
to **Production, Preview, and Development**.

Also add `VITE_USE_DEMO_OTP=true` for now — `artiva-hub` is on Spark, so real
SMS won't send yet even with Phone Auth enabled. Remove it once you're on
Blaze and want real OTP delivery.

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
4. **Upload an ID photo.** With Storage not yet provisioned, you should see
   the "Cloud storage isn't set up" banner appear and the flow continue
   normally — that's the fallback working as designed, not a bug.

### If something's off

| Symptom | Cause |
| --- | --- |
| Console warns "Firebase env vars are not set" | Env vars missing or not applied to that environment — add them and **redeploy** |
| Sign-in fails with a domain/reCAPTCHA error | Vercel domain missing from Firebase authorized domains (step 1d) |
| `permission-denied` writing the profile | `firestore.rules` not deployed (step 1c) |
| OTP accepts any code in production | `VITE_USE_DEMO_OTP` is still `true` (expected until Blaze), or the Firebase config is incomplete |
| Deep links 404 | `vercel.json` missing from the deployed commit |
| "Cloud storage isn't set up" banner still showing after adding Storage | It clears itself the next time an upload succeeds for real — retry the current step, or refresh and re-upload |
