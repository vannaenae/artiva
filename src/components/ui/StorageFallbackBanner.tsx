import { CloudOff } from 'lucide-react'
import { useApp } from '@/context/AppContext'

/**
 * Visible whenever an upload has fallen back to local (in-browser) storage
 * because Firebase Storage isn't actually usable — e.g. the project is on
 * the Spark plan and never provisioned a bucket. Renders above every
 * screen so the degraded state is never silent.
 */
export function StorageFallbackBanner() {
  const { storageFallbackActive } = useApp()
  if (!storageFallbackActive) return null

  return (
    <div className="mx-auto flex w-full max-w-[480px] items-start gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
      <CloudOff className="mt-0.5 size-3.5 shrink-0" />
      <span>
        Cloud storage isn&apos;t set up for this project yet — uploads are being kept in this
        browser only and won&apos;t be visible elsewhere.
      </span>
    </div>
  )
}
