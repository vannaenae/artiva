import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Dispute } from '../types';
import { formatDate } from '../lib/utils';
import { 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  UserCheck, 
  FileText, 
  Lock, 
  MessageSquare, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const DisputesPage: React.FC = () => {
  const { disputes, currentRole, userSession, resolveDispute, submitDisputeCounterStatement, navigate } = useApp();

  // Residents and artisans only see disputes they're party to. Admins get
  // full oversight to adjudicate.
  const myDisputes = disputes.filter((d) => {
    if (currentRole === 'resident') return d.residentId === userSession?.id;
    if (currentRole === 'artisan') return d.artisanId === userSession?.id;
    return true;
  });

  // Counter-Statement Modal State
  const [selectedDisputeForCounter, setSelectedDisputeForCounter] = useState<Dispute | null>(null);
  const [counterInput, setCounterInput] = useState<string>('');

  // Admin Resolution Modal State
  const [selectedDisputeForResolution, setSelectedDisputeForResolution] = useState<Dispute | null>(null);
  const [resolutionNote, setResolutionNote] = useState<string>('');

  const handleOpenCounterModal = (dispute: Dispute) => {
    setSelectedDisputeForCounter(dispute);
    setCounterInput('');
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeForCounter || !counterInput.trim()) return;

    submitDisputeCounterStatement(selectedDisputeForCounter.id, counterInput);
    setSelectedDisputeForCounter(null);
  };

  const handleResolve = (outcome: 'release_to_artisan' | 'refund_to_resident') => {
    if (!selectedDisputeForResolution) return;
    resolveDispute(selectedDisputeForResolution.id, resolutionNote || 'Adjudicated by Admin after examining both sides of the story.', outcome);
    setSelectedDisputeForResolution(null);
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-rose-600 shrink-0" />
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Escrow Dispute Resolution Portal
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Both sides of the story are required before any escrow fund release decision is rendered.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 px-3.5 py-2 rounded-artiva border border-rose-200 text-xs font-bold text-rose-800 shrink-0">
            <Lock className="w-4 h-4 text-rose-600" />
            <span>Escrow Frozen During Dispute</span>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {myDisputes.length > 0 ? (
        <div className="space-y-6">
          {myDisputes.map(dispute => {
            const isWaitingForCounter = dispute.status === 'awaiting_counter_statement';
            const isReadyForAdmin = dispute.status === 'under_review';
            const isResolved = dispute.status === 'resolved';

            return (
              <Card key={dispute.id} className="space-y-6 hover-lift border-2 border-slate-200">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{dispute.id}</span>
                    <span className="font-mono text-xs text-slate-500 font-semibold">Booking #{dispute.bookingId}</span>
                    {isWaitingForCounter && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Awaiting Counter-Statement
                      </span>
                    )}
                    {isReadyForAdmin && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-purple-600" /> Both Sides Submitted — Ready for Admin
                      </span>
                    )}
                    {isResolved && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dispute Resolved
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">Raised on: {formatDate(dispute.createdAt)}</span>
                </div>

                {/* BOTH SIDES OF THE STORY SIDE-BY-SIDE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* SIDE 1: Initial Claim */}
                  <div className="p-4 bg-slate-50 rounded-artiva border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5">
                        <User className="w-4 h-4 text-artiva-teal" />
                        1. {dispute.raisedByRole === 'resident' ? 'Resident Claim' : 'Artisan Claim'} ({dispute.residentName})
                      </span>
                      <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {dispute.reason}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-3 rounded border border-slate-200">
                      "{dispute.description}"
                    </p>

                    {dispute.evidencePhotoUrl && (
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Claim Evidence Photo:</span>
                        <img
                          src={dispute.evidencePhotoUrl}
                          alt="Dispute evidence"
                          className="w-full h-32 object-cover rounded-artiva border border-slate-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* SIDE 2: Counter-Statement */}
                  <div className="p-4 bg-purple-50/50 rounded-artiva border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 font-heading flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-purple-700" />
                        2. {dispute.raisedByRole === 'resident' ? 'Artisan Counter-Statement' : 'Resident Counter-Statement'} ({dispute.artisanName})
                      </span>
                      {dispute.counterStatement && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Submitted
                        </span>
                      )}
                    </div>

                    {dispute.counterStatement ? (
                      <p className="text-xs text-purple-900 leading-relaxed font-normal bg-white p-3 rounded border border-purple-200">
                        "{dispute.counterStatement}"
                      </p>
                    ) : (
                      <div className="p-6 text-center bg-white rounded border border-dashed border-purple-300 space-y-2">
                        <Clock className="w-6 h-6 text-purple-400 mx-auto" />
                        <p className="text-xs text-purple-800 font-semibold">Counter-Statement Pending</p>
                        <p className="text-[11px] text-purple-600">
                          The opposing party ({dispute.raisedByRole === 'resident' ? dispute.artisanName : dispute.residentName}) must state their side of the story before decision.
                        </p>
                      </div>
                    )}

                    {dispute.counterEvidencePhotoUrl && (
                      <div>
                        <span className="text-[10px] text-purple-600 font-bold uppercase block mb-1">Counter Evidence Photo:</span>
                        <img
                          src={dispute.counterEvidencePhotoUrl}
                          alt="Counter evidence"
                          className="w-full h-32 object-cover rounded-artiva border border-purple-200"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {/* Resolution Summary Banner if Resolved */}
                {dispute.resolutionSummary && (
                  <div className="p-4 bg-emerald-50 rounded-artiva border border-emerald-200 space-y-1">
                    <h4 className="text-xs font-bold text-emerald-900 font-heading flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Official Admin Verdict & Settlement
                    </h4>
                    <p className="text-xs text-emerald-800 font-medium">{dispute.resolutionSummary}</p>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Artisan: <strong className="text-slate-800">{dispute.artisanName}</strong> • Resident: <strong className="text-slate-800">{dispute.residentName}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    
                    {/* Counter Statement Action Button */}
                    {!dispute.counterStatement && (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleOpenCounterModal(dispute)}
                        icon={<MessageSquare className="w-4 h-4 text-slate-900" />}
                      >
                        Submit Counter-Statement (State Your Side)
                      </Button>
                    )}

                    {/* Admin Resolution Button */}
                    {currentRole === 'admin' && !dispute.resolutionSummary && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedDisputeForResolution(dispute)}
                        icon={<Scale className="w-4 h-4" />}
                      >
                        Review Both Sides & Render Verdict
                      </Button>
                    )}
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-artiva-lg text-center border border-slate-200 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-heading">No Active Disputes</h3>
          <p className="text-xs text-slate-500">All estate bookings are operating smoothly without open disputes.</p>
        </div>
      )}

      {/* Modal for Submitting Counter-Statement */}
      {selectedDisputeForCounter && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDisputeForCounter(null)}
          title="Submit Your Side of the Story"
        >
          <form onSubmit={handleSubmitCounter} className="space-y-4">
            <p className="text-xs text-slate-600">
              Dispute raised by <strong className="text-slate-900">{selectedDisputeForCounter.residentName}</strong> regarding: "{selectedDisputeForCounter.reason}".
            </p>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1 font-heading">Their Claim:</span>
              <p className="text-slate-600 italic">"{selectedDisputeForCounter.description}"</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Your Counter-Statement & Work Explanation:
              </label>
              <textarea
                required
                rows={4}
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                placeholder="Explain what happened during the job, materials used, advice provided to resident..."
                className="w-full text-xs p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedDisputeForCounter(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="md" icon={<MessageSquare className="w-4 h-4 text-slate-900" />}>
                Submit Counter-Statement to Admin
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for Admin Decision */}
      {selectedDisputeForResolution && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDisputeForResolution(null)}
          title="Admin Verdict: Resolve Dispute"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Reviewing dispute for Booking <strong className="text-slate-900">#{selectedDisputeForResolution.bookingId}</strong>. Both sides of the story have been recorded.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 font-heading">
                Admin Adjudication Reasoning:
              </label>
              <textarea
                rows={3}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Enter formal verdict summary..."
                className="w-full text-xs p-3 rounded-artiva border border-slate-300 focus:ring-2 focus:ring-artiva-teal outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleResolve('release_to_artisan')}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Release Escrow to Artisan ({selectedDisputeForResolution.artisanName})
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleResolve('refund_to_resident')}
                className="text-rose-600 border-rose-300 hover:bg-rose-50"
                icon={<AlertCircle className="w-4 h-4 text-rose-600" />}
              >
                Refund Escrow to Resident ({selectedDisputeForResolution.residentName})
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
