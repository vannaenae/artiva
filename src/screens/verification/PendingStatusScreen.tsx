import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

export function PendingStatusScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useApp()

  useEffect(() => {
    if (profile && profile.verificationStatus === 'unverified') {
      updateProfile({ verificationStatus: 'pending' })
    }
  }, [profile, updateProfile])

  return (
    <div className="app-shell">
      <AppHeader title="Verification" />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-chip-blue">
          <Clock className="size-9 text-brand-dark" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Under Review</h1>
          <p className="mx-auto max-w-xs pt-2 text-base text-text-secondary">
            We&apos;re reviewing your documents. This usually takes less than 24 hours — we&apos;ll
            notify you as soon as it&apos;s done.
          </p>
        </div>
        <div className="w-full pt-4">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
