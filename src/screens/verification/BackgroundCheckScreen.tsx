import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { useApp } from '@/context/AppContext'

const POINTS = [
  'Identity confirmation against government records',
  'Criminal history screening where permitted by law',
  'Results are encrypted and only used for verification',
]

export function BackgroundCheckScreen() {
  const navigate = useNavigate()
  const { updateProfile, profile } = useApp()
  const [agreed, setAgreed] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (!agreed || saving) return
    setSaving(true)
    try {
      await updateProfile({ steps: { ...profile!.steps, backgroundCheck: 'complete' } })
      navigate('/verify/checklist')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Background Check" showBack backTo="/verify/checklist" />
      <div className="flex flex-1 flex-col px-4 pb-8 pt-8">
        <div className="flex flex-col items-center gap-3 pb-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-chip-blue">
            <ShieldCheck className="size-8 text-brand-dark" />
          </span>
          <h1 className="text-2xl font-bold tracking-[-0.24px] text-text-primary">
            Background Check Consent
          </h1>
          <p className="max-w-xs text-sm text-text-secondary">
            For the safety of our community, we run a standard background check on every provider.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-[17px] shadow-card">
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-6">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label="I consent to Artiva conducting a background check as described above."
          />
        </div>

        <div className="mt-auto pt-8">
          <Button
            onClick={handleContinue}
            disabled={!agreed}
            loading={saving}
            variant={agreed ? 'primary' : 'secondary'}
            icon={<ArrowRight className="size-3.5" />}
          >
            Consent &amp; Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
