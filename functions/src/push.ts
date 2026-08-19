/**
 * Sends notifications for the two events users actually want to know about
 * without opening the app: a booking's status changing, and a new chat
 * message. Reads the recipient's FCM token from their `users/{uid}`
 * profile doc (see src/lib/push.ts / src/lib/firestoreUsers.ts for how
 * that gets there); if they haven't enabled push, falls back to SMS via
 * their stored phone number (see sms.ts) instead of just going silent —
 * push and SMS are alternatives, not both-every-time, so this never double-
 * notifies. If neither is available/configured, this is a genuine no-op.
 */

import { onDocumentUpdated, onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import * as logger from 'firebase-functions/logger';
import { sendSms, TERMII_API_KEY } from './sms';

const STATUS_LABELS: Record<string, string> = {
  accepted: 'was accepted',
  in_progress: 'is now in progress',
  completed: 'was marked complete',
  confirmed: 'was confirmed',
  paid_out: 'was paid out',
  declined: 'was declined',
  disputed: 'was disputed',
};

async function sendToUser(uid: string, title: string, body: string, data: Record<string, string>): Promise<void> {
  try {
    const snap = await getFirestore().collection('users').doc(uid).get();
    const user = snap.data();
    if (!user) return;

    if (user.pushToken) {
      await getMessaging().send({ token: user.pushToken, notification: { title, body }, data });
      return;
    }

    if (user.phone) {
      await sendSms(user.phone, `${title}: ${body}`);
    }
  } catch (err) {
    logger.warn('push: failed to notify user', { uid, err });
  }
}

export const notifyOnBookingStatusChange = onDocumentUpdated(
  { document: 'bookings/{bookingId}', secrets: [TERMII_API_KEY] },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after || before.status === after.status) return;

    const label = STATUS_LABELS[after.status] || `status changed to ${after.status}`;

    // Both parties see the same shared booking timeline in the app, so both
    // get notified regardless of which of them (or an admin) caused the
    // change — there's no reliable "who didn't cause this" signal to filter
    // on without extra bookkeeping this doesn't have yet.
    await Promise.all(
      [after.residentId, after.artisanId]
        .filter(Boolean)
        .map((uid: string) => sendToUser(uid, 'Booking update', `Your booking ${label}.`, { bookingId: event.params.bookingId }))
    );
  }
);

export const notifyOnNewMessage = onDocumentCreated(
  { document: 'bookings/{bookingId}/messages/{messageId}', secrets: [TERMII_API_KEY] },
  async (event) => {
    const message = event.data?.data();
    if (!message) return;

    const recipientUid = message.senderId === message.residentId ? message.artisanId : message.residentId;
    if (!recipientUid) return;

    await sendToUser(
      recipientUid,
      `New message from ${message.senderName}`,
      message.text,
      { bookingId: event.params.bookingId }
    );
  }
);
