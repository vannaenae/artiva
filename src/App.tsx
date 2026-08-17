import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { FirebaseWarningBanner } from './components/auth/FirebaseWarningBanner';

// Pages Inventory
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
import { AdminLoginPage } from './pages/AdminLoginPage';

const RouterContent: React.FC = () => {
  const { currentPath, currentRole } = useApp();

  const renderCurrentRoute = () => {
    // Route matching
    if (currentPath === '/') {
      return <LandingPage />;
    }
    if (currentPath === '/directory') {
      return <ResidentDirectoryPage />;
    }
    if (currentPath.startsWith('/artisan/')) {
      return <ArtisanProfilePage />;
    }
    if (currentPath === '/bookings') {
      return <BookingsPage />;
    }
    if (currentPath.startsWith('/bookings/')) {
      return <BookingDetailPage />;
    }
    if (currentPath === '/artisan-dashboard') {
      return <ArtisanDashboardPage />;
    }
    if (currentPath === '/verification') {
      return <ArtisanVerificationPage />;
    }
    
    // Secret Admin Access Portal Route
    if (currentPath === '/admin/secret-portal' || currentPath === '/admin/login') {
      return <AdminLoginPage />;
    }
    
    if (currentPath === '/admin/verifications') {
      if (currentRole !== 'admin') {
        return <AdminLoginPage />;
      }
      return <AdminVerificationPage />;
    }
    
    if (currentPath === '/disputes') {
      return <DisputesPage />;
    }
    if (currentPath === '/login') {
      return <LoginPage />;
    }
    if (currentPath === '/signup') {
      return <SignupPage />;
    }

    // Default fallback
    return <LandingPage />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans">
      <div>
        <Navbar />
        <FirebaseWarningBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderCurrentRoute()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <RouterContent />
    </AppProvider>
  );
}

export default App;
