export type UserRole = 'resident' | 'artisan' | 'admin';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export type ServiceCategory = 
  | 'plumbing' 
  | 'electrical' 
  | 'cleaning' 
  | 'appliance_repair' 
  | 'carpentry' 
  | 'painting' 
  | 'ac_repair';

export interface Estate {
  id: string;
  name: string;
  lga: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
}

export interface CustomerReview {
  id: string;
  residentName: string;
  residentEstate: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Artisan {
  id: string;
  name: string;
  phone: string;
  email?: string;
  category: ServiceCategory;
  categoryLabel: string;
  estateId: string;
  estateName: string;
  lat: number;
  lng: number;
  /** Free-text service address, if the artisan provided one to geocode.
   * Falls back to the estate centroid (lat/lng above) when absent. */
  address?: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  inspectionFee: number;
  verificationStatus: VerificationStatus;
  bio: string;
  skills: string[];
  idDocumentUrl?: string;
  /** Free-text NIN, only used by the optional automated check in
   * lib/ninVerify.ts. Never required — manual document review (above)
   * is the verification path that always works. */
  ninNumber?: string;
  photoUrl: string;
  completedJobsCount: number;
  disputeCount: number;
  memberSince: string;
  verificationSubmittedAt?: string;
  rejectionReason?: string;
  reviews?: CustomerReview[];
}

export interface Resident {
  id: string;
  name: string;
  phone: string;
  email: string;
  estateId: string;
  estateName: string;
  address: string;
}

export type PricingType = 'fixed_rate' | 'inspection_first';

export type BookingStatus = 
  | 'requested' 
  | 'inspection_requested' 
  | 'quote_pending' 
  | 'accepted' 
  | 'declined' 
  | 'in_progress' 
  | 'supplemental_quote_pending' // Mid-job extra parts escrow top-up request
  | 'completed' 
  | 'confirmed' 
  | 'paid_out'
  | 'disputed';

export type EscrowStatus = 'held' | 'released' | 'disputed' | 'refunded';

export interface Booking {
  id: string;
  residentId: string;
  residentName: string;
  residentPhone: string;
  residentEstate: string;
  artisanId: string;
  artisanName: string;
  artisanCategory: string;
  artisanPhotoUrl: string;
  serviceDescription: string;
  preferredDate: string;
  preferredTime: string;
  pricingType: PricingType;
  inspectionFee: number;
  customQuoteAmount?: number;
  quoteNotes?: string;
  
  // Edge Case 1: Estate Security Access Pass
  estateGateCode?: string;
  
  // Edge Case 2: Mid-Job Supplemental Escrow Top-Up
  supplementalAmount?: number;
  supplementalNotes?: string;
  
  // Edge Case 3: Pre-Work Photo Inspection Log
  beforeWorkPhotoUrl?: string;
  
  // Edge Case 4: Auto-Release Timer
  autoReleaseDate?: string;
  
  totalAmount: number;
  escrowStatus: EscrowStatus;
  status: BookingStatus;
  residentConfirmed: boolean;
  artisanConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DisputeStatus = 'open' | 'awaiting_counter_statement' | 'under_review' | 'resolved';

export interface Dispute {
  id: string;
  bookingId: string;
  artisanId: string;
  artisanName: string;
  residentId: string;
  residentName: string;
  raisedByRole: 'resident' | 'artisan';
  reason: string;
  description: string;
  evidencePhotoUrl?: string;
  
  // Both Sides of the Story
  counterStatement?: string;
  counterEvidencePhotoUrl?: string;
  counterSubmittedAt?: string;
  
  status: DisputeStatus;
  resolutionSummary?: string;
  createdAt: string;
  resolvedAt?: string;
}
