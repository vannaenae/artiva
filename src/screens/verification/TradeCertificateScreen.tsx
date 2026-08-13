import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { UploadBox } from '@/components/verification/UploadBox'
import { useApp } from '@/context/AppContext'

export function TradeCertificateScreen() {
  const navigate = useNavigate()
  const { updateProfile, uploadFile, profile } = useApp()
  const [selection, setSelection] = useState<{ preview: string; file: File } | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSelect = (file: File) => {
    setSelection({ file, preview: URL.createObjectURL(file) })
  }

  const handleUpload = async () => {
    if (!selection || uploading) return
    setUploading(true)
    try {
      const url = await uploadFile('trade-certificate', selection.file)
      await updateProfile({
        tradeCertificateUrl: url,
        steps: { ...profile!.steps, tradeCertificate: 'complete' },
      })
      navigate('/verify/address')
    } catch {
      navigate('/upload-failed', { state: { returnTo: '/verify/certificate' } })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showBack backTo="/verify/checklist" />
      <div className="flex flex-1 flex-col gap-8 px-4 pb-8 pt-6">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.24px] text-text-primary">Trade Certificate</h1>
          <p className="pt-2 text-sm text-text-secondary">
            Upload proof of your trade license or professional certification. This helps clients trust
            your expertise.
          </p>
        </div>

        <UploadBox
          variant="dashed"
          title="Tap to upload or drag & drop"
          subtitle="PDF, PNG, or JPG up to 10MB."
          hint="Ensure the certificate number and your name are visible."
          previewUrl={selection?.preview}
          status={uploading ? 'uploading' : 'idle'}
          accept="image/*,.pdf"
          onSelect={handleSelect}
        />

        <div className="mt-auto flex flex-col gap-3">
          <Button onClick={handleUpload} disabled={!selection} loading={uploading}>
            Next
          </Button>
          <Button variant="ghost" onClick={() => navigate('/verify/address')}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}
