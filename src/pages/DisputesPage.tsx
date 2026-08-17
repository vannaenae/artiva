import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';
import { AlertCircle, ShieldAlert, CheckCircle2, FileText, User, RefreshCw, Lock } from 'lucide-react';

export const DisputesPage: React.FC = () => {
  const { disputes, resolveDispute, currentRole } = useApp();
  const [resolutionSummary, setResolutionSummary] = useState<string>('');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-rose-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            Dispute & Trust Layer Dashboard
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          When a dispute is raised on any booking, escrow funds are frozen until investigation & resolution.
        </p>
      </div>

      {/* Disputes List */}
      {disputes.length > 0 ? (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="space-y-4 border-l-4 border-l-rose-500">
              
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">#{dispute.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {dispute.status === 'under_review' ? 'Under Review' : dispute.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Raised by: <span className="font-bold text-slate-800 uppercase">{dispute.raisedByRole}</span>
                  </span>
                </div>
                <span className="text-xs text-slate-400">Raised: {formatDate(dispute.createdAt)}</span>
              </div>

              {/* Main content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    Reason: <span className="text-rose-700">{dispute.reason}</span>
                  </h4>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Resident: <strong className="text-slate-800">{dispute.residentName}</strong></span>
                    <span>Artisan: <strong className="text-slate-800">{dispute.artisanName}</strong></span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-artiva border border-slate-200">
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      "{dispute.description}"
                    </p>
                  </div>

                  {dispute.resolutionSummary && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-artiva text-xs text-emerald-900">
                      <p className="font-bold">Resolution Summary:</p>
                      <p className="mt-0.5 text-emerald-800">{dispute.resolutionSummary}</p>
                    </div>
                  )}
                </div>

                {/* Evidence Photo Preview */}
                {dispute.evidencePhotoUrl && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Attached Photo Evidence</span>
                    <img
                      src={dispute.evidencePhotoUrl}
                      alt="Dispute Evidence"
                      className="w-full h-32 object-cover rounded-artiva border border-slate-200"
                    />
                  </div>
                )}

              </div>

              {/* Resolution Controls for Admin or Parties */}
              {dispute.status !== 'resolved' && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  {selectedDisputeId !== dispute.id ? (
                    <div className="flex justify-end">
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => setSelectedDisputeId(dispute.id)}
                        icon={<Lock className="w-3.5 h-3.5 text-slate-900" />}
                      >
                        Resolve Dispute & Unfreeze Escrow
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-artiva border border-slate-200 space-y-3">
                      <h5 className="text-xs font-bold text-slate-900">Dispute Resolution Outcome</h5>
                      
                      <input
                        type="text"
                        placeholder="Resolution summary (e.g. 50% partial refund agreed, or full re-service authorized)..."
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-artiva border border-slate-300 focus:outline-none"
                      />

                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDisputeId(null)}
                        >
                          Cancel
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            resolveDispute(
                              dispute.id,
                              resolutionSummary || 'Refund issued to resident.',
                              'refund_to_resident'
                            );
                            setSelectedDisputeId(null);
                          }}
                        >
                          Refund Escrow to Resident
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            resolveDispute(
                              dispute.id,
                              resolutionSummary || 'Full payout released to artisan.',
                              'release_to_artisan'
                            );
                            setSelectedDisputeId(null);
                          }}
                        >
                          Release Escrow to Artisan
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-artiva-lg p-12 text-center border border-slate-200 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No active disputes</h3>
          <p className="text-xs text-slate-500">All estate bookings are proceeding smoothly with 100% mutual completion confirmation.</p>
        </div>
      )}

    </div>
  );
};
