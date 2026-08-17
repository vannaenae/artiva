import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { formatCurrency, formatDistance, haversineKm } from '../lib/utils';
import {
  Calendar,
  AlertCircle,
  Search,
  Briefcase,
  Award,
  ArrowRight,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

const StatTile: React.FC<{ label: string; value: string; tone: 'teal' | 'amber' | 'emerald' | 'rose' }> = ({ label, value, tone }) => {
  const toneClasses: Record<string, string> = {
    teal: 'text-artiva-teal-dark',
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
  };
  return (
    <div className="bg-white p-4 rounded-artiva border border-slate-200 shadow-artiva-sm space-y-1">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <p className={`text-xl font-extrabold ${toneClasses[tone]}`}>{value}</p>
    </div>
  );
};

const ResidentDashboard: React.FC = () => {
  const { userSession, bookings, disputes, artisans, selectedEstate, userLocation, navigate } = useApp();

  const myBookings = useMemo(() => bookings.filter(b => b.residentId === userSession?.id), [bookings, userSession]);
  const activeBookings = myBookings.filter(b => b.status !== 'paid_out' && b.status !== 'declined');
  const escrowHeld = myBookings.filter(b => b.escrowStatus === 'held').reduce((sum, b) => sum + b.totalAmount, 0);
  const openDisputes = disputes.filter(d => d.residentId === userSession?.id && d.status !== 'resolved');

  const distanceOrigin = userLocation || selectedEstate;
  const nearbyArtisans = useMemo(() => {
    return artisans
      .filter(a => a.verificationStatus === 'verified')
      .map(a => ({ ...a, distanceKm: haversineKm(distanceOrigin.lat, distanceOrigin.lng, a.lat, a.lng) }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }, [artisans, distanceOrigin]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Active Bookings" value={String(activeBookings.length)} tone="teal" />
        <StatTile label="Escrow Held" value={formatCurrency(escrowHeld)} tone="amber" />
        <StatTile label="Open Disputes" value={String(openDisputes.length)} tone="rose" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/directory')} icon={<Search className="w-4 h-4" />}>
          Browse Verified Artisans
        </Button>
        <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/bookings')} icon={<Calendar className="w-4 h-4" />}>
          View My Bookings ({myBookings.length})
        </Button>
      </div>

      {/* Recent Bookings */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 font-heading">Recent Bookings</h2>
        {myBookings.length === 0 ? (
          <Card className="text-center text-xs text-slate-500 py-8">
            No bookings yet. Browse the directory to book your first verified artisan.
          </Card>
        ) : (
          <div className="space-y-2">
            {myBookings.slice(0, 3).map(b => (
              <Card
                key={b.id}
                hoverable
                onClick={() => navigate(`/bookings/${b.id}`)}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{b.artisanName} • {b.artisanCategory}</p>
                  <p className="text-[11px] text-slate-500 truncate">{b.serviceDescription}</p>
                </div>
                <span className="text-xs font-bold text-artiva-teal-dark shrink-0">{formatCurrency(b.totalAmount)}</span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Artisans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-artiva-teal" /> Nearest Verified Artisans
          </h2>
          <button onClick={() => navigate('/directory')} className="text-xs font-bold text-artiva-teal hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {nearbyArtisans.length === 0 ? (
          <Card className="text-center text-xs text-slate-500 py-8">
            No verified artisans nearby yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nearbyArtisans.map(a => (
              <Card key={a.id} hoverable onClick={() => navigate(`/artisan/${a.id}`)} className="space-y-2">
                <div className="flex items-center gap-2">
                  <img src={a.photoUrl} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{a.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{a.categoryLabel}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <RatingStars rating={a.rating} size="sm" />
                  <span className="font-bold text-artiva-teal-dark">{formatDistance(a.distanceKm)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ArtisanDashboardHome: React.FC = () => {
  const { userSession, bookings, artisans, navigate } = useApp();
  const currentArtisan = artisans.find(a => a.id === userSession?.id);
  const myBookings = bookings.filter(b => b.artisanId === userSession?.id);
  const pendingRequests = myBookings.filter(b => b.status === 'requested');
  const activeJobs = myBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress' || b.status === 'completed');
  const escrowHeld = myBookings.filter(b => b.escrowStatus === 'held').reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {currentArtisan && currentArtisan.verificationStatus !== 'verified' && (
        <Card className="border-amber-200 bg-amber-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Get verified to start receiving estate job requests.</span>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate('/verification')}>Complete Verification</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Pending Requests" value={String(pendingRequests.length)} tone="amber" />
        <StatTile label="Active Jobs" value={String(activeJobs.length)} tone="teal" />
        <StatTile label="Escrow Held" value={formatCurrency(escrowHeld)} tone="emerald" />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/artisan-dashboard')} icon={<Briefcase className="w-4 h-4" />}>
        Open Job Dashboard
      </Button>
    </div>
  );
};

const AdminDashboardHome: React.FC = () => {
  const { artisans, disputes, navigate } = useApp();
  const pendingVerifications = artisans.filter(a => a.verificationStatus === 'pending').length;
  const openDisputes = disputes.filter(d => d.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatTile label="Pending Verifications" value={String(pendingVerifications)} tone="amber" />
        <StatTile label="Open Disputes" value={String(openDisputes)} tone="rose" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/admin/verifications')} icon={<ShieldCheck className="w-4 h-4" />}>
          Verification Review Panel
        </Button>
        <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/disputes')} icon={<AlertCircle className="w-4 h-4" />}>
          Dispute Resolution Portal
        </Button>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { userSession, currentRole } = useApp();

  if (!userSession) return null;

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-artiva-teal-light text-artiva-teal-dark flex items-center justify-center font-bold text-lg font-heading shrink-0">
          {userSession.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Welcome back, {userSession.name}</h1>
          <p className="text-xs text-slate-500">{userSession.estateName || 'Artiva'} • {currentRole} account</p>
        </div>
      </div>

      {currentRole === 'resident' && <ResidentDashboard />}
      {currentRole === 'artisan' && <ArtisanDashboardHome />}
      {currentRole === 'admin' && <AdminDashboardHome />}
    </div>
  );
};
