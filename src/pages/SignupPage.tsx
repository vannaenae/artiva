import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ESTATES, CATEGORIES } from '../data/seedData';
import { ServiceCategory } from '../types';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, User, UserCheck, Upload, CheckCircle2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signupResident, signupArtisan, navigate, selectedEstate } = useApp();

  const [signupType, setSignupType] = useState<'resident' | 'artisan'>('resident');
  
  // Resident fields
  const [resName, setResName] = useState<string>('');
  const [resPhone, setResPhone] = useState<string>('');
  const [resEmail, setResEmail] = useState<string>('');
  const [resEstateId, setResEstateId] = useState<string>(selectedEstate.id);

  // Artisan fields
  const [artName, setArtName] = useState<string>('');
  const [artPhone, setArtPhone] = useState<string>('');
  const [artEmail, setArtEmail] = useState<string>('');
  const [artCategory, setArtCategory] = useState<ServiceCategory>('plumbing');
  const [artRate, setArtRate] = useState<number>(8500);
  const [artBio, setArtBio] = useState<string>('');

  const handleResidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupResident(resName || 'New Resident', resPhone || '+234 803 000 1111', resEmail || 'resident@example.ng', resEstateId);
    navigate('/directory');
  };

  const handleArtisanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catLabel = CATEGORIES.find(c => c.id === artCategory)?.label || 'Artisan';
    signupArtisan({
      name: artName || 'New Artisan',
      phone: artPhone || '+234 803 000 2222',
      email: artEmail || 'artisan@example.ng',
      category: artCategory,
      categoryLabel: catLabel,
      hourlyRate: artRate,
      bio: artBio || 'Professional artisan servicing residential estates.',
    });
    navigate('/artisan-dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-artiva bg-artiva-teal text-white flex items-center justify-center mx-auto shadow-artiva-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Register on Artiva</h1>
        <p className="text-xs text-slate-500">Create an account as an estate Resident or vetted Artisan</p>
      </div>

      {/* Signup Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-6">
        
        {/* Toggle Account Type */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-artiva border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSignupType('resident')}
            className={`py-2.5 rounded flex items-center justify-center gap-1.5 transition-all ${
              signupType === 'resident' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            Resident Account
          </button>

          <button
            type="button"
            onClick={() => setSignupType('artisan')}
            className={`py-2.5 rounded flex items-center justify-center gap-1.5 transition-all ${
              signupType === 'artisan' ? 'bg-artiva-teal text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Artisan Account
          </button>
        </div>

        {signupType === 'resident' ? (
          <form onSubmit={handleResidentSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Mrs. Folake Kuti"
              value={resName}
              onChange={(e) => setResName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+234 803 123 4567"
                value={resPhone}
                onChange={(e) => setResPhone(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="resident@example.ng"
                value={resEmail}
                onChange={(e) => setResEmail(e.target.value)}
                required
              />
            </div>

            <Select
              label="Registered Estate Catchment Area"
              value={resEstateId}
              onChange={(e) => setResEstateId(e.target.value)}
              options={ESTATES.map(e => ({ value: e.id, label: `${e.name} (${e.lga})` }))}
            />

            <Button type="submit" variant="primary" fullWidth size="lg">
              Complete Resident Registration
            </Button>
          </form>
        ) : (
          <form onSubmit={handleArtisanSubmit} className="space-y-4">
            <Input
              label="Full Legal Name (Matches NIN / Driver's License)"
              placeholder="e.g. Emeka Okonkwo"
              value={artName}
              onChange={(e) => setArtName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+234 803 123 4567"
                value={artPhone}
                onChange={(e) => setArtPhone(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="artisan@artiva.ng"
                value={artEmail}
                onChange={(e) => setArtEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Primary Trade Category"
                value={artCategory}
                onChange={(e) => setArtCategory(e.target.value as ServiceCategory)}
                options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
              />

              <Input
                label="Hourly Service Rate (NGN)"
                type="number"
                value={artRate}
                onChange={(e) => setArtRate(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Professional Bio & Skills
              </label>
              <textarea
                rows={3}
                value={artBio}
                onChange={(e) => setArtBio(e.target.value)}
                placeholder="Describe your trade experience, certifications, and specialty tools..."
                className="w-full rounded-artiva border border-slate-300 p-3 text-sm focus:border-artiva-teal outline-none"
                required
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-artiva text-xs text-amber-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-600 shrink-0" />
              <span>NIN Identity Document upload will be requested on your Verification Portal.</span>
            </div>

            <Button type="submit" variant="gold" fullWidth size="lg">
              Submit Artisan Profile for Verification
            </Button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Already registered?{' '}
          <button onClick={() => navigate('/login')} className="font-bold text-artiva-teal hover:underline">
            Sign In Here
          </button>
        </div>

      </div>

    </div>
  );
};
