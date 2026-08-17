import React from 'react';
import { Artisan } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { Button } from '../ui/Button';
import { formatCurrency, formatDistance } from '../../lib/utils';
import { MapPin, Briefcase, Calendar, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface ArtisanCardProps {
  artisan: Artisan;
  onSelect: (artisan: Artisan) => void;
  onBook: (artisan: Artisan) => void;
}

export const ArtisanCard: React.FC<ArtisanCardProps> = ({
  artisan,
  onSelect,
  onBook,
}) => {
  return (
    <Card hoverable className="flex flex-col justify-between h-full group hover-lift animate-fade-in">
      <div>
        {/* Header with Photo & Verification Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={artisan.photoUrl}
                alt={artisan.name}
                className="w-16 h-16 rounded-artiva object-cover border-2 border-artiva-teal/20 group-hover:border-artiva-teal transition-all shadow-artiva-sm"
              />
              {artisan.verificationStatus === 'verified' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white" title="Verified Artisan">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-artiva-teal transition-colors font-heading">
                {artisan.name}
              </h3>
              <p className="text-xs text-artiva-teal-dark font-semibold">{artisan.categoryLabel}</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{artisan.estateName} • </span>
                <span className="font-semibold text-artiva-teal-dark">{formatDistance(artisan.distanceKm)}</span>
              </div>
            </div>
          </div>

          <Badge status={artisan.verificationStatus} size="sm" />
        </div>

        {/* Bio summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {artisan.bio}
        </p>

        {/* Verified Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {artisan.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
            >
              ✓ {skill}
            </span>
          ))}
          {artisan.skills.length > 3 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
              +{artisan.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Metrics & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={artisan.rating} reviewCount={artisan.reviewCount} size="sm" />
            <span className="text-[11px] text-slate-400">• {artisan.completedJobsCount} jobs</span>
          </div>
          <p className="text-xs font-extrabold text-slate-900 mt-0.5 font-heading">
            {formatCurrency(artisan.hourlyRate)} <span className="text-[10px] font-normal text-slate-500">/ hr</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(artisan)}
          >
            Profile
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onBook(artisan)}
            icon={<Calendar className="w-3.5 h-3.5" />}
          >
            Book
          </Button>
        </div>
      </div>
    </Card>
  );
};
