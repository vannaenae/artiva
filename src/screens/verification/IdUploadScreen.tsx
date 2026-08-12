import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { UploadBox } from '@/components/verification/UploadBox'
import { useApp } from '@/context/AppContext'

type Side = 'front' | 'back'

export function IdUploadScreen() {
  const navigate = useNavigate()
  const { updateProfile, uploadFile, profile } = useApp()
  const [side, setSide] = useState<Side>('front')
  const [files, setFiles] = useState<Record<Side, { preview: string; file: File } | null>>({
    front: null,
    back: null,
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const current = files[side]

  const handleSelect = (file: File) => {
    setFiles((prev) => ({ ...prev, [side]: { file, preview: URL.createObjectURL(file) } }))
  }

  const handleUpload = async () => {
    if (!current || uploading) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadFile(`id-${side}`, current.file)
      if (side === 'front') {
        await updateProfile({
          idFrontUrl: url,
          steps: { ...profile!.steps, governmentId: 'in_progress' },
        })
        setSide('back')
      } else {
        await updateProfile({
          idBackUrl: url,
          steps: { ...profile!.steps, governmentId: 'complete' },
        })
        navigate('/verify/selfie')
      }
    } catch {
      navigate('/upload-failed', { state: { returnTo: '/verify/id' } })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showBack backTo="/verify/checklist" showNotifications />
      <div className="flex flex-1 flex-col gap-8 px-4 pb-8 pt-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-xl font-semibold text-text-primary">
            Upload ID {side === 'front' ? 'Front' : 'Back'}
          </h2>
          <p className="text-sm text-text-secondary">
            Please upload a clear photo of the {side} of your government-issued ID.
          </p>
        </div>

        <UploadBox
          variant="camera"
          title="Tap to take photo"
          subtitle="or browse files"
          previewUrl={current?.preview}
          status={uploading ? 'uploading' : 'idle'}
          capture
          onSelect={handleSelect}
        />

        <div className="rounded-xl border border-border bg-surface-muted p-[17px]">
          <h3 className="flex items-center gap-1.5 pb-2 text-sm font-semibold text-text-primary">
            Requirements
          </h3>
          <ul className="list-disc space-y-1 pl-6 text-sm text-text-secondary">
            <li>Clear and readable</li>
            <li>No glare or reflections</li>
            <li>All four corners visible</li>
          </ul>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <div className="mt-auto">
          <Button pill onClick={handleUpload} disabled={!current} loading={uploading}>
            Upload
          </Button>
        </div>
      </div>
    </div>
  )
}
