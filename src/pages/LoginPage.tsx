import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Phone, Lock, ArrowRight, User, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithOtp, navigate } = useApp();

  const [role, setRole] = useState<UserRole>('resident');
  const [phone, setPhone] = useState<string>('+234 803 999 1111');
  const [otp, setOtp] = useState<string>('1234');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithOtp(phone, role, otp);
    if (role === 'artisan') {
      navigate('/artisan-dashboard');
    } else if (role === 'admin') {
      navigate('/admin/verifications');
    } else {
      navigate('/directory');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-artiva bg-artiva-teal text-white flex items-center justify-center mx-auto shadow-artiva-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Sign In to Artiva</h1>
        <p className="text-xs text-slate-500">Secure mock OTP sign-in for Nigerian estate residents & artisans</p>
      </div>

      {/* Card */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-5">
        
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-artiva border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setRole('resident');
              setPhone('+234 803 999 1111');
            }}
            className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
              role === 'resident' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Resident
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('artisan');
              setPhone('+234 803 123 4567');
            }}
            className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
              role === 'artisan' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Artisan
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setPhone('+234 800 111 2222');
            }}
            className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
              role === 'admin' ? 'bg-artiva-gold text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Nigerian Phone Number"
              icon={<Phone className="w-4 h-4 text-slate-400" />}
              placeholder="+234 803 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Send SMS OTP Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-600">Enter 4-digit code sent to <strong className="text-slate-900">{phone}</strong></p>
              <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                Demo Code: Type <strong className="font-mono">1234</strong> (or any 4 digits)
              </p>
            </div>

            <Input
              label="4-Digit Code"
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              placeholder="1 2 3 4"
              value={otp}
              maxLength={4}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center font-mono text-lg tracking-widest"
              required
            />

            <Button
              type="submit"
              variant="gold"
              fullWidth
              size="lg"
            >
              Confirm OTP & Sign In ({role.toUpperCase()})
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-slate-500 hover:underline"
            >
              ← Change phone number
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-bold text-artiva-teal hover:underline">
            Register Here
          </button>
        </div>

      </div>

    </div>
  );
};
