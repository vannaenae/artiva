import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Artisan } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { RatingStars } from '../components/ui/RatingStars';
import { formatCurrency, formatDistance } from '../lib/utils';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  Star, 
  User, 
  Phone, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

export const ArtisanProfilePage: React.FC = () => {
  const { currentPath, navigate, artisans, createBooking, selectedEstate } = useApp();

  // Extract ID from current hash path e.g. /artisan/art-1
  const artisanId = currentPath.split('/artisan/')[1] || 'art-1';
  const artisan = artisans.find(a => a.id === artisanId) || artisans[0];

  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-08-19');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM');
  const [hours, setHours] = useState<number>(2);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking(
      artisan.id,
      serviceDescription || 'General repair service.',
      preferredDate,
      preferredTime,
      hours
    );
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/directory')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-artiva-teal transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Artisan Directory</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={artisan.photoUrl}
                alt={artisan.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-artiva object-cover border-2 border-artiva-teal/20"
              />
              {artisan.verificationStatus === 'verified' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">{artisan.name}</h1>
                <Badge status={artisan.verificationStatus} size="sm" />
              </div>
              <p className="text-xs text-artiva-teal-dark font-bold">{artisan.categoryLabel}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {artisan.estateName} ({formatDistance(artisan.distanceKm)})
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {artisan.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-artiva border sm:border-none border-slate-200">
            <span className="text-xs text-slate-500 block">Service Rate</span>
            <span className="text-2xl font-extrabold text-slate-900 font-heading">
              {formatCurrency(artisan.hourlyRate)}
            </span>
            <span className="text-xs text-slate-500"> / hour</span>

            <div className="pt-3">
              <Button
                variant="gold"
                size="md"
                fullWidth
                onClick={() => {
                  setIsBookingModalOpen(true);
                  setBookingSuccess(false);
                }}
                icon={<Calendar className="w-4 h-4 text-slate-900" />}
              >
                Request Booking
              </Button>
            </div>
          </div>
        </div>

        {/* Ratings & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-50 rounded-artiva border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rating</span>
            <div className="mt-1 flex items-center justify-center">
              <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} size="sm" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-artiva border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Jobs</span>
            <span className="text-sm font-bold text-slate-800">{artisan.completedJobsCount} Verified Jobs</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-artiva border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
            <span className="text-sm font-bold text-slate-800">{artisan.memberSince}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-artiva border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Escrow Guarantee</span>
            <span className="text-xs font-bold text-emerald-600">✓ 100% Protected</span>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900">About {artisan.name}</h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-artiva border border-slate-200">
            {artisan.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Verified Skills & Tools</h3>
          <div className="flex flex-wrap gap-2">
            {artisan.skills.map((skill, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-artiva-pill bg-artiva-teal-light text-artiva-teal-dark font-bold border border-artiva-teal/20">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-artiva-teal" />
            Estate Resident Reviews ({artisan.reviews?.length || 0})
          </h3>

          {artisan.reviews && artisan.reviews.length > 0 ? (
            <div className="space-y-3">
              {artisan.reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-artiva bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rev.residentName} ({rev.residentEstate})</span>
                    <span className="text-slate-400 text-[11px]">{rev.date}</span>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" showCount={false} />
                  <p className="text-xs text-slate-600 pt-1">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No public reviews written yet for this artisan.</p>
          )}
        </div>

      </div>

      {/* Booking Form Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={bookingSuccess ? 'Booking Request Sent' : `Book ${artisan.name}`}
        subtitle={`Escrow Protection Vault • ${artisan.categoryLabel}`}
        maxWidth="md"
      >
        {!bookingSuccess ? (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-artiva border border-slate-200 flex items-center gap-3">
              <img src={artisan.photoUrl} alt={artisan.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{artisan.name}</h4>
                <p className="text-[11px] text-artiva-teal-dark font-semibold">
                  {formatCurrency(artisan.hourlyRate)} per hour • {formatDistance(artisan.distanceKm)}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Service Requirements / Job Description
              </label>
              <textarea
                rows={3}
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Describe the issue (e.g., Water pump leak, inverter tripping, deep cleaning)..."
                className="w-full rounded-artiva border border-slate-300 p-3 text-sm text-slate-900 focus:border-artiva-teal focus:ring-1 focus:ring-artiva-teal outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Preferred Date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />
              <Input
                label="Preferred Time"
                type="text"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                placeholder="10:00 AM"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Estimated Duration (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full rounded-artiva border border-slate-300 p-2.5 text-sm"
              />
            </div>

            {/* Escrow Fee Summary */}
            <div className="bg-artiva-teal-light/60 p-4 rounded-artiva border border-artiva-teal/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Hourly Rate:</span>
                <span>{formatCurrency(artisan.hourlyRate)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Estimated Hours:</span>
                <span>{hours} hours</span>
              </div>
              <div className="pt-2 border-t border-artiva-teal/20 flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>Escrow Deposit Total:</span>
                <span className="text-artiva-teal-dark text-base font-extrabold">
                  {formatCurrency(artisan.hourlyRate * hours)}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                🔒 Funds are locked in escrow until both you and the artisan confirm job completion.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="md" onClick={() => setIsBookingModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="gold" size="md" type="submit" icon={<Lock className="w-4 h-4 text-slate-900" />}>
                Pay Escrow & Request Booking
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Escrow Locked & Booking Dispatched</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your request has been sent to <span className="font-semibold">{artisan.name}</span>. Funds of <span className="font-bold text-artiva-teal-dark">{formatCurrency(artisan.hourlyRate * hours)}</span> are locked in escrow.
            </p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsBookingModalOpen(false);
                navigate('/bookings');
              }}
            >
              Go to Bookings Dashboard
            </Button>
          </div>
        )}
      </Modal>

    </div>
  );
};
