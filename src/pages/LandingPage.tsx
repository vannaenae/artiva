import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Award, 
  Search, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Wrench, 
  Zap, 
  Sparkles, 
  Wind, 
  Tv, 
  Hammer, 
  Paintbrush,
  Star,
  Users,
  Building,
  Check,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';

import plumberWorkImg from '../assets/images/plumber_work.jpg';
import electricianWorkImg from '../assets/images/electrician_work.jpg';
import cleanerWorkImg from '../assets/images/cleaner_work.jpg';
import acWorkImg from '../assets/images/ac_work.jpg';

export const LandingPage: React.FC = () => {
  const { navigate, selectedEstate, artisans } = useApp();

  const verifiedArtisansCount = artisans.filter(a => a.verificationStatus === 'verified').length;

  return (
    <div className="space-y-16 py-4 animate-fade-in">
      
      {/* 1. Website Hero Banner */}
      <section className="relative overflow-hidden rounded-artiva-lg bg-gradient-to-br from-slate-900 via-artiva-teal-dark to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-artiva-lg border border-slate-800">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-artiva-pill bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-badge-pulse" />
              <span>Nigeria's Vetted Home-Services Marketplace Website</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              Verified Estate Artisans. <br />
              <span className="text-artiva-gold">Protected by Escrow.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-lg leading-relaxed">
              Artiva connects residents in <strong className="text-white">{selectedEstate.name}</strong> with background-checked plumbers, electricians, cleaners, and AC technicians. Payment is held in <strong className="text-emerald-400">Escrow</strong> and released only when job completion is confirmed by both sides.
            </p>

            {/* Call to Actions for Residents and Artisans */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/directory')}
                icon={<Search className="w-5 h-5 text-slate-900" />}
              >
                Browse Verified Artisans
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signup')}
                className="text-white border-white/30 hover:bg-white/10"
                icon={<UserCheck className="w-5 h-5" />}
              >
                Register as Artisan
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{verifiedArtisansCount}+ Vetted Artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-artiva-gold" />
                <span>100% Escrow Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-300" />
                <span>Nearest-First Proximity</span>
              </div>
            </div>
          </div>

          {/* Hero Work Gallery Feature */}
          <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-3 relative">
            <div className="space-y-3">
              <div className="relative group overflow-hidden rounded-artiva border-2 border-white/20 shadow-artiva-md">
                <img src={plumberWorkImg} alt="Plumber at work" className="w-full h-44 object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Plumbing
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-artiva border-2 border-white/20 shadow-artiva-md">
                <img src={cleanerWorkImg} alt="Cleaner at work" className="w-full h-36 object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Deep Cleaning
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <div className="relative group overflow-hidden rounded-artiva border-2 border-white/20 shadow-artiva-md">
                <img src={electricianWorkImg} alt="Electrician at work" className="w-full h-36 object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Electrical & Solar
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-artiva border-2 border-white/20 shadow-artiva-md">
                <img src={acWorkImg} alt="AC Technician at work" className="w-full h-44 object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Wind className="w-3 h-3 text-teal-300" /> AC Servicing
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Artisans in Action Gallery Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-artiva-teal-dark bg-artiva-teal-light px-3 py-1 rounded-artiva-pill">
            Artisans in Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Vetted Professionals Servicing Estate Homes
          </h2>
          <p className="text-xs text-slate-500">Real photos of verified trade specialists on the job across Lekki, VGC, Ikota, and Chevron.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-artiva-lg overflow-hidden border border-slate-200 shadow-artiva-sm hover-lift group">
            <div className="relative h-48 overflow-hidden">
              <img src={plumberWorkImg} alt="Plumbing Specialist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NIN Verified
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm font-heading">Plumbing & Borehole Pumps</h4>
              <p className="text-xs text-slate-500">Pressure pump repairs, pipe leak detection, water treatment.</p>
            </div>
          </div>

          <div className="bg-white rounded-artiva-lg overflow-hidden border border-slate-200 shadow-artiva-sm hover-lift group">
            <div className="relative h-48 overflow-hidden">
              <img src={electricianWorkImg} alt="Electrical & Solar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NIN Verified
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm font-heading">Inverters & Solar Wiring</h4>
              <p className="text-xs text-slate-500">Automatic changeover switches, DB box rewiring, generator panels.</p>
            </div>
          </div>

          <div className="bg-white rounded-artiva-lg overflow-hidden border border-slate-200 shadow-artiva-sm hover-lift group">
            <div className="relative h-48 overflow-hidden">
              <img src={cleanerWorkImg} alt="Deep Cleaning" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NIN Verified
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm font-heading">Deep Cleaning & Fumigation</h4>
              <p className="text-xs text-slate-500">Post-construction cleanup, upholstery steam wash, pest control.</p>
            </div>
          </div>

          <div className="bg-white rounded-artiva-lg overflow-hidden border border-slate-200 shadow-artiva-sm hover-lift group">
            <div className="relative h-48 overflow-hidden">
              <img src={acWorkImg} alt="AC Technician" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> NIN Verified
              </div>
            </div>
            <div className="p-4 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm font-heading">AC Service & Gas Refill</h4>
              <p className="text-xs text-slate-500">Split unit servicing, compressor repairs, VRV cooling systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Value Proposition Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-artiva-teal-dark bg-artiva-teal-light px-3 py-1 rounded-artiva-pill">
            Why Estate Residents Trust Artiva
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Solving the Trust & Safety Problem in Estate Living
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-artiva bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">1. Identity Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every artisan submits government NIN or Driver's License credentials and undergoes estate gate clearance checks before being granted the green verified badge.
            </p>
          </div>

          <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-artiva bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">2. Estate Proximity Sorting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Artisans registered nearest to your estate address (e.g. Lekki Phase 1, VGC, Ikota) appear first, ensuring quick arrival times within 20 minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-artiva bg-teal-50 text-artiva-teal flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-heading">3. Paystack Escrow Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your service money is locked safely in escrow. No cash is paid upfront. Payment is released to the artisan only after dual job confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dual Call to Action Banner */}
      <section className="bg-slate-900 text-white p-8 sm:p-10 rounded-artiva-lg shadow-artiva-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold font-heading">Are you a skilled artisan in Lagos?</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Get verified to receive high-paying estate service jobs in Lekki, VGC, Ikota, and Chevron. Enjoy guaranteed payment on completed jobs via Artiva Escrow.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="gold" size="lg" onClick={() => navigate('/signup')}>
            Join as Verified Artisan
          </Button>
        </div>
      </section>

    </div>
  );
};
