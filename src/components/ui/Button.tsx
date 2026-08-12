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
    'bg-brand text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] disabled:opacity-60',
  secondary: 'bg-border text-text-secondary',
  ghost: 'bg-transparent text-text-secondary border border-border',
  dark: 'bg-navy text-white',
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
        'inline-flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold tracking-[0.14px] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100',
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
