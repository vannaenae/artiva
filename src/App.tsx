import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

import { LandingPage } from './pages/LandingPage';
import { ResidentDirectoryPage } from './pages/ResidentDirectoryPage';
import { ArtisanProfilePage } from './pages/ArtisanProfilePage';
import { BookingsPage } from './pages/BookingsPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { ArtisanDashboardPage } from './pages/ArtisanDashboardPage';
import { ArtisanVerificationPage } from './pages/ArtisanVerificationPage';
import { AdminVerificationPage } from './pages/AdminVerificationPage';
import { DisputesPage } from './pages/DisputesPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  const renderPage = () => {
    if (currentPath === '/') return <LandingPage />;
    if (currentPath === '/directory') return <ResidentDirectoryPage />;
    if (currentPath.startsWith('/artisan/')) return <ArtisanProfilePage />;
    if (currentPath === '/bookings') return <BookingsPage />;
    if (currentPath.startsWith('/bookings/')) return <BookingDetailPage />;
    if (currentPath === '/artisan-dashboard') return <ArtisanDashboardPage />;
    if (currentPath === '/verification') return <ArtisanVerificationPage />;
    if (currentPath === '/admin/verifications') return <AdminVerificationPage />;
    if (currentPath === '/disputes') return <DisputesPage />;
    if (currentPath === '/login') return <LoginPage />;
    if (currentPath === '/signup') return <SignupPage />;
    return <LandingPage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Header Navigation Bar */}
      <Navbar />

      {/* 2. Main Page View Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
