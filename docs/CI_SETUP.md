# CI/CD Setup — GitHub Actions → Firebase Hosting

`.github/workflows/firebase-deploy.yml` builds the app and deploys Hosting +
Firestore/Storage rules to the `artiva-hub` Firebase project on every push to
`main`. It needs 9 repository secrets before it can run successfully.

## Add the secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository
secret**. Add all 9:

| Secret | Where to get it |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_ARTIVA_HUB` | Firebase Console → Project Settings → Service Accounts → **Generate new private key**. Paste the entire downloaded JSON file as the secret value. |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack dashboard → Settings → API Keys & Webhooks → live **public** key (`pk_live_...`). |
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → General → Your apps → Web app config. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same config block. |
| `VITE_FIREBASE_PROJECT_ID` | Same config block (should be `artiva-hub`). |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same config block. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same config block. |
| `VITE_FIREBASE_APP_ID` | Same config block. |
| `VITE_ADMIN_PASSCODE` | Choose your own value — a real secret, not `change-me`. Gates `/#/admin/secret-portal`. |

## What the workflow does

1. Checks out the repo, installs dependencies (`npm ci`).
2. Builds the app (`npm run build`), injecting the `VITE_*` secrets as
   env vars so they land in the built bundle (Vite only exposes `VITE_`-
   prefixed vars to client code — nothing server-side-only ends up in here).
3. Writes `FIREBASE_SERVICE_ACCOUNT_ARTIVA_HUB` to a temp JSON file and
   points `GOOGLE_APPLICATION_CREDENTIALS` at it.
4. Runs `firebase deploy --only hosting,firestore:rules,storage:rules
   --project artiva-hub`, authenticated via that service account.

## Before the first deploy

Make sure, in the Firebase Console for `artiva-hub`:

- **Authentication → Sign-in method** → Phone is enabled.
- The project is on the **Blaze** (pay-as-you-go) plan — Phone Auth won't
  send real SMS on the free Spark plan.
- **Authentication → Settings → Authorized domains** includes your Hosting
  domain (added automatically by Firebase Hosting, but worth checking).

## Verifying it worked

After merging a PR to `main`:

1. GitHub repo → **Actions** tab → confirm the `Deploy to Firebase` run is
   green.
2. Visit the Hosting URL (`https://artiva-hub.web.app` or your configured
   domain) and confirm the new build is live.
3. `firebase deploy:history --project artiva-hub` (or the Firebase Console
   → Hosting) to confirm the release timestamp matches.

If the workflow fails on the deploy step, double-check
`FIREBASE_SERVICE_ACCOUNT_ARTIVA_HUB` is the raw JSON (not base64-encoded or
wrapped in extra quotes) and that the service account has the **Firebase
Hosting Admin** and **Cloud Datastore/Firestore rules** roles.
