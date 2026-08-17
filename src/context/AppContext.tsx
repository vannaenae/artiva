import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Artisan, 
  Resident,
  Estate, 
  Booking, 
  Dispute, 
  ServiceCategory, 
  VerificationStatus,
  BookingStatus,
  EscrowStatus
} from '../types';
import { ESTATES, SEED_ARTISANS, SEED_RESIDENTS, SEED_BOOKINGS, SEED_DISPUTES } from '../data/seedData';

interface UserSession {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  estateId?: string;
  estateName?: string;
}

interface AppContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string) => void;
  
  // User Session & Role
  userSession: UserSession | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedEstate: Estate;
  setSelectedEstate: (estate: Estate) => void;
  
  // Auth Actions (Mock Phone + OTP)
  loginWithOtp: (phone: string, role: UserRole, otpCode?: string) => UserSession;
  signupResident: (name: string, phone: string, email: string, estateId: string) => UserSession;
  signupArtisan: (artisanData: Partial<Artisan>) => UserSession;
  logout: () => void;
  
  // Artisans & Verification State Machine
  artisans: Artisan[];
  verifyArtisan: (artisanId: string, status: VerificationStatus, rejectionReason?: string) => void;
  
  // Residents List
  residents: Resident[];

  // Booking & Escrow State Machine
  bookings: Booking[];
  createBooking: (artisanId: string, serviceDescription: string, date: string, time: string, estimatedHours?: number) => Booking;
  acceptBooking: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  startJob: (bookingId: string) => void;
  completeJobByArtisan: (bookingId: string) => void;
  confirmJobByResident: (bookingId: string) => void;
  
  // Disputes
  disputes: Dispute[];
  createDispute: (bookingId: string, reason: string, description: string, evidencePhotoUrl?: string) => void;
  resolveDispute: (disputeId: string, resolution: string, outcome: 'release_to_artisan' | 'refund_to_resident') => void;

  // Directory Search & Filters
  activeCategory: ServiceCategory | 'all';
  setActiveCategory: (cat: ServiceCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Client-Side Hash Router
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const p = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentPath(p);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. Estate Selection
  const [selectedEstate, setSelectedEstate] = useState<Estate>(ESTATES[0]); // Lekki Phase 1

  // 3. User Session State
  const [userSession, setUserSession] = useState<UserSession | null>({
    id: 'res-1',
    name: 'Mrs. Folake Kuti',
    phone: '+234 803 999 1111',
    email: 'folake.kuti@example.ng',
    role: 'resident',
    estateId: 'est-1',
    estateName: 'Lekki Phase 1 Estate',
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('resident');

  // 4. Shared In-Memory Data Collections (persisted in localStorage for session robustness)
  const [artisans, setArtisans] = useState<Artisan[]>(() => {
    const saved = localStorage.getItem('artiva_artisans');
    return saved ? JSON.parse(saved) : SEED_ARTISANS;
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('artiva_residents');
    return saved ? JSON.parse(saved) : SEED_RESIDENTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('artiva_bookings');
    return saved ? JSON.parse(saved) : SEED_BOOKINGS;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('artiva_disputes');
    return saved ? JSON.parse(saved) : SEED_DISPUTES;
  });

  // Directory Search & Filters
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist state updates to localStorage so testing across tabs/refreshes works
  useEffect(() => {
    localStorage.setItem('artiva_artisans', JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem('artiva_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('artiva_disputes', JSON.stringify(disputes));
  }, [disputes]);

  // Auth Helpers
  const loginWithOtp = (phone: string, role: UserRole, otpCode = '1234'): UserSession => {
    let session: UserSession;
    if (role === 'resident') {
      const match = residents.find(r => r.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')) || residents[0];
      session = {
        id: match.id,
        name: match.name,
        phone: match.phone,
        email: match.email,
        role: 'resident',
        estateId: match.estateId,
        estateName: match.estateName,
      };
    } else if (role === 'artisan') {
      const match = artisans.find(a => a.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, '')) || artisans[0];
      session = {
        id: match.id,
        name: match.name,
        phone: match.phone,
        email: match.email,
        role: 'artisan',
        estateId: match.estateId,
        estateName: match.estateName,
      };
    } else {
      session = {
        id: 'admin-1',
        name: 'Estate Security Admin',
        phone,
        role: 'admin',
      };
    }

    setUserSession(session);
    setCurrentRole(role);
    return session;
  };

  const signupResident = (name: string, phone: string, email: string, estateId: string): UserSession => {
    const estate = ESTATES.find(e => e.id === estateId) || ESTATES[0];
    const newResident: Resident = {
      id: `res-${Date.now()}`,
      name,
      phone,
      email,
      estateId: estate.id,
      estateName: estate.name,
      address: `Block ${Math.floor(Math.random() * 20) + 1}, ${estate.name}`,
    };

    setResidents(prev => [newResident, ...prev]);

    const session: UserSession = {
      id: newResident.id,
      name: newResident.name,
      phone: newResident.phone,
      email: newResident.email,
      role: 'resident',
      estateId: newResident.estateId,
      estateName: newResident.estateName,
    };

    setUserSession(session);
    setCurrentRole('resident');
    return session;
  };

  const signupArtisan = (artisanData: Partial<Artisan>): UserSession => {
    const newArt: Artisan = {
      id: `art-${Date.now()}`,
      name: artisanData.name || 'New Artisan',
      phone: artisanData.phone || '+234 800 000 0000',
      email: artisanData.email || 'artisan@artiva.ng',
      category: artisanData.category || 'plumbing',
      categoryLabel: artisanData.categoryLabel || 'Plumbing',
      estateId: selectedEstate.id,
      estateName: selectedEstate.name,
      distanceKm: 0.5,
      rating: 5.0,
      reviewCount: 0,
      hourlyRate: artisanData.hourlyRate || 8500,
      verificationStatus: 'pending', // Starts in pending review state
      bio: artisanData.bio || 'Vetted professional artisan.',
      skills: artisanData.skills || ['General Maintenance'],
      idDocumentUrl: artisanData.idDocumentUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      photoUrl: artisanData.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      completedJobsCount: 0,
      disputeCount: 0,
      memberSince: 'Just now',
      verificationSubmittedAt: new Date().toISOString(),
    };

    setArtisans(prev => [newArt, ...prev]);

    const session: UserSession = {
      id: newArt.id,
      name: newArt.name,
      phone: newArt.phone,
      email: newArt.email,
      role: 'artisan',
      estateId: newArt.estateId,
      estateName: newArt.estateName,
    };

    setUserSession(session);
    setCurrentRole('artisan');
    return session;
  };

  const logout = () => {
    setUserSession(null);
  };

  // Verification Review Action
  const verifyArtisan = (artisanId: string, status: VerificationStatus, rejectionReason?: string) => {
    setArtisans(prev => prev.map(art => {
      if (art.id === artisanId) {
        return {
          ...art,
          verificationStatus: status,
          rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        };
      }
      return art;
    }));
  };

  // Booking & Escrow State Machine
  const createBooking = (
    artisanId: string, 
    serviceDescription: string, 
    date: string, 
    time: string, 
    estimatedHours = 2
  ): Booking => {
    const artisan = artisans.find(a => a.id === artisanId);
    const amount = (artisan?.hourlyRate || 8500) * estimatedHours;

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      residentId: userSession?.id || 'res-1',
      residentName: userSession?.name || 'Mrs. Folake Kuti',
      residentPhone: userSession?.phone || '+234 803 999 1111',
      residentEstate: selectedEstate.name,
      artisanId,
      artisanName: artisan?.name || 'Artisan',
      artisanCategory: artisan?.categoryLabel || 'Artisan',
      artisanPhotoUrl: artisan?.photoUrl || '',
      serviceDescription,
      preferredDate: date,
      preferredTime: time,
      totalAmount: amount,
      escrowStatus: 'held', // Funds immediately locked in escrow
      status: 'requested',
      residentConfirmed: false,
      artisanConfirmed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const acceptBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'accepted', updatedAt: new Date().toISOString() } : b));
  };

  const declineBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'declined', escrowStatus: 'refunded', updatedAt: new Date().toISOString() } : b));
  };

  const startJob = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'in_progress', updatedAt: new Date().toISOString() } : b));
  };

  const completeJobByArtisan = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const nextArtisanConfirmed = true;
        const fullyConfirmed = b.residentConfirmed && nextArtisanConfirmed;
        return {
          ...b,
          artisanConfirmed: true,
          status: fullyConfirmed ? 'confirmed' : 'completed',
          escrowStatus: fullyConfirmed ? 'released' : 'held',
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));
  };

  const confirmJobByResident = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        // Dual completion confirmation -> releases escrow!
        return {
          ...b,
          residentConfirmed: true,
          artisanConfirmed: true,
          status: 'paid_out',
          escrowStatus: 'released',
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));

    // Increment completed jobs count for artisan
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setArtisans(prev => prev.map(a => a.id === targetBooking.artisanId ? { ...a, completedJobsCount: a.completedJobsCount + 1 } : a));
    }
  };

  // Disputes Flow
  const createDispute = (bookingId: string, reason: string, description: string, evidencePhotoUrl?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newDispute: Dispute = {
      id: `dsp-${Date.now().toString().slice(-4)}`,
      bookingId,
      artisanId: booking.artisanId,
      artisanName: booking.artisanName,
      residentId: booking.residentId,
      residentName: booking.residentName,
      raisedByRole: currentRole === 'artisan' ? 'artisan' : 'resident',
      reason,
      description,
      evidencePhotoUrl: evidencePhotoUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };

    setDisputes(prev => [newDispute, ...prev]);

    // Freeze escrow funds on booking
    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'disputed',
      escrowStatus: 'disputed',
      updatedAt: new Date().toISOString()
    } : b));
  };

  const resolveDispute = (disputeId: string, resolutionSummary: string, outcome: 'release_to_artisan' | 'refund_to_resident') => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: 'resolved',
          resolutionSummary,
          resolvedAt: new Date().toISOString(),
        };
      }
      return d;
    }));

    const dispute = disputes.find(d => d.id === disputeId);
    if (dispute) {
      setBookings(prev => prev.map(b => {
        if (b.id === dispute.bookingId) {
          return {
            ...b,
            status: outcome === 'release_to_artisan' ? 'paid_out' : 'declined',
            escrowStatus: outcome === 'release_to_artisan' ? 'released' : 'refunded',
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      }));
    }
  };

  return (
    <AppContext.Provider value={{
      currentPath,
      navigate,
      userSession,
      currentRole,
      setCurrentRole,
      selectedEstate,
      setSelectedEstate,
      loginWithOtp,
      signupResident,
      signupArtisan,
      logout,
      artisans,
      verifyArtisan,
      residents,
      bookings,
      createBooking,
      acceptBooking,
      declineBooking,
      startJob,
      completeJobByArtisan,
      confirmJobByResident,
      disputes,
      createDispute,
      resolveDispute,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
