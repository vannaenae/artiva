import React, { useState } from 'react';
import { Booking } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { AlertCircle, Upload, Image, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface DisputeModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitDispute: (bookingId: string, reason: string, description: string, evidencePhotoUrl?: string) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSubmitDispute,
}) => {
  const [reason, setReason] = useState<string>('Incomplete Service');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80');
  const [error, setError] = useState<string>('');

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 10) {
      setError('Please provide a detailed description of the issue (at least 10 characters).');
      return;
    }

    onSubmitDispute(booking.id, reason, description, photoUrl);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Raise Booking Dispute"
      subtitle="Artiva Trust & Security Layer — Escrow Freeze Guarantee"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Frozen Escrow Warning */}
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-artiva flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <p className="font-bold">Escrow Freeze Active</p>
            <p className="mt-0.5 text-rose-700">
              Submitting this dispute will immediately freeze the <span className="font-bold">{formatCurrency(booking.totalAmount)}</span> held in escrow for booking <span className="font-mono font-bold">#{booking.id}</span> until admin review.
            </p>
          </div>
        </div>

        {/* Dispute Reason */}
        <Select
          label="Primary Dispute Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={[
            { value: 'Incomplete Service', label: 'Incomplete Service / Job Left Unfinished' },
            { value: 'Substandard Quality / Failure', label: 'Substandard Quality / Equipment Failed' },
            { value: 'Property Damage', label: 'Property Damage during Service' },
            { value: 'Price Inflation / Extra Demand', label: 'Unagreed Extra Charge Demand' },
            { value: 'No Show / Extreme Delay', label: 'Artisan No-Show or Excessive Delay' },
          ]}
        />

        {/* Detailed Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Detailed Statement of Facts
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError('');
            }}
            placeholder="Explain exactly what went wrong during the service visit..."
            className="w-full rounded-artiva border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-artiva-teal focus:ring-1 focus:ring-artiva-teal outline-none"
          />
          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        </div>

        {/* Photo Evidence Upload Mock */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Photo Evidence (Optional but Recommended)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-artiva p-4 text-center hover:border-artiva-teal transition-colors">
            {photoUrl ? (
              <div className="relative inline-block group">
                <img
                  src={photoUrl}
                  alt="Evidence Preview"
                  className="w-full h-32 object-cover rounded-artiva border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-1 right-1 bg-slate-900/80 text-white text-xs px-2 py-0.5 rounded"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">Click to upload photo evidence (JPG, PNG)</p>
                <button
                  type="button"
                  onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80')}
                  className="text-xs text-artiva-teal hover:underline font-bold"
                >
                  Attach Sample Inspection Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="outline" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            type="submit"
            icon={<AlertCircle className="w-4 h-4" />}
          >
            Freeze Escrow & Open Dispute
          </Button>
        </div>

      </form>
    </Modal>
  );
};
