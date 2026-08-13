import { useNavigate } from 'react-router-dom'
import { ArrowRight, Camera, IdCard, MapPin } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { ChecklistItem } from '@/components/verification/ChecklistItem'
import { useApp } from '@/context/AppContext'
import { allStepsComplete } from '@/lib/flow'

export function ChecklistScreen() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useApp()
  const steps = profile?.steps

  const handleBegin = async () => {
    if (profile && allStepsComplete(profile)) {
      await updateProfile({ verificationStatus: 'pending' })
      navigate('/verify/pending')
      return
    }
    if (!steps || steps.governmentId !== 'complete') return navigate('/verify/id')
    if (steps.selfie !== 'complete') return navigate('/verify/selfie')
    if (profile?.role === 'provider' && steps.tradeCertificate !== 'complete') {
      return navigate('/verify/certificate')
    }
    if (steps.proofOfAddress !== 'complete') return navigate('/verify/address')
    navigate('/verify/background-check')
  }

  return (
    <div className="app-shell">
      <AppHeader title="Artiva" showNotifications avatarUrl="" />
      <div className="flex flex-1 flex-col justify-between px-4 pb-8 pt-6">
        <div>
          <div className="pb-6">
            <h1 className="text-[32px] font-bold leading-10 tracking-[-0.64px] text-text-primary">
              Verification Checklist
            </h1>
            <p className="pt-2 text-sm text-text-secondary">
              Complete the following steps to verify your identity and access all premium services
              securely.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <ChecklistItem
              icon={<IdCard className="size-5 text-text-primary" />}
              title="1. Government ID"
              status={steps?.governmentId ?? 'not_started'}
              onClick={() => navigate('/verify/id')}
            />
            <ChecklistItem
              icon={<Camera className="size-5 text-text-primary" />}
              title="2. Selfie Capture"
              status={steps?.selfie ?? 'not_started'}
              onClick={() => navigate('/verify/selfie')}
            />
            <ChecklistItem
              icon={<MapPin className="size-5 text-text-primary" />}
              title="3. Proof of Address"
              status={steps?.proofOfAddress ?? 'not_started'}
              onClick={() => navigate('/verify/address')}
            />
          </div>
        </div>

        <div className="pt-8">
          <Button onClick={handleBegin} icon={<ArrowRight className="size-3.5" />}>
            {profile && allStepsComplete(profile) ? 'Submit for Review' : 'Begin'}
          </Button>
        </div>
      </div>
    </div>
  )
}
