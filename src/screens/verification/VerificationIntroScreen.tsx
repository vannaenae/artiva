import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Briefcase, Handshake, Lock } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'

const BENEFITS = [
  {
    icon: <Handshake className="size-6 text-brand-dark" />,
    title: 'Build trust',
    description: 'Clients are 3x more likely to hire verified professionals.',
  },
  {
    icon: <Briefcase className="size-6 text-brand-dark" />,
    title: 'Get more jobs',
    description: 'Appear higher in search results and receive priority matching.',
  },
  {
    icon: <Lock className="size-6 text-brand-dark" />,
    title: 'Secure payments',
    description: 'Access instant payouts and our payment protection guarantee.',
  },
]

export function VerificationIntroScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <AppHeader title="Verification" showBack backTo="/role" />
      <div className="flex flex-1 flex-col px-4 pt-6">
        <div className="flex flex-col items-center gap-4 pb-8 pt-6 text-center">
          <span className="relative flex size-24 items-center justify-center rounded-full bg-chip">
            <BadgeCheck className="size-11 text-brand" strokeWidth={1.75} />
          </span>
          <div>
            <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
              Let&apos;s get you verified
            </h1>
            <p className="pt-2 text-base text-text-secondary">
              Complete your profile to unlock premium features and stand out.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 rounded-xl border border-border bg-white p-[17px] shadow-card"
            >
              <span className="flex size-11 shrink-0 items-center justify-center">{benefit.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{benefit.title}</h3>
                <p className="text-sm text-text-secondary">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center gap-2 pb-4 pt-8">
          <Button onClick={() => navigate('/verify/checklist')} icon={<ArrowRight className="size-4" />}>
            Start Verification
          </Button>
          <p className="text-xs font-medium tracking-[0.24px] text-text-secondary">
            Takes about 2 minutes
          </p>
        </div>
      </div>
    </div>
  )
}
