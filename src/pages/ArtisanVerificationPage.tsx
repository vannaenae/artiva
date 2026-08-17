import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ServiceCategory } from '../types';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Award, Upload, CheckCircle2, FileText, Lock } from 'lucide-react';

export const ArtisanVerificationPage: React.FC = () => {
  const { artisans, signupArtisan, userSession, selectedEstate } = useApp();

  const currentArtisan = artisans.find(a => a.phone === userSession?.phone);

  const [name, setName] = useState<string>(currentArtisan?.name || 'New Artisan');
  const [category, setCategory] = useState<ServiceCategory>('plumbing');
  const [hourlyRate, setHourlyRate] = useState<number>(8500);
  const [bio, setBio] = useState<string>(currentArtisan?.bio || '');
  const [skills, setSkills] = useState<string>('Leak Detection, Pressure Pumps, Pipe Fitting');
  const [idPhotoUrl, setIdPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
  const [submitted, setSubmitted] = useState<boolean>(currentArtisan?.verificationStatus === 'pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupArtisan({
      name,
      category,
      categoryLabel: CATEGORIES.find(c => c.id === category)?.label || 'Artisan',
      hourlyRate,
      bio,
      skills: skills.split(',').map(s => s.trim()),
      idDocumentUrl: idPhotoUrl,
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-artiva-teal" />
          <h1 className="text-xl font-bold text-slate-900 font-heading">
            Artisan Identity Verification & Vetting
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Get verified to unlock resident booking requests across {selectedEstate.name} and nearby estates.
        </p>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Verification Status:</span>
          <Badge status={currentArtisan?.verificationStatus || 'pending'} size="lg" />
        </div>

        {currentArtisan?.verificationStatus === 'verified' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-artiva flex items-center gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">You are a Verified Artisan!</p>
              <p className="mt-0.5 text-emerald-700">Your profile carries the green shield badge and appears at the top of proximity-sorted estate searches.</p>
            </div>
          </div>
        )}

        {submitted && currentArtisan?.verificationStatus === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-artiva flex items-center gap-3 text-xs text-amber-900">
            <CheckCircle2 className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Verification Documents Under Review</p>
              <p className="mt-0.5 text-amber-700">Your NIN document is being inspected by the estate administration team. Approval typically takes 2–4 hours.</p>
            </div>
          </div>
        )}
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-artiva-lg border border-slate-200 shadow-artiva-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          Update Verification Application
        </h3>

        <Input
          label="Full Legal Name (Matches NIN / Driver's License)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Service Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
          />

          <Input
            label="Hourly Service Rate (NGN)"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Professional Bio & Experience
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your background, years of experience, and specialized skills..."
            className="w-full rounded-artiva border border-slate-300 p-3 text-sm text-slate-900 focus:border-artiva-teal focus:ring-1 focus:ring-artiva-teal outline-none"
            required
          />
        </div>

        <Input
          label="Skills & Equipment (Comma Separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          helperText="e.g. Inverter Wiring, DB Box, Short Circuiting, Automatic Changeover"
        />

        {/* Identity Document Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Upload Identification Document (NIN / Voter Card / Driver's License)
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-artiva p-4 text-center bg-slate-50 hover:border-artiva-teal transition-colors">
            {idPhotoUrl ? (
              <div className="space-y-2">
                <img
                  src={idPhotoUrl}
                  alt="NIN Document"
                  className="w-full h-40 object-cover rounded-artiva border border-slate-200 max-w-md mx-auto"
                />
                <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Identity Document Attached
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">Drag & drop your NIN slip or click to select image</p>
                <button
                  type="button"
                  onClick={() => setIdPhotoUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80')}
                  className="text-xs text-artiva-teal hover:underline font-bold"
                >
                  Attach Sample NIN Document
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            type="submit"
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Submit for Admin Verification
          </Button>
        </div>

      </form>

    </div>
  );
};
