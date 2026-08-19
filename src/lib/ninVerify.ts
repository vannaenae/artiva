/**
 * NIN (National Identity Number) verification — integration point only.
 *
 * Real NIN verification (NIMC, or resellers like Prembly / YouVerify /
 * VerifyMe) is an authenticated API that requires a secret key. That key
 * must never live in client-side code — Artiva is a static SPA with no
 * backend of its own, so there is nowhere safe to hold it. Calling a NIN
 * provider directly from the browser would mean shipping that secret to
 * every visitor's devtools.
 *
 * So this module doesn't call a NIN provider directly. It calls a backend
 * endpoint YOU stand up (e.g. a Firebase Cloud Function) that holds the
 * real provider secret and proxies the request server-side. Point
 * VITE_NIN_VERIFY_ENDPOINT at that function once it exists.
 *
 * Until then, isNinVerifyConfigured is false and verifyNin() is never
 * called — admins keep doing what they do today: eyeballing the uploaded
 * ID photo in VerificationReviewCard. This never blocks or auto-approves
 * anything; a match/mismatch result is advisory input for the admin, not
 * a replacement for their judgment.
 */

export type NinVerifyStatus = 'match' | 'mismatch' | 'error';

export interface NinVerifyResult {
  status: NinVerifyStatus;
  message: string;
}

export const NIN_VERIFY_ENDPOINT = import.meta.env.VITE_NIN_VERIFY_ENDPOINT || '';
export const isNinVerifyConfigured = NIN_VERIFY_ENDPOINT.trim() !== '';

export async function verifyNin(nin: string, fullName: string): Promise<NinVerifyResult | null> {
  if (!isNinVerifyConfigured) return null;

  const trimmedNin = nin.trim();
  if (!trimmedNin) return null;

  try {
    const res = await fetch(NIN_VERIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nin: trimmedNin, fullName }),
    });

    if (!res.ok) {
      return { status: 'error', message: `Verification service returned an error (${res.status}). Fall back to manual document review.` };
    }

    const data: { match?: boolean } = await res.json();
    return data.match
      ? { status: 'match', message: 'NIN matches the submitted name.' }
      : { status: 'mismatch', message: 'NIN did not match the submitted name — review the document carefully.' };
  } catch {
    return { status: 'error', message: 'Could not reach the verification service. Fall back to manual document review.' };
  }
}
