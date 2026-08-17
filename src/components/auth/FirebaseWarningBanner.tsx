import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Shield, User, UserCheck } from 'lucide-react';

export const FirebaseWarningBanner: React.FC = () => {
  const { currentRole, setCurrentRole, loginWithOtp } = useApp();

  return (
    <div className="w-full bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Live Demo Mode Active
          </span>
          <span className="hidden md:inline text-slate-400">
            In-memory state enabled. Test Resident, Artisan, and Admin roles:
          </span>
        </div>

        {/* Live Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-artiva border border-slate-700">
          <span className="text-[11px] text-slate-400 px-1 font-medium hidden xs:inline">Test Role:</span>
          <button
            onClick={() => {
              setCurrentRole('resident');
              loginWithOtp('+234 803 999 1111', 'resident');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all ${
              currentRole === 'resident'
                ? 'bg-artiva-teal text-white shadow'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <User className="w-3 h-3" />
            Resident
          </button>

          <button
            onClick={() => {
              setCurrentRole('artisan');
              loginWithOtp('+234 803 123 4567', 'artisan');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all ${
              currentRole === 'artisan'
                ? 'bg-artiva-teal text-white shadow'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Artisan
          </button>

          <button
            onClick={() => {
              setCurrentRole('admin');
              loginWithOtp('+234 800 111 2222', 'admin');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all ${
              currentRole === 'admin'
                ? 'bg-artiva-gold text-slate-900 shadow'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin Review
          </button>
        </div>
      </div>
    </div>
  );
};
