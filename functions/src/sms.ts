/**
 * SMS fallback — for residents/artisans without a reliable data plan (or
 * who just haven't enabled push notifications), booking updates and new
 * messages can go out as plain SMS instead.
 *
 * Termii is a Nigeria-focused SMS gateway; any HTTP SMS API (Africa's
 * Talking, Twilio, etc.) would slot in here similarly — this one concrete
 * choice keeps the integration real rather than a vague, untestable
 * interface. Needs your own Termii account, a registered Sender ID
 * ("Artiva" below is a placeholder until that's approved), and
 * TERMII_API_KEY set as a Cloud Functions secret — none of which this code
 * can create for you, same as the Paystack/NIN integrations elsewhere in
 * this repo.
 */

import { defineSecret } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';

export const TERMII_API_KEY = defineSecret('TERMII_API_KEY');

const TERMII_API_URL = 'https://api.ng.termii.com/api/sms/send';
const SENDER_ID = 'Artiva';

/** Sends a plain-text SMS. Returns false (never throws) on any failure,
 * including simply not being configured — callers treat this the same
 * fail-open way as every other optional integration in this codebase. */
export async function sendSms(phone: string, message: string): Promise<boolean> {
  const apiKey = TERMII_API_KEY.value();
  if (!apiKey) return false;

  try {
    const res = await fetch(TERMII_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: phone.replace(/\s+/g, ''),
        from: SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'generic',
        api_key: apiKey,
      }),
    });
    if (!res.ok) {
      logger.warn('sendSms: Termii returned an error', { status: res.status });
      return false;
    }
    return true;
  } catch (err) {
    logger.warn('sendSms: request failed', err);
    return false;
  }
}
