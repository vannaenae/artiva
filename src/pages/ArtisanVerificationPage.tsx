import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { ServiceCategory } from '../types';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { geocodeAddress } from '../lib/geocode';
import { ShieldCheck, Award, Upload, CheckCircle2, MapPin } from 'lucide-react';

export const ArtisanVerificationPage: React.FC = () => {
  const { artisans, signupArtisan, userSession, selectedEstate } = useApp();

  const currentArtisan = artisans.find(a => a.phone === userSession?.phone);

  const [name, setName] = useState<string>(currentArtisan?.name || '');
  const [category, setCategory] = useState<ServiceCategory>('plumbing');
  const [hourlyRate, setHourlyRate] = useState<number>(8500);
  const [bio, setBio] = useState<string>(currentArtisan?.bio || '');
  const [skills, setSkills] = useState<string>('');
  const [address, setAddress] = useState<string>(currentArtisan?.address || '');
  const [idPhotoUrl, setIdPhotoUrl] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(currentArtisan?.verificationStatus === 'pending');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleIdFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdPhotoUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPhotoUrl) return;

    // Best-effort: pin the artisan to their real address for accurate
    // proximity sorting. If geocoding fails (unreachable, address doesn't
    // resolve, etc.) they still get registered — signupArtisan falls back
    // to the estate's centroid, same as leaving this field blank.
    let coords: { lat: number; lng: number } | null = null;
    if (address.trim()) {
      setIsLocating(true);
      coords = await geocodeAddress(`${address}, ${selectedEstate.name}, Lagos, Nigeria`);
      setIsLocating(false);
    }

    signupArtisan({
      name,
      category,
      categoryLabel: CATEGORIES.find(c => c.id === category)?.label || 'Artisan',
      hourlyRate,
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      idDocumentUrl: idPhotoUrl,
      address: address.trim() || undefined,
      lat: coords?.lat,
      lng: coords?.lng,
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

        <Input
          label="Service Address (Optional)"
          icon={<MapPin className="w-4 h-4 text-slate-400" />}
          placeholder="e.g. 12 Admiralty Way, Lekki Phase 1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          helperText="Pins your exact location for accurate proximity sorting. Leave blank to use your estate's general location."
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

          <label className="block border-2 border-dashed border-slate-300 rounded-artiva p-4 text-center bg-slate-50 hover:border-artiva-teal transition-colors cursor-pointer">
            <input type="file" accept="image/*,.pdf" onChange={handleIdFileSelect} className="hidden" />
            {idPhotoUrl ? (
              <div className="space-y-2">
                <img
                  src={idPhotoUrl}
                  alt="Selected identity document"
                  className="w-full h-40 object-cover rounded-artiva border border-slate-200 max-w-md mx-auto"
                />
                <p className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Document selected — click to replace
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600">Click to select a photo of your NIN slip, voter's card, or driver's license</p>
              </div>
            )}
          </label>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col items-end gap-1.5">
          {!idPhotoUrl && (
            <p className="text-[11px] text-amber-700">Select an identity document above before submitting.</p>
          )}
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={!idPhotoUrl || isLocating}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            {isLocating ? 'Locating address…' : 'Submit for Admin Verification'}
          </Button>
        </div>

      </form>

    </div>
  );
};
