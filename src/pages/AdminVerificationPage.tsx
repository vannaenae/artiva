import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationReviewCard } from '../components/artisan/VerificationReviewCard';
import { ShieldCheck, Clock, ShieldAlert, Award, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

export const AdminVerificationPage: React.FC = () => {
  const { artisans, verifyArtisan } = useApp();
  const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected' | 'all'>('pending');
  const [search, setSearch] = useState<string>('');

  const filteredArtisans = artisans.filter(a => {
    if (filter !== 'all' && a.verificationStatus !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.categoryLabel.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingCount = artisans.filter(a => a.verificationStatus === 'pending').length;
  const verifiedCount = artisans.filter(a => a.verificationStatus === 'verified').length;
  const rejectedCount = artisans.filter(a => a.verificationStatus === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Admin Panel Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-artiva-lg shadow-artiva-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-artiva-gold" />
            <h1 className="text-xl sm:text-2xl font-bold font-heading">
              Artisan Verification Review Panel
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Internal review screen to evaluate artisan NIN documents and approve/reject verification badges.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-artiva border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} Pending Review
          </span>

          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-artiva border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            {verifiedCount} Verified
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
              filter === 'pending'
                ? 'bg-artiva-teal text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Verified ({verifiedCount})
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Rejected ({rejectedCount})
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-artiva text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Submissions
          </button>
        </div>

        <div className="w-full sm:w-64">
          <Input
            icon={<Search className="w-4 h-4 text-slate-400" />}
            placeholder="Search by artisan name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Verification Cards List */}
      {filteredArtisans.length > 0 ? (
        <div className="space-y-4">
          {filteredArtisans.map((artisan) => (
            <VerificationReviewCard
              key={artisan.id}
              artisan={artisan}
              onVerify={verifyArtisan}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-artiva-lg p-12 text-center border border-slate-200 text-xs text-slate-500 space-y-2">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No applications in this view</h3>
          <p className="text-xs text-slate-500">Submitted artisan applications will appear here for internal verification review.</p>
        </div>
      )}

    </div>
  );
};
