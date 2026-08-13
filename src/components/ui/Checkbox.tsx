import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  className?: string
}

export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <label className={cn('flex w-full cursor-pointer items-start gap-4', className)}>
      <span className="flex shrink-0 items-center justify-center pt-1">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-[4px] border-2 transition-colors',
            checked ? 'border-brand bg-brand' : 'border-border-warm bg-white',
          )}
        >
          {checked ? <Check className="size-4 text-white" strokeWidth={3} /> : null}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="flex-1 text-base text-text-primary">{label}</span>
    </label>
  )
}
