import React, { useState } from 'react';
import { Artisan } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, ShieldAlert, FileText, Check, X, Eye, Phone, MapPin, Calendar } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface VerificationReviewCardProps {
  artisan: Artisan;
  onVerify: (artisanId: string, status: 'verified' | 'rejected', reason?: string) => void;
}

export const VerificationReviewCard: React.FC<VerificationReviewCardProps> = ({
  artisan,
  onVerify,
}) => {
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  return (
    <Card className="border-l-4 border-l-artiva-gold">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Profile Info */}
        <div className="flex items-start gap-4">
          <img
            src={artisan.photoUrl}
            alt={artisan.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{artisan.name}</h3>
              <Badge status={artisan.verificationStatus} size="sm" />
            </div>
            <p className="text-xs text-artiva-teal-dark font-medium mt-0.5">{artisan.categoryLabel}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {artisan.estateName}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {artisan.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Submitted: {artisan.verificationSubmittedAt ? formatDate(artisan.verificationSubmittedAt) : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials & Actions */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          
          {/* Document Preview Trigger */}
          <button
            onClick={() => setShowDocModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-artiva bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4 text-artiva-teal" />
            <span>View NIN / Drivers License</span>
          </button>

          {artisan.verificationStatus === 'pending' && (
            <div className="flex items-center gap-2">
              {!isRejecting ? (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsRejecting(true)}
                    icon={<X className="w-4 h-4" />}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!artisan.idDocumentUrl}
                    onClick={() => onVerify(artisan.id, 'verified')}
                    icon={<Check className="w-4 h-4" />}
                  >
                    Approve Badge
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-artiva border border-rose-200">
                  <input
                    type="text"
                    placeholder="Reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="text-xs p-1.5 rounded border border-rose-300 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      onVerify(artisan.id, 'rejected', rejectionReason || 'Incomplete identity document');
                      setIsRejecting(false);
                    }}
                    className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {artisan.verificationStatus === 'verified' && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-artiva border border-emerald-200 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified & Active
            </span>
          )}

          {artisan.verificationStatus === 'rejected' && (
            <div className="text-right">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-artiva border border-rose-200 flex items-center justify-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Rejected
              </span>
              {artisan.rejectionReason && (
                <p className="text-[10px] text-rose-500 mt-1">{artisan.rejectionReason}</p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Identity Document Preview Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-artiva-lg p-6 max-w-lg w-full space-y-4 shadow-artiva-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-artiva-teal" />
                Submitted Identification Document ({artisan.name})
              </h3>
              <button onClick={() => setShowDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-artiva overflow-hidden bg-slate-50">
              {artisan.idDocumentUrl ? (
                <img
                  src={artisan.idDocumentUrl}
                  alt="ID Document"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400">
                  No identity document submitted yet.
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-artiva border border-slate-200">
              <p className="font-bold text-slate-800">Verification Checklist:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-600">
                <li>Government NIN / Driver's License matches profile name.</li>
                <li>Artisan resides within registered estate catchment area.</li>
                <li>No active unresolved fraud or theft complaints.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDocModal(false)}>
                Close Preview
              </Button>
              {artisan.verificationStatus === 'pending' && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!artisan.idDocumentUrl}
                  onClick={() => {
                    onVerify(artisan.id, 'verified');
                    setShowDocModal(false);
                  }}
                  icon={<Check className="w-4 h-4" />}
                >
                  Approve Verification
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
