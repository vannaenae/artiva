/**
 * Paystack webhook verification + artisan payouts.
 *
 * This is the piece the client-only SPA structurally cannot do itself: the
 * Paystack *secret* key (as opposed to the public key already used in
 * src/lib/paystack.ts) must never reach the browser, so verifying webhook
 * signatures and calling the Transfer API both have to run somewhere with a
 * server-side secret. Cloud Functions is that somewhere.
 *
 * Bookings now live in Firestore (see src/lib/firestoreBookings.ts), each
 * one carrying the `paystackReference` its escrow charge was made under
 * (src/context/AppContext.tsx sets it at creation, from the reference
 * Paystack Inline JS's success callback returns). That reference is what
 * lets this webhook find the right booking: on a verified `charge.success`
 * event, it looks up the booking whose paystackReference matches the
 * event's reference and stamps it with a server-verified
 * `paymentVerifiedAt`. That's independent proof the charge really went
 * through — up to now, "payment succeeded" was purely the client's own
 * claim, since Paystack Inline JS's onSuccess callback fires in the
 * browser and nothing forced it to correspond to a real charge.
 *
 * This intentionally does not touch escrowStatus/status — those are the
 * booking's operational state machine (accepted, in_progress, disputed...)
 * and stay driven by the resident/artisan/admin actions that already run
 * it. paymentVerifiedAt is an independent, additive confirmation flag.
 */

import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import * as crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PAYSTACK_SECRET_KEY = defineSecret('PAYSTACK_SECRET_KEY');

const PAYSTACK_API_BASE = 'https://api.paystack.co';

/**
 * Receives Paystack's webhook POST, verifies its signature, and logs the
 * verified event. Configure this function's URL as the webhook in your
 * Paystack dashboard (Settings -> API Keys & Webhooks).
 */
export const paystackWebhook = onRequest(
  { secrets: [PAYSTACK_SECRET_KEY], cors: false },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // Signature is HMAC-SHA512 of the *raw* request body, keyed with the
    // secret key. Firebase gives us req.rawBody (a Buffer) specifically so
    // this can be verified before any JSON parsing/reserialization, which
    // would otherwise change the byte string and break verification.
    const signature = req.headers['x-paystack-signature'];
    const secret = PAYSTACK_SECRET_KEY.value();
    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(req.rawBody)
      .digest('hex');

    if (typeof signature !== 'string' || signature !== expectedSignature) {
      logger.warn('paystackWebhook: signature mismatch, rejecting');
      res.status(401).send('Invalid signature');
      return;
    }

    const event = req.body as { event?: string; data?: { reference?: string; status?: string } & Record<string, unknown> };
    logger.info('paystackWebhook: verified event', { type: event.event });

    const db = getFirestore();

    try {
      await db.collection('paystackWebhookEvents').add({
        event: event.event || 'unknown',
        data: event.data || {},
        verifiedAt: FieldValue.serverTimestamp(),
      });
    } catch (err) {
      // Don't fail the webhook over an audit-log write error — Paystack
      // will retry on non-2xx, and retrying doesn't fix a Firestore issue.
      // Log it loudly instead so it's visible in Cloud Functions logs.
      logger.error('paystackWebhook: failed to persist event', err);
    }

    if (event.event === 'charge.success' && event.data?.reference) {
      try {
        const matches = await db.collection('bookings')
          .where('paystackReference', '==', event.data.reference)
          .limit(1)
          .get();

        if (matches.empty) {
          // Not necessarily an error — could be a charge from before this
          // booking existed, a test event, or a reference typo somewhere.
          logger.warn('paystackWebhook: no booking found for reference', { reference: event.data.reference });
        } else {
          await matches.docs[0].ref.update({ paymentVerifiedAt: FieldValue.serverTimestamp() });
          logger.info('paystackWebhook: booking payment verified', { bookingId: matches.docs[0].id });
        }
      } catch (err) {
        logger.error('paystackWebhook: failed to reconcile booking', err);
      }
    }

    // Paystack expects a fast 200 acknowledging receipt.
    res.status(200).send('OK');
  }
);

