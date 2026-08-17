import React from 'react';
import { useApp } from '../../context/AppContext';
import { ESTATES } from '../../data/seedData';
import { 
  ShieldCheck, 
  MapPin, 
  User, 
  Search, 
  Calendar, 
  AlertCircle, 
  Briefcase, 
  Award,
  LogOut,
  UserCheck,
  Shield,
  Home,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { 
    currentPath,
    navigate,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currentRole, 
    selectedEstate, 
    setSelectedEstate, 
    userSession, 
    logout,
    bookings,
    disputes 
  } = useApp();

  const activeBookingsCount = bookings.filter(b => b.status !== 'paid_out' && b.status !== 'declined').length;
  const activeDisputesCount = disputes.filter(d => d.status !== 'resolved').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-artiva-sm">
      
      {/* Main Header Bar (Hidden Admin View - Zero Public Admin Links) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Shield Mark */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-artiva bg-artiva-teal text-white flex items-center justify-center shadow-artiva-sm group-hover:scale-105 transition-all">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-heading">Artiva</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-artiva-teal-light text-artiva-teal-dark rounded">Estate</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">Verified Artisans • Paystack Escrow Vault</p>
            </div>
          </div>

          {/* Registered Estate Selector (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-artiva border border-slate-200">
            <MapPin className="w-4 h-4 text-artiva-teal" />
            <span className="text-xs text-slate-500 font-medium">Estate:</span>
            <select
              value={selectedEstate.id}
              onChange={(e) => {
                const est = ESTATES.find(item => item.id === e.target.value);
                if (est) setSelectedEstate(est);
              }}
              className="bg-transparent text-xs font-bold text-slate-900 border-none outline-none cursor-pointer focus:ring-0"
            >
              {ESTATES.map(estate => (
                <option key={estate.id} value={estate.id}>
                  {estate.name} ({estate.lga})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links (Desktop - strictly partitioned) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                currentPath === '/'
                  ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => navigate('/directory')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                currentPath === '/directory'
                  ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Artisan Directory</span>
            </button>

            {/* Resident Navigation */}
            {currentRole === 'resident' && (
              <>
                <button
                  onClick={() => navigate('/bookings')}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                    currentPath.startsWith('/bookings')
                      ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                  {activeBookingsCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-artiva-teal text-white text-[10px] rounded-full font-bold">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/disputes')}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                    currentPath === '/disputes'
                      ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Disputes</span>
                  {activeDisputesCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] rounded-full font-bold">
                      {activeDisputesCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Artisan Navigation */}
            {currentRole === 'artisan' && (
              <>
                <button
                  onClick={() => navigate('/artisan-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                    currentPath === '/artisan-dashboard'
                      ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Job Dashboard</span>
                </button>

                <button
                  onClick={() => navigate('/verification')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                    currentPath === '/verification'
                      ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Verify ID</span>
                </button>
              </>
            )}

            {/* Secret Admin View links ONLY if user is explicitly authenticated as admin */}
            {currentRole === 'admin' && (
              <button
                onClick={() => navigate('/admin/verifications')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold bg-slate-900 text-amber-300 shadow-sm"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Review Console</span>
              </button>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-2">
            {userSession ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{userSession.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{userSession.role}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut className="w-4 h-4 text-slate-400" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')} icon={<LogIn className="w-3.5 h-3.5" />}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-artiva text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-artiva-lg">
          
          {/* Mobile Estate Selector */}
          <div className="bg-slate-50 p-3 rounded-artiva border border-slate-200 space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-artiva-teal" /> Registered Estate Location
            </label>
            <select
              value={selectedEstate.id}
              onChange={(e) => {
                const est = ESTATES.find(item => item.id === e.target.value);
                if (est) setSelectedEstate(est);
              }}
              className="w-full bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded p-2 outline-none"
            >
              {ESTATES.map(estate => (
                <option key={estate.id} value={estate.id}>
                  {estate.name} ({estate.lga})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                currentPath === '/' ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-5 h-5 text-artiva-teal" />
              <span>Home Overview</span>
            </button>

            <button
              onClick={() => navigate('/directory')}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                currentPath === '/directory' ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Search className="w-5 h-5 text-artiva-teal" />
              <span>Artisan Directory</span>
            </button>

            {currentRole === 'resident' && (
              <>
                <button
                  onClick={() => navigate('/bookings')}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                    currentPath.startsWith('/bookings') ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-artiva-teal" />
                    <span>My Bookings</span>
                  </div>
                  {activeBookingsCount > 0 && (
                    <span className="px-2 py-0.5 bg-artiva-teal text-white text-xs rounded-full font-bold">
                      {activeBookingsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate('/disputes')}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                    currentPath === '/disputes' ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <span>Disputes</span>
                  </div>
                  {activeDisputesCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full font-bold">
                      {activeDisputesCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentRole === 'artisan' && (
              <>
                <button
                  onClick={() => navigate('/artisan-dashboard')}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                    currentPath === '/artisan-dashboard' ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-artiva-teal" />
                  <span>Artisan Job Dashboard</span>
                </button>

                <button
                  onClick={() => navigate('/verification')}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-artiva text-sm font-semibold transition-all ${
                    currentPath === '/verification' ? 'bg-artiva-teal-light text-artiva-teal-dark' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-5 h-5 text-artiva-teal" />
                  <span>NIN Identity Verification</span>
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => navigate('/admin/verifications')}
                className="flex items-center gap-2 px-3 py-2.5 rounded-artiva text-sm font-semibold bg-slate-900 text-amber-300"
              >
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Admin Review Console</span>
              </button>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {userSession ? (
              <Button
                variant="outline"
                size="md"
                onClick={logout}
                className="w-full justify-center"
                icon={<LogOut className="w-4 h-4" />}
              >
                Sign Out ({userSession.name})
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="md" onClick={() => navigate('/login')} className="justify-center">
                  Sign In
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/signup')} className="justify-center">
                  Register
                </Button>
              </div>
            )}
          </div>

        </div>
      )}

    </header>
  );
};
