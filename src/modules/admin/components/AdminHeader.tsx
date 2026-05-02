import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, Menu, Loader2 } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import { Link, useNavigate } from 'react-router-dom';
import UserNav from '../../../shared/components/UserNav';
import { useAdminStore } from '../store/useAdminStore';
import clsx from 'clsx';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const AdminHeader = ({ onMenuToggle }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { searchGlobal, searchResults, searchLoading, notificationCount, fetchNotificationCount } = useAdminStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch notification count on mount
  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchGlobal(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, searchGlobal]);

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasResults =
    searchResults &&
    (searchResults.trips.length > 0 || searchResults.buses.length > 0 || searchResults.drivers.length > 0);

  return (
    <header
      className="h-16 sm:h-20 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8
                 fixed top-0 right-0 left-0 lg:left-64 z-20 font-sans
                 border-b border-gray-100 shadow-sm"
    >
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-[#1A1A2E] tracking-tight">Dashboard</h2>
      </div>

      {/* Center Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-8" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchLoading && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
          )}
          <input
            type="text"
            placeholder="Search trips, buses, drivers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                       text-sm text-gray-600 focus:outline-none focus:border-blue-400
                       focus:ring-2 focus:ring-blue-50 focus:bg-white
                       transition-all placeholder:text-gray-400"
          />

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              {!hasResults && !searchLoading && (
                <p className="px-4 py-3 text-sm text-gray-400 font-medium">No results found for "{query}"</p>
              )}

              {searchResults?.trips && searchResults.trips.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trips</p>
                  {searchResults.trips.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { navigate(`/admin/trips/${t.id}`); setShowResults(false); setQuery(''); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-700 font-medium transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}

              {searchResults?.buses && searchResults.buses.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50">Buses</p>
                  {searchResults.buses.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { navigate(`/admin/fleet`); setShowResults(false); setQuery(''); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-700 font-medium transition-colors"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}

              {searchResults?.drivers && searchResults.drivers.length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50">Drivers</p>
                  {searchResults.drivers.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => { navigate(`/admin/drivers`); setShowResults(false); setQuery(''); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm text-gray-700 font-medium transition-colors"
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
            {notificationCount > 0 && (
              <span
                className={clsx(
                  'absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white',
                )}
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          <NotificationsDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        </div>

        {/* Settings */}
        <div className="relative hidden sm:block">
          <Link
            to="/admin/settings"
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* User Profile */}
        <UserNav />
      </div>
    </header>
  );
};

export default AdminHeader;
