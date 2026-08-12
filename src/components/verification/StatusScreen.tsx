import type { ReactNode } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'

interface StatusScreenProps {
  headerTitle: string
  icon: ReactNode
  iconBg?: string
  title: string
  description: ReactNode
  primaryLabel: string
  onPrimary: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  showBack?: boolean
}

/**
 * Shared layout for the icon + heading + description + CTA "utility" screens:
 * permission denied, upload failed, document unreadable, notification prompt, etc.
 */
export function StatusScreen({
  headerTitle,
  icon,
  iconBg = 'bg-chip',
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showBack = true,
}: StatusScreenProps) {
  return (
    <div className="app-shell">
      <AppHeader title={headerTitle} showBack={showBack} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <span className={`flex size-20 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
          <p className="mx-auto max-w-xs text-base text-text-secondary">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 pt-4">
          <Button onClick={onPrimary}>{primaryLabel}</Button>
          {secondaryLabel ? (
            <Button variant="ghost" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
