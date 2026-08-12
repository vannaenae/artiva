import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import {
  defaultVerificationSteps,
  type UserProfile,
  type UserRole,
} from '@/types'

const DEMO_UID_KEY = 'artiva_demo_uid'
const DEMO_SESSION_KEY = 'artiva_demo_signed_in'
const DEMO_PROFILE_KEY = (uid: string) => `artiva_demo_profile_${uid}`

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

/** Uploads a verification document/photo, returning a viewable URL. */
export async function uploadVerificationFile(uid: string, field: string, file: File): Promise<string> {
  if (!storage) {
    // Demo fallback: persist as a data URL so it survives reloads.
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const path = `verification/${uid}/${field}-${Date.now()}-${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
