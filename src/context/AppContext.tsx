import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  RecaptchaVerifier,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth'
import { auth, isDemoOtpMode } from '@/lib/firebase'
import {
  clearDemoSession,
  createDemoSession,
  ensureProfile,
  getDemoSessionUid,
  subscribeToProfile,
  updateProfile as saveProfilePartial,
  uploadVerificationFile,
} from '@/lib/backend'
import type { UserProfile } from '@/types'

interface AppUser {
  uid: string
  phoneNumber: string | null
}

interface AppContextValue {
  user: AppUser | null
  profile: UserProfile | null
  authLoading: boolean
  isDemoOtpMode: boolean
  sendOtp: (fullPhoneNumber: string) => Promise<void>
  confirmOtp: (code: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>
  uploadFile: (field: string, file: File) => Promise<string>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const pendingPhoneRef = useRef<string | null>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)

  // Bootstrap auth state: real Firebase Auth when configured, otherwise a
  // sticky per-browser demo identity so the flow can be exercised end to end.
  useEffect(() => {
    if (!auth) {
      const uid = getDemoSessionUid()
      setUser(uid ? { uid, phoneNumber: null } : null)
      setAuthLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? { uid: fbUser.uid, phoneNumber: fbUser.phoneNumber } : null)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // Subscribe to the user's profile document whenever the uid changes.
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    let unsub: (() => void) | undefined
    ensureProfile(user.uid, user.phoneNumber).then((initial) => {
      setProfile(initial)
      unsub = subscribeToProfile(user.uid, (p) => p && setProfile(p))
    })
    return () => unsub?.()
  }, [user])

  const sendOtp = useCallback(async (fullPhoneNumber: string) => {
    pendingPhoneRef.current = fullPhoneNumber

    if (isDemoOtpMode || !auth) {
      // No real SMS is sent; the OTP screen accepts any 6-digit code.
      return
    }

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
    confirmationRef.current = await signInWithPhoneNumber(
      auth,
      fullPhoneNumber,
      recaptchaRef.current,
    )
  }, [])

  const confirmOtp = useCallback(async (code: string) => {
    if (isDemoOtpMode || !auth) {
      const uid = createDemoSession()
      const phoneNumber = pendingPhoneRef.current
      const initial = await ensureProfile(uid, phoneNumber)
      if (phoneNumber && initial.phoneNumber !== phoneNumber) {
        await saveProfilePartial(uid, { phoneNumber })
      }
      setUser({ uid, phoneNumber })
      return
    }

    if (!confirmationRef.current) {
      throw new Error('No OTP request in progress. Please request a new code.')
    }
    await confirmationRef.current.confirm(code)
  }, [])

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth)
    } else {
      clearDemoSession()
    }
    setUser(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      if (!user) return
      await saveProfilePartial(user.uid, partial)
    },
    [user],
  )

  const uploadFile = useCallback(
    async (field: string, file: File) => {
      if (!user) throw new Error('Not signed in')
      return uploadVerificationFile(user.uid, field, file)
    },
    [user],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      profile,
      authLoading,
      isDemoOtpMode: isDemoOtpMode || !auth,
      sendOtp,
      confirmOtp,
      logout,
      updateProfile,
      uploadFile,
    }),
    [user, profile, authLoading, sendOtp, confirmOtp, logout, updateProfile, uploadFile],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within an AppProvider')
  return ctx
}
