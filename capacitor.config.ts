import type { CapacitorConfig } from '@capacitor/cli';

// Wraps the existing Vite/React SPA (built to `dist/`) as a native iOS app
// shell so it can be archived in Xcode and uploaded to TestFlight. This does
// not change how the app is built or deployed as a website — `npm run
// build` still produces the same `dist/` that Firebase Hosting serves; `cap
// sync` just copies that same output into the native project.
const config: CapacitorConfig = {
  appId: 'com.artiva.app',
  appName: 'Artiva',
  webDir: 'dist',
};

export default config;
