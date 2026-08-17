import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/ui/Badge';
import { RatingStars } from '../components/ui/RatingStars';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { formatCurrency, formatDistance, haversineKm } from '../lib/utils';
import { triggerPaystackEscrowPayment } from '../lib/paystack';
import { PricingType } from '../types';
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  MessageSquare,
  Award,
  Phone,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  AlertCircle,
  CreditCard
} from 'lucide-react';

export const ArtisanProfilePage: React.FC = () => {
  const { currentPath, navigate, artisans, userSession, selectedEstate, userLocation, createBooking } = useApp();

  // Extract artisan ID from route hash e.g. /artisan/art-1
  const artisanId = currentPath.split('/artisan/')[1] || '';
  const artisan = artisans.find(a => a.id === artisanId);
  const distanceOrigin = userLocation || selectedEstate;
  const distanceKm = artisan ? haversineKm(distanceOrigin.lat, distanceOrigin.lng, artisan.lat, artisan.lng) : 0;

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [serviceDescription, setServiceDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-08-19');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [pricingType, setPricingType] = useState<PricingType>('fixed_rate');
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleOpenBookingModal = () => {
    if (!userSession) {
      navigate('/login');
      return;
    }
    setPaymentError('');
    setIsBookingModalOpen(true);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artisan || !serviceDescription.trim() || !userSession) return;

    const amountInNaira = pricingType === 'inspection_first'
      ? (artisan.inspectionFee || 3000)
      : (artisan.hourlyRate * estimatedHours);

    const email = userSession.email || `${userSession.phone.replace(/\D/g, '')}@artiva.ng`;

    setPaymentError('');
    setIsPaying(true);

    triggerPaystackEscrowPayment(
      email,
      amountInNaira,
      { artisanName: artisan.name, estateName: selectedEstate.name, serviceDescription },
      () => {
        setIsPaying(false);
        const booking = createBooking(
          artisan.id,
          serviceDescription,
          preferredDate,
          preferredTime,
          pricingType,
          estimatedHours
        );
        setIsBookingModalOpen(false);
        navigate(`/bookings/${booking.id}`);
      },
      () => setIsPaying(false),
      (message) => {
        setIsPaying(false);
        setPaymentError(message);
      }
    );
  };

  if (!artisan) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Artisan Not Found</h2>
        <p className="text-xs text-slate-500">This artisan profile doesn't exist or is no longer available.</p>
        <button
          onClick={() => navigate('/directory')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-artiva-teal hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Artisan Directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">

      {/* Back to Directory Button */}
      <button
        onClick={() => navigate('/directory')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-artiva-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Artisan Directory
      </button>

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-artiva-lg p-6 sm:p-8 border border-slate-200 shadow-artiva-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="relative">
              <img
                src={artisan.photoUrl}
                alt={artisan.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-artiva-lg object-cover border-2 border-artiva-teal shadow-artiva-md"
              />
              {artisan.verificationStatus === 'verified' && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 font-heading">{artisan.name}</h1>
                <Badge status={artisan.verificationStatus} />
              </div>
              <p className="text-sm font-bold text-artiva-teal-dark">{artisan.categoryLabel}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{artisan.estateName} • </span>
                <span className="font-bold text-artiva-teal">{formatDistance(distanceKm)} away</span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} />
                <span className="text-xs text-slate-400">• Member since {artisan.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="bg-slate-50 p-4 rounded-artiva border border-slate-200 text-right space-y-3 w-full sm:w-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Standard Rate</span>
              <span className="text-xl font-extrabold text-slate-900 font-heading">{formatCurrency(artisan.hourlyRate)}</span>
              <span className="text-xs text-slate-500"> / hour</span>
            </div>

            <div className="text-xs text-slate-600 border-t border-slate-200 pt-2">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">On-Site Diagnosis Fee</span>
              <span className="font-bold text-purple-700">{formatCurrency(artisan.inspectionFee || 3000)}</span>
            </div>

            <Button
              variant="gold"
              size="md"
              onClick={handleOpenBookingModal}
              className="w-full justify-center"
              icon={<Calendar className="w-4 h-4 text-slate-900" />}
            >
              Book Artisan Now
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">About Professional</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{artisan.bio}</p>
        </div>

        {/* Verified Skills */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">Verified Skills & Services</h3>
          <div className="flex flex-wrap gap-2">
            {artisan.skills.map((skill, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-artiva-pill bg-teal-50 text-artiva-teal-dark font-semibold border border-teal-200/60 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-artiva-teal" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {artisan.reviews && artisan.reviews.length > 0 && (
        <div className="bg-white rounded-artiva-lg p-6 sm:p-8 border border-slate-200 shadow-artiva-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-artiva-teal" />
            Estate Resident Reviews ({artisan.reviews.length})
          </h3>

          <div className="space-y-4">
            {artisan.reviews.map(review => (
              <div key={review.id} className="p-4 bg-slate-50 rounded-artiva border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 font-heading">{review.residentName}</h4>
                    <span className="text-[11px] text-slate-500">{review.residentEstate} • {review.date}</span>
                  </div>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-700 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsBookingModalOpen(false)}
          title={`Book ${artisan.name}`}
        >
          <form onSubmit={handleCreateBooking} className="space-y-4">
            
            {/* Pricing Model Option */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 font-heading block">
                Select Job Pricing Model:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPricingType('fixed_rate')}
                  className={`p-3 rounded-artiva border text-left flex flex-col justify-between transition-all ${
                    pricingType === 'fixed_rate'
                      ? 'border-artiva-teal bg-artiva-teal-light/40 text-slate-900 ring-2 ring-artiva-teal/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-heading">Fixed Rate</span>
                    {pricingType === 'fixed_rate' && <CheckCircle2 className="w-4 h-4 text-artiva-teal" />}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    {formatCurrency(artisan.hourlyRate)}/hr estimated
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPricingType('inspection_first')}
                  className={`p-3 rounded-artiva border text-left flex flex-col justify-between transition-all ${
                    pricingType === 'inspection_first'
                      ? 'border-artiva-teal bg-artiva-teal-light/40 text-slate-900 ring-2 ring-artiva-teal/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-heading">Request On-Site Inspection</span>
                    {pricingType === 'inspection_first' && <CheckCircle2 className="w-4 h-4 text-artiva-teal" />}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    {formatCurrency(artisan.inspectionFee || 3000)} diagnosis fee held
                  </span>
                </button>
              </div>

              {pricingType === 'inspection_first' && (
                <div className="p-3 bg-amber-50 rounded-artiva border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Eye className="w-4 h-4 text-amber-700" />
                    How On-Site Inspection Works:
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Artisan visits your estate home to inspect the issue and submits an official custom quote proposal for materials and labor. You review and approve the quote before any work starts.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Describe the Job / Repair Needed:
              </label>
              <textarea
                required
                rows={3}
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full text-xs p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
              <Input
                label="Time"
                type="text"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              />
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-artiva flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Escrow Hold Amount</span>
                <span className="font-extrabold text-sm text-amber-300 font-heading">
                  {pricingType === 'inspection_first'
                    ? formatCurrency(artisan.inspectionFee || 3000)
                    : formatCurrency(artisan.hourlyRate * estimatedHours)}
                </span>
              </div>

              <div className="text-right text-[10px] text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protected in Escrow</span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 rounded-artiva border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="md" disabled={isPaying} icon={<CreditCard className="w-4 h-4 text-slate-900" />}>
                {isPaying ? 'Opening Paystack…' : 'Pay via Paystack & Lock Escrow'}
              </Button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
};
