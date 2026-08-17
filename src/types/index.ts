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
  distanceKm: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  inspectionFee: number; // Inspection fee for on-site diagnosis (e.g. ₦3,000)
  verificationStatus: VerificationStatus;
  bio: string;
  skills: string[];
  idDocumentUrl?: string;
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
  | 'inspection_requested'   // Resident requested on-site inspection
  | 'quote_pending'          // Artisan inspected & submitted custom price quote
  | 'accepted' 
  | 'declined' 
  | 'in_progress' 
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
  inspectionFee: number;      // Inspection fee locked in escrow for diagnosis
  customQuoteAmount?: number; // Custom quote proposed by artisan after on-site inspection
  quoteNotes?: string;        // Artisan notes on materials & labor breakdown
  totalAmount: number;
  escrowStatus: EscrowStatus;
  status: BookingStatus;
  residentConfirmed: boolean;
  artisanConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DisputeStatus = 'open' | 'under_review' | 'resolved';

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
  status: DisputeStatus;
  resolutionSummary?: string;
  createdAt: string;
  resolvedAt?: string;
}
