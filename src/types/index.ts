export type UserRole = 'customer' | 'provider'

export type StepStatus = 'not_started' | 'in_progress' | 'complete'

export interface VerificationSteps {
  governmentId: StepStatus
  selfie: StepStatus
  proofOfAddress: StepStatus
  tradeCertificate: StepStatus
  backgroundCheck: StepStatus
}

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface UserProfile {
  uid: string
  phoneNumber: string | null
  role: UserRole | null
  agreedToTermsAt: number | null
  verificationStatus: VerificationStatus
  steps: VerificationSteps
  rejectionReason?: string
  idFrontUrl?: string
  idBackUrl?: string
  selfieUrl?: string
  proofOfAddressUrl?: string
  proofOfAddressType?: 'bank_statement' | 'utility_bill' | 'rental_agreement'
  tradeCertificateUrl?: string
  createdAt: number
  updatedAt: number
}

export const defaultVerificationSteps: VerificationSteps = {
  governmentId: 'not_started',
  selfie: 'not_started',
  proofOfAddress: 'not_started',
  tradeCertificate: 'not_started',
  backgroundCheck: 'not_started',
}
