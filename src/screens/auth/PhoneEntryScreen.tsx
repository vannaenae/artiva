import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

const COUNTRY_CODES = [
  { code: '+1', label: 'US' },
  { code: '+234', label: 'NG' },
  { code: '+44', label: 'UK' },
]

export function PhoneEntryScreen() {
  const navigate = useNavigate()
  const { sendOtp } = useApp()
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const digits = phone.replace(/\D/g, '')
  const isValid = digits.length >= 7

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError(null)
    try {
      const fullNumber = `${countryCode}${digits}`
      await sendOtp(fullNumber)
      navigate('/otp', { state: { phoneNumber: fullNumber } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showBack />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-6 rounded-xl border border-border bg-white p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
              Enter your phone number
            </h1>
            <p className="text-sm text-text-secondary">
              We&apos;ll send you a One Time Password (OTP) to verify your number.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative flex w-full items-center rounded-lg border border-border bg-white">
              <div className="flex items-center gap-1 border-r border-border-warm py-3 pl-3 pr-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none bg-transparent text-base text-text-secondary outline-none"
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-3 text-text-secondary" />
              </div>
              <input
                type="tel"
                inputMode="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 rounded-r-lg py-3.5 pl-3 pr-4 text-base text-text-primary outline-none placeholder:text-text-secondary/50"
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={!isValid} loading={loading} icon={<ArrowRight className="size-3" />}>
              Send OTP
            </Button>
          </div>
        </form>

        <p className="max-w-xs pt-8 text-center text-xs font-medium tracking-[0.24px] text-text-secondary">
          By tapping &quot;Send OTP&quot;, you agree to our{' '}
          <span className="font-semibold text-brand">Terms of Service</span> and{' '}
          <span className="font-semibold text-brand">Privacy Policy</span>.
        </p>

        <div id="recaptcha-container" />
      </div>
    </div>
  )
}
