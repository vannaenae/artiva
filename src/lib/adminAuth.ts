import { signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, app, isFirebaseConfigured } from './firebase';

/**
 * Best-effort bridge to the real admin claim.
 *
 * AdminLoginPage's passcode check is still the primary gate (see the
 * ponytail comment there) — this doesn't replace it, it upgrades it. On a
 * correct passcode, this signs the admin in anonymously (no phone/SMS step
 * needed for a single shared admin portal) and calls the
 * `verifyAdminPasscode` Cloud Function, which checks the SAME passcode
 * again server-side (against a secret, never shipped to the browser) and
 * grants the real `admin` custom claim Firestore's rules check.
 *
 * That function has to actually be deployed with its ADMIN_PASSCODE secret
 * set (see functions/src/admin.ts) for this to succeed — until then, or
 * whenever Firebase isn't configured, this fails silently and the caller
 * keeps working off the client-side passcode check alone, same as before
 * this existed.
 */
export async function tryElevateToRealAdmin(passcode: string): Promise<boolean> {
  if (!isFirebaseConfigured || !auth || !app) return false;

  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    const functions = getFunctions(app);
    const verify = httpsCallable(functions, 'verifyAdminPasscode');
    await verify({ passcode });
    // Force a token refresh so the new custom claim is visible immediately —
    // otherwise the SDK keeps serving the cached (claim-less) token.
    await auth.currentUser?.getIdToken(true);
    return true;
  } catch (err) {
    console.warn('[Artiva Admin] Real admin claim elevation failed (falling back to passcode-only session):', err);
    return false;
  }
}
