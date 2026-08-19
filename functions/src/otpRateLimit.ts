/**
 * OTP request rate limiting — a real, server-enforced cap, not just a UI
 * throttle. Firebase Phone Auth bills per SMS and Nigerian carriers aren't
 * free, so an unlimited "Send Verification Code" button is a real cost/
 * abuse vector at any scale.
 *
 * This has to be a Cloud Function rather than a client-side Firestore
 * check: OTP requests happen before the user is signed in, so Firestore's
 * security rules can't scope a client write to "only increment your own
 * counter" the way they can for signed-in collections — a client with
 * devtools open could just overwrite the counter directly. Running the
 * increment here, with firestore.rules denying all direct client access to
 * `otpRateLimits`, means the only way to affect the count is through this
 * function's own logic.
 *
 * Deliberately unauthenticated (no request.auth check) — there's no user
 * session yet at this point in the flow.
 */

import { onCall } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const MAX_ATTEMPTS_PER_WINDOW = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

export const checkOtpRateLimit = onCall(async (request): Promise<RateLimitResult> => {
  const phone = (request.data as { phone?: string } | undefined)?.phone?.replace(/\D/g, '');
  if (!phone) {
    return { allowed: false, message: 'Enter a valid phone number.' };
  }

  const db = getFirestore();
  const ref = db.collection('otpRateLimits').doc(phone);

  return db.runTransaction(async (tx): Promise<RateLimitResult> => {
    const snap = await tx.get(ref);
    const now = Date.now();
    const data = snap.exists ? (snap.data() as { count: number; windowStart: number }) : null;

    // No record yet, or the previous window has fully expired — start fresh.
    if (!data || now - data.windowStart > WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: now });
      return { allowed: true };
    }

    if (data.count >= MAX_ATTEMPTS_PER_WINDOW) {
      const retryInMinutes = Math.max(1, Math.ceil((WINDOW_MS - (now - data.windowStart)) / 60000));
      return {
        allowed: false,
        message: `Too many verification code requests. Try again in about ${retryInMinutes} minute${retryInMinutes === 1 ? '' : 's'}.`,
      };
    }

    tx.update(ref, { count: FieldValue.increment(1) });
    return { allowed: true };
  });
});
