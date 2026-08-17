import React from 'react';
import { ShieldCheck, Lock, CheckCircle, PhoneCall, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Guarantee */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-artiva bg-artiva-teal text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white font-heading">Artiva</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nigeria's premier estate-verified artisan marketplace. Connecting residents with vetted plumbers, electricians, cleaners, and technicians with escrow payment protection.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-1 bg-slate-800 text-emerald-400 rounded text-[11px] font-semibold border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Escrow Protected
              </span>
              <span className="px-2 py-1 bg-slate-800 text-artiva-gold rounded text-[11px] font-semibold border border-slate-700 flex items-center gap-1">
                <Award className="w-3 h-3" /> ID Verified
              </span>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Estates & Coverage</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Lekki Phase 1 Estate</li>
              <li>Victoria Garden City (VGC)</li>
              <li>Ikota Villa Estate</li>
              <li>Chevron Drive Estate</li>
              <li>Ikoyi & Victoria Island</li>
            </ul>
          </div>

          {/* Core Functional Domains */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Marketplace Domains</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Verified Artisan Directory</li>
              <li>Artisan ID Verification Portal</li>
              <li>Escrow Payment Protection</li>
              <li>Dual Job Confirmation</li>
              <li>Dispute & Trust Resolution</li>
            </ul>
          </div>

          {/* Security & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Escrow Guarantee</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Funds are held safely in escrow upon booking and released to the artisan only after both resident and artisan confirm job completion.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-artiva border border-slate-700 text-[11px] text-slate-300">
              <span className="font-bold text-white">Need Support?</span> Raise a dispute directly on any booking or contact estate security admin.
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Artiva (formerly Verfix). Built for Nigerian Residential Estates.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-300 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 transition-colors">Artisan Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
