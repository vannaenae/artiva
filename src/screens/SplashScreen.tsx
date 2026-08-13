import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Palette } from 'lucide-react'
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
          <div className="size-[384px] rounded-full border border-brand mix-blend-screen" />
          <div className="absolute size-[192px] rounded-full border border-white mix-blend-screen" />
        </div>
        <div className="relative flex flex-col items-center">
          <span className="flex size-24 items-center justify-center rounded-full bg-brand shadow-[0_0_20px_rgba(255,140,0,0.3)]">
            <Palette className="size-10 text-white" strokeWidth={2} />
          </span>
          <h1 className="pt-4 text-[32px] font-bold leading-10 tracking-[-0.8px] text-white">Artiva</h1>
          <p className="pt-4 text-sm text-[#c1c6d9] opacity-80">Elevating Service Experiences</p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 pb-8 pt-6">
        <span className="h-2.5 w-10 animate-pulse rounded-full bg-white/20" />
        <p className="text-xs font-medium tracking-[0.24px] text-[#c1c6d9] opacity-60">
          Initializing workspace...
        </p>
      </div>
    </div>
  )
}
