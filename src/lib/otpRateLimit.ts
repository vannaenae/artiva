import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, isFirebaseConfigured } from './firebase';

interface RateLimitResult {
  allowed: boolean;
  message?: string;
}

/**
 * Checks (and records) an OTP request attempt against the server-enforced
 * cap in functions/src/otpRateLimit.ts, before actually sending an SMS.
 *
 * Fails open in two cases: Firebase isn't configured (mock mode has no SMS
 * cost to protect), or the check itself errors (e.g. the function isn't
 * deployed yet) — never block a real sign-in attempt because this optional
 * guard couldn't run, same philosophy as every other best-effort call in
 * this codebase (upsertUserProfile, geocodeAddress, etc.).
 */
export async function checkOtpRateLimit(phone: string): Promise<RateLimitResult> {
  if (!isFirebaseConfigured || !app) return { allowed: true };

  try {
    const functions = getFunctions(app);
    const check = httpsCallable<{ phone: string }, RateLimitResult>(functions, 'checkOtpRateLimit');
    const result = await check({ phone });
    return result.data;
  } catch (err) {
    console.warn('[Artiva OTP] Rate-limit check failed, allowing the request through:', err);
    return { allowed: true };
  }
}
