import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  getFirestore,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { app, isFirebaseConfigured } from './firebase';

/**
 * Per-booking chat, as a `bookings/{bookingId}/messages` subcollection.
 *
 * Only meaningful when Firebase is configured — there's no sensible
 * localStorage fallback for cross-device messaging the way there is for
 * booking state, so callers should gate the whole chat UI behind
 * isFirebaseConfigured rather than rendering an empty/broken chat.
 */

export interface BookingMessage {
  id: string;
  residentId: string;
  artisanId: string;
  senderId: string;
  senderName: string;
  senderRole: 'resident' | 'artisan';
  text: string;
  createdAt: string;
}

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!isFirebaseConfigured || !app) return null;
  if (!db) db = getFirestore(app);
  return db;
}

export function subscribeToMessages(bookingId: string, onChange: (messages: BookingMessage[]) => void): Unsubscribe {
  const database = getDb();
  if (!database) return () => {};

  const q = query(collection(database, 'bookings', bookingId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingMessage))),
    (err) => console.warn('[Artiva Firestore] Messages listener failed:', err)
  );
}

export async function sendMessage(
  bookingId: string,
  residentId: string,
  artisanId: string,
  senderId: string,
  senderName: string,
  senderRole: 'resident' | 'artisan',
  text: string
): Promise<void> {
  const database = getDb();
  if (!database) return;

  // residentId/artisanId are denormalized onto every message (not just the
  // parent booking) so Firestore's security rules can check "am I a party
  // to this thread" per-message without a get() lookup on the parent doc.
  await addDoc(collection(database, 'bookings', bookingId, 'messages'), {
    residentId,
    artisanId,
    senderId,
    senderName,
    senderRole,
    text,
    createdAt: new Date().toISOString(),
  });
}
