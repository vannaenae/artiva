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

## Known limitations

Some Figma photo/icon assets (selfies, ID photos, provider avatars,
portfolio images) use `@expo/vector-icons` placeholders rather than the
exact exported assets — see the PR history for why.
