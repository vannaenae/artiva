# TestFlight Setup — Artiva as a native iOS app

Artiva is a web app (React + Vite, deployed to Firebase Hosting — see
`CI_SETUP.md`). `ios/` wraps that same build in a native shell using
[Capacitor](https://capacitorjs.com/): `capacitor.config.ts` points it at
`dist/`, so `npx cap sync ios` copies the exact same output Firebase Hosting
serves into the Xcode project. No app logic lives in `ios/` — it's a native
window onto the web app plus whatever native APIs get added later.

`.github/workflows/testflight-deploy.yml` builds that Xcode project on a
macOS GitHub Actions runner and uploads it to TestFlight. It's a *manual*
trigger (Actions tab → **Deploy to TestFlight** → **Run workflow**), not
push-triggered like `firebase-deploy.yml`, because every run consumes a
build number and hits App Store Connect.

None of the steps below can be done from this repo or by an AI agent — they
require your own Apple ID, a paid Apple Developer Program membership, and
access to the App Store Connect / Apple Developer web consoles. This doc is
the checklist for doing them once.

## 1. One-time Apple-side setup

1. **Enroll in the Apple Developer Program** (developer.apple.com/programs —
   $99/year) if you haven't already, using the Apple ID you want to own this
   app.
2. **Register the App ID** — Apple Developer → **Certificates, IDs &
   Profiles** → **Identifiers** → **+** → App IDs → App. Bundle ID:
   `com.artiva.app` (explicit, must match `capacitor.config.ts`'s `appId`).
3. **Create the app record in App Store Connect** —
   appstoreconnect.apple.com → **Apps** → **+** → New App → platform iOS,
   bundle ID `com.artiva.app`, same name ("Artiva") you want on TestFlight.
4. **Create a Distribution certificate** — Apple Developer → **Certificates**
   → **+** → **Apple Distribution**. Download it, double-click to install
   into your local Keychain Access, then export it as a `.p12` (Keychain
   Access → right-click the certificate → Export → set an export password —
   you'll need that password as a secret below).
5. **Create an App Store provisioning profile** — Apple Developer →
   **Profiles** → **+** → **App Store** distribution → select the
   `com.artiva.app` App ID → select the distribution certificate from step 4
   → download the `.mobileprovision` file.
6. **Create an App Store Connect API key** — App Store Connect → **Users and
   Access** → **Integrations** → **App Store Connect API** → **+**. Give it
   the **App Manager** role. Download the `.p8` key file **immediately** —
   Apple only lets you download it once — and note the **Key ID** and
   **Issuer ID** shown on that page.
7. **Find your Team ID** — Apple Developer → **Membership** (or the
   Certificates/Profiles pages) — a 10-character alphanumeric string.

## 2. Add the GitHub repository secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository
secret**. Add all of these (in addition to the `VITE_*` / Firebase secrets
`CI_SETUP.md` already documents — the TestFlight build also needs those, to
embed real Firebase/Paystack config in the app):

| Secret | Value |
|---|---|
| `IOS_DIST_CERTIFICATE_P12_BASE64` | `base64 -i DistributionCert.p12 \| pbcopy`, paste the output |
| `IOS_DIST_CERTIFICATE_PASSWORD` | the export password you set in step 1.4 |
| `IOS_PROVISIONING_PROFILE_BASE64` | `base64 -i Artiva_App_Store.mobileprovision \| pbcopy`, paste the output |
| `IOS_CI_KEYCHAIN_PASSWORD` | any password you make up — only used for the throwaway CI keychain |
| `APPLE_TEAM_ID` | the Team ID from step 1.7 |
| `APP_STORE_CONNECT_KEY_ID` | the Key ID from step 1.6 |
| `APP_STORE_CONNECT_ISSUER_ID` | the Issuer ID from step 1.6 |
| `APP_STORE_CONNECT_KEY_CONTENT_BASE64` | `base64 -i AuthKey_XXXXXXXXXX.p8 \| pbcopy`, paste the output |

(`base64 -i <file> | pbcopy` is macOS; on Linux use
`base64 -w0 <file> | xclip -selection clipboard`, or just `base64 -w0
<file>` and copy the printed output.)

## 3. What the workflow does

1. Builds the web app (`npm run build`) with the same `VITE_*` secrets as
   the Firebase deploy, so the iOS build embeds real config, not demo/mock
   fallbacks.
2. `npx cap sync ios` copies that build into `ios/App/App/public`.
3. Decodes the certificate and provisioning profile secrets, imports them
   into a temporary CI keychain (`security import` / `security
   create-keychain`), and reads the profile's name so fastlane can select
   it by name.
4. Writes the App Store Connect API key to a temp file.
5. Runs `bundle exec fastlane beta` (`ios/App/fastlane/Fastfile`), which:
   - looks up the last build number already on TestFlight and increments
     past it (`latest_testflight_build_number` / `increment_build_number`),
   - switches the Xcode project to manual signing with the imported
     certificate + profile (`update_code_signing_settings`),
   - archives and exports a release `.ipa` (`build_app`),
   - uploads it to TestFlight (`upload_to_testflight`).

## 4. After the first successful run

- App Store Connect → your app → **TestFlight** tab → the build appears
  once Apple finishes processing it (usually a few minutes to an hour) —
  `skip_waiting_for_build_processing: true` in the Fastfile means the
  workflow doesn't sit there waiting for that.
- Add yourself (and other testers) under **Internal Testing** (immediate,
  no App Review) or **External Testing** (first build needs a quick Apple
  Beta App Review, subsequent builds usually don't).
- **Missing Compliance**: TestFlight may prompt for export compliance info
  the first time — Artiva doesn't use custom encryption, so "No" is
  correct.

## 5. Local development / testing without CI

Requires a Mac with Xcode installed — nothing here runs on Linux/CI-less
setups:

```bash
npm run build       # produces dist/
npx cap sync ios     # copies dist/ into ios/App/App/public
npx cap open ios     # opens ios/App/App.xcodeproj in Xcode
```

From Xcode you can run Artiva in the Simulator or on a connected device, or
do `Product → Archive` to build/upload manually instead of via CI.
