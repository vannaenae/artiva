import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  getFirestore,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { app, isFirebaseConfigured } from './firebase';
import { Booking } from '../types';

/**
 * Live-synced `bookings/{id}` documents in Firestore, replacing the
 * localStorage-only booking state that only ever lived in one browser.
 *
 * Safe no-ops when Firebase isn't configured — AppContext keeps its
 * existing localStorage behavior in that case, unchanged.
 */

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!isFirebaseConfigured || !app) return null;
  if (!db) db = getFirestore(app);
  return db;
}

const COLLECTION = 'bookings';

/**
 * Live-subscribes to every booking `uid` is party to (as resident or
 * artisan), or — for admins — every booking, period.
 *
 * Firestore's security rules for /bookings require a query to already be
 * scoped to documents the rule can prove belong to the caller (residentId
 * or artisanId == request.auth.uid); an unfiltered query would be rejected
 * the moment it touched someone else's document. There's no native
 * OR-across-fields query, so this runs two listeners and merges them
 * client-side rather than one combined query. Admins skip that — their
 * custom claim satisfies the rule for every document regardless of filters.
 */
export function subscribeToBookings(
  uid: string,
  isAdmin: boolean,
  onChange: (bookings: Booking[]) => void
): Unsubscribe {
  const database = getDb();
  if (!database) return () => {};

  if (isAdmin) {
    return onSnapshot(collection(database, COLLECTION), (snap) => {
      onChange(snap.docs.map((d) => d.data() as Booking));
    }, (err) => console.warn('[Artiva Firestore] Admin bookings listener failed:', err));
  }

  let asResident: Booking[] = [];
  let asArtisan: Booking[] = [];
  const emit = () => {
    const merged = [...asResident, ...asArtisan].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    onChange(merged);
  };

  const unsubResident = onSnapshot(
    query(collection(database, COLLECTION), where('residentId', '==', uid)),
    (snap) => { asResident = snap.docs.map((d) => d.data() as Booking); emit(); },
    (err) => console.warn('[Artiva Firestore] Resident bookings listener failed:', err)
  );
  const unsubArtisan = onSnapshot(
    query(collection(database, COLLECTION), where('artisanId', '==', uid)),
    (snap) => { asArtisan = snap.docs.map((d) => d.data() as Booking); emit(); },
    (err) => console.warn('[Artiva Firestore] Artisan bookings listener failed:', err)
  );

  return () => { unsubResident(); unsubArtisan(); };
}

/**
 * Create or overwrite a booking document. The onSnapshot listeners above
 * pick up the change (Firestore's local cache reflects it immediately, so
 * this reads as instant even before the server round-trip completes) —
 * callers don't need a separate local state update alongside this.
 */
export async function saveBooking(booking: Booking): Promise<void> {
  const database = getDb();
  if (!database) return;
  await setDoc(doc(database, COLLECTION, booking.id), booking);
}
