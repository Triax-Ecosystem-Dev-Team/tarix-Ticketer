import { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, Menu } from 'lucide-react';
import SettingsDropdown from './SettingsDropdown';
import NotificationsDropdown from './NotificationsDropdown';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const AdminHeader = ({ onMenuToggle }: AdminHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="h-16 sm:h-20 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8
                       fixed top-0 right-0 left-0 lg:left-64 z-20 font-sans
                       border-b border-gray-100 shadow-sm">

      {/* Left: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible only on mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100
                     rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A2E] tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* Center Search — hidden on small screens */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search trips, buses, drivers..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                       text-sm text-gray-600 focus:outline-none focus:border-blue-400
                       focus:ring-2 focus:ring-blue-50 focus:bg-white
                       transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px]
                             font-bold flex items-center justify-center rounded-full border border-white">
              3
            </span>
          </button>
          <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>
        
        {/* Settings */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <SettingsDropdown isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-1 sm:pl-2 cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0EA5E9] flex items-center
                            justify-center text-white font-medium text-xs sm:text-sm">
              JM
            </div>
            {/* Name — hidden on mobile, shown sm+ */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-sm font-medium text-gray-700">John Manager</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl
                            shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-1 z-50">
              <div className="px-1 py-1">
                {['Profile', 'Settings', 'Help'].map((item) => (
                  <button 
                    key={item}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600
                               hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="h-px bg-gray-100 my-1 mx-4" />
              <div className="px-1 py-1">
                <button className="w-full text-left px-4 py-2.5 text-sm text-[#EF4444]
                                   hover:bg-red-50 rounded-lg transition-colors font-medium">
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
