import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { auth, isFirebaseConfigured, setupRecaptcha, sendPhoneOtp } from './firebase';

/**
 * Two-step Firebase Phone Auth (send code → confirm code), with a mock
 * fallback for when Firebase isn't configured (see `.env.example`).
 *
 * The two steps are the same shape either way — callers don't need to branch
 * on whether Firebase is configured. In mock mode no SMS is sent and any
 * 4-6 digit code confirms, so local/demo usage keeps working unchanged.
 */

export interface OtpSession {
  mode: 'firebase' | 'mock';
  phone: string;
  confirmationResult?: ConfirmationResult;
}

export interface PhoneAuthResult {
  uid: string;
  phone: string;
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

function getRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  if (!recaptchaVerifier) {
    recaptchaVerifier = setupRecaptcha(containerId);
  }
  return recaptchaVerifier;
}

/** Step 1: send (or simulate) an SMS OTP to `phone`. */
export async function startPhoneSignIn(phone: string, recaptchaContainerId: string): Promise<OtpSession> {
  if (!isFirebaseConfigured || !auth) {
    // Honest mock fallback — no SMS is actually sent.
    return { mode: 'mock', phone };
  }

  const verifier = getRecaptchaVerifier(recaptchaContainerId);
  if (!verifier) {
    throw new Error('Could not initialize phone verification. Please refresh and try again.');
  }

  try {
    const confirmationResult = await sendPhoneOtp(phone, verifier);
    if (!confirmationResult) {
      throw new Error('Could not send verification code. Please try again.');
    }
    return { mode: 'firebase', phone, confirmationResult };
  } catch (err) {
    // A failed attempt can leave the reCAPTCHA widget in a used/expired
    // state — drop it so the next request builds a fresh one.
    recaptchaVerifier = null;
    throw new Error(friendlyOtpError(err));
  }
}

/** Step 2: confirm the code the user was sent (or typed, in mock mode). */
export async function confirmPhoneSignIn(session: OtpSession, code: string): Promise<PhoneAuthResult> {
  const trimmed = code.trim();
  if (!/^\d{4,6}$/.test(trimmed)) {
    throw new Error('Enter the verification code you received.');
  }

  if (session.mode === 'mock') {
    // Deterministic per-phone mock uid so repeated logins from the same
    // number resolve to the same "account" within a session.
    return { uid: `mock-${session.phone.replace(/\D/g, '')}`, phone: session.phone };
  }

  if (!session.confirmationResult) {
    throw new Error('Your verification session expired. Request a new code.');
  }

  try {
    const result = await session.confirmationResult.confirm(trimmed);
    return { uid: result.user.uid, phone: result.user.phoneNumber || session.phone };
  } catch (err) {
    throw new Error(friendlyOtpError(err));
  }
}

function friendlyOtpError(err: unknown): string {
  const code = (err as { code?: string } | undefined)?.code;
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'That phone number looks invalid. Use the format +234 803 123 4567.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/invalid-verification-code':
      return 'That code is incorrect. Double check and try again.';
    case 'auth/code-expired':
      return 'That code has expired. Request a new one.';
    case 'auth/captcha-check-failed':
      return 'Verification check failed. Please refresh and try again.';
    default:
      return 'Something went wrong sending or verifying the code. Please try again.';
  }
}
