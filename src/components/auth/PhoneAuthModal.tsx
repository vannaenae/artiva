import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '../../context/AppContext';
import { Phone, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, loginWithOtp } = useApp();
  
  const [phoneNumber, setPhoneNumber] = useState<string>('+234 803 123 4567');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [otpCode, setOtpCode] = useState<string>('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithOtp(phoneNumber, currentRole, otpCode);
    setStep('success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'success' ? 'Verification Successful' : `Sign in to Artiva (${currentRole.toUpperCase()})`}
      subtitle="Mock Phone OTP Authentication"
    >
      {step === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <Input
            label="Phone Number"
            icon={<Phone className="w-4 h-4" />}
            placeholder="+234 803 123 4567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <Button type="submit" variant="primary" fullWidth size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Send SMS Code
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center py-2">
            <h4 className="text-sm font-bold text-slate-900">Enter 4-Digit Code</h4>
            <p className="text-xs text-slate-500 mt-1">Sent to {phoneNumber}</p>
            <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-1 mt-2 inline-block">
              Demo Code: Type <span className="font-mono font-bold">1234</span>
            </p>
          </div>

          <Input
            placeholder="1 2 3 4"
            value={otpCode}
            maxLength={4}
            onChange={(e) => setOtpCode(e.target.value)}
            className="text-center font-mono text-lg tracking-widest"
          />

          <Button type="submit" variant="gold" fullWidth size="lg">
            Confirm OTP & Sign In
          </Button>
        </form>
      )}

      {step === 'success' && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Signed In Successfully</h3>
          <Button variant="primary" fullWidth onClick={onClose}>
            Continue
          </Button>
        </div>
      )}
    </Modal>
  );
};
