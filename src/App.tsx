import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { RequireAuth } from './components/auth/RequireAuth';

// Pages Inventory
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
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
import { ProfilePage } from './pages/ProfilePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

const RouterContent: React.FC = () => {
  const { currentPath, currentRole, userSession } = useApp();

  // Route matching ignores any ?query string (e.g. /login?next=/bookings) —
  // that's parsed by the page that needs it (LoginPage), not the router.
  const pathname = currentPath.split('?')[0];

  const renderCurrentRoute = () => {
    if (pathname === '/') {
      return userSession ? <DashboardPage /> : <LandingPage />;
    }
    if (pathname === '/directory') {
      return <ResidentDirectoryPage />;
    }
    if (pathname.startsWith('/artisan/')) {
      return <ArtisanProfilePage />;
    }
    if (pathname === '/bookings') {
      return <RequireAuth><BookingsPage /></RequireAuth>;
    }
    if (pathname.startsWith('/bookings/')) {
      return <RequireAuth><BookingDetailPage /></RequireAuth>;
    }
    if (pathname === '/artisan-dashboard') {
      return <RequireAuth><ArtisanDashboardPage /></RequireAuth>;
    }
    if (pathname === '/verification') {
      return <RequireAuth><ArtisanVerificationPage /></RequireAuth>;
    }
    if (pathname === '/profile') {
      return <RequireAuth><ProfilePage /></RequireAuth>;
    }

    // Secret Admin Access Portal Route
    if (pathname === '/admin/secret-portal' || pathname === '/admin/login') {
      return <AdminLoginPage />;
    }

    if (pathname === '/admin/verifications') {
      if (currentRole !== 'admin') {
        return <AdminLoginPage />;
      }
      return <AdminVerificationPage />;
    }

    if (pathname === '/disputes') {
      return <RequireAuth><DisputesPage /></RequireAuth>;
    }
    if (pathname === '/login') {
      return <LoginPage />;
    }
    if (pathname === '/signup') {
      return <SignupPage />;
    }
    if (pathname === '/terms') {
      return <TermsPage />;
    }
    if (pathname === '/privacy') {
      return <PrivacyPage />;
    }

    // Default fallback
    return userSession ? <DashboardPage /> : <LandingPage />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans">
      <div>
        <Navbar />
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
