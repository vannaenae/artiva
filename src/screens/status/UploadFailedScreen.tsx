import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { StatusScreen } from '@/components/verification/StatusScreen'

export function UploadFailedScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/verify/checklist'

  return (
    <StatusScreen
      headerTitle="Upload Failed"
      icon={<AlertTriangle className="size-9 text-danger" strokeWidth={1.75} />}
      iconBg="bg-danger-soft"
      title="Upload didn't go through"
      description="We couldn't upload your file. Check your connection and try again."
      primaryLabel="Try Again"
      onPrimary={() => navigate(returnTo)}
      secondaryLabel="Back to Checklist"
      onSecondary={() => navigate('/verify/checklist')}
    />
  )
}
