import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useApp } from '@/context/AppContext'

const SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body: 'By accessing or using the Artiva platform, you agree to be bound by these Terms of Service and all terms incorporated by reference. If you do not agree to all of these terms, do not use our services.',
  },
  {
    heading: '2. User Accounts',
    body: 'You may need to register for an account to access some or all of our services. You must provide accurate, current, and complete information during the registration process and keep your account information up-to-date.',
  },
  {
    heading: '3. Privacy and Data Collection',
    body: 'Our Privacy Policy describes how we handle the information you provide to us when you use our services. You understand that through your use of the services, you consent to the collection and use of this information. We collect data primarily to facilitate secure transactions and optimize the pairing of service providers with clients.',
  },
  {
    heading: '4. Service Provider Obligations',
    body: 'Providers utilizing the Artiva platform must maintain professional standards, adhere to local regulations, and ensure all representations of their services are accurate.',
  },
  {
    heading: '5. Limitation of Liability',
    body: 'To the maximum extent permitted by applicable law, Artiva shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.',
  },
  {
    heading: '6. Modifications to Terms',
    body: 'We reserve the right to modify these terms at any time. We will provide notice of these changes by updating the terms on this page.',
  },
]

export function TermsConsentScreen() {
  const navigate = useNavigate()
  const { updateProfile } = useApp()
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [saving, setSaving] = useState(false)

  const canContinue = agreedTerms && agreedPrivacy

  const handleContinue = async () => {
    if (!canContinue || saving) return
    setSaving(true)
    try {
      await updateProfile({ agreedToTermsAt: Date.now() })
      navigate('/verify')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Legal Consent" showBack />
      <div className="flex-1 overflow-y-auto px-4 pb-32 pt-6">
        <div className="pb-6">
          <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
            Terms of Service &amp; Privacy Policy
          </h1>
          <p className="pt-2 text-base text-text-secondary">
            Please review our updated terms and privacy practices before continuing to use Artiva.
          </p>
        </div>

        <div className="mb-6 max-h-80 overflow-y-auto rounded-xl border border-border bg-white p-[17px] shadow-card">
          <div className="flex flex-col gap-4">
            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h3 className="pb-1 text-lg font-semibold text-text-primary">{section.heading}</h3>
                <p className="text-sm text-text-secondary">{section.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Checkbox
            checked={agreedTerms}
            onChange={setAgreedTerms}
            label={
              <>
                I agree to the <span className="font-semibold text-brand">Terms of Service</span>
              </>
            }
          />
          <Checkbox
            checked={agreedPrivacy}
            onChange={setAgreedPrivacy}
            label={
              <>
                I acknowledge and consent to the <span className="font-semibold text-brand">Privacy Policy</span>
              </>
            }
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-[480px] border-t border-border bg-app-bg/90 px-4 pb-4 pt-4 backdrop-blur-md">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          loading={saving}
          variant={canContinue ? 'primary' : 'secondary'}
          icon={<ArrowRight className="size-3.5" />}
        >
          Agree &amp; Continue
        </Button>
      </div>
    </div>
  )
}
