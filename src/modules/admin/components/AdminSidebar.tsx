import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Bus, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  FileText,
  CheckCircle,
  TrendingUp,
  BarChart3,
  X,
  UserPlus,
  UserCog,
} from 'lucide-react';
import clsx from 'clsx';
import logoWhite from '../../../assets/images/logo-white.webp';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();
  const [isTripsOpen, setIsTripsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  // Close sidebar on nav on mobile
  const handleNav = () => {
    onClose();
  };

  return (
    <aside
      className={clsx(
        // Base: fixed full-height sidebar
        'w-64 bg-[#1A1A2E] text-white flex flex-col h-screen fixed left-0 top-0 z-40 font-sans',
        // Mobile: slide in/out; Desktop: always visible
        'transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoWhite} alt="Tarix Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-white font-bold text-xl tracking-wide leading-none">TARIX</h1>
            <span className="text-slate-500 text-xs font-medium">Manager</span>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
        
        {/* Dashboard */}
        <Link
          to="/admin"
          onClick={handleNav}
          className={clsx(
            "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200",
            isActive('/admin') 
              ? "bg-[#0EA5E9]/20 text-[#0EA5E9]" 
              : "text-[#64748B] hover:text-white hover:bg-white/5"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>

        {/* Trips Accordion */}
        <div>
          <button 
            onClick={() => setIsTripsOpen(!isTripsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-[#64748B] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Trips</span>
            </div>
            {isTripsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isTripsOpen && (
            <div className="mt-1 space-y-1 pl-4">
              <Link
                to="/admin/trips/create"
                onClick={handleNav}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                  isActive('/admin/trips/create') 
                    ? "text-[#0EA5E9]" 
                    : "text-[#64748B] hover:text-white"
                )}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium text-sm">Create Trip</span>
              </Link>
              
              <Link
                to="/admin/trips"
                onClick={handleNav}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                  isActive('/admin/trips') 
                    ? "text-[#0EA5E9]" 
                    : "text-[#64748B] hover:text-white"
                )}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium text-sm">Trip Overview</span>
              </Link>

              <Link
                to="/admin/trips/completed"
                onClick={handleNav}
                className={clsx(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                  isActive('/admin/trips/completed') 
                    ? "text-[#0EA5E9]" 
                    : "text-[#64748B] hover:text-white"
                )}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Completed Trip</span>
              </Link>
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        {[
          { to: '/admin/buses',   icon: Bus,        label: 'Buses'    },
          { to: '/admin/drivers', icon: Users,       label: 'Drivers'  },
          { to: '/admin/revenue', icon: TrendingUp,  label: 'Revenue'  },
          { to: '/admin/reports', icon: BarChart3,   label: 'Reports'  },
          { to: '/admin/settings',icon: Settings,    label: 'Settings' },
          { to: '/admin/team/add',icon: UserPlus,    label: 'Add Team Member' },
          { to: '/admin/team',    icon: UserCog,     label: 'Member Manager' },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={handleNav}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive(to)
                ? "bg-[#0EA5E9]/20 text-[#0EA5E9]"
                : "text-[#64748B] hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium text-sm">{label}</span>
          </Link>
        ))}

      </nav>

      {/* User Profile + Logout */}
      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white font-medium flex-shrink-0">
            JM
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">John Mark</p>
            <p className="text-xs text-[#64748B] truncate">john@tarix.com</p>
          </div>
        </div>

        <button className="flex items-center gap-3 px-2 text-[#EF4444] hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
