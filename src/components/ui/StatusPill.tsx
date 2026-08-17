import React from 'react';
import { BookingStatus, EscrowStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, Lock, DollarSign, XCircle, RotateCcw, Eye, FileText, PlusCircle } from 'lucide-react';

interface StatusPillProps {
  status: BookingStatus;
  type?: 'booking' | 'escrow';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const styles: Record<BookingStatus, { bg: string; text: string; border: string; icon: React.ReactNode; label: string }> = {
    inspection_requested: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Eye className="w-3.5 h-3.5" />,
      label: 'On-Site Inspection Requested',
    },
    quote_pending: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <FileText className="w-3.5 h-3.5" />,
      label: 'Price Quote Pending Approval',
    },
    supplemental_quote_pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <PlusCircle className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Mid-Job Escrow Top-Up Requested',
    },
    requested: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Booking Requested',
    },
    accepted: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: 'Accepted by Artisan',
    },
    declined: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: 'Declined',
    },
    in_progress: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />,
      label: 'Job In Progress',
    },
    completed: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />,
      label: 'Awaiting Dual Confirmation',
    },
    confirmed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: 'Job Confirmed',
    },
    paid_out: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <DollarSign className="w-3.5 h-3.5" />,
      label: 'Escrow Released & Paid',
    },
    disputed: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: 'Dispute Raised',
    },
  };

  const curr = styles[status] || styles.requested;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${curr.bg} ${curr.text} ${curr.border}`}>
      {curr.icon}
      <span>{curr.label}</span>
    </span>
  );
};

export const EscrowBadge: React.FC<{ status: EscrowStatus }> = ({ status }) => {
  const styles: Record<EscrowStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    held: {
      bg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      text: 'text-amber-700',
      icon: <Lock className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Escrow Secured',
    },
    released: {
      bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      text: 'text-emerald-700',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      label: 'Escrow Paid Out',
    },
    disputed: {
      bg: 'bg-rose-500/10 text-rose-700 border-rose-200',
      text: 'text-rose-700',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Escrow Frozen (Dispute)',
    },
    refunded: {
      bg: 'bg-slate-500/10 text-slate-700 border-slate-200',
      text: 'text-slate-700',
      icon: <RotateCcw className="w-3.5 h-3.5 text-slate-600" />,
      label: 'Escrow Refunded',
    },
  };

  const curr = styles[status] || styles.held;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${curr.bg}`}>
      {curr.icon}
      <span>{curr.label}</span>
    </span>
  );
};
