import React from 'react';
import { useApp } from '../context/AppContext';
import { BookingCard } from '../components/booking/BookingCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  AlertCircle,
  PhoneCall
} from 'lucide-react';

export const ArtisanDashboardPage: React.FC = () => {
  const {
    artisans,
    bookings,
    userSession,
    navigate,
    acceptBooking,
    declineBooking,
    startJob,
    completeJobByArtisan,
    confirmJobByResident
  } = useApp();

  const currentArtisan = artisans.find(a => a.id === userSession?.id);

  if (!currentArtisan) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">No Artisan Profile Yet</h2>
        <p className="text-xs text-slate-500">Sign in as an artisan and submit your verification application to see your dashboard here.</p>
        <Button variant="primary" size="md" onClick={() => navigate(userSession ? '/verification' : '/login')}>
          {userSession ? 'Complete Verification' : 'Sign In'}
        </Button>
      </div>
    );
  }

  const artisanBookings = bookings.filter(b => b.artisanId === currentArtisan.id || b.artisanName === currentArtisan.name);
  const pendingRequests = artisanBookings.filter(b => b.status === 'requested');
  const activeJobs = artisanBookings.filter(b => b.status === 'accepted' || b.status === 'in_progress' || b.status === 'completed');
  const completedJobs = artisanBookings.filter(b => b.status === 'confirmed' || b.status === 'paid_out');

  const totalEarningsHeld = artisanBookings
    .filter(b => b.escrowStatus === 'held')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalEarningsPaid = artisanBookings
    .filter(b => b.escrowStatus === 'released')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Artisan Profile Banner */}
      <div className="bg-gradient-to-r from-artiva-teal-dark via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-artiva-lg shadow-artiva-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentArtisan.photoUrl}
            alt={currentArtisan.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading">{currentArtisan.name}</h1>
              <Badge status={currentArtisan.verificationStatus} />
            </div>
            <p className="text-xs text-artiva-teal-light font-medium">{currentArtisan.categoryLabel} • {currentArtisan.estateName}</p>
            <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
              <span>⭐ {currentArtisan.rating} Rating</span>
              <span>• {currentArtisan.completedJobsCount} Jobs Completed</span>
              <span>• {formatCurrency(currentArtisan.hourlyRate)}/hr Rate</span>
            </div>
          </div>
        </div>

        {/* Verification Callout */}
        {currentArtisan.verificationStatus !== 'verified' && (
          <div className="bg-amber-500/20 border border-amber-400/30 p-3 rounded-artiva text-xs space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Identity Verification Required
            </p>
            <p className="text-slate-300">Submit your NIN or Driver's License to receive the Verified Artisan Badge and get 3x more bookings.</p>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-artiva border border-slate-200 shadow-artiva-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Escrow Pending (In Work)</span>
          <p className="text-xl font-extrabold text-amber-600">{formatCurrency(totalEarningsHeld)}</p>
          <p className="text-[10px] text-slate-500">Released upon resident job confirmation</p>
        </div>

        <div className="bg-white p-4 rounded-artiva border border-slate-200 shadow-artiva-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Paid Out</span>
          <p className="text-xl font-extrabold text-emerald-600">{formatCurrency(totalEarningsPaid)}</p>
          <p className="text-[10px] text-slate-500">Directly transferred to bank account</p>
        </div>

        <div className="bg-white p-4 rounded-artiva border border-slate-200 shadow-artiva-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Job Requests</span>
          <p className="text-xl font-extrabold text-artiva-teal-dark">{pendingRequests.length + activeJobs.length}</p>
          <p className="text-[10px] text-slate-500">Requires your response or action</p>
        </div>
      </div>

      {/* Incoming Booking Requests */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-artiva-teal" />
          Incoming Job Requests ({pendingRequests.length})
        </h2>

        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                currentRole="artisan"
                onAccept={acceptBooking}
                onDecline={declineBooking}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-artiva p-6 text-center border border-slate-200 text-xs text-slate-500">
            No pending booking requests right now. New estate requests will notify you instantly via phone SMS.
          </div>
        )}
      </div>

      {/* Active Jobs Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Clock className="w-5 h-5 text-artiva-teal" />
          Active Jobs In Progress ({activeJobs.length})
        </h2>

        {activeJobs.length > 0 ? (
          <div className="space-y-4">
            {activeJobs.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                currentRole="artisan"
                onStartJob={startJob}
                onCompleteJob={completeJobByArtisan}
                onConfirmJob={confirmJobByResident}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-artiva p-6 text-center border border-slate-200 text-xs text-slate-500">
            No active jobs currently in progress.
          </div>
        )}
      </div>

    </div>
  );
};
