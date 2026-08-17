import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, Phone, ArrowRight, User, UserCheck, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithOtp, navigate, currentPath } = useApp();

  const [role, setRole] = useState<UserRole>('resident');
  const [phone, setPhone] = useState<string>('');

  // If we were redirected here from a protected page (?next=/bookings), send
  // the user back there once they're signed in instead of always defaulting.
  const nextPath = new URLSearchParams(currentPath.split('?')[1] || '').get('next');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithOtp(phone, role);
    if (nextPath) {
      navigate(nextPath);
    } else if (role === 'artisan') {
      navigate('/artisan-dashboard');
    } else if (role === 'admin') {
      navigate('/admin/verifications');
    } else {
      navigate('/');
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
        <p className="text-xs text-slate-500">Sign in with your registered phone number</p>
      </div>

      {/* Card */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-5">

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-artiva border border-slate-200 text-xs font-bold">
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

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 rounded flex items-center justify-center gap-1 transition-all ${
              role === 'admin' ? 'bg-artiva-gold text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
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
            Continue
          </Button>
        </form>

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
