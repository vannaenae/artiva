import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
}

/** Six boxed digit inputs with a visual separator after the third, matching the OTP screen. */
export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join(''))
    if (digit && index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      e.preventDefault()
      onChange(pasted.padEnd(length, '').slice(0, length))
      inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
  }

  return (
    <div className="flex w-full items-center justify-center gap-2">
      {digits.map((digit, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            ref={(el) => {
              inputs.current[index] = el
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => setDigit(index, e.target.value.replace(/\D/g, '').slice(-1))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              'h-14 w-12 rounded-xl border bg-app-bg text-center text-2xl font-semibold text-text-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] outline-none transition-colors',
              digit || index === value.length
                ? 'border-brand shadow-[0_0_0_2px_rgba(255,140,0,0.2),0_1px_2px_0_rgba(0,0,0,0.05)]'
                : 'border-border-warm',
            )}
          />
          {index === 2 ? <span className="h-1 w-2 shrink-0 rounded-full bg-border-warm" /> : null}
        </div>
      ))}
    </div>
  )
}
