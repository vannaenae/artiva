import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Phone, Mail, MapPin, Edit3, Trash2, CheckCircle2, ShieldAlert, Bell, BellOff } from 'lucide-react';
import { isFirebaseConfigured } from '../lib/firebase';
import { enablePushNotifications } from '../lib/push';

export const ProfilePage: React.FC = () => {
  const { userSession, updateUserSession, logout, selectedEstate } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userSession?.name || '');
  const [phone, setPhone] = useState(userSession?.phone || '');
  const [email, setEmail] = useState(userSession?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pushState, setPushState] = useState<'idle' | 'enabling' | 'on' | 'error'>('idle');
  const [pushError, setPushError] = useState('');

  const handleEnablePush = async () => {
    if (!userSession) return;
    setPushState('enabling');
    setPushError('');
    const result = await enablePushNotifications(userSession.id);
    if (result.success) {
      setPushState('on');
    } else {
      setPushState('error');
      setPushError(result.message || 'Could not enable notifications.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserSession({ name, phone, email });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your Artiva account? This action cannot be undone.')) {
      logout();
    }
  };

  // RequireAuth (in App.tsx) already redirects to /login when signed out —
  // this is just a type-narrowing guard for the render below.
  if (!userSession) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">My Profile & Contact Details</h1>
          <p className="text-xs text-slate-500">Manage your account information and preferences</p>
        </div>
        <Button
          variant={isEditing ? 'ghost' : 'outline'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          icon={<Edit3 className="w-4 h-4" />}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      <Card className="p-6 space-y-6">
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={<User className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              icon={<Phone className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4 text-slate-400" />}
            />
            <Button type="submit" variant="gold" size="md" fullWidth>
              Save Changes
            </Button>
          </form>
        ) : (
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center gap-3 pb-3">
              <div className="w-12 h-12 rounded-full bg-artiva-teal-light text-artiva-teal-dark flex items-center justify-center font-bold text-lg font-heading">
                {userSession.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-heading">{userSession.name}</h3>
                <span className="text-xs uppercase font-bold text-artiva-teal bg-artiva-teal-light px-2 py-0.5 rounded">
                  {userSession.role} Account
                </span>
              </div>
            </div>

            <div className="pt-3 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Contact Number:
                </span>
                <span className="font-bold text-slate-900 font-mono">{userSession.phone}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address:
                </span>
                <span className="font-bold text-slate-900">{userSession.email || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Estate Location:
                </span>
                <span className="font-bold text-slate-900">{selectedEstate.name}</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Push Notifications */}
      {isFirebaseConfigured && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              {pushState === 'on' ? (
                <Bell className="w-4 h-4 text-artiva-teal mt-0.5 shrink-0" />
              ) : (
                <BellOff className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-heading">Push Notifications</h4>
                <p className="text-[11px] text-slate-500">
                  {pushState === 'on'
                    ? 'On — you\'ll be notified of booking updates and new messages.'
                    : 'Get notified when a booking updates or you get a new message.'}
                </p>
                {pushState === 'error' && (
                  <p className="text-[11px] text-rose-600 mt-1">{pushError}</p>
                )}
              </div>
            </div>
            {pushState !== 'on' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnablePush}
                disabled={pushState === 'enabling'}
              >
                {pushState === 'enabling' ? 'Enabling…' : 'Enable'}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Danger Zone: Account Deletion */}
      <Card className="p-4 border-rose-200 bg-rose-50/40 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-900 font-heading flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Danger Zone
            </h4>
            <p className="text-[11px] text-rose-700">Permanently remove your account and active booking history.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAccount}
            className="text-rose-600 border-rose-300 hover:bg-rose-100"
            icon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};
