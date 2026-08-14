# Shipping Artiva to TestFlight

The app is now wrapped as a native iOS project via
[Capacitor](https://capacitorjs.com) — it's the same React app, running
inside a native WKWebView shell, packaged as a real `.ipa` Xcode can sign and
upload. Everything up to "open in Xcode" is done from this repo; everything
from there on needs your Mac, Xcode, and Apple Developer account — none of
that can be scripted from a Linux sandbox.

## What's already set up

- `capacitor.config.ts` — app name "Artiva", bundle ID placeholder
  `com.artiva.app`, web build output (`dist`) wired as the app's content.
- `ios/App/App.xcodeproj` — a real, buildable Xcode project (Swift Package
  Manager, not CocoaPods — no `pod install` step needed).
- `Info.plist` — camera and photo library usage descriptions added (required
  for the ID/selfie upload steps; the app will crash on first camera use
  without these, and Apple will reject a submission missing them).
- `npm run ios:sync` — builds the web app and copies it into the iOS
  project. **Run this after any change to `src/`** before opening Xcode —
  Xcode builds whatever's currently in `ios/App/App/public`, which is a
  snapshot, not a live reference to `dist/`.

## What you need to do (on your Mac)

### 1. Clone and sync

```bash
git clone https://github.com/vannaenae/artiva.git
cd artiva
git checkout claude/ios-testflight-setup   # or main, once merged
npm install
npm run ios:open      # builds the web app, syncs, and opens Xcode
```

### 2. Configure signing

In Xcode, select the **App** target → **Signing & Capabilities**:

- Team: pick your Apple Developer team.
- Bundle Identifier: change `com.artiva.app` to whatever you want to
  register — this becomes permanent for this app once used in a TestFlight
  build, so pick deliberately (e.g. `com.<yourcompany>.artiva`).
- Let Xcode "Automatically manage signing" unless you already have
  provisioning profiles set up manually.

### 3. Register the App ID + create the app record

If this bundle ID hasn't been used before:

1. [developer.apple.com](https://developer.apple.com) → Certificates,
   Identifiers & Profiles → Identifiers → register the bundle ID from step 2.
2. [App Store Connect](https://appstoreconnect.apple.com) → My Apps → **+**
   → New App → pick the same bundle ID, name it "Artiva" (or your choice),
   set the primary language and category.

### 4. Set version + build number

Still in **Signing & Capabilities** (or the General tab):

- Version (`CFBundleShortVersionString`): e.g. `1.0.0`.
- Build (`CFBundleVersion`): increment this **every time** you upload a new
  build — App Store Connect rejects a duplicate build number.

### 5. Archive and upload

- Select **Any iOS Device (arm64)** as the run destination (not a simulator
  — simulator builds can't be archived for upload).
- Product → Archive.
- When the Organizer window opens, **Distribute App** → **App Store
  Connect** → **Upload** → follow the prompts (automatic signing is fine).
- Processing in App Store Connect usually takes a few minutes to ~an hour.

### 6. Add testers in TestFlight

App Store Connect → your app → **TestFlight** tab:

- **Internal testing**: add testers by Apple ID (must be on your team) — no
  review needed, available almost immediately after processing.
- **External testing**: add a group, submit for the (usually fast) Beta App
  Review, then invite testers by email or share the public link.

## Known limitations to be aware of

**Phone Auth (real OTP) is unreliable inside a native WebView.** The app
currently uses Firebase's Web SDK for Phone Auth, which relies on reCAPTCHA
and a browser-style origin — both fragile inside a `capacitor://` WKWebView
context. This doesn't block testing: `VITE_USE_DEMO_OTP=true` is already set
on the deployed config, so the app accepts any 6-digit code and Firestore/
Storage still work for real. If you want real SMS delivery *inside the
native app* (as opposed to the Vercel web deployment, where it already
works), that needs a native Firebase Auth plugin
(e.g. `@capacitor-firebase/authentication`) instead of the JS SDK — a
follow-up, not something needed to get a build into TestFlight.

**App icon and splash screen are still Capacitor's defaults.** Fine for
internal TestFlight testing; Apple will reject an App Store submission using
placeholder branding. Replace
`ios/App/App/Assets.xcassets/AppIcon.appiconset` and `Splash.imageset`
(easiest via Xcode's asset catalog editor, or any Capacitor icon-generator
tool) before submitting for external review.

**Camera in Simulator.** The iOS Simulator has no real camera — test the
selfie/ID capture flow on a physical device.
