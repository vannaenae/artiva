import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp, RECAPTCHA_CONTAINER_ID } from './context/AppContext';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { RequireAuth } from './components/auth/RequireAuth';

// Pages Inventory
// Lazy-loaded so each route's code (and any libraries only it needs, e.g.
// Paystack on the directory page) ships as its own chunk instead of one
// single bundle everyone downloads on first paint — the bundle had crossed
// Vite's 500kB warning threshold with everything eager.
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ResidentDirectoryPage = lazy(() => import('./pages/ResidentDirectoryPage').then(m => ({ default: m.ResidentDirectoryPage })));
const ArtisanProfilePage = lazy(() => import('./pages/ArtisanProfilePage').then(m => ({ default: m.ArtisanProfilePage })));
const BookingsPage = lazy(() => import('./pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const BookingDetailPage = lazy(() => import('./pages/BookingDetailPage').then(m => ({ default: m.BookingDetailPage })));
const ArtisanDashboardPage = lazy(() => import('./pages/ArtisanDashboardPage').then(m => ({ default: m.ArtisanDashboardPage })));
const ArtisanVerificationPage = lazy(() => import('./pages/ArtisanVerificationPage').then(m => ({ default: m.ArtisanVerificationPage })));
const AdminVerificationPage = lazy(() => import('./pages/AdminVerificationPage').then(m => ({ default: m.AdminVerificationPage })));
const DisputesPage = lazy(() => import('./pages/DisputesPage').then(m => ({ default: m.DisputesPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

const RouteFallback: React.FC = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-2 border-artiva-teal border-t-transparent rounded-full animate-spin" />
  </div>
);

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
          <Suspense fallback={<RouteFallback />}>
            {renderCurrentRoute()}
          </Suspense>
        </main>
      </div>
      <Footer />
      {/* Invisible reCAPTCHA anchor for Firebase Phone Auth (src/lib/phoneAuth.ts).
          Mounted once here so Login/Signup share a single container id. */}
      <div id={RECAPTCHA_CONTAINER_ID} />
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
