import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Clock, Repeat, Search, Wallet, XCircle } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types'

const STATUS_META: Record<VerificationStatus, { label: string; className: string; icon: React.ReactNode }> = {
  verified: { label: 'Verified', className: 'bg-success-soft text-success', icon: <BadgeCheck className="size-3.5" /> },
  pending: { label: 'Under review', className: 'bg-chip-blue text-brand-dark', icon: <Clock className="size-3.5" /> },
  rejected: { label: 'Action needed', className: 'bg-danger-soft text-danger', icon: <XCircle className="size-3.5" /> },
  unverified: { label: 'Not verified', className: 'bg-chip text-text-muted', icon: <Clock className="size-3.5" /> },
}

export function HomeScreen() {
  const navigate = useNavigate()
  const { profile, logout } = useApp()

  const status = profile?.verificationStatus ?? 'unverified'
  const statusMeta = STATUS_META[status]

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showNotifications />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Welcome back</p>
            <h1 className="text-2xl font-bold text-text-primary">
              {profile?.role === 'provider' ? 'Provider Dashboard' : 'Find a Provider'}
            </h1>
          </div>
          <span
            className={cn(
              'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold',
              statusMeta.className,
            )}
          >
            {statusMeta.icon}
            {statusMeta.label}
          </span>
        </div>

        {status !== 'verified' ? (
          <button
            type="button"
            onClick={() => navigate('/verify')}
            className="rounded-xl border border-brand/30 bg-brand-soft/40 p-4 text-left"
          >
            <p className="text-sm font-semibold text-brand-dark">Finish verifying your account</p>
            <p className="pt-1 text-sm text-text-secondary">
              Unlock every feature by completing identity verification.
            </p>
          </button>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start gap-2 rounded-xl border border-border bg-white p-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-chip-blue">
              {profile?.role === 'provider' ? (
                <Wallet className="size-5 text-brand-dark" />
              ) : (
                <Search className="size-5 text-brand-dark" />
              )}
            </span>
            <p className="text-sm font-semibold text-text-primary">
              {profile?.role === 'provider' ? 'Earnings & Payouts' : 'Search Providers'}
            </p>
            <p className="text-xs text-text-muted">Coming soon</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/switch-role')}
            className="flex flex-col items-start gap-2 rounded-xl border border-border bg-white p-4 text-left"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-chip">
              <Repeat className="size-5 text-text-primary" />
            </span>
            <p className="text-sm font-semibold text-text-primary">Switch Role</p>
            <p className="text-xs text-text-muted">
              Become a {profile?.role === 'provider' ? 'customer' : 'provider'}
            </p>
          </button>
        </div>

        <button
          type="button"
          onClick={() => logout().then(() => navigate('/'))}
          className="mt-auto self-center text-sm font-medium text-text-secondary underline"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
