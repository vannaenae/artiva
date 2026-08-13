import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Wrench } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import { defaultVerificationSteps, type UserRole } from '@/types'

export function SwitchRoleScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useApp()
  const [selected, setSelected] = useState<UserRole | null>(null)
  const [saving, setSaving] = useState(false)

  const otherRole: UserRole = profile?.role === 'provider' ? 'customer' : 'provider'

  const handleSwitch = async () => {
    if (!selected || saving) return
    setSaving(true)
    try {
      // Switching roles re-opens verification since provider requirements differ.
      await updateProfile({
        role: selected,
        verificationStatus: 'unverified',
        steps: { ...defaultVerificationSteps },
      })
      navigate('/verify')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Switch Role" showBack backTo="/home" />
      <div className="flex flex-1 flex-col px-4 pb-8 pt-8">
        <div className="pb-6 text-center">
          <h1 className="text-2xl font-bold tracking-[-0.24px] text-text-primary">
            Switch to a new role
          </h1>
          <p className="pt-2 text-sm text-text-secondary">
            You&apos;re currently a{' '}
            <span className="font-semibold text-text-primary">
              {profile?.role === 'provider' ? 'service provider' : 'customer'}
            </span>
            . Switching requires completing verification for your new role.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSelected(otherRole)}
          className={cn(
            'flex w-full items-center gap-4 rounded-xl border bg-white p-[17px] text-left shadow-[0_4px_8px_rgba(18,24,38,0.04)]',
            selected === otherRole ? 'border-brand ring-2 ring-brand/20' : 'border-border',
          )}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-chip">
            {otherRole === 'provider' ? (
              <Wrench className="size-5 text-text-primary" />
            ) : (
              <Briefcase className="size-4 text-text-primary" />
            )}
          </span>
          <span className="flex-1">
            <span className="block text-lg font-semibold text-text-primary">
              {otherRole === 'provider' ? 'Become a Provider' : 'Switch to Customer'}
            </span>
            <span className="block text-sm text-text-secondary">
              {otherRole === 'provider' ? 'Offer your skills and get hired.' : 'Find professionals for your needs.'}
            </span>
          </span>
        </button>

        <div className="mt-auto pt-8">
          <Button onClick={handleSwitch} disabled={!selected} loading={saving}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
