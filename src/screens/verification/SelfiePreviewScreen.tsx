import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RotateCcw, Check } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

interface LocationState {
  previewUrl: string
  file: File
}

export function SelfiePreviewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateProfile, uploadFile, profile } = useApp()
  const state = location.state as LocationState | null
  const [saving, setSaving] = useState(false)

  if (!state) {
    navigate('/verify/selfie', { replace: true })
    return null
  }

  const handleConfirm = async () => {
    if (saving) return
    setSaving(true)
    try {
      const url = await uploadFile('selfie', state.file)
      await updateProfile({
        selfieUrl: url,
        steps: { ...profile!.steps, selfie: 'complete' },
      })
      navigate(profile?.role === 'provider' ? '/verify/certificate' : '/verify/address')
    } catch {
      navigate('/upload-failed', { state: { returnTo: '/verify/selfie' } })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-shell">
      <AppHeader title="Review Selfie" showBack backTo="/verify/selfie" />
      <div className="flex flex-1 flex-col px-4 pb-8 pt-6">
        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-text-primary">
          <img
            src={state.previewUrl}
            alt="Captured selfie"
            className="max-h-[60vh] w-full object-contain [transform:scaleX(-1)]"
          />
        </div>
        <p className="pt-4 text-center text-sm text-text-secondary">
          Make sure your face is clearly visible and well lit.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" icon={<RotateCcw className="size-4" />} iconPosition="left" onClick={() => navigate('/verify/selfie')}>
            Retake
          </Button>
          <Button loading={saving} icon={<Check className="size-4" />} onClick={handleConfirm}>
            Use Photo
          </Button>
        </div>
      </div>
    </div>
  )
}
