import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, isFirebaseConfigured, storage } from '@/lib/firebase'
import {
  defaultVerificationSteps,
  type UserProfile,
  type UserRole,
} from '@/types'

const DEMO_UID_KEY = 'artiva_demo_uid'
const DEMO_SESSION_KEY = 'artiva_demo_signed_in'
const DEMO_PROFILE_KEY = (uid: string) => `artiva_demo_profile_${uid}`
const STORAGE_FALLBACK_KEY = 'artiva_storage_fallback_active'
const STORAGE_FALLBACK_EVENT = 'artiva-storage-fallback'

/**
 * Reads the current demo "session" without creating one — mirrors Firebase
 * Auth's onAuthStateChanged starting at null until the user signs in, so the
 * splash screen still routes a fresh visitor through phone entry + OTP.
 */
export function getDemoSessionUid(): string | null {
  return localStorage.getItem(DEMO_SESSION_KEY) ? localStorage.getItem(DEMO_UID_KEY) : null
}

/** Creates (or reuses) a persistent per-browser demo uid and marks the session signed in. */
export function createDemoSession(): string {
  let uid = localStorage.getItem(DEMO_UID_KEY)
  if (!uid) {
    uid = `demo_${crypto.randomUUID()}`
    localStorage.setItem(DEMO_UID_KEY, uid)
  }
  localStorage.setItem(DEMO_SESSION_KEY, '1')
  return uid
}

/** Clears the demo "session" (uid + profile are kept, so signing back in resumes progress). */
export function clearDemoSession(): void {
  localStorage.removeItem(DEMO_SESSION_KEY)
}

function newProfile(uid: string, phoneNumber: string | null): UserProfile {
  const now = Date.now()
  return {
    uid,
    phoneNumber,
    role: null,
    agreedToTermsAt: null,
    verificationStatus: 'unverified',
    steps: { ...defaultVerificationSteps },
    createdAt: now,
    updatedAt: now,
  }
}

function readDemoProfile(uid: string): UserProfile | null {
  const raw = localStorage.getItem(DEMO_PROFILE_KEY(uid))
  return raw ? (JSON.parse(raw) as UserProfile) : null
}

function writeDemoProfile(profile: UserProfile) {
  localStorage.setItem(DEMO_PROFILE_KEY(profile.uid), JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent('artiva-demo-profile-change', { detail: profile }))
}

/** Fetches (creating if missing) the profile document for a user. */
export async function ensureProfile(uid: string, phoneNumber: string | null): Promise<UserProfile> {
  if (!db) {
    const existing = readDemoProfile(uid)
    if (existing) return existing
    const created = newProfile(uid, phoneNumber)
    writeDemoProfile(created)
    return created
  }

  const ref_ = doc(db, 'users', uid)
  const snap = await getDoc(ref_)
  if (snap.exists()) return snap.data() as UserProfile

  const created = newProfile(uid, phoneNumber)
  await setDoc(ref_, { ...created, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
  return created
}

/** Subscribes to live profile updates. Returns an unsubscribe function. */
export function subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
  if (!db) {
    callback(readDemoProfile(uid))
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<UserProfile>).detail
      if (detail.uid === uid) callback(detail)
    }
    window.addEventListener('artiva-demo-profile-change', handler)
    return () => window.removeEventListener('artiva-demo-profile-change', handler)
  }

  const ref_ = doc(db, 'users', uid)
  return onSnapshot(ref_, (snap) => {
    callback(snap.exists() ? (snap.data() as UserProfile) : null)
  })
}

/** Merges a partial update into the profile document. */
export async function updateProfile(uid: string, partial: Partial<UserProfile>): Promise<void> {
  if (!db) {
    const existing = readDemoProfile(uid) ?? newProfile(uid, null)
    writeDemoProfile({ ...existing, ...partial, updatedAt: Date.now() })
    return
  }

  const ref_ = doc(db, 'users', uid)
  await updateDoc(ref_, { ...partial, updatedAt: serverTimestamp() })
}

export async function updateRole(uid: string, role: UserRole) {
  return updateProfile(uid, { role })
}

/**
 * True once an upload has fallen back to local storage because Firebase
 * Storage is configured (or configured-adjacent) but not actually usable —
 * e.g. the project is still on the Spark plan and never provisioned a
 * bucket. Sticky for the browser session so the banner stays visible.
 */
export function isStorageFallbackActive(): boolean {
  return sessionStorage.getItem(STORAGE_FALLBACK_KEY) === '1'
}

function markStorageFallbackActive() {
  if (sessionStorage.getItem(STORAGE_FALLBACK_KEY) === '1') return
  sessionStorage.setItem(STORAGE_FALLBACK_KEY, '1')
  window.dispatchEvent(new Event(STORAGE_FALLBACK_EVENT))
}

function clearStorageFallbackActive() {
  if (sessionStorage.getItem(STORAGE_FALLBACK_KEY) !== '1') return
  sessionStorage.removeItem(STORAGE_FALLBACK_KEY)
  window.dispatchEvent(new Event(STORAGE_FALLBACK_EVENT))
}

export function onStorageFallback(callback: () => void): () => void {
  window.addEventListener(STORAGE_FALLBACK_EVENT, callback)
  return () => window.removeEventListener(STORAGE_FALLBACK_EVENT, callback)
}

async function persistAsLocalDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Uploads a verification document/photo, returning a viewable URL.
 *
 * When Firebase Storage is unavailable — either never configured, or
 * configured but not actually provisioned (e.g. Storage requires the Blaze
 * plan and the project is still on Spark) — this transparently falls back
 * to a local data URL so the verification flow stays fully demoable. The
 * fallback is never silent: `isStorageFallbackActive`/`onStorageFallback`
 * let the UI surface a visible "not saved to the cloud" banner whenever it
 * kicks in on an otherwise-real Firebase project.
 */
export async function uploadVerificationFile(uid: string, field: string, file: File): Promise<string> {
  if (storage) {
    try {
      const path = `verification/${uid}/${field}-${Date.now()}-${file.name}`
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      clearStorageFallbackActive()
      return url
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        '[Artiva] Firebase Storage upload failed — falling back to local demo storage. ' +
          'Is Storage actually provisioned for this project (requires the Blaze plan)?',
        err,
      )
      if (isFirebaseConfigured) markStorageFallbackActive()
    }
  } else if (isFirebaseConfigured) {
    // Auth/Firestore are real, but Storage was never set up for this project.
    markStorageFallbackActive()
  }

  return persistAsLocalDataUrl(file)
}
