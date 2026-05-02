import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sun, Moon, Monitor,
  Bell, MessageSquare, Mail, Loader2, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuthStore } from '../../../modules/auth/store/useAuthStore';

// ── Utility components ────────────────────────────────────────────────────────
const PageCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    <div className="p-6 sm:p-8">{children}</div>
  </div>
);

interface FeedbackProps { type: 'success' | 'error'; text: string }
const Feedback: React.FC<FeedbackProps> = ({ type, text }) => (
  <div className={`flex items-center gap-2 text-sm font-bold animate-in slide-in-from-left duration-300 ${type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
    {text}
  </div>
);

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle: React.FC<{ on: boolean; onChange: () => void; disabled?: boolean; color?: string }> = ({
  on, onChange, disabled, color = 'bg-[#0ea5e9]',
}) => (
  <button
    onClick={onChange}
    disabled={disabled}
    type="button"
    className={`w-11 h-6 rounded-full flex items-center px-[3px] transition-all duration-300 flex-shrink-0 disabled:opacity-50
      ${on ? color : 'bg-slate-200'}`}
  >
    <div className={`w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// ── Notification Row ──────────────────────────────────────────────────────────
interface NotifRowProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  on: boolean;
  onToggle: () => void;
  loading?: boolean;
}
const NotifRow: React.FC<NotifRowProps> = ({ icon, label, sub, on, onToggle, loading }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-bold text-slate-800">{label}</p>
        <p className="text-[12px] text-slate-500">{sub}</p>
      </div>
    </div>
    {loading
      ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      : <Toggle on={on} onChange={onToggle} />
    }
  </div>
);

// ── Theme Card ────────────────────────────────────────────────────────────────
interface ThemeCardProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}
const ThemeCard: React.FC<ThemeCardProps> = ({ id, icon, label, desc, selected, onClick }) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer flex-1 min-w-[100px]
      ${selected
        ? 'border-[#0ea5e9] bg-blue-50/60 shadow-sm shadow-blue-100'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-[#0ea5e9] text-white' : 'bg-slate-100 text-slate-400'}`}>
      {icon}
    </div>
    <p className={`text-[13px] font-bold ${selected ? 'text-[#0ea5e9]' : 'text-slate-700'}`}>{label}</p>
    <p className="text-[11px] text-slate-500 text-center leading-tight">{desc}</p>
  </button>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const Preferences: React.FC = () => {
  const { user, updatePreferences } = useAuthStore();
  const isAdmin = user?.role === 'Admin';
  const backPath = isAdmin ? '/admin/account/settings' : '/account/settings';

  // Derive current prefs from the store — no stale local defaults
  const currentTheme = (user?.theme as 'light' | 'dark' | 'system') ?? 'light';
  const [selectedTheme, setSelectedTheme] = React.useState<'light' | 'dark' | 'system'>(currentTheme);
  const [themeLoading, setThemeLoading] = React.useState(false);
  const [themeMsg, setThemeMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [notifStates, setNotifStates] = React.useState({
    email: user?.notifEmail ?? true,
    sms: user?.notifSms ?? true,
    push: user?.notifPush ?? true,
  });
  const [notifLoading, setNotifLoading] = React.useState<string | null>(null);
  const [notifMsg, setNotifMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleThemeSave = async (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    setThemeMsg(null);
    setThemeLoading(true);
    try {
      await updatePreferences({ theme });
      setThemeMsg({ type: 'success', text: 'Theme preference saved.' });
      // Apply theme to <html> element
      document.documentElement.setAttribute('data-theme', theme);
      setTimeout(() => setThemeMsg(null), 3000);
    } catch {
      setThemeMsg({ type: 'error', text: 'Failed to save theme preference.' });
    } finally {
      setThemeLoading(false);
    }
  };

  const handleNotifToggle = async (key: 'email' | 'sms' | 'push') => {
    setNotifLoading(key);
    setNotifMsg(null);
    const newVal = !notifStates[key];
    setNotifStates(prev => ({ ...prev, [key]: newVal }));
    try {
      const fieldMap = { email: 'notifEmail', sms: 'notifSms', push: 'notifPush' } as const;
      await updatePreferences({ [fieldMap[key]]: newVal });
      setNotifMsg({ type: 'success', text: 'Notification preference updated.' });
      setTimeout(() => setNotifMsg(null), 3000);
    } catch {
      // Revert on error
      setNotifStates(prev => ({ ...prev, [key]: !newVal }));
      setNotifMsg({ type: 'error', text: 'Failed to update notification preference.' });
    } finally {
      setNotifLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 pb-20">
      {/* Back */}
      <Link
        to={backPath}
        className="inline-flex items-center text-slate-500 hover:text-[#0ea5e9] mb-8 transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Settings
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Preferences</h1>
        <p className="text-slate-500 text-sm">Customize your appearance and notification settings</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Theme ───────────────────────────────────────────────────────────── */}
        <PageCard>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">Appearance</h2>
              <p className="text-[12.5px] text-slate-500">Choose how TARIX looks on your device.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <ThemeCard
              id="theme-light"
              icon={<Sun className="w-5 h-5" />}
              label="Light"
              desc="Classic light interface"
              selected={selectedTheme === 'light'}
              onClick={() => handleThemeSave('light')}
            />
            <ThemeCard
              id="theme-dark"
              icon={<Moon className="w-5 h-5" />}
              label="Dark"
              desc="Easy on the eyes at night"
              selected={selectedTheme === 'dark'}
              onClick={() => handleThemeSave('dark')}
            />
            <ThemeCard
              id="theme-system"
              icon={<Monitor className="w-5 h-5" />}
              label="System"
              desc="Follows your OS preference"
              selected={selectedTheme === 'system'}
              onClick={() => handleThemeSave('system')}
            />
          </div>

          {themeLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </div>
          )}
          {themeMsg && !themeLoading && <Feedback type={themeMsg.type} text={themeMsg.text} />}
        </PageCard>

        {/* ── Notifications ───────────────────────────────────────────────────── */}
        <PageCard>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 pb-5 border-b border-slate-50 w-full">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-[#ec4899]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">Notifications</h2>
                <p className="text-[12.5px] text-slate-500">Control how and when you hear from TARIX.</p>
              </div>
            </div>
          </div>

          <NotifRow
            icon={<Mail className="w-4.5 h-4.5 text-[#0ea5e9]" />}
            label="Email Notifications"
            sub="Trip updates, reports and booking confirmations"
            on={notifStates.email}
            onToggle={() => handleNotifToggle('email')}
            loading={notifLoading === 'email'}
          />
          <NotifRow
            icon={<MessageSquare className="w-4.5 h-4.5 text-[#10b981]" />}
            label="SMS Notifications"
            sub="Urgent alerts and critical system notices"
            on={notifStates.sms}
            onToggle={() => handleNotifToggle('sms')}
            loading={notifLoading === 'sms'}
          />
          <NotifRow
            icon={<Bell className="w-4.5 h-4.5 text-[#f59e0b]" />}
            label="In-App Notifications"
            sub="Real-time alerts while using the dashboard"
            on={notifStates.push}
            onToggle={() => handleNotifToggle('push')}
            loading={notifLoading === 'push'}
          />

          {notifMsg && (
            <div className="mt-3">
              <Feedback type={notifMsg.type} text={notifMsg.text} />
            </div>
          )}
        </PageCard>

        {/* ── Language ────────────────────────────────────────────────────────── */}
        <PageCard>
          <h2 className="text-[15px] font-bold text-slate-800 mb-4">Language & Region</h2>
          <div className="max-w-xs">
            <label className="text-sm font-bold text-slate-700 block mb-2">Display Language</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] focus:outline-none focus:border-[#0ea5e9] text-slate-700 font-medium"
              defaultValue="en-NG"
            >
              <option value="en-NG">English (Nigeria)</option>
              <option value="en-GB">English (UK)</option>
              <option value="fr-FR">Français</option>
              <option value="ha">Hausa</option>
              <option value="yo">Yorùbá</option>
              <option value="ig">Igbo</option>
            </select>
          </div>
        </PageCard>

      </div>
    </div>
  );
};

export default Preferences;
