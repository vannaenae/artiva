import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Guard logic: Validate that key values exist and are non-empty
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId &&
  typeof firebaseConfig.projectId === 'string' &&
  firebaseConfig.projectId.trim() !== ''
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    console.log('[Artiva Auth] Firebase initialized successfully.');
  } catch (error) {
    console.warn('[Artiva Auth] Firebase initialization failed gracefully:', error);
    app = null;
    auth = null;
  }
} else {
  console.info('[Artiva Auth] Firebase environment variables are not set — phone-auth helpers below are no-ops until they are configured.');
}

export { app, auth };

/**
 * Setup phone authentication reCAPTCHA verifier safely
 */
export function setupRecaptcha(containerId: string): RecaptchaVerifier | null {
  if (!isFirebaseConfigured || !auth) {
    console.warn('[Artiva Auth] Cannot setup reCAPTCHA: Firebase Auth is not configured.');
    return null;
  }
  try {
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[Artiva Auth] reCAPTCHA solved');
      },
    });
  } catch (err) {
    console.error('[Artiva Auth] Error initializing reCAPTCHA:', err);
    return null;
  }
}

/**
 * Request Phone OTP safely
 */
export async function sendPhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult | null> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase Auth is not configured. Please set environment variables.');
  }
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}
