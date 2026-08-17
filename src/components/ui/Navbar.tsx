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
  Zap
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { 
    currentPath,
    navigate,
    currentRole, 
    setCurrentRole,
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
      
      {/* Role Test Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-artiva-teal/30 text-teal-300 px-2 py-0.5 rounded font-bold">
              <Zap className="w-3.5 h-3.5 text-teal-300" />
              Live Demo Mode Active
            </span>
            <span className="hidden sm:inline text-slate-400">
              Interactive session state in memory. Switch test roles anytime:
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-artiva">
            <button
              onClick={() => {
                setCurrentRole('resident');
                navigate('/directory');
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currentRole === 'resident'
                  ? 'bg-artiva-teal text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Resident View
            </button>

            <button
              onClick={() => {
                setCurrentRole('artisan');
                navigate('/artisan-dashboard');
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currentRole === 'artisan'
                  ? 'bg-artiva-teal text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Artisan View
            </button>

            <button
              onClick={() => {
                setCurrentRole('admin');
                navigate('/admin/verifications');
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currentRole === 'admin'
                  ? 'bg-artiva-gold text-slate-900 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Shield Mark */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-artiva bg-artiva-teal text-white flex items-center justify-center shadow-artiva-sm group-hover:scale-105 transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">Artiva</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-artiva-teal-light text-artiva-teal-dark rounded">Estate</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Verified Artisans • Escrow Vault</p>
            </div>
          </div>

          {/* Registered Estate Selector */}
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

          {/* Navigation Links with Active URL matching */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                currentPath === '/'
                  ? 'bg-artiva-teal-light text-artiva-teal-dark shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
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
              <span>Directory</span>
            </button>

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
                  <span>Bookings</span>
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
                  <span className="hidden md:inline">Disputes</span>
                  {activeDisputesCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] rounded-full font-bold">
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

            {currentRole === 'admin' && (
              <button
                onClick={() => navigate('/admin/verifications')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold transition-all ${
                  currentPath === '/admin/verifications'
                    ? 'bg-artiva-gold-light text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-artiva-gold-dark" />
                <span>Verification Review Queue</span>
              </button>
            )}
          </nav>

          {/* User Auth Buttons */}
          <div className="flex items-center gap-2">
            {userSession ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{userSession.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{userSession.phone}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  title="Sign out"
                  icon={<LogOut className="w-4 h-4 text-slate-400" />}
                >
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  icon={<LogIn className="w-3.5 h-3.5" />}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
