import type { CapacitorConfig } from '@capacitor/core'

const config: CapacitorConfig = {
  // Placeholder bundle ID — change this to match whatever you register in
  // App Store Connect before your first archive/upload. It must be unique
  // and, once used for a real TestFlight build, effectively permanent.
  appId: 'com.artiva.app',
  appName: 'Artiva',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
}

export default config
