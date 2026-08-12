import { useLocation, useNavigate } from 'react-router-dom'
import { FileWarning } from 'lucide-react'
import { StatusScreen } from '@/components/verification/StatusScreen'

export function DocumentUnreadableScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/verify/id'

  return (
    <StatusScreen
      headerTitle="Document Unreadable"
      icon={<FileWarning className="size-9 text-brand-dark" strokeWidth={1.75} />}
      iconBg="bg-chip-blue"
      title="We couldn't read that document"
      description="Make sure the photo is well-lit, in focus, and shows all four corners, then upload it again."
      primaryLabel="Retake Photo"
      onPrimary={() => navigate(returnTo)}
      secondaryLabel="Back to Checklist"
      onSecondary={() => navigate('/verify/checklist')}
    />
  )
}
