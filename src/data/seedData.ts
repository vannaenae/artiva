import { Artisan, Resident, Booking, Dispute, Estate, ServiceCategory } from '../types';

export const ESTATES: Estate[] = [
  {
    id: 'est-1',
    name: 'Lekki Phase 1 Estate',
    lga: 'Eti-Osa',
    state: 'Lagos',
    address: 'Admiralty Way, Lekki, Lagos',
  },
  {
    id: 'est-2',
    name: 'Victoria Garden City (VGC)',
    lga: 'Eti-Osa',
    state: 'Lagos',
    address: 'Lekki-Epe Expressway, VGC, Lagos',
  },
  {
    id: 'est-3',
    name: 'Ikota Villa Estate',
    lga: 'Eti-Osa',
    state: 'Lagos',
    address: 'Ikota, Lekki, Lagos',
  },
  {
    id: 'est-4',
    name: 'Chevron Drive Estate',
    lga: 'Eti-Osa',
    state: 'Lagos',
    address: 'Chevron Drive, Lekki, Lagos',
  },
];

export const CATEGORIES: { id: ServiceCategory; label: string; iconName: string; description: string }[] = [
  { id: 'plumbing', label: 'Plumbing', iconName: 'Wrench', description: 'Pipe leaks, boreholes, pump repair, bathroom fittings' },
  { id: 'electrical', label: 'Electrical', iconName: 'Zap', description: 'Inverter setup, wiring, DB box, generator changeovers' },
  { id: 'cleaning', label: 'House Cleaning', iconName: 'Sparkles', description: 'Post-construction cleaning, deep cleaning, fumigation' },
  { id: 'appliance_repair', label: 'Appliance Repair', iconName: 'Tv', description: 'Washing machines, fridges, microwaves, ovens' },
  { id: 'ac_repair', label: 'AC Service & Repair', iconName: 'Wind', description: 'AC servicing, gas refilling, compressor replacement' },
  { id: 'carpentry', label: 'Carpentry', iconName: 'Hammer', description: 'Door installation, kitchen cabinets, wardrobe repairs' },
  { id: 'painting', label: 'Painting & POP', iconName: 'Paintbrush', description: 'Interior/exterior painting, POP ceiling repairs' },
];

// Live site: no seeded residents/artisans/bookings/disputes. Real records are
// created as people sign up and use the app; screens render their empty states
// until then. See AppContext.tsx for the localStorage-backed collections.
export const SEED_RESIDENTS: Resident[] = [];
export const SEED_ARTISANS: Artisan[] = [];
export const SEED_BOOKINGS: Booking[] = [];
export const SEED_DISPUTES: Dispute[] = [];
