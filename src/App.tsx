import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { StorageFallbackBanner } from '@/components/ui/StorageFallbackBanner'

const SplashScreen = lazy(() => import('@/screens/SplashScreen').then((m) => ({ default: m.SplashScreen })))
const PhoneEntryScreen = lazy(() => import('@/screens/auth/PhoneEntryScreen').then((m) => ({ default: m.PhoneEntryScreen })))
const OtpVerifyScreen = lazy(() => import('@/screens/auth/OtpVerifyScreen').then((m) => ({ default: m.OtpVerifyScreen })))
const RoleSelectionScreen = lazy(() => import('@/screens/onboarding/RoleSelectionScreen').then((m) => ({ default: m.RoleSelectionScreen })))
const TermsConsentScreen = lazy(() => import('@/screens/onboarding/TermsConsentScreen').then((m) => ({ default: m.TermsConsentScreen })))
const SwitchRoleScreen = lazy(() => import('@/screens/onboarding/SwitchRoleScreen').then((m) => ({ default: m.SwitchRoleScreen })))
const VerificationIntroScreen = lazy(() => import('@/screens/verification/VerificationIntroScreen').then((m) => ({ default: m.VerificationIntroScreen })))
const ChecklistScreen = lazy(() => import('@/screens/verification/ChecklistScreen').then((m) => ({ default: m.ChecklistScreen })))
const IdUploadScreen = lazy(() => import('@/screens/verification/IdUploadScreen').then((m) => ({ default: m.IdUploadScreen })))
const SelfieCaptureScreen = lazy(() => import('@/screens/verification/SelfieCaptureScreen').then((m) => ({ default: m.SelfieCaptureScreen })))
const SelfiePreviewScreen = lazy(() => import('@/screens/verification/SelfiePreviewScreen').then((m) => ({ default: m.SelfiePreviewScreen })))
const TradeCertificateScreen = lazy(() => import('@/screens/verification/TradeCertificateScreen').then((m) => ({ default: m.TradeCertificateScreen })))
const ProofOfAddressScreen = lazy(() => import('@/screens/verification/ProofOfAddressScreen').then((m) => ({ default: m.ProofOfAddressScreen })))
const BackgroundCheckScreen = lazy(() => import('@/screens/verification/BackgroundCheckScreen').then((m) => ({ default: m.BackgroundCheckScreen })))
const PendingStatusScreen = lazy(() => import('@/screens/verification/PendingStatusScreen').then((m) => ({ default: m.PendingStatusScreen })))
const ResultScreen = lazy(() => import('@/screens/verification/ResultScreen').then((m) => ({ default: m.ResultScreen })))
const PermissionDeniedScreen = lazy(() => import('@/screens/status/PermissionDeniedScreen').then((m) => ({ default: m.PermissionDeniedScreen })))
const UploadFailedScreen = lazy(() => import('@/screens/status/UploadFailedScreen').then((m) => ({ default: m.UploadFailedScreen })))
const DocumentUnreadableScreen = lazy(() => import('@/screens/status/DocumentUnreadableScreen').then((m) => ({ default: m.DocumentUnreadableScreen })))
const NotificationPromptScreen = lazy(() => import('@/screens/status/NotificationPromptScreen').then((m) => ({ default: m.NotificationPromptScreen })))
const HomeScreen = lazy(() => import('@/screens/home/HomeScreen').then((m) => ({ default: m.HomeScreen })))

function RouteFallback() {
  return (
    <div className="app-shell items-center justify-center">
      <span className="size-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <StorageFallbackBanner />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<SplashScreen />} />

          <Route path="/phone" element={<PhoneEntryScreen />} />
          <Route path="/otp" element={<OtpVerifyScreen />} />

          <Route path="/role" element={<RoleSelectionScreen />} />
          <Route path="/terms" element={<TermsConsentScreen />} />
          <Route path="/switch-role" element={<SwitchRoleScreen />} />

          <Route path="/verify" element={<VerificationIntroScreen />} />
          <Route path="/verify/checklist" element={<ChecklistScreen />} />
          <Route path="/verify/id" element={<IdUploadScreen />} />
          <Route path="/verify/selfie" element={<SelfieCaptureScreen />} />
          <Route path="/verify/selfie/preview" element={<SelfiePreviewScreen />} />
          <Route path="/verify/certificate" element={<TradeCertificateScreen />} />
          <Route path="/verify/address" element={<ProofOfAddressScreen />} />
          <Route path="/verify/background-check" element={<BackgroundCheckScreen />} />
          <Route path="/verify/pending" element={<PendingStatusScreen />} />
          <Route path="/verify/result" element={<ResultScreen />} />

          <Route path="/permission-denied" element={<PermissionDeniedScreen />} />
          <Route path="/upload-failed" element={<UploadFailedScreen />} />
          <Route path="/document-unreadable" element={<DocumentUnreadableScreen />} />
          <Route path="/notifications-prompt" element={<NotificationPromptScreen />} />

          <Route path="/home" element={<HomeScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProvider>
  )
}

export default App
