/**
 * Single root stack covering every screen in the Figma flow (Page 5).
 * Kept as one flat stack for now since the source file itself is one
 * continuous flow board rather than separate app sections.
 */
export type AuthStackParamList = {
  Splash: undefined;
  PhoneEntry: undefined;
  PhoneEntryNigeria: undefined;
  OtpVerify: undefined;
  OtpVerifyNigeria: undefined;
  RoleSelection: undefined;
  TermsConsent: undefined;

  // Verification / KYC
  VerificationIntro: undefined;
  VerificationChecklist: undefined;
  IdUploadEmpty: undefined;
  IdUploadSelected: undefined;
  SelfieCapture: undefined;
  SelfiePreview: undefined;
  TradeCertificate: undefined;
  ProofOfAddress: undefined;
  BackgroundCheckConsent: undefined;
  ResultVerified: undefined;
  ResultRejected: undefined;
  PendingStatus: undefined;
  PermissionDenied: undefined;
  UploadFailed: undefined;
  DocumentUnreadable: undefined;
  NotificationPermissionPrompt: undefined;

  // Provider
  SwitchRole: undefined;
  ProviderProfileVerified: undefined;
  ProviderCategorySelection: undefined;
  ProviderPricingSetup: undefined;
  ProviderPricingSetupNGN: undefined;
  ProviderAvailabilitySetup: undefined;
  ProviderPortfolioUpload: undefined;
  ProviderBusinessBio: undefined;
  ProviderStatusToggle: undefined;
  ProviderEarningsPayoutsNGN: undefined;

  // Customer
  CustomerHome: undefined;
  CustomerSearchFilters: undefined;
  CustomerProviderProfileNigeria: undefined;
  CustomerBookingFormNGN: undefined;
  CustomerEscrowPaymentSummaryNGN: undefined;
};

export type RouteName = keyof AuthStackParamList;
