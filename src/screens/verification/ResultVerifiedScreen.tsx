import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ResultVerifiedScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-shell overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-32 size-[500px] rounded-full bg-success/20 blur-3xl" />
        <div className="absolute -right-10 -bottom-32 size-[400px] rounded-full bg-brand-soft/40 blur-3xl" />
      </div>
      <div className="h-2 w-full shrink-0 bg-navy" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-sm rounded-xl border border-border bg-white/80 p-8 text-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md">
          <div className="mx-auto -mt-4 mb-4 flex size-20 items-center justify-center">
            <span className="relative flex size-20 items-center justify-center rounded-full bg-success-soft ring-1 ring-success/20">
              <BadgeCheck className="size-10 text-success" strokeWidth={2} />
            </span>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">You&apos;re Verified!</h1>
          <p className="mx-auto max-w-[240px] pt-2 text-base text-text-secondary">
            Your profile is now live. You can start offering your services to clients immediately.
          </p>
          <div className="mx-auto my-8 h-1 w-12 rounded-full bg-border" />
          <Button onClick={() => navigate('/home')} icon={<ArrowRight className="size-3" />}>
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  )
}
