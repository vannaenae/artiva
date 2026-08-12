import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { StatusScreen } from '@/components/verification/StatusScreen'

export function NotificationPromptScreen() {
  const navigate = useNavigate()

  const handleEnable = () => {
    if ('Notification' in window) {
      Notification.requestPermission().finally(() => navigate('/home'))
    } else {
      navigate('/home')
    }
  }

  return (
    <StatusScreen
      headerTitle="Stay in the Loop"
      showBack={false}
      icon={<Bell className="size-9 text-brand-dark" strokeWidth={1.75} />}
      iconBg="bg-chip-blue"
      title="Turn on notifications"
      description="Get notified the moment your verification is approved, or when a client sends you a booking request."
      primaryLabel="Enable Notifications"
      onPrimary={handleEnable}
      secondaryLabel="Not Now"
      onSecondary={() => navigate('/home')}
    />
  )
}
