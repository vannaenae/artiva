import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { StatusPill, EscrowBadge } from '../components/ui/StatusPill';
import { Button } from '../components/ui/Button';
import { DisputeModal } from '../components/dispute/DisputeModal';
import { BookingChat } from '../components/booking/BookingChat';
import { formatCurrency, formatDate } from '../lib/utils';
import { buildWhatsAppShareUrl } from '../lib/whatsapp';
import { isFirebaseConfigured } from '../lib/firebase';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  RefreshCw,
  PhoneCall,
  Check,
  MessageCircle,
  Star
} from 'lucide-react';

export const BookingDetailPage: React.FC = () => {
  const {
    currentPath,
    navigate,
    bookings,
    currentRole,
    acceptBooking,
    declineBooking,
    startJob,
    completeJobByArtisan,
    confirmJobByResident,
    submitReview,
    createDispute
  } = useApp();

  // Extract ID from current hash path e.g. /bookings/bk-105
  const bookingId = currentPath.split('/bookings/')[1] || '';
  const booking = bookings.find(b => b.id === bookingId);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewJustSubmitted, setReviewJustSubmitted] = useState<boolean>(false);

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Booking Not Found</h2>
        <p className="text-xs text-slate-500">This booking doesn't exist or has been removed.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  const steps = [
    { key: 'requested', label: 'Booking Requested', desc: 'Escrow locked by resident' },
    { key: 'accepted', label: 'Accepted by Artisan', desc: 'Schedule confirmed' },
    { key: 'in_progress', label: 'Work In Progress', desc: 'Artisan on site' },
    { key: 'completed', label: 'Artisan Completed', desc: 'Awaiting resident check' },
    { key: 'paid_out', label: 'Dual Confirmed & Paid Out', desc: 'Escrow released to artisan' },
  ];

  const getCurrentStepIndex = () => {
    if (booking.status === 'requested') return 0;
    if (booking.status === 'accepted') return 1;
    if (booking.status === 'in_progress') return 2;
    if (booking.status === 'completed') return 3;
    if (booking.status === 'confirmed' || booking.status === 'paid_out') return 4;
    return 0;
  };

  const currentStepIdx = getCurrentStepIndex();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back Link */}
      <button
        onClick={() => navigate('/bookings')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-artiva-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Bookings Dashboard</span>
      </button>

      {/* Main Details Header */}
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-400">#{booking.id}</span>
              <StatusPill status={booking.status} />
              <EscrowBadge status={booking.escrowStatus} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2 font-heading">
              {booking.artisanCategory} for {booking.residentName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Booked on {formatDate(booking.createdAt)}</p>
          </div>

          <div className="text-left sm:text-right bg-artiva-teal-light/50 p-3.5 rounded-artiva border border-artiva-teal/20">
            <span className="text-[10px] font-bold text-artiva-teal-dark uppercase tracking-wider block">Escrow Secured</span>
            <span className="text-2xl font-extrabold text-artiva-teal-dark font-heading">
              {formatCurrency(booking.totalAmount)}
            </span>
            {booking.paymentVerifiedAt && (
              <span className="mt-1 flex items-center sm:justify-end gap-1 text-[10px] font-bold text-emerald-600">
                <Check className="w-3 h-3" /> Payment verified by Paystack
              </span>
            )}
          </div>
        </div>

        {/* Step-by-Step Status Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifecycle Status Timeline</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIdx && booking.status !== 'declined' && booking.status !== 'disputed';
              const isCurrent = idx === currentStepIdx && booking.status !== 'declined' && booking.status !== 'disputed';
              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-artiva border text-xs space-y-1 ${
                    isPassed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isCurrent
                      ? 'bg-artiva-teal-light border-artiva-teal text-artiva-teal-dark font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px]">Step 0{idx + 1}</span>
                    {isPassed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <p className="font-bold text-[11px] leading-tight">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resident & Artisan Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-artiva bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artisan Details</span>
            <div className="flex items-center gap-3">
              <img src={booking.artisanPhotoUrl} alt={booking.artisanName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{booking.artisanName}</h4>
                <p className="text-xs text-artiva-teal-dark font-medium">{booking.artisanCategory}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-artiva bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resident & Location</span>
            <div className="space-y-1 text-xs text-slate-700">
              <p className="font-bold text-slate-900">{booking.residentName}</p>
              <p className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {booking.residentEstate}
              </p>
              <p className="flex items-center gap-1 text-slate-500">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" /> {booking.residentPhone}
              </p>
              <a
                href={buildWhatsAppShareUrl(
                  `Hi ${booking.residentName}, this is regarding your Artiva booking: "${booking.serviceDescription}".`,
                  booking.residentPhone
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Message on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Job Requirements */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Description</span>
          <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-artiva border border-slate-200 leading-relaxed">
            "{booking.serviceDescription}"
          </p>
        </div>

        {/* Leave a Review — resident, once they've confirmed the job's done, once per booking */}
        {currentRole === 'resident' && booking.residentConfirmed && !booking.reviewSubmitted && (
          <div className="p-4 rounded-artiva bg-artiva-gold/5 border border-artiva-gold/30 space-y-3">
            {reviewJustSubmitted ? (
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Thanks — your review is posted on {booking.artisanName}'s profile.
              </p>
            ) : (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Rate {booking.artisanName}'s work
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5"
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || reviewRating)
                            ? 'fill-artiva-gold text-artiva-gold'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How did the job go? (optional)"
                  className="w-full rounded-artiva border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-artiva-teal focus:ring-1 focus:ring-artiva-teal outline-none"
                />
                <Button
                  variant="gold"
                  size="sm"
                  disabled={reviewRating === 0}
                  onClick={() => {
                    submitReview(booking.id, reviewRating, reviewComment.trim() || 'No additional comments.');
                    setReviewJustSubmitted(true);
                  }}
                >
                  Submit Review
                </Button>
              </>
            )}
          </div>
        )}

        {/* Interactive Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current Test Role: <strong className="font-bold text-slate-900 uppercase">{currentRole}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Artisan controls */}
            {currentRole === 'artisan' && booking.status === 'requested' && (
              <>
                <Button variant="outline" size="md" onClick={() => declineBooking(booking.id)}>
                  Decline Booking
                </Button>
                <Button variant="primary" size="md" onClick={() => acceptBooking(booking.id)} icon={<Check className="w-4 h-4" />}>
                  Accept Request
                </Button>
              </>
            )}

            {currentRole === 'artisan' && booking.status === 'accepted' && (
              <Button variant="primary" size="md" onClick={() => startJob(booking.id)} icon={<RefreshCw className="w-4 h-4" />}>
                Mark Job In-Progress
              </Button>
            )}

            {currentRole === 'artisan' && booking.status === 'in_progress' && !booking.artisanConfirmed && (
              <Button variant="gold" size="md" onClick={() => completeJobByArtisan(booking.id)} icon={<CheckCircle2 className="w-4 h-4" />}>
                Mark Job Completed
              </Button>
            )}

            {/* Resident controls */}
            {currentRole === 'resident' && (booking.status === 'completed' || (booking.status === 'in_progress' && booking.artisanConfirmed)) && (
              <Button
                variant="gold"
                size="md"
                onClick={() => confirmJobByResident(booking.id)}
                icon={<ShieldCheck className="w-4 h-4 text-slate-900" />}
              >
                Confirm Job Completion & Release Escrow ({formatCurrency(booking.totalAmount)})
              </Button>
            )}

            {/* Raise Dispute */}
            {(booking.status === 'in_progress' || booking.status === 'completed' || booking.status === 'accepted') && (
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsDisputeModalOpen(true)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
              >
                Raise Dispute
              </Button>
            )}
          </div>
        </div>

      </div>

      {/* Live chat thread — Firestore-only, no localStorage fallback exists
          for cross-device messaging, so this simply doesn't render in demo
          mode rather than showing a chat that can't actually sync. */}
      {isFirebaseConfigured && <BookingChat booking={booking} />}

      {/* Dispute Modal */}
      {isDisputeModalOpen && (
        <DisputeModal
          booking={booking}
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          onSubmitDispute={(bId, reason, desc, photo) => {
            createDispute(bId, reason, desc, photo);
            setIsDisputeModalOpen(false);
          }}
        />
      )}

    </div>
  );
};
