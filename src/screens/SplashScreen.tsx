import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { nextRouteForProfile } from '@/lib/flow'

export function SplashScreen() {
  const navigate = useNavigate()
  const { user, profile, authLoading } = useApp()

  useEffect(() => {
    if (authLoading) return
    const timer = setTimeout(() => {
      if (!user) return navigate('/phone', { replace: true })
      navigate(nextRouteForProfile(profile), { replace: true })
    }, 1400)
    return () => clearTimeout(timer)
  }, [authLoading, user, profile, navigate])

  return (
    <div className="app-shell items-center justify-between bg-navy px-4">
      <div className="relative flex flex-1 w-full flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
          <div className="size-[384px] rounded-full border border-white" />
          <div className="absolute size-[192px] rounded-full border border-white" />
        </div>
        <div className="relative flex flex-col items-center">
          <span className="flex size-20 items-center justify-center rounded-2xl bg-brand shadow-[0_8px_24px_-4px_rgba(67,56,202,0.5)]">
            <ShieldCheck className="size-9 text-white" strokeWidth={2} />
          </span>
          <h1 className="pt-5 text-[32px] font-bold leading-10 tracking-[-0.8px] text-white">Artiva</h1>
          <p className="pt-3 text-sm text-slate-400">Elevating Service Experiences</p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 pb-8 pt-6">
        <span className="h-1 w-10 animate-pulse rounded-full bg-white/20" />
        <p className="text-xs font-medium tracking-[0.24px] text-slate-500">
          Initializing workspace...
        </p>
      </div>
    </div>
  )
}
