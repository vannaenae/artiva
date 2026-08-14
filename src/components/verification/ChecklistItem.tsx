import type { ReactNode } from 'react'
import { ChevronRight, Circle, Clock, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepStatus } from '@/types'

interface ChecklistItemProps {
  icon: ReactNode
  title: string
  status: StepStatus
  onClick?: () => void
}

const statusMeta: Record<StepStatus, { label: string; icon: ReactNode; color: string }> = {
  not_started: { label: 'Not started', icon: <Circle className="size-3" />, color: 'text-text-muted' },
  in_progress: { label: 'In progress', icon: <Clock className="size-3" />, color: 'text-brand-dark' },
  complete: { label: 'Complete', icon: <CheckCircle2 className="size-3" />, color: 'text-success' },
}

export function ChecklistItem({ icon, title, status, onClick }: ChecklistItemProps) {
  const meta = statusMeta[status]
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-border bg-white p-[17px] text-left shadow-card transition hover:border-text-muted/30 active:scale-[0.99]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-chip">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-semibold text-text-primary">{title}</span>
        <span className={cn('flex items-center gap-1 text-xs font-medium tracking-[0.6px] uppercase', meta.color)}>
          {meta.icon}
          {meta.label}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-text-muted" />
    </button>
  )
}
