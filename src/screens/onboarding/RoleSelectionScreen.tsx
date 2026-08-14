import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Briefcase, Wrench } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import type { UserRole } from '@/types'

const ROLES: { role: UserRole; icon: React.ReactNode; title: string; description: string }[] = [
  {
    role: 'customer',
    icon: <Briefcase className="size-4 text-text-primary" />,
    title: 'I want to hire services',
    description: 'Find professionals for your needs.',
  },
  {
    role: 'provider',
    icon: <Wrench className="size-5 text-text-primary" />,
    title: 'I want to provide services',
    description: 'Offer your skills and get hired.',
  },
]

export function RoleSelectionScreen() {
  const navigate = useNavigate()
  const { updateProfile } = useApp()
  const [selected, setSelected] = useState<UserRole | null>(null)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (!selected || saving) return
    setSaving(true)
    try {
      await updateProfile({ role: selected })
      navigate('/terms')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" />
      <div className="flex flex-1 flex-col justify-between px-4 pb-4 pt-6">
        <div>
          <div className="pb-8 text-center">
            <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
              Join Artiva
            </h1>
            <p className="pt-2 text-sm text-text-secondary">Select how you want to use the platform.</p>
          </div>

          <div className="flex flex-col gap-4 py-4">
            {ROLES.map(({ role, icon, title, description }) => {
              const isSelected = selected === role
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelected(role)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border bg-white p-[17px] text-left shadow-card transition',
                    isSelected ? 'border-brand ring-2 ring-brand/20' : 'border-border hover:border-text-muted/30',
                  )}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-chip">
                    {icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold text-text-primary">{title}</span>
                    <span className="block text-sm text-text-secondary">{description}</span>
                  </span>
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected ? 'border-brand bg-brand' : 'border-border',
                    )}
                  >
                    {isSelected ? <span className="size-2.5 rounded-full bg-white" /> : null}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-6">
          <Button
            onClick={handleContinue}
            disabled={!selected}
            loading={saving}
            icon={<ArrowRight className="size-3.5" />}
          >
            Continue
          </Button>
          <p className="text-sm text-text-secondary">
            Already have an account? <span className="font-medium text-brand">Log in</span>
          </p>
        </div>
      </div>
    </div>
  )
}
