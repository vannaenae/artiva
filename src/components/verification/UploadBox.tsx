import { useRef } from 'react'
import { Camera, CloudUpload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadBoxProps {
  variant?: 'camera' | 'dashed'
  title: string
  subtitle: string
  hint?: string
  previewUrl?: string | null
  status?: 'idle' | 'uploading' | 'done' | 'error'
  accept?: string
  capture?: boolean
  onSelect: (file: File) => void
  className?: string
}

export function UploadBox({
  variant = 'camera',
  title,
  subtitle,
  hint,
  previewUrl,
  status = 'idle',
  accept = 'image/*',
  capture = false,
  onSelect,
  className,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSelect(file)
    e.target.value = ''
  }

  if (previewUrl) {
    return (
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative block w-full overflow-hidden rounded-xl border border-border bg-surface-muted',
          className,
        )}
      >
        <img src={previewUrl} alt="Uploaded document preview" className="max-h-56 w-full object-contain" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-navy/80 px-4 py-2 text-xs font-medium text-white backdrop-blur">
          <span>{status === 'uploading' ? 'Uploading…' : 'Tap to replace'}</span>
          {status === 'uploading' ? <Loader2 className="size-4 animate-spin" /> : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          capture={capture ? 'environment' : undefined}
          onChange={handleChange}
          className="sr-only"
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-xl p-6 text-center transition',
        variant === 'camera'
          ? 'bg-app-bg py-8'
          : 'min-h-[200px] border-2 border-dashed border-border-warm bg-white',
        className,
      )}
    >
      <span
        className={cn(
          'mb-4 flex items-center justify-center rounded-full',
          variant === 'camera' ? 'size-16 bg-chip-blue' : 'size-16 bg-chip',
        )}
      >
        {variant === 'camera' ? (
          <Camera className="size-6 text-brand-dark" strokeWidth={2} />
        ) : (
          <CloudUpload className="size-7 text-text-muted" strokeWidth={1.75} />
        )}
      </span>
      {variant === 'camera' ? (
        <span className="flex flex-col items-center gap-0.5 text-sm">
          <span className="font-semibold tracking-[0.14px] text-brand-dark">{title}</span>
          <span className="text-text-muted">{subtitle}</span>
        </span>
      ) : (
        <span className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-text-primary">{title}</span>
          <span className="max-w-[250px] text-sm text-text-muted">{subtitle}</span>
          {hint ? <span className="max-w-[250px] text-xs text-text-muted">{hint}</span> : null}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={capture ? 'environment' : undefined}
        onChange={handleChange}
        className="sr-only"
      />
    </button>
  )
}
