import { useNavigate } from 'react-router-dom'
import { RotateCcw, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { defaultVerificationSteps } from '@/types'

export function ResultRejectedScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useApp()

  const handleRetry = async () => {
    await updateProfile({ verificationStatus: 'unverified', steps: { ...defaultVerificationSteps } })
    navigate('/verify/checklist')
  }

  return (
    <div className="app-shell overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-32 size-[500px] rounded-full bg-danger/10 blur-3xl" />
      </div>
      <div className="h-2 w-full shrink-0 bg-navy" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-white/90 p-8 text-center shadow-modal backdrop-blur-md">
          <div className="mx-auto -mt-4 mb-4 flex size-20 items-center justify-center">
            <span className="relative flex size-20 items-center justify-center rounded-full bg-danger-soft ring-1 ring-danger/20">
              <ShieldAlert className="size-10 text-danger" strokeWidth={2} />
            </span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Verification Unsuccessful</h1>
          <p className="mx-auto max-w-[260px] pt-2 text-base text-text-secondary">
            {profile?.rejectionReason ||
              "We couldn't verify your documents. Please check the requirements and try again."}
          </p>
          <div className="mx-auto my-8 h-1 w-12 rounded-full bg-border" />
          <Button onClick={handleRetry} icon={<RotateCcw className="size-3.5" />}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
