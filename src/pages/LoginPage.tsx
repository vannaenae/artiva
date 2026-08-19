import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { isFirebaseConfigured } from '../lib/firebase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Phone, ArrowRight, User, UserCheck, KeyRound, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { confirmLoginOtp, requestOtp, otpLoading, otpError, navigate, currentPath } = useApp();

  // Admin sign-in only happens through the passcode-gated /admin/secret-portal
  // — never offer it here, or anyone could self-assign the admin role.
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('resident');
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  // If we were redirected here from a protected page (?next=/bookings), send
  // the user back there once they're signed in instead of always defaulting.
  const nextPath = new URLSearchParams(currentPath.split('?')[1] || '').get('next');

  const goToDestination = () => {
    if (nextPath) {
      navigate(nextPath);
    } else if (role === 'artisan') {
      navigate('/artisan-dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp(phone);
      setStep('otp');
    } catch {
      // otpError is already set by the context; nothing else to do here.
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmLoginOtp(code, role);
      goToDestination();
    } catch {
      // otpError is already set by the context; stay on this step.
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
        <p className="text-xs text-slate-500">
          {step === 'phone'
            ? 'Sign in with your registered phone number'
            : `Enter the code sent to ${phone}`}
        </p>
      </div>

      {/* Card */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-5">

        {step === 'phone' ? (
          <>
            {/* Role Selector Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-artiva border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('resident')}
                className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
                  role === 'resident' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Resident
              </button>

              <button
                type="button"
                onClick={() => setRole('artisan')}
                className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
                  role === 'artisan' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Artisan
              </button>
            </div>

            <form onSubmit={handleSendCode} className="space-y-4">
              <Input
                label="Nigerian Phone Number"
                icon={<Phone className="w-4 h-4 text-slate-400" />}
                placeholder="+234 803 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              {otpError && (
                <p className="text-xs text-rose-600 font-medium">{otpError}</p>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={otpLoading}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {otpLoading ? 'Sending code…' : 'Send Verification Code'}
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {!isFirebaseConfigured && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-artiva text-xs text-amber-900">
                Demo mode: Firebase isn't configured, so no SMS was actually sent. Enter any 4–6 digit code to continue.
              </div>
            )}

            <Input
              label="Verification Code"
              icon={<KeyRound className="w-4 h-4 text-slate-400" />}
              placeholder="123456"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />

            {otpError && (
              <p className="text-xs text-rose-600 font-medium">{otpError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={otpLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {otpLoading ? 'Verifying…' : 'Verify & Sign In'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 hover:text-artiva-teal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change phone number
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
