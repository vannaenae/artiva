# Artiva (mobile)

The Expo / React Native implementation of Artiva, built from the same
[Figma file](https://www.figma.com/design/vK27oIGb5Cteo40AT6Nbxk/Verifix-%E2%80%94-Verification-Screens)
as the web app in the repo root — all 40 screens from the flow board:
onboarding, phone/OTP auth, role selection, KYC/verification, provider
setup, and customer booking/payment.

## Tech stack

- **Expo (TypeScript) + React Native**
- **React Navigation** (native stack)
- Design tokens (`src/theme/tokens.ts`) extracted directly from the Figma
  file — there's no shared variables/styles library there — navy
  (`#151B29`) + safety-orange (`#FF8C00`) brand, Inter typeface.

## Getting started

```bash
npm install
npx expo start
```

Then press `i` / `a` / `w` to open in iOS simulator, Android emulator, or
web, or scan the QR code with Expo Go on a device.

## Project structure

```
src/
  components/     # TopAppBar, Button, Card, ScreenContainer, StatusScreen
  context/        # RoleContext — the role picked on Role Selection, used to
                   # route providers vs. customers after verification
  navigation/      # RootNavigator + route param types
  screens/
    auth/, verification/, provider/, customer/
  theme/           # design tokens
```

## Deploying to TestFlight

Builds and submissions run via [EAS](https://docs.expo.dev/eas/) — `eas.json`
is already set up with `development` / `preview` / `production` profiles.
This has to run from your machine (Apple auth + 2FA aren't scriptable here):

```bash
npm install -g eas-cli   # or use `npx eas-cli` for every command below
eas login                # your Expo account

# One-time: links this project to your Expo account and fills in
# extra.eas.projectId in app.json.
eas init

# Confirm/adjust ios.bundleIdentifier in app.json first — it's set to
# com.artiva.app as a placeholder; change it if you have a different one
# reserved in App Store Connect.

eas build --platform ios --profile production
# EAS will create the App Store Connect app + provisioning automatically the
# first time, using your Apple Developer account credentials.

eas submit --platform ios --latest
# Uploads the build to App Store Connect; it shows up in TestFlight once
# Apple finishes processing (usually a few minutes to ~30 min).
```

`cli.appVersionSource: "remote"` in `eas.json` means EAS tracks the iOS
build number for you — no manual bumping between builds.

## Known limitations

Some Figma photo/icon assets (selfies, ID photos, provider avatars,
portfolio images) use `@expo/vector-icons` placeholders rather than the
exact exported assets — see the PR history for why.
