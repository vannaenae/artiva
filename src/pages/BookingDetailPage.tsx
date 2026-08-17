import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { StatusPill, EscrowBadge } from '../components/ui/StatusPill';
import { Button } from '../components/ui/Button';
import { DisputeModal } from '../components/dispute/DisputeModal';
import { formatCurrency, formatDate } from '../lib/utils';
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
  Check
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
    createDispute 
  } = useApp();

  // Extract ID from current hash path e.g. /bookings/bk-105
  const bookingId = currentPath.split('/bookings/')[1] || 'bk-101';
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState<boolean>(false);

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
