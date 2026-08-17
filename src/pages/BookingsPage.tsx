import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { BookingCard } from '../components/booking/BookingCard';
import { DisputeModal } from '../components/dispute/DisputeModal';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';
import { 
  Calendar, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const {
    bookings,
    currentRole,
    userSession,
    acceptBooking,
    declineBooking,
    startJob,
    completeJobByArtisan,
    confirmJobByResident,
    createDispute
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed' | 'disputed'>('all');
  const [selectedDisputeBooking, setSelectedDisputeBooking] = useState<Booking | null>(null);

  // Residents and artisans only see bookings that involve them. Admins get
  // oversight visibility across the whole platform.
  const myBookings = bookings.filter((b) => {
    if (currentRole === 'resident') return b.residentId === userSession?.id;
    if (currentRole === 'artisan') return b.artisanId === userSession?.id;
    return true;
  });

  const filteredBookings = myBookings.filter((b) => {
    if (filterTab === 'active') return b.status === 'requested' || b.status === 'accepted' || b.status === 'in_progress';
    if (filterTab === 'completed') return b.status === 'completed' || b.status === 'confirmed' || b.status === 'paid_out';
    if (filterTab === 'disputed') return b.status === 'disputed';
    return true;
  });

  const totalEscrowHeld = myBookings
    .filter(b => b.escrowStatus === 'held')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalEscrowPaid = myBookings
    .filter(b => b.escrowStatus === 'released')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Bookings & Escrow Vault Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track service requests, dual completion confirmations, and escrow payment releases.
          </p>
        </div>

        {/* Escrow Balance Metrics */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-artiva text-right">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Escrow Secured</span>
            <span className="text-sm font-extrabold text-amber-900">{formatCurrency(totalEscrowHeld)}</span>
          </div>

          <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-artiva text-right">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Released Payouts</span>
            <span className="text-sm font-extrabold text-emerald-900">{formatCurrency(totalEscrowPaid)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
            filterTab === 'all'
              ? 'bg-artiva-teal text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Bookings ({myBookings.length})
        </button>

        <button
          onClick={() => setFilterTab('active')}
          className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
            filterTab === 'active'
              ? 'bg-artiva-teal text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Active / In Progress
        </button>

        <button
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
            filterTab === 'completed'
              ? 'bg-artiva-teal text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Completed & Paid Out
        </button>

        <button
          onClick={() => setFilterTab('disputed')}
          className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
            filterTab === 'disputed'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Disputed
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentRole={currentRole}
              onAccept={acceptBooking}
              onDecline={declineBooking}
              onStartJob={startJob}
              onCompleteJob={completeJobByArtisan}
              onConfirmJob={confirmJobByResident}
              onRaiseDispute={(b) => setSelectedDisputeBooking(b)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-artiva-lg p-12 text-center border border-slate-200 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No bookings in this tab</h3>
          <p className="text-xs text-slate-500">Bookings placed in the directory will appear here with live escrow tracking.</p>
        </div>
      )}

      {/* Dispute Modal */}
      {selectedDisputeBooking && (
        <DisputeModal
          booking={selectedDisputeBooking}
          isOpen={Boolean(selectedDisputeBooking)}
          onClose={() => setSelectedDisputeBooking(null)}
          onSubmitDispute={(bookingId, reason, desc, photo) => {
            createDispute(bookingId, reason, desc, photo);
            setSelectedDisputeBooking(null);
          }}
        />
      )}

    </div>
  );
};
