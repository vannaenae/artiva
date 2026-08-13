import { useLocation, useNavigate } from 'react-router-dom'
import { CameraOff } from 'lucide-react'
import { StatusScreen } from '@/components/verification/StatusScreen'

export function PermissionDeniedScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/verify/selfie'

  return (
    <StatusScreen
      headerTitle="Camera Access"
      icon={<CameraOff className="size-9 text-danger" strokeWidth={1.75} />}
      iconBg="bg-danger-soft"
      title="Camera access needed"
      description="Artiva needs camera access to capture your selfie for verification. Please enable it in your browser or device settings."
      primaryLabel="Try Again"
      onPrimary={() => navigate(returnTo)}
      secondaryLabel="Back to Checklist"
      onSecondary={() => navigate('/verify/checklist')}
    />
  )
}
