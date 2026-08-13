import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList, RouteName } from './types';
import SplashScreen from '../screens/auth/SplashScreen';
import PhoneEntryScreen from '../screens/auth/PhoneEntryScreen';
import PlaceholderScreen from '../screens/shared/PlaceholderScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** Human-readable titles for routes still on the placeholder screen. */
const placeholderTitles: Partial<Record<RouteName, string>> = {
  PhoneEntryNigeria: 'Phone Entry (Nigeria)',
  OtpVerify: 'Verify OTP',
  OtpVerifyNigeria: 'Verify OTP (Nigeria)',
  RoleSelection: 'Choose Your Role',
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
  ResultVerified: "You're Verified",
  ResultRejected: 'Verification Failed',
  PendingStatus: 'Verification In Progress',
  PermissionDenied: 'Camera Permission Required',
  UploadFailed: 'Upload Failed',
  DocumentUnreadable: 'Document Unreadable',
  NotificationPermissionPrompt: 'Stay Updated',
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
      {(Object.keys(placeholderTitles) as RouteName[]).map((name) => (
        <Stack.Screen key={name} name={name}>
          {(props) => <PlaceholderScreen {...props} title={placeholderTitles[name]!} />}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
