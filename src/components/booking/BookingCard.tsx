import React from 'react';
import { Booking, UserRole } from '../../types';
import { Card } from '../ui/Card';
import { StatusPill, EscrowBadge } from '../ui/StatusPill';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Phone,
  RotateCcw
} from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  currentRole: UserRole;
  onAccept?: (bookingId: string) => void;
  onDecline?: (bookingId: string) => void;
  onStartJob?: (bookingId: string) => void;
  onCompleteJob?: (bookingId: string) => void;
  onConfirmJob?: (bookingId: string) => void;
  onRaiseDispute?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currentRole,
  onAccept,
  onDecline,
  onStartJob,
  onCompleteJob,
  onConfirmJob,
  onRaiseDispute,
}) => {
  return (
    <Card className="space-y-4 hover-lift">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400">#{booking.id}</span>
          <StatusPill status={booking.status} />
          <EscrowBadge status={booking.escrowStatus} />
        </div>
        <span className="text-xs text-slate-400">
          Booked: {formatDate(booking.createdAt)}
        </span>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Artisan / Resident Info */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-3">
            <img
              src={booking.artisanPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
              alt={booking.artisanName}
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm font-heading">{booking.artisanName}</h4>
              <p className="text-xs text-artiva-teal-dark font-medium">{booking.artisanCategory}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Resident: {booking.residentName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {booking.residentEstate}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-artiva border border-slate-200/80">
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              "{booking.serviceDescription}"
            </p>
          </div>
        </div>

        {/* Schedule & Escrow Amount Box */}
        <div className="bg-artiva-teal-light/40 p-4 rounded-artiva border border-artiva-teal/20 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-artiva-teal-dark">Scheduled Visit</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mt-1 font-heading">
              <Calendar className="w-4 h-4 text-artiva-teal" />
              <span>{booking.preferredDate} at {booking.preferredTime}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-artiva-teal/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Escrow Total:</span>
              <span className="text-base font-extrabold text-artiva-teal-dark font-heading">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
              {booking.escrowStatus === 'held' && (
                <>
                  <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Held securely in Artiva Escrow</span>
                </>
              )}
              {booking.escrowStatus === 'released' && (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Released to Artisan</span>
                </>
              )}
              {booking.escrowStatus === 'disputed' && (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>Frozen due to active dispute</span>
                </>
              )}
              {booking.escrowStatus === 'refunded' && (
                <>
                  <RotateCcw className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>Refunded to Resident</span>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Dual Confirmation Progress Bar */}
      {(booking.status === 'in_progress' || booking.status === 'completed' || booking.status === 'confirmed' || booking.status === 'paid_out') && (
        <div className="p-3 bg-slate-50 rounded-artiva border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 font-heading">Dual Completion Confirmation Tracker</span>
            <span className="font-semibold text-artiva-teal">
              {booking.escrowStatus === 'released' ? '100% (Escrow Released)' : booking.status === 'completed' ? '50% (Awaiting Resident)' : '25% (In Progress)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded border flex items-center justify-between ${booking.artisanConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200 text-slate-500'}`}>
              <span>1. Artisan Done</span>
              {booking.artisanConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
            </div>

            <div className={`p-2 rounded border flex items-center justify-between ${booking.residentConfirmed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' : 'bg-white border-slate-200 text-slate-500'}`}>
              <span>2. Resident Confirmed</span>
              {booking.residentConfirmed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons based on Role & State Machine */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>Contact {currentRole === 'resident' ? booking.artisanName : booking.residentName}:</span>
          <span className="font-mono font-bold text-slate-800">{booking.residentPhone}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Artisan Controls */}
          {currentRole === 'artisan' && booking.status === 'requested' && onAccept && onDecline && (
            <>
              <Button variant="outline" size="sm" onClick={() => onDecline(booking.id)}>
                Decline Request
              </Button>
              <Button variant="primary" size="sm" onClick={() => onAccept(booking.id)} icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Accept Booking
              </Button>
            </>
          )}

          {currentRole === 'artisan' && booking.status === 'accepted' && onStartJob && (
            <Button variant="primary" size="sm" onClick={() => onStartJob(booking.id)} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Start Job (Mark In Progress)
            </Button>
          )}

          {currentRole === 'artisan' && booking.status === 'in_progress' && onCompleteJob && !booking.artisanConfirmed && (
            <Button variant="gold" size="sm" onClick={() => onCompleteJob(booking.id)} icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Mark Job Completed
            </Button>
          )}

          {/* Resident Controls */}
          {currentRole === 'resident' && (booking.status === 'completed' || (booking.status === 'in_progress' && booking.artisanConfirmed)) && onConfirmJob && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onConfirmJob(booking.id)}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-slate-900" />}
            >
              Confirm Completion & Release Escrow ({formatCurrency(booking.totalAmount)})
            </Button>
          )}

          {/* Dispute Action Button */}
          {(booking.status === 'in_progress' || booking.status === 'completed' || booking.status === 'accepted') && onRaiseDispute && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRaiseDispute(booking)}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
              icon={<AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
            >
              Raise Dispute
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
