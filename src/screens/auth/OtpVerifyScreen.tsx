import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, PhoneOutgoing } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { OtpInput } from '@/components/verification/OtpInput'
import { useApp } from '@/context/AppContext'
import { nextRouteForProfile } from '@/lib/flow'

export function OtpVerifyScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { confirmOtp, sendOtp, profile, isDemoOtpMode } = useApp()
  const phoneNumber = (location.state as { phoneNumber?: string } | null)?.phoneNumber ?? ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)

  const handleVerify = async () => {
    if (code.length !== 6 || loading) return
    setLoading(true)
    setError(null)
    try {
      await confirmOtp(code)
      navigate(nextRouteForProfile(profile), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!phoneNumber || resending) return
    setResending(true)
    setError(null)
    try {
      await sendOtp(phoneNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Verification" showBack />
      <div className="flex flex-1 flex-col items-center px-4 py-8">
        <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-brand-soft">
          <PhoneOutgoing className="size-8 text-brand" strokeWidth={2} />
        </span>
        <h2 className="pb-2 text-2xl font-semibold tracking-[-0.24px] text-text-primary">
          Check your phone
        </h2>
        <div className="flex flex-col items-center gap-1 pb-8 text-center text-base">
          <span className="text-text-secondary">Enter 6-digit code sent to</span>
          <span className="font-bold text-text-primary">{phoneNumber || 'your number'}</span>
        </div>

        <div className="w-full pb-8">
          <OtpInput value={code} onChange={setCode} />
        </div>

        {isDemoOtpMode ? (
          <p className="pb-4 text-center text-xs text-text-muted">
            Demo mode — no SMS is sent. Enter any 6 digits to continue.
          </p>
        ) : null}
        {error ? <p className="pb-4 text-sm text-danger">{error}</p> : null}

        <div className="flex items-center gap-2 pb-8 text-sm">
          <span className="text-text-secondary">Didn&apos;t receive a code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold tracking-[0.14px] text-brand-dark disabled:opacity-50"
          >
            {resending ? 'Resending…' : 'Resend code'}
          </button>
        </div>

        <Button
          onClick={handleVerify}
          disabled={code.length !== 6}
          loading={loading}
          icon={<ArrowRight className="size-3" />}
          className="mt-auto"
        >
          Verify
        </Button>
      </div>
    </div>
  )
}
