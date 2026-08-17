import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ShieldCheck, Lock, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';

// ponytail: this is a client-bundled passcode, not real authentication — anyone
// who reads the built JS can find it. It's a speed bump for casual access, not
// a security boundary. Upgrade to real backend-verified admin auth (Firebase
// custom claims, a server-checked login) before this handles anything sensitive.
const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'artiva-admin';

export const AdminLoginPage: React.FC = () => {
  const { navigate, loginWithOtp } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      loginWithOtp('+234 800 999 0000', 'admin');
      navigate('/admin/verifications');
    } else {
      setError('Invalid Admin Security Passcode. Access denied.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-artiva bg-slate-900 text-artiva-gold mx-auto flex items-center justify-center shadow-artiva-md">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Restricted Admin Access
        </h1>
        <p className="text-xs text-slate-500">
          Internal security verification queue & escrow dispute adjudication panel.
        </p>
      </div>

      <Card className="p-6 space-y-4 border-2 border-slate-900 shadow-artiva-lg">
        <form onSubmit={handleAdminAuth} className="space-y-4">
          
          <Input
            label="Admin Security Passcode"
            type="password"
            required
            placeholder="Enter security passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError('');
            }}
            icon={<KeyRound className="w-4 h-4 text-slate-400" />}
          />

          {error && (
            <div className="p-3 bg-rose-50 rounded text-xs text-rose-700 font-semibold border border-rose-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            fullWidth
            icon={<ShieldCheck className="w-5 h-5 text-slate-900" />}
          >
            Authenticate Admin Portal
          </Button>

        </form>
      </Card>

      <div className="text-center text-xs text-slate-400">
        <p>Restricted to Artiva Security Operations Personnel only.</p>
      </div>
    </div>
  );
};
