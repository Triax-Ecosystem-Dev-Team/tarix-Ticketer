import { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Fingerprint,
  Globe,
  BellRing,
  Moon,
  Mail,
  Building2,
  CreditCard,
  Users,
  Code2,
  HelpCircle,
  FileText,
  MessageSquare,
  Bug,
  Activity,
  Info,
  Keyboard,
  LogOut,
  X,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

// ── Shared components ─────────────────────────────────────────────────────────

const Badge = ({ children, color = 'green' }: { children: React.ReactNode; color?: 'green' | 'teal' }) => {
  return (
    <span
      className={clsx(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.3px]',
        color === 'green' ? 'bg-[#1abc9c] text-white' : 'bg-[#3bb6e0] text-white'
      )}
    >
      {children}
    </span>
  );
};

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!on)}
    className={clsx(
      'w-9 h-5 rounded-full flex items-center px-[3px] transition-colors flex-shrink-0',
      on ? 'bg-[#1abc9c]' : 'bg-slate-200'
    )}
  >
    <div
      className={clsx(
        'w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200',
        on ? 'translate-x-4' : 'translate-x-0'
      )}
    />
  </button>
);

const SectionLabel = ({ label }: { label: string }) => (
  <div className="px-5 pt-3.5 pb-1.5 text-[10.5px] font-semibold tracking-[0.9px] uppercase text-slate-400">
    {label}
  </div>
);

interface RowProps {
  icon: LucideIcon;
  label: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

const Row = ({ icon: Icon, label, right, onClick, danger = false }: RowProps) => (
  <button
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-colors text-left',
      danger ? 'hover:bg-red-50 text-red-500' : 'hover:bg-slate-50 text-slate-700'
    )}
  >
    <Icon size={17} strokeWidth={1.8} className={clsx('flex-shrink-0', danger ? 'text-red-500' : 'text-[#3bb6e0]')} />
    <span className={clsx('flex-1 text-[13.5px] font-medium', danger ? '' : 'text-slate-700')}>{label}</span>
    {right && <span className="flex items-center text-slate-400 text-xs">{right}</span>}
  </button>
);

const Divider = () => <div className="h-px bg-slate-100 my-1" />;

// ── Main Widget ───────────────────────────────────────────────────────────────

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDropdown({ isOpen, onClose }: SettingsDropdownProps) {
  const navigate = useNavigate();
  const [notifOn, setNotifOn] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown Panel */}
      <div 
        className="absolute right-0 top-12 mt-2 w-full min-w-[320px] max-w-[360px] bg-white rounded-2xl
                   shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-slate-100 
                   max-h-[85vh] overflow-y-auto hide-scrollbar z-50
                   origin-top-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-2xl">
            <span className="font-['Sora',sans-serif] text-base font-bold text-slate-900">Settings</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700
                         flex items-center justify-center transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          <div className="pb-2">
            {/* ACCOUNT */}
            <SectionLabel label="Account" />
            <Row 
              icon={User} 
              label="Profile Settings" 
              onClick={() => {
                navigate('/account/profile');
                onClose();
              }}
            />
            <Row 
              icon={Shield} 
              label="Account Security" 
              onClick={() => {
                navigate('/account/settings');
                onClose();
              }}
            />
            <Row icon={KeyRound} label="Change Password" />
            <Row
              icon={Fingerprint}
              label="Two-Factor Authentication"
              right={<Badge color="green">Enabled</Badge>}
            />

            <Divider />

            {/* PREFERENCES */}
            <SectionLabel label="Preferences" />
            <Row
              icon={Globe}
              label="Language & Region"
              right={<span className="text-slate-400 text-[12px]">English (NG)</span>}
            />
            <Row
              icon={BellRing}
              label="Notifications"
              right={<Toggle on={notifOn} onChange={setNotifOn} />}
            />
            <Row
              icon={Moon}
              label="Theme"
              right={
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 text-[12px]">Light</span>
                  <ChevronRight size={14} />
                </div>
              }
            />
            <Row icon={Mail} label="Email Preferences" />

            <Divider />

            {/* BUSINESS */}
            <SectionLabel label="Business" />
            <Row icon={Building2} label="Company Profile" />
            <Row
              icon={CreditCard}
              label="Billing & Subscription"
              right={<Badge color="green">Active</Badge>}
            />
            <Row
              icon={Users}
              label="Team Members"
              right={<span className="text-slate-400 text-[12px] font-semibold">3</span>}
            />
            <Row icon={Code2} label="API Keys" />

            <Divider />

            {/* SUPPORT */}
            <SectionLabel label="Support" />
            <Row 
              icon={HelpCircle} 
              label="Help Center" 
              right={<ChevronRight size={14} />} 
              onClick={() => {
                navigate('/account/help');
                onClose();
              }}
            />
            <Row icon={FileText} label="Documentation" right={<ChevronRight size={14} />} />
            <Row icon={MessageSquare} label="Contact Support" />
            <Row icon={Bug} label="Report a Bug" />

            <Divider />

            {/* SYSTEM */}
            <SectionLabel label="System" />
            <Row
              icon={Activity}
              label="System Status"
              right={
                <span className="flex items-center gap-1.5 text-[11px] text-[#1abc9c] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1abc9c]" />
                  Operational
                </span>
              }
            />
            <Row
              icon={Info}
              label="About TARIX"
              right={<span className="text-slate-400 text-[12px]">v2.8</span>}
            />
            <Row
              icon={Keyboard}
              label="Keyboard Shortcuts"
              right={
                <span className="text-slate-400 text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded-md">
                  ⌘K
                </span>
              }
            />

            {/* LOGOUT */}
            <div className="mt-1 pt-1 border-t border-slate-100">
              <Row icon={LogOut} label="Logout" danger />
            </div>
          </div>
      </div>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </>
  );
}
