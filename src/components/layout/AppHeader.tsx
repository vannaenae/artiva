import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title: string
  /** Show a back chevron that navigates to `backTo`, or calls history back if omitted. */
  showBack?: boolean
  backTo?: string
  onBack?: () => void
  right?: ReactNode
  showHelp?: boolean
  showNotifications?: boolean
  avatarUrl?: string
  className?: string
}

export function AppHeader({
  title,
  showBack = false,
  backTo,
  onBack,
  right,
  showHelp = false,
  showNotifications = false,
  avatarUrl,
  className,
}: AppHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) return onBack()
    if (backTo) return navigate(backTo)
    navigate(-1)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center gap-2 bg-navy px-4 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
      {showBack ? (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          className="flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white/10 active:bg-white/20"
        >
          <ArrowLeft className="size-4" strokeWidth={2.5} />
        </button>
      ) : null}

      <h1 className="flex-1 truncate text-center text-xl font-bold">{title}</h1>

      <div className="flex shrink-0 items-center gap-1">
        {showHelp ? (
          <button
            type="button"
            aria-label="Help"
            className="flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <HelpCircle className="size-5" />
          </button>
        ) : null}
        {showNotifications ? (
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <Bell className="size-4" />
          </button>
        ) : null}
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-8 rounded-full object-cover" />
        ) : null}
        {right}
      </div>

      {/* Reserve symmetric space so a centered title stays centered when only one side has content. */}
      {!showBack && !right && !showHelp && !showNotifications && !avatarUrl ? (
        <div className="size-10 shrink-0" />
      ) : null}
    </header>
  )
}
