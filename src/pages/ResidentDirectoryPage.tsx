import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArtisanCard } from '../components/artisan/ArtisanCard';
import { ArtisanFilter } from '../components/artisan/ArtisanFilter';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Artisan, PricingType } from '../types';
import { formatCurrency, formatDistance, haversineKm } from '../lib/utils';
import { triggerPaystackEscrowPayment } from '../lib/paystack';
import {
  Search,
  MapPin,
  ShieldCheck,
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Tv,
  Hammer,
  Paintbrush,
  Calendar,
  Clock,
  Lock,
  AlertCircle,
  Eye,
  CheckCircle2,
  CreditCard,
  LocateFixed,
  LoaderCircle
} from 'lucide-react';

type ArtisanWithDistance = Artisan & { distanceKm: number };

export const ResidentDirectoryPage: React.FC = () => {
  const {
    artisans,
    selectedEstate,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    userSession,
    navigate,
    createBooking,
    userLocation,
    locationStatus,
    requestUserLocation,
  } = useApp();

  const [onlyVerified, setOnlyVerified] = useState<boolean>(true);
  const [minRating, setMinRating] = useState<number>(0);

  // Booking Modal State
  const [selectedArtisanForBooking, setSelectedArtisanForBooking] = useState<ArtisanWithDistance | null>(null);
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('2026-08-19');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM');
  const [pricingType, setPricingType] = useState<PricingType>('fixed_rate');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);

  // Distance is computed from the resident's real device location when granted,
  // falling back to their registered estate's coordinates otherwise.
  const distanceOrigin = userLocation || selectedEstate;

  // Filtered & Proximity Sorted Artisans
  const filteredArtisans = useMemo((): ArtisanWithDistance[] => {
    return artisans
      .filter(artisan => {
        if (activeCategory !== 'all' && artisan.category !== activeCategory) {
          return false;
        }
        if (onlyVerified && artisan.verificationStatus !== 'verified') {
          return false;
        }
        if (minRating > 0 && artisan.rating < minRating) {
          return false;
        }
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesName = artisan.name.toLowerCase().includes(q);
          const matchesBio = artisan.bio.toLowerCase().includes(q);
          const matchesCategory = artisan.categoryLabel.toLowerCase().includes(q);
          const matchesSkill = artisan.skills.some(s => s.toLowerCase().includes(q));
          if (!matchesName && !matchesBio && !matchesCategory && !matchesSkill) {
            return false;
          }
        }
        return true;
      })
      .map(artisan => ({
        ...artisan,
        distanceKm: haversineKm(distanceOrigin.lat, distanceOrigin.lng, artisan.lat, artisan.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [artisans, activeCategory, onlyVerified, minRating, searchQuery, distanceOrigin]);

  const [paymentError, setPaymentError] = useState<string>('');
  const [isPaying, setIsPaying] = useState<boolean>(false);

  const handleOpenBookingModal = (artisan: ArtisanWithDistance) => {
    if (!userSession) {
      navigate('/login');
      return;
    }
    setSelectedArtisanForBooking(artisan);
    setServiceDescription('');
    setPricingType('fixed_rate');
    setPaymentError('');
  };

  const handleConfirmBookingWithPaystack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtisanForBooking || !serviceDescription.trim()) return;

    const amountInNaira = pricingType === 'inspection_first'
      ? (selectedArtisanForBooking.inspectionFee || 3000)
      : (selectedArtisanForBooking.hourlyRate * estimatedHours);

    const email = userSession?.email || `${(userSession?.phone || 'resident').replace(/\D/g, '')}@artiva.ng`;

    setPaymentError('');
    setIsPaying(true);

    // Trigger Paystack Inline NGN Payment Pop-up
    triggerPaystackEscrowPayment(
      email,
      amountInNaira,
      {
        artisanName: selectedArtisanForBooking.name,
        estateName: selectedEstate.name,
        serviceDescription,
      },
      (reference) => {
        // Callback on Paystack payment success
        setIsPaying(false);
        const booking = createBooking(
          selectedArtisanForBooking.id,
          serviceDescription,
          preferredDate,
          preferredTime,
          pricingType,
          estimatedHours,
          reference
        );

        setSelectedArtisanForBooking(null);
        navigate(`/bookings/${booking.id}`);
      },
      () => setIsPaying(false),
      (message) => {
        setIsPaying(false);
        setPaymentError(message);
      }
    );
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-artiva-teal shrink-0" />
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Artisans Near {selectedEstate.name}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              {userLocation
                ? 'Sorted nearest-first using your current device location.'
                : `Sorted nearest-first from ${selectedEstate.name}. Share your location for exact distances.`}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-artiva-teal-light px-3.5 py-2 rounded-artiva border border-artiva-teal/20 text-xs font-bold text-artiva-teal-dark">
              <ShieldCheck className="w-4 h-4 text-emerald-600 animate-badge-pulse" />
              <span>Paystack Escrow Protected • Zero Cash Risk</span>
            </div>
            <button
              type="button"
              onClick={requestUserLocation}
              disabled={locationStatus === 'requesting'}
              className="flex items-center gap-1.5 text-[11px] font-bold text-artiva-teal hover:text-artiva-teal-dark disabled:opacity-60"
            >
              {locationStatus === 'requesting' ? (
                <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
              {userLocation ? 'Update my location' : 'Use my current location'}
            </button>
            {locationStatus === 'denied' && (
              <p className="text-[10px] text-rose-500 max-w-[220px] text-right">
                Location access denied — showing distance from {selectedEstate.name} instead.
              </p>
            )}
            {locationStatus === 'unsupported' && (
              <p className="text-[10px] text-rose-500 max-w-[220px] text-right">
                Location isn't supported on this device/browser.
              </p>
            )}
          </div>
        </div>

        {/* Directory Filters */}
        <ArtisanFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          minRating={minRating}
          setMinRating={setMinRating}
        />
      </div>

      {/* Artisans Grid */}
      {filteredArtisans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map(artisan => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              onSelect={(art) => navigate(`/artisan/${art.id}`)}
              onBook={handleOpenBookingModal}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-artiva-lg text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-heading">No Artisans Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try loosening your search terms or toggling off the "Verified Only" filter to view additional artisans.
          </p>
          <Button variant="outline" size="sm" onClick={() => {
            setActiveCategory('all');
            setSearchQuery('');
            setOnlyVerified(false);
          }}>
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Booking Modal with Paystack Gateway */}
      {selectedArtisanForBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedArtisanForBooking(null)}
          title={`Book ${selectedArtisanForBooking.name}`}
        >
          <form onSubmit={handleConfirmBookingWithPaystack} className="space-y-4">
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-artiva border border-slate-200">
              <img
                src={selectedArtisanForBooking.photoUrl}
                alt={selectedArtisanForBooking.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-300"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm font-heading">{selectedArtisanForBooking.name}</h4>
                <p className="text-xs text-artiva-teal-dark font-medium">{selectedArtisanForBooking.categoryLabel}</p>
                <p className="text-[11px] text-slate-500">
                  {formatCurrency(selectedArtisanForBooking.hourlyRate)}/hr • {formatDistance(selectedArtisanForBooking.distanceKm)} away
                </p>
              </div>
            </div>

            {/* Pricing Structure */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 font-heading block">
                Select Pricing Model for this Job:
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
                    {formatCurrency(selectedArtisanForBooking.hourlyRate)}/hr estimated
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
                    {formatCurrency(selectedArtisanForBooking.inspectionFee || 3000)} diagnosis fee held
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
                    The artisan will visit your home at your scheduled date/time to inspect the work. You lock a small diagnosis fee ({formatCurrency(selectedArtisanForBooking.inspectionFee || 3000)}) in Paystack escrow. After inspecting, the artisan submits an official quote proposal for your approval.
                  </p>
                </div>
              )}
            </div>

            {/* Service Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Describe the Job / Work Required:
              </label>
              <textarea
                required
                rows={3}
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="e.g. Pressure pump leaking water near generator room, hidden dampness behind kitchen tiles..."
                className="w-full text-xs p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Preferred Date"
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
              <Input
                label="Preferred Time"
                type="text"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              />
            </div>

            {/* Paystack Escrow Summary */}
            <div className="p-3 bg-slate-900 text-white rounded-artiva flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Paystack Escrow Hold</span>
                <span className="font-extrabold text-sm text-amber-300 font-heading">
                  {pricingType === 'inspection_first'
                    ? formatCurrency(selectedArtisanForBooking.inspectionFee || 3000)
                    : formatCurrency(selectedArtisanForBooking.hourlyRate * estimatedHours)}
                </span>
              </div>

              <div className="text-right text-[10px] text-slate-300 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paystack Gateway</span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 rounded-artiva border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedArtisanForBooking(null)}>
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
