
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../modules/auth/store/useAuthStore';
import { getAvatarSrc } from '../utils/imageUtils';

const UserNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const dropdownItems = user.role === 'Admin' 
    ? [
        { name: 'Profile', path: '/admin/account/profile', icon: User },
        { name: 'Settings', path: '/admin/account/settings', icon: Settings },
        { name: 'Help', path: '/admin/account/help', icon: HelpCircle }
      ]
    : [
        { name: 'Profile', path: '/account/profile', icon: User },
        { name: 'Settings', path: '/account/settings', icon: Settings },
        { name: 'Help', path: '/account/help', icon: HelpCircle }
      ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 pl-2 cursor-pointer focus:outline-none group"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-blue flex items-center
                        justify-center text-white font-bold text-xs sm:text-sm shadow-sm group-hover:bg-[#0086E6] transition-colors overflow-hidden">
          {getAvatarSrc(user.avatar) ? (
            <img src={getAvatarSrc(user.avatar)!} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        {/* Name — hidden on mobile, shown sm+ */}
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="text-left">
            <p className="text-sm font-bold text-gray-700 leading-tight">{user.name}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-tight">{user.role}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-xl
                        shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in duration-150">
          <div className="px-3 py-2 border-b border-gray-50 mb-1 sm:hidden">
            <p className="text-sm font-bold text-gray-700">{user.name}</p>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{user.role}</p>
          </div>
          
          <div className="px-1.5 py-1">
            {dropdownItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path}
                onClick={() => setIsDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600
                           hover:bg-gray-50 hover:text-primary-blue rounded-lg transition-colors group"
              >
                <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary-blue transition-colors" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="h-px bg-gray-100 my-1 mx-3" />
          <div className="px-1.5 py-1">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#EF4444]
                                 hover:bg-red-50 rounded-lg transition-colors font-semibold group"
            >
              <LogOut className="w-4 h-4 text-[#EF4444] transition-transform group-hover:translate-x-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNav;
