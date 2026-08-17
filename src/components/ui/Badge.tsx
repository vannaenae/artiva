import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, Shield } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface BadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  size = 'md',
  showText = true,
}) => {
  const config = {
    verified: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-badge-pulse" />,
      label: 'Verified Artisan',
    },
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      label: 'Verification Pending',
    },
    rejected: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
      label: 'Verification Rejected',
    },
    unverified: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Shield className="w-3.5 h-3.5 text-slate-400" />,
      label: 'Unverified',
    },
  };

  const current = config[status] || config.unverified;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-artiva-pill border ${current.bg} ${sizeClasses[size]}`}
    >
      {current.icon}
      {showText && <span>{current.label}</span>}
    </span>
  );
};
