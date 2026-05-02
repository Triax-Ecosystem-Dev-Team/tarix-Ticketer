import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Lock, Eye, EyeOff,
  ShieldCheck, ShieldOff, Loader2, CheckCircle2, XCircle
} from 'lucide-react';
import { useAuthStore } from '../../../modules/auth/store/useAuthStore';

// ── Shared sub-components ─────────────────────────────────────────────────────
const PageCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 sm:p-8">{children}</div>
  </div>
);

interface FeedbackProps { type: 'success' | 'error'; text: string }
const Feedback: React.FC<FeedbackProps> = ({ type, text }) => (
  <div className={`flex items-center gap-2 text-sm font-bold mt-3 animate-in slide-in-from-left duration-300 ${type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
    {type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
    {text}
  </div>
);

// ── Password Field ─────────────────────────────────────────────────────────────
const PasswordField: React.FC<{
  label: string; id: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}> = ({ label, id, value, onChange, placeholder, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-slate-700 block">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          id={id} type={show ? 'text' : 'password'}
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px]
                     focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium text-slate-700"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Security: React.FC = () => {
  const { user, changePassword, toggle2FA } = useAuthStore();
  const isAdmin = user?.role === 'Admin';
  const backPath = isAdmin ? '/admin/account/settings' : '/account/settings';

  // Password form
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 2FA
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [twoFaMsg, setTwoFaMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const is2FAEnabled = user?.twoFaEnabled ?? false;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pw.next.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(pw.current, pw.next);
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPw({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwMsg(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password.';
      setPwMsg({ type: 'error', text: msg });
    } finally {
      setPwLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    setTwoFaMsg(null);
    setTwoFaLoading(true);
    try {
      await toggle2FA(!is2FAEnabled);
      setTwoFaMsg({
        type: 'success',
        text: `Two-Factor Authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}.`,
      });
      setTimeout(() => setTwoFaMsg(null), 3000);
    } catch {
      setTwoFaMsg({ type: 'error', text: 'Failed to update 2FA setting.' });
    } finally {
      setTwoFaLoading(false);
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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Security</h1>
        <p className="text-slate-500 text-sm">Manage your password and authentication methods</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Change Password ─────────────────────────────────────────────────── */}
        <PageCard>
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-[#0ea5e9]" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">Change Password</h2>
              <p className="text-[12.5px] text-slate-500">Choose a strong password and don't reuse it for other accounts.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
            <PasswordField
              label="Current Password" id="current-pw"
              value={pw.current} onChange={(v) => setPw(p => ({ ...p, current: v }))}
              placeholder="Enter your current password" required
            />
            <PasswordField
              label="New Password" id="new-pw"
              value={pw.next} onChange={(v) => setPw(p => ({ ...p, next: v }))}
              placeholder="Minimum 8 characters" required
            />
            <PasswordField
              label="Confirm New Password" id="confirm-pw"
              value={pw.confirm} onChange={(v) => setPw(p => ({ ...p, confirm: v }))}
              placeholder="Re-enter new password" required
            />

            {pwMsg && <Feedback type={pwMsg.type} text={pwMsg.text} />}

            <div className="pt-2">
              <button
                type="submit"
                disabled={pwLoading}
                className="flex items-center gap-2 px-8 py-3 bg-[#0ea5e9] text-white rounded-2xl text-sm font-bold
                           hover:bg-[#0284c7] transition-all shadow-sm shadow-blue-100 disabled:opacity-70 active:scale-95"
              >
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Update Password
              </button>
            </div>
          </form>
        </PageCard>

        {/* ── Two-Factor Authentication ───────────────────────────────────────── */}
        <PageCard>
          <div className="flex items-start sm:items-center gap-4 justify-between flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${is2FAEnabled ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                {is2FAEnabled
                  ? <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  : <ShieldOff className="w-5 h-5 text-slate-400" />
                }
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                  Two-Factor Authentication
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${is2FAEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </h2>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  Adds a second layer of security when signing in.
                </p>
              </div>
            </div>

            <button
              onClick={handle2FAToggle}
              disabled={twoFaLoading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 disabled:opacity-70 active:scale-95
                ${is2FAEnabled
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7] shadow-sm shadow-blue-100'
                }`}
            >
              {twoFaLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : is2FAEnabled ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />
              }
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>

          {twoFaMsg && <div className="mt-4"><Feedback type={twoFaMsg.type} text={twoFaMsg.text} /></div>}

          {is2FAEnabled && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-[13px] text-emerald-700 font-medium">
                ✓ Your account is protected with Two-Factor Authentication. A verification code will be sent to your registered phone when you sign in.
              </p>
            </div>
          )}
        </PageCard>

        {/* ── Active Sessions ─────────────────────────────────────────────────── */}
        <PageCard>
          <h2 className="text-[15px] font-bold text-slate-800 mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {[
              { device: 'Chrome on Windows', location: 'Lagos, NG', time: 'Current session', isCurrent: true },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[13.5px] font-bold text-slate-800">{session.device}</p>
                  <p className="text-[12px] text-slate-500">{session.location} · {session.time}</p>
                </div>
                {session.isCurrent
                  ? <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">Active</span>
                  : <button className="text-[12px] text-red-500 font-bold hover:underline">Revoke</button>
                }
              </div>
            ))}
          </div>
        </PageCard>

      </div>
    </div>
  );
};

export default Security;
