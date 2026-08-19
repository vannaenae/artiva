import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { app, isFirebaseConfigured } from './firebase';
import { UserRole } from '../types';

/**
 * Firestore `users/{uid}` profile documents for residents and artisans.
 *
 * Every function here is a safe no-op when Firebase isn't configured —
 * callers (AppContext) keep `localStorage` as the source of truth in that
 * mode and treat this purely as a best-effort sync layer on top.
 */

export interface UserProfileDoc {
  uid: string;
  role: UserRole;
  phone: string;
  name: string;
  email?: string;
  estateId?: string;
  estateName?: string;
  /** Current FCM registration token, if the user has enabled push
   * notifications (see lib/push.ts). Cloud Functions reads this to send
   * booking/message notifications — see functions/src/push.ts. */
  pushToken?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!isFirebaseConfigured || !app) return null;
  if (!db) {
    db = getFirestore(app);
  }
  return db;
}

/** Look up a user's profile doc by uid. Returns null if not found or Firestore isn't configured. */
export async function fetchUserProfile(uid: string): Promise<UserProfileDoc | null> {
  const database = getDb();
  if (!database) return null;

  try {
    const snap = await getDoc(doc(database, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfileDoc) : null;
  } catch (err) {
    console.warn('[Artiva Firestore] Failed to fetch user profile:', err);
    return null;
  }
}

/**
 * Create or update a user's profile doc (merge write — safe to call on
 * every sign-in/sign-up without clobbering fields set elsewhere).
 */
export async function upsertUserProfile(
  uid: string,
  profile: Omit<UserProfileDoc, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const database = getDb();
  if (!database) return; // mock mode — nothing to sync

  try {
    const existing = await getDoc(doc(database, 'users', uid));
    await setDoc(
      doc(database, 'users', uid),
      {
        ...profile,
        uid,
        createdAt: existing.exists() ? existing.data().createdAt ?? serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    // Never block sign-in/sign-up on a Firestore write failing — the app
    // still works off localStorage/seed data either way.
    console.warn('[Artiva Firestore] Failed to save user profile:', err);
  }
}

/** Save (or clear, by passing null) this user's current push token. A
 * plain merge write — doesn't touch any other profile field. */
export async function savePushToken(uid: string, token: string | null): Promise<void> {
  const database = getDb();
  if (!database) return;

  try {
    await setDoc(doc(database, 'users', uid), { pushToken: token, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('[Artiva Firestore] Failed to save push token:', err);
  }
}

export const createResidentProfile = (
  uid: string,
  data: { phone: string; name: string; email?: string; estateId?: string; estateName?: string }
): Promise<void> => upsertUserProfile(uid, { role: 'resident', ...data });

export const createArtisanProfile = (
  uid: string,
  data: { phone: string; name: string; email?: string; estateId?: string; estateName?: string }
): Promise<void> => upsertUserProfile(uid, { role: 'artisan', ...data });
