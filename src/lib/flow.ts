import type { UserProfile } from '@/types'

/**
 * Given the user's current profile, decides which screen the app should
 * land on next. Centralizing this keeps the Splash screen, guards, and
 * post-step "Continue" buttons all agreeing on the canonical flow order.
 */
export function nextRouteForProfile(profile: UserProfile | null): string {
  if (!profile) return '/role'
  if (!profile.role) return '/role'
  if (!profile.agreedToTermsAt) return '/terms'

  if (profile.verificationStatus === 'verified') return '/home'
  if (profile.verificationStatus === 'rejected') return '/verify/result'
  if (profile.verificationStatus === 'pending') return '/verify/pending'

  const { steps } = profile
  if (steps.governmentId !== 'complete') return '/verify'
  if (steps.selfie !== 'complete') return '/verify/selfie'
  if (profile.role === 'provider' && steps.tradeCertificate !== 'complete') {
    return '/verify/certificate'
  }
  if (steps.proofOfAddress !== 'complete') return '/verify/address'
  if (steps.backgroundCheck !== 'complete') return '/verify/background-check'
  return '/verify/checklist'
}

export function allStepsComplete(profile: UserProfile): boolean {
  const { steps, role } = profile
  return (
    steps.governmentId === 'complete' &&
    steps.selfie === 'complete' &&
    steps.proofOfAddress === 'complete' &&
    steps.backgroundCheck === 'complete' &&
    (role !== 'provider' || steps.tradeCertificate === 'complete')
  )
}
