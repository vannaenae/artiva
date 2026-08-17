import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Artisan } from '../types';
import { ArtisanCard } from '../components/artisan/ArtisanCard';
import { ArtisanFilter } from '../components/artisan/ArtisanFilter';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RatingStars } from '../components/ui/RatingStars';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDistance } from '../lib/utils';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Lock, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Star,
  Award,
  AlertCircle,
  Wrench,
  Zap,
  Check,
  ArrowRight,
  Shield,
  ThumbsUp
} from 'lucide-react';

export const ResidentDirectoryPage: React.FC = () => {
  const { 
    artisans, 
    selectedEstate, 
    activeCategory, 
    setActiveCategory, 
    searchQuery, 
    setSearchQuery,
    createBooking
  } = useApp();

  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [bookingArtisan, setBookingArtisan] = useState<Artisan | null>(null);

  // Booking Form State
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-08-19');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM');
  const [hours, setHours] = useState<number>(2);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Filter artisans based on category, search, verification status, and registered estate proximity
  const filteredArtisans = artisans.filter((art) => {
    if (activeCategory !== 'all' && art.category !== activeCategory) return false;
    if (onlyVerified && art.verificationStatus !== 'verified') return false;
    if (minRating > 0 && art.rating < minRating) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = art.name.toLowerCase().includes(q);
      const matchCategory = art.categoryLabel.toLowerCase().includes(q);
      const matchSkills = art.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchCategory && !matchSkills) return false;
    }
    return true;
  }).sort((a, b) => a.distanceKm - b.distanceKm); // Nearest-first distance sorting

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingArtisan) return;

    createBooking(
      bookingArtisan.id,
      serviceDescription || 'General maintenance service.',
      preferredDate,
      preferredTime,
      hours
    );

    setBookingSuccess(true);
  };

  return (
    <div className="space-y-12">
      
      {/* Website Hero Section */}
      <section className="relative overflow-hidden rounded-artiva-lg bg-gradient-to-br from-slate-900 via-artiva-teal-dark to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-artiva-lg border border-slate-800">
        <div className="relative z-10 max-w-4xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-artiva-pill bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Nigeria's Vetted Home-Services Marketplace Website</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
            Verified Estate Artisans. <br />
            <span className="text-artiva-gold">Protected by Escrow.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl leading-relaxed">
            Connecting residents in <strong className="text-white">{selectedEstate.name}</strong> with background-checked plumbers, electricians, cleaners, and AC technicians. Your money stays safely in escrow until you inspect and approve the completed job.
          </p>

          {/* Core Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-artiva border border-white/10">
              <div className="w-8 h-8 rounded-full bg-artiva-gold/20 text-artiva-gold flex items-center justify-center shrink-0 font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Proximity-Sorted</p>
                <p className="text-slate-400 text-[11px]">Nearest artisans to {selectedEstate.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-artiva border border-white/10">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Escrow Payment Vault</p>
                <p className="text-slate-400 text-[11px]">Funds released on mutual confirmation</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-artiva border border-white/10">
              <div className="w-8 h-8 rounded-full bg-artiva-teal/30 text-teal-300 flex items-center justify-center shrink-0 font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">ID & NIN Verified</p>
                <p className="text-slate-400 text-[11px]">Government ID & estate security checked</p>
              </div>
            </div>
          </div>

        </div>

        {/* Decorative Shield Watermark */}
        <div className="absolute right-[-60px] bottom-[-60px] opacity-10 pointer-events-none">
          <ShieldCheck className="w-[500px] h-[500px] text-white" />
        </div>
      </section>

      {/* Website "How It Works" Section */}
      <section className="bg-white p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-artiva-teal-dark bg-artiva-teal-light px-3 py-1 rounded-artiva-pill">
            Website Booking Guarantee
          </span>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            How Artiva Protects Estate Residents & Artisans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-artiva bg-slate-50 border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-artiva-teal text-white flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Select Verified Artisan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse plumbers, electricians, and technicians sorted by distance from your registered estate address.
            </p>
          </div>

          <div className="p-5 rounded-artiva bg-amber-50 border border-amber-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-artiva-gold text-slate-900 flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Lock Funds in Escrow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your service payment is held securely in the Artiva Escrow Vault. Zero money is paid upfront to the artisan.
            </p>
          </div>

          <div className="p-5 rounded-artiva bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dual Confirmation Release</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect the finished work. Funds are transferred to the artisan only after both you and the artisan confirm completion.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Search & Filters Bar */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-heading">
              Artisan Directory — {selectedEstate.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing <span className="font-bold text-artiva-teal-dark">{filteredArtisans.length}</span> vetted professionals ready for on-demand booking
            </p>
          </div>
        </div>

        <ArtisanFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          minRating={minRating}
          setMinRating={setMinRating}
        />

        {/* Artisans Directory Grid */}
        {filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                artisan={artisan}
                onSelect={(art) => setSelectedArtisan(art)}
                onBook={(art) => {
                  setBookingArtisan(art);
                  setBookingSuccess(false);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-artiva-lg p-12 text-center border border-slate-200 shadow-artiva-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No artisans found matching search filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching your category filter, turning off "Verified Only", or clearing the search bar.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setOnlyVerified(false);
                setMinRating(0);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Artisan Detail Modal */}
      {selectedArtisan && (
        <Modal
          isOpen={Boolean(selectedArtisan)}
          onClose={() => setSelectedArtisan(null)}
          title={selectedArtisan.name}
          subtitle={`${selectedArtisan.categoryLabel} • ${selectedArtisan.estateName}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <img
                src={selectedArtisan.photoUrl}
                alt={selectedArtisan.name}
                className="w-20 h-20 rounded-artiva object-cover border-2 border-artiva-teal/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedArtisan.name}</h3>
                  <Badge status={selectedArtisan.verificationStatus} />
                </div>
                <p className="text-xs text-slate-500">{selectedArtisan.categoryLabel}</p>
                <div className="flex items-center gap-3 pt-1">
                  <RatingStars rating={selectedArtisan.rating} reviewCount={selectedArtisan.reviewCount} />
                  <span className="text-xs text-slate-500">• {selectedArtisan.completedJobsCount} jobs completed</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Professional Bio</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-artiva border border-slate-200">
                {selectedArtisan.bio}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Skills & Tools</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedArtisan.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded bg-artiva-teal-light text-artiva-teal-dark font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-artiva flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-emerald-900">Protected by Artiva Escrow</p>
                <p className="text-emerald-700">Funds are held in escrow until you confirm job completion.</p>
              </div>
              <span className="text-base font-extrabold text-emerald-900">
                {formatCurrency(selectedArtisan.hourlyRate)}/hr
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setSelectedArtisan(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setBookingArtisan(selectedArtisan);
                  setSelectedArtisan(null);
                  setBookingSuccess(false);
                }}
                icon={<Calendar className="w-4 h-4" />}
              >
                Proceed to Booking
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Booking Form Modal */}
      {bookingArtisan && (
        <Modal
          isOpen={Boolean(bookingArtisan)}
          onClose={() => setBookingArtisan(null)}
          title={bookingSuccess ? 'Booking Request Submitted!' : `Book ${bookingArtisan.name}`}
          subtitle={`Escrow Deposit Vault • ${bookingArtisan.categoryLabel}`}
          maxWidth="md"
        >
          {!bookingSuccess ? (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-artiva border border-slate-200 flex items-center gap-3">
                <img src={bookingArtisan.photoUrl} alt={bookingArtisan.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{bookingArtisan.name}</h4>
                  <p className="text-[11px] text-artiva-teal-dark font-semibold">
                    {formatCurrency(bookingArtisan.hourlyRate)} per hour • {formatDistance(bookingArtisan.distanceKm)}
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
                  placeholder="Describe the issue (e.g., Water pump leak, circuit breaker tripping, deep kitchen cleaning)..."
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
                  Estimated Job Duration (Hours)
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
                  <span>{formatCurrency(bookingArtisan.hourlyRate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>Estimated Hours:</span>
                  <span>{hours} hours</span>
                </div>
                <div className="pt-2 border-t border-artiva-teal/20 flex items-center justify-between font-bold text-slate-900 text-sm">
                  <span>Escrow Deposit Total:</span>
                  <span className="text-artiva-teal-dark text-base font-extrabold">
                    {formatCurrency(bookingArtisan.hourlyRate * hours)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  🔒 Funds are held safely in escrow. Nothing is paid out until both you and the artisan confirm job completion.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="md" onClick={() => setBookingArtisan(null)} type="button">
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
              <h3 className="text-xl font-bold text-slate-900">Escrow Secured & Request Sent</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your request has been dispatched to <span className="font-semibold">{bookingArtisan.name}</span>. Funds of <span className="font-bold text-artiva-teal-dark">{formatCurrency(bookingArtisan.hourlyRate * hours)}</span> are locked in escrow.
              </p>
              <Button variant="primary" fullWidth onClick={() => setBookingArtisan(null)}>
                View Active Bookings Dashboard
              </Button>
            </div>
          )}
        </Modal>
      )}

    </div>
  );
};
