import { useApp } from '@/context/AppContext'
import { ResultVerifiedScreen } from './ResultVerifiedScreen'
import { ResultRejectedScreen } from './ResultRejectedScreen'
import { PendingStatusScreen } from './PendingStatusScreen'

/** Picks the correct result screen based on the profile's live verification status. */
export function ResultScreen() {
  const { profile } = useApp()

  if (profile?.verificationStatus === 'rejected') return <ResultRejectedScreen />
  if (profile?.verificationStatus === 'verified') return <ResultVerifiedScreen />
  return <PendingStatusScreen />
}
