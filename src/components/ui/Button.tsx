import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  pill?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-raised hover:bg-brand-dark disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none',
  secondary:
    'bg-white text-text-secondary border border-border hover:border-text-muted/40 hover:text-text-primary disabled:text-slate-300',
  ghost: 'bg-transparent text-text-secondary border border-border hover:bg-surface-muted disabled:text-slate-300',
  dark: 'bg-navy text-white hover:bg-navy-soft disabled:bg-slate-200 disabled:text-slate-400',
}

export function Button({
  variant = 'primary',
  pill = false,
  loading = false,
  icon,
  iconPosition = 'right',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold tracking-[0.14px] transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg',
        pill ? 'rounded-full' : 'rounded-xl',
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <span>{children}</span>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </button>
  )
}