interface InitiatePayoutRequest {
  bookingId: string;
  artisanName: string;
  amountNaira: number;
  bankCode: string;
  accountNumber: string;
}

/**
 * Pays an artisan out via Paystack Transfers. Callable, admin-only (checked
 * via the `admin` custom claim — see functions/src/admin.ts for how that
 * claim gets set).
 *
 * Real Paystack Transfers also require the *business* account to have
 * completed its own KYC with Paystack and have transfers enabled — that's a
 * one-time manual step on paystack.com this function can't do for you.
 */
export const initiateArtisanPayout = onCall(
  { secrets: [PAYSTACK_SECRET_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in first.');
    }
    if (request.auth.token.admin !== true) {
      throw new HttpsError('permission-denied', 'Admin access required.');
    }

    const { bookingId, artisanName, amountNaira, bankCode, accountNumber } =
      (request.data || {}) as Partial<InitiatePayoutRequest>;

    if (!bookingId || !artisanName || !amountNaira || !bankCode || !accountNumber) {
      throw new HttpsError('invalid-argument', 'bookingId, artisanName, amountNaira, bankCode, and accountNumber are all required.');
    }
    if (amountNaira <= 0) {
      throw new HttpsError('invalid-argument', 'amountNaira must be positive.');
    }

    const secret = PAYSTACK_SECRET_KEY.value();
    const authHeaders = {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    };

    const db = getFirestore();
    const payoutRef = db.collection('payouts').doc();

    try {
      // Step 1: Paystack requires a "transfer recipient" before you can pay
      // it — create one fresh each time rather than caching, since a cached
      // recipient_code tied to stale bank details would silently misroute
      // funds.
      const recipientRes = await fetch(`${PAYSTACK_API_BASE}/transferrecipient`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          type: 'nuban',
          name: artisanName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        }),
      });
      const recipientData: any = await recipientRes.json();
      if (!recipientRes.ok || !recipientData.status) {
        throw new HttpsError('internal', `Paystack rejected the recipient: ${recipientData.message || recipientRes.statusText}`);
      }
      const recipientCode = recipientData.data.recipient_code;

      // Step 2: the actual transfer. Amount is in kobo, same convention as
      // the client-side escrow charge in src/lib/paystack.ts.
      const transferRes = await fetch(`${PAYSTACK_API_BASE}/transfer`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          source: 'balance',
          amount: Math.round(amountNaira * 100),
          recipient: recipientCode,
          reason: `Artiva payout for booking ${bookingId}`,
        }),
      });
      const transferData: any = await transferRes.json();
      if (!transferRes.ok || !transferData.status) {
        throw new HttpsError('internal', `Paystack rejected the transfer: ${transferData.message || transferRes.statusText}`);
      }

      await payoutRef.set({
        bookingId,
        artisanName,
        amountNaira,
        status: transferData.data.status || 'pending',
        paystackTransferCode: transferData.data.transfer_code,
        paystackReference: transferData.data.reference,
        initiatedBy: request.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
      });

      // Paystack transfers usually come back 'success' synchronously for
      // NUBAN payouts, but can also land as 'pending' (queued for manual
      // approval on the Paystack dashboard) or 'otp' (needs OTP entry
      // there) — only a confirmed success updates the booking. A
      // pending/otp transfer still gets its own payouts record above for
      // the admin to track; the booking stays wherever it was.
      if (transferData.data.status === 'success') {
        await db.collection('bookings').doc(bookingId).update({
          status: 'paid_out',
          escrowStatus: 'released',
          updatedAt: new Date().toISOString(),
        });
      }

      return { success: true, transferCode: transferData.data.transfer_code, status: transferData.data.status };
    } catch (err) {
      await payoutRef.set({
        bookingId,
        artisanName,
        amountNaira,
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
        initiatedBy: request.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
      });
      if (err instanceof HttpsError) throw err;
      logger.error('initiateArtisanPayout: unexpected failure', err);
      throw new HttpsError('internal', 'Payout failed unexpectedly — check Cloud Functions logs.');
    }
  }
);
