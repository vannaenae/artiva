/**
 * Server-side admin passcode check.
 *
 * Today, admin access (see src/pages/AdminLoginPage.tsx) is checked entirely
 * client-side against VITE_ADMIN_PASSCODE — which, being a VITE_ var, ships
 * in the built JS bundle in plaintext. That's already honestly documented
 * as "a speed bump, not real authentication" in .env.example. This function
 * is the real version: the passcode is checked against a Cloud Functions
 * secret (never sent to the browser), and only on a match does it grant the
 * `admin` custom claim Firestore's rules and initiateArtisanPayout both
 * check for.
 *
 * Wiring this into AdminLoginPage is a follow-up (not done in this pass) —
 * it would mean calling this function after the existing passcode form
 * submit, and swapping out the client-side comparison for its result. Until
 * that wiring happens, this function exists and works but nothing calls it.
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { getAuth } from 'firebase-admin/auth';

const ADMIN_PASSCODE = defineSecret('ADMIN_PASSCODE');

export const verifyAdminPasscode = onCall(
  { secrets: [ADMIN_PASSCODE] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in (phone OTP) before requesting admin access.');
    }

    const { passcode } = (request.data || {}) as { passcode?: string };
    if (!passcode || passcode !== ADMIN_PASSCODE.value()) {
      throw new HttpsError('permission-denied', 'Invalid admin passcode.');
    }

    await getAuth().setCustomUserClaims(request.auth.uid, { admin: true });
    return { success: true };
  }
);
