import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconCircleProps {
  children: ReactNode
  size?: number
  bg?: string
  className?: string
}

/** A round icon chip, matching the Figma "Background" icon containers. */
export function IconCircle({ children, size = 48, bg = 'bg-chip', className }: IconCircleProps) {
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full', bg, className)}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}
