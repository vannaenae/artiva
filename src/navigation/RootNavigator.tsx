import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList, RouteName } from './types';
import SplashScreen from '../screens/auth/SplashScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import OtpVerifyScreen from '../screens/auth/OtpVerifyScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import ResultVerifiedScreen from '../screens/verification/ResultVerifiedScreen';
import ResultRejectedScreen from '../screens/verification/ResultRejectedScreen';
import PendingStatusScreen from '../screens/verification/PendingStatusScreen';
import UploadFailedScreen from '../screens/verification/UploadFailedScreen';
import PermissionDeniedScreen from '../screens/verification/PermissionDeniedScreen';
import DocumentUnreadableScreen from '../screens/verification/DocumentUnreadableScreen';
import NotificationPermissionPromptScreen from '../screens/verification/NotificationPermissionPromptScreen';
import TermsConsentScreen from '../screens/auth/TermsConsentScreen';
import VerificationIntroScreen from '../screens/verification/VerificationIntroScreen';
import VerificationChecklistScreen from '../screens/verification/VerificationChecklistScreen';
import IdUploadEmptyScreen from '../screens/verification/IdUploadEmptyScreen';
import IdUploadSelectedScreen from '../screens/verification/IdUploadSelectedScreen';
import SelfieCaptureScreen from '../screens/verification/SelfieCaptureScreen';
import SelfiePreviewScreen from '../screens/verification/SelfiePreviewScreen';
import TradeCertificateScreen from '../screens/verification/TradeCertificateScreen';
import ProofOfAddressScreen from '../screens/verification/ProofOfAddressScreen';
import BackgroundCheckConsentScreen from '../screens/verification/BackgroundCheckConsentScreen';
import SwitchRoleScreen from '../screens/provider/SwitchRoleScreen';
import ProviderProfileVerifiedScreen from '../screens/provider/ProviderProfileVerifiedScreen';
import ProviderCategorySelectionScreen from '../screens/provider/ProviderCategorySelectionScreen';
import ProviderPricingSetupScreen from '../screens/provider/ProviderPricingSetupScreen';
import ProviderAvailabilitySetupScreen from '../screens/provider/ProviderAvailabilitySetupScreen';
import ProviderPortfolioUploadScreen from '../screens/provider/ProviderPortfolioUploadScreen';
import ProviderBusinessBioScreen from '../screens/provider/ProviderBusinessBioScreen';
import PlaceholderScreen from '../screens/shared/PlaceholderScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Human-readable titles for routes still on the placeholder screen. */
const placeholderTitles: Partial<Record<RouteName, string>> = {
  PhoneEntryNigeria: 'Phone Entry (Nigeria)',
  OtpVerifyNigeria: 'Verify OTP (Nigeria)',
  ProviderPricingSetupNGN: 'Rates & Pricing',
  ProviderStatusToggle: 'Currently Online',
  ProviderEarningsPayoutsNGN: 'Earnings & Payouts',
  CustomerHome: 'Find Services',
  CustomerSearchFilters: 'Search & Filters',
  CustomerProviderProfileNigeria: 'Provider Profile',
  CustomerBookingFormNGN: 'Book a Service',
  CustomerEscrowPaymentSummaryNGN: 'Payment Summary',
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="ResultVerified" component={ResultVerifiedScreen} />
      <Stack.Screen name="ResultRejected" component={ResultRejectedScreen} />
      <Stack.Screen name="PendingStatus" component={PendingStatusScreen} />
      <Stack.Screen name="UploadFailed" component={UploadFailedScreen} />
      <Stack.Screen name="PermissionDenied" component={PermissionDeniedScreen} />
      <Stack.Screen name="DocumentUnreadable" component={DocumentUnreadableScreen} />
      <Stack.Screen
        name="NotificationPermissionPrompt"
        component={NotificationPermissionPromptScreen}
      />
      <Stack.Screen name="TermsConsent" component={TermsConsentScreen} />
      <Stack.Screen name="VerificationIntro" component={VerificationIntroScreen} />
      <Stack.Screen name="VerificationChecklist" component={VerificationChecklistScreen} />
      <Stack.Screen name="IdUploadEmpty" component={IdUploadEmptyScreen} />
      <Stack.Screen name="IdUploadSelected" component={IdUploadSelectedScreen} />
      <Stack.Screen name="SelfieCapture" component={SelfieCaptureScreen} />
      <Stack.Screen name="SelfiePreview" component={SelfiePreviewScreen} />
      <Stack.Screen name="TradeCertificate" component={TradeCertificateScreen} />
      <Stack.Screen name="ProofOfAddress" component={ProofOfAddressScreen} />
      <Stack.Screen name="BackgroundCheckConsent" component={BackgroundCheckConsentScreen} />
      <Stack.Screen name="SwitchRole" component={SwitchRoleScreen} />
      <Stack.Screen name="ProviderProfileVerified" component={ProviderProfileVerifiedScreen} />
      <Stack.Screen name="ProviderCategorySelection" component={ProviderCategorySelectionScreen} />
      <Stack.Screen name="ProviderPricingSetup" component={ProviderPricingSetupScreen} />
      <Stack.Screen name="ProviderAvailabilitySetup" component={ProviderAvailabilitySetupScreen} />
      <Stack.Screen name="ProviderPortfolioUpload" component={ProviderPortfolioUploadScreen} />
      <Stack.Screen name="ProviderBusinessBio" component={ProviderBusinessBioScreen} />
      {(Object.keys(placeholderTitles) as RouteName[]).map((name) => (
        <Stack.Screen key={name} name={name}>
          {(props) => <PlaceholderScreen {...props} title={placeholderTitles[name]!} />}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
