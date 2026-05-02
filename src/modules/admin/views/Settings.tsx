import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Key, Shield,
  Globe, Bell, Sun, Mail,
  Building, CreditCard, Users, Code,
  Activity, Info, HelpCircle,
  DollarSign, Loader2, Save,
  ChevronRight,
} from 'lucide-react';
import api from '../../../shared/api';
import { useAuthStore } from '../../auth/store/useAuthStore';

// ─── Reusable Card ────────────────────────────────────────────────────────────
interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: { label: string; color: 'green' | 'slate' };
  onClick?: () => void;
  children?: React.ReactNode;
}

function SettingCard({ icon, title, description, badge, onClick, children }: SettingCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={`bg-white rounded-2xl p-5 border border-slate-200 flex flex-col items-start gap-3 transition-all duration-200 relative
        ${onClick ? 'cursor-pointer hover:border-[#0ea5e9] hover:shadow-md hover:shadow-blue-50/60 active:scale-[0.99]' : ''}`}
    >
      {badge && (
        <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide
          ${badge.color === 'green' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {badge.label}
        </span>
      )}
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-bold text-slate-800 mb-0.5">{title}</h3>
        <p className="text-[12.5px] text-slate-500 leading-relaxed">{description}</p>
      </div>
      {children && <div className="w-full">{children}</div>}
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ title, description, adminOnly }: { title: string; description: string; adminOnly?: boolean }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 text-center sm:text-left">
      <div>
        <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          {title}
          {adminOnly && (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full tracking-wide border border-amber-200">
              Admin only
            </span>
          )}
        </h2>
        <p className="text-[12.5px] text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  // Global Pricing state (Admin only)
  const [extraBaggagePrice, setExtraBaggagePrice] = useState<number>(0);
  const [isFetchingPrice, setIsFetchingPrice] = useState(true);
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [priceMessage, setPriceMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data?.data) setExtraBaggagePrice(res.data.data.extraBaggagePrice);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setIsFetchingPrice(false);
      }
    };
    fetchSettings();
  }, [isAdmin]);

  const handleSavePricing = async () => {
    setIsSavingPrice(true);
    setPriceMessage(null);
    try {
      const res = await api.put('/settings', { extraBaggagePrice });
      if (res.data?.data) {
        setExtraBaggagePrice(res.data.data.extraBaggagePrice);
        setPriceMessage({ type: 'success', text: 'Pricing updated successfully!' });
        setTimeout(() => setPriceMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setPriceMessage({ type: 'error', text: 'Failed to update. Please try again.' });
    } finally {
      setIsSavingPrice(false);
    }
  };

  const profilePath = isAdmin ? '/admin/account/profile' : '/account/profile';
  const securityPath = isAdmin ? '/admin/account/security' : '/account/security';
  const preferencesPath = isAdmin ? '/admin/account/preferences' : '/account/preferences';

  const isAnyNotifEnabled = user?.notifEmail || user?.notifSms || user?.notifPush;

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 pt-2">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center sm:justify-start gap-1.5 text-[12px] font-medium text-slate-400 mb-3">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700">Settings</span>
        </nav>

        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-[13.5px] text-slate-500 mt-1">
              Manage your account, preferences
              {isAdmin && ', business configuration, and global pricing'}.
            </p>
          </div>

          {/* System Status pill */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none mb-0.5">System Status</p>
              <p className="text-[12px] font-semibold text-emerald-600 leading-none">All operational</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        {/* ── Account ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Account"
            description="Manage your account security and personal information"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SettingCard
              icon={<User className="w-4.5 h-4.5 text-[#0ea5e9]" />}
              title="Profile Settings"
              description="Update your name, email, and contact info."
              onClick={() => navigate(profilePath)}
            />
            <SettingCard
              icon={<Lock className="w-4.5 h-4.5 text-[#ec4899]" />}
              title="Account Security"
              description="Review login activity and security events."
              onClick={() => navigate(securityPath)}
            />
            <SettingCard
              icon={<Key className="w-4.5 h-4.5 text-[#f59e0b]" />}
              title="Change Password"
              description="Update your account password regularly."
              onClick={() => navigate(securityPath)}
            />
            <SettingCard
              icon={<Shield className="w-4.5 h-4.5 text-[#10b981]" />}
              title="Two-Factor Auth"
              description="Add an extra layer of login security."
              badge={{ label: user?.twoFaEnabled ? 'Enabled' : 'Disabled', color: user?.twoFaEnabled ? 'green' : 'slate' }}
              onClick={() => navigate(securityPath)}
            />
          </div>
        </section>

        {/* ── Preferences ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeading
            title="Preferences"
            description="Customize your dashboard and notification experience"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SettingCard
              icon={<Globe className="w-4.5 h-4.5 text-[#0ea5e9]" />}
              title="Language & Region"
              description="Set your preferred language and locale."
              onClick={() => navigate(preferencesPath)}
            />
            <SettingCard
              icon={<Bell className="w-4.5 h-4.5 text-[#ec4899]" />}
              title="Notifications"
              description="Configure email, SMS and push alerts."
              badge={{ label: isAnyNotifEnabled ? 'On' : 'Off', color: isAnyNotifEnabled ? 'green' : 'slate' }}
              onClick={() => navigate(preferencesPath)}
            />
            <SettingCard
              icon={<Sun className="w-4.5 h-4.5 text-[#f59e0b]" />}
              title="Theme"
              description="Switch between light, dark, or system theme."
              onClick={() => navigate(preferencesPath)}
            />
            <SettingCard
              icon={<Mail className="w-4.5 h-4.5 text-[#10b981]" />}
              title="Email Preferences"
              description="Control marketing and digest emails."
              onClick={() => navigate(preferencesPath)}
            />
          </div>
        </section>

        {/* ── Business (Admin only) ────────────────────────────────────────────── */}
        {isAdmin && (
          <section>
            <SectionHeading
              title="Business"
              description="Configure company settings and integrations"
              adminOnly
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SettingCard
                icon={<Building className="w-4.5 h-4.5 text-[#0ea5e9]" />}
                title="Company Profile"
                description="Manage company information and branding."
              />
              <SettingCard
                icon={<CreditCard className="w-4.5 h-4.5 text-[#ec4899]" />}
                title="Billing & Subscription"
                description="View and manage your subscription plan."
                badge={{ label: 'Active', color: 'green' }}
              />
              <SettingCard
                icon={<Users className="w-4.5 h-4.5 text-[#f59e0b]" />}
                title="Team Members"
                description="Add and manage team roles and permissions."
                badge={{ label: '3 members', color: 'slate' }}
              />
              <SettingCard
                icon={<Code className="w-4.5 h-4.5 text-[#10b981]" />}
                title="API Keys"
                description="Generate keys for third-party integrations."
              />
            </div>
          </section>
        )}

        {/* ── Global Pricing (Admin only) ──────────────────────────────────────── */}
        {isAdmin && (
          <section>
            <SectionHeading
              title="Global Pricing"
              description="Manage application-wide fees applied at checkout"
              adminOnly
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SettingCard
                icon={<DollarSign className="w-4.5 h-4.5 text-emerald-500" />}
                title="Extra Baggage Price"
                description="Base price charged per unit of extra baggage."
              >
                <div className="mt-1 space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₦</span>
                    <input
                      type="number"
                      value={extraBaggagePrice}
                      onChange={(e) => setExtraBaggagePrice(Number(e.target.value))}
                      disabled={isFetchingPrice || isSavingPrice}
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm
                                 focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all
                                 font-medium text-slate-700 disabled:opacity-60"
                    />
                  </div>
                  <button
                    onClick={handleSavePricing}
                    disabled={isFetchingPrice || isSavingPrice}
                    className="w-full py-2 bg-[#0ea5e9] text-white rounded-xl text-[13px] font-bold
                               hover:bg-[#0284c7] transition-all flex items-center justify-center gap-2
                               disabled:opacity-60 shadow-sm shadow-blue-100"
                  >
                    {isSavingPrice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save
                  </button>
                  {priceMessage && (
                    <p className={`text-[11.5px] font-semibold text-center ${
                      priceMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {priceMessage.text}
                    </p>
                  )}
                </div>
              </SettingCard>
            </div>
          </section>
        )}

        {/* ── System Information ───────────────────────────────────────────────── */}
        <section>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-5">System Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                  <Info className="w-4 h-4 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700 mb-0.5">Version</p>
                  <p className="text-[12.5px] text-slate-500">TARIX Manager v2.0.0</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700 mb-0.5">System Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[12.5px] text-emerald-600 font-medium">Operational</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-700 mb-0.5">Support</p>
                  <a href="#" className="text-[12.5px] text-[#0ea5e9] hover:underline font-medium">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
