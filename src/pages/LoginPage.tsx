import React, { useEffect, useRef, useState } from 'react';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { isFirebaseConfigured, setupRecaptcha, sendPhoneOtp } from '../lib/firebase';
import { ShieldCheck, Phone, ArrowRight, User, UserCheck, Lock, AlertCircle } from 'lucide-react';

/** Nigerian phone input in any common shape -> E.164, which Firebase requires. */
function toE164(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('234')) return `+${digits}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string } | undefined)?.code || '';
  switch (code) {
    case 'auth/invalid-phone-number':
      return "That phone number doesn't look valid. Use the format +234 803 123 4567.";
    case 'auth/too-many-requests':
      return 'Too many attempts from this device. Please wait a bit and try again.';
    case 'auth/invalid-verification-code':
      return 'That code is incorrect. Double-check and try again.';
    case 'auth/code-expired':
      return 'That code expired. Request a new one.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for this project right now. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export const LoginPage: React.FC = () => {
  const { loginWithOtp, navigate, currentPath } = useApp();

  // Admin sign-in only happens through the passcode-gated /admin/secret-portal —
  // never offer it here, or anyone could self-assign the admin role.
  const [role, setRole] = useState<Exclude<UserRole, 'admin'>>('resident');
  const [phone, setPhone] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    return () => recaptchaVerifierRef.current?.clear();
  }, []);

  // If we were redirected here from a protected page (?next=/bookings), send
  // the user back there once they're signed in instead of always defaulting.
  const nextPath = new URLSearchParams(currentPath.split('?')[1] || '').get('next');

  const completeSignIn = () => {
    loginWithOtp(phone, role);
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
    setError('');

    // No Firebase project configured yet — fall back to the honest phone-only
    // flow instead of pretending to text a code that was never sent.
    if (!isFirebaseConfigured) {
      completeSignIn();
      return;
    }

    setIsSubmitting(true);
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = setupRecaptcha('recaptcha-container');
      }
      if (!recaptchaVerifierRef.current) {
        throw new Error('Could not start verification. Please refresh and try again.');
      }
      const result = await sendPhoneOtp(toE164(phone), recaptchaVerifierRef.current);
      if (!result) throw new Error('Could not send verification code.');
      confirmationResultRef.current = result;
      setStep('otp');
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!confirmationResultRef.current) {
      setError('This code expired. Go back and request a new one.');
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmationResultRef.current.confirm(otpCode);
      completeSignIn();
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setIsSubmitting(false);
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
          {isFirebaseConfigured ? "We'll text you a one-time code to sign in" : 'Sign in with your registered phone number'}
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

              {error && (
                <div className="p-3 bg-rose-50 rounded-artiva border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={isSubmitting}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting ? 'Sending…' : 'Continue'}
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-600">
                Enter the code sent to <strong className="text-slate-900">{phone}</strong>
              </p>
            </div>

            <Input
              label="6-Digit Code"
              icon={<Lock className="w-4 h-4 text-slate-400" />}
              placeholder="123456"
              value={otpCode}
              maxLength={6}
              onChange={(e) => setOtpCode(e.target.value)}
              className="text-center font-mono text-lg tracking-widest"
              required
            />

            {error && (
              <div className="p-3 bg-rose-50 rounded-artiva border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="gold" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying…' : 'Verify & Sign In'}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => { setStep('phone'); setOtpCode(''); setError(''); }}
                className="text-slate-500 hover:underline"
              >
                ← Change phone number
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isSubmitting}
                className="text-artiva-teal font-bold hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-bold text-artiva-teal hover:underline">
            Register Here
          </button>
        </div>

      </div>

      {/* Anchor for Firebase's invisible reCAPTCHA widget */}
      <div id="recaptcha-container" />
    </div>
  );
};
