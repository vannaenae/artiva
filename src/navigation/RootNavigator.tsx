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
import PlaceholderScreen from '../screens/shared/PlaceholderScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Human-readable titles for routes still on the placeholder screen. */
const placeholderTitles: Partial<Record<RouteName, string>> = {
  PhoneEntryNigeria: 'Phone Entry (Nigeria)',
  OtpVerifyNigeria: 'Verify OTP (Nigeria)',
  TermsConsent: 'Terms & Privacy',
  VerificationIntro: "Let's get you verified",
  VerificationChecklist: 'Verification Checklist',
  IdUploadEmpty: 'Upload ID',
  IdUploadSelected: 'ID Uploaded',
  SelfieCapture: 'Take a Selfie',
  SelfiePreview: 'Confirm Selfie',
  TradeCertificate: 'Trade Certification',
  ProofOfAddress: 'Proof of Address',
  BackgroundCheckConsent: 'Background Check Consent',
  SwitchRole: 'Switch Role',
  ProviderProfileVerified: 'Your Profile',
  ProviderCategorySelection: 'What services do you offer?',
  ProviderPricingSetup: 'Rates & Pricing',
  ProviderPricingSetupNGN: 'Rates & Pricing',
  ProviderAvailabilitySetup: 'Availability Setup',
  ProviderPortfolioUpload: 'Showcase Your Work',
  ProviderBusinessBio: 'Tell Customers About Yourself',
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
      {(Object.keys(placeholderTitles) as RouteName[]).map((name) => (
        <Stack.Screen key={name} name={name}>
          {(props) => <PlaceholderScreen {...props} title={placeholderTitles[name]!} />}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
