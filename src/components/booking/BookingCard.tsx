import React, { useState } from 'react';
import { Booking, UserRole } from '../../types';
import { Card } from '../ui/Card';
import { StatusPill, EscrowBadge } from '../ui/StatusPill';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
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
  RotateCcw,
  Eye,
  FileText,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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
  const { submitQuoteProposal, approveQuoteProposal, rejectQuoteProposal } = useApp();
  
  // Custom Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [customQuoteInput, setCustomQuoteInput] = useState<string>('25000');
  const [quoteNotesInput, setQuoteNotesInput] = useState<string>('Includes replacement parts, pipe fittings, and 3 hours labor.');

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customQuoteInput);
    if (!val || val <= 0) return;
    submitQuoteProposal(booking.id, val, quoteNotesInput);
    setIsQuoteModalOpen(false);
  };

  return (
    <Card className="space-y-4 hover-lift">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400">#{booking.id}</span>
          <StatusPill status={booking.status} />
          <EscrowBadge status={booking.escrowStatus} />
          {booking.pricingType === 'inspection_first' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Eye className="w-3 h-3 text-purple-600" /> On-Site Inspection
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          Booked: {formatDate(booking.createdAt)}
        </span>
      </div>

      {/* Main Details Grid (Responsive) */}
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

          {/* Display Custom Quote Proposal Card if status is quote_pending */}
          {booking.status === 'quote_pending' && booking.customQuoteAmount && (
            <div className="p-3 bg-purple-50 rounded-artiva border border-purple-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-purple-900">
                <span className="flex items-center gap-1.5 font-heading">
                  <FileText className="w-4 h-4 text-purple-700" />
                  Artisan Official Quote Proposal
                </span>
                <span className="text-sm font-extrabold text-purple-800 font-heading">
                  {formatCurrency(booking.customQuoteAmount)}
                </span>
              </div>
              {booking.quoteNotes && (
                <p className="text-[11px] text-purple-800 italic">
                  Note: "{booking.quoteNotes}"
                </p>
              )}
            </div>
          )}
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
          
          {/* Artisan On-Site Inspection Quote Action */}
          {currentRole === 'artisan' && booking.status === 'inspection_requested' && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => setIsQuoteModalOpen(true)}
              icon={<Eye className="w-3.5 h-3.5 text-slate-900" />}
            >
              Submit On-Site Inspection Quote Proposal
            </Button>
          )}

          {/* Resident Custom Quote Approval Action */}
          {currentRole === 'resident' && booking.status === 'quote_pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => rejectQuoteProposal(booking.id)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Reject Quote
              </Button>

              <Button
                variant="gold"
                size="sm"
                onClick={() => approveQuoteProposal(booking.id)}
                icon={<CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />}
              >
                Approve Quote ({formatCurrency(booking.customQuoteAmount || 0)}) & Lock Escrow
              </Button>
            </>
          )}

          {/* Artisan Standard Controls */}
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

          {/* Resident Dual Confirmation Controls */}
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

      {/* Modal for Artisan to submit custom price quote after on-site inspection */}
      {isQuoteModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsQuoteModalOpen(false)}
          title="Submit Official Price Quote Proposal"
        >
          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <p className="text-xs text-slate-600">
              Enter your diagnosed total price quote for materials and labor for <strong className="text-slate-900">{booking.residentName}</strong>.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Proposed Total Amount (₦):
              </label>
              <input
                type="number"
                required
                min={1000}
                value={customQuoteInput}
                onChange={(e) => setCustomQuoteInput(e.target.value)}
                className="w-full text-sm font-bold p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Breakdown Notes for Resident:
              </label>
              <textarea
                rows={3}
                required
                value={quoteNotesInput}
                onChange={(e) => setQuoteNotesInput(e.target.value)}
                className="w-full text-xs p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsQuoteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="md" icon={<FileText className="w-4 h-4 text-slate-900" />}>
                Send Official Quote to Resident
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </Card>
  );
};
