import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Wallet, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../../../modules/auth/store/useAuthStore';
import UserNav from '../../../../shared/components/UserNav';
import CashbackModal from '../modals/CashbackModal';
import SalesOverviewModal from '../SalesOverviewModal';
import logo from '../../../../assets/images/logo.webp';

const TicketerHeader: React.FC = () => {
  const [isCashbackModalOpen, setIsCashbackModalOpen] = React.useState(false);
  const [isSalesOverviewOpen, setIsSalesOverviewOpen] = React.useState(false);
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  // Format wallet balance
  const walletBalance = user && 'walletBalance' in user ? (user as any).walletBalance : 1000000;
  const formattedBalance = user
    ? `₦${walletBalance.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : '₦0.00';

  if (!user) return null;

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6">
        {/* Left Section: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center cursor-pointer group">
            <img 
              src={logo} 
              alt="TARIX Logo" 
              className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/find-ticket"
              className="text-gray-500 text-sm font-bold hover:text-primary-blue transition-colors relative group"
            >
              Find Ticket
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/bus-status"
              className="text-gray-500 text-sm font-bold hover:text-primary-blue transition-colors relative group"
            >
              Bus Status
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full" />
            </Link>
            <button
              onClick={() => setIsSalesOverviewOpen(true)}
              className="text-gray-500 text-sm font-bold hover:text-primary-blue transition-colors relative group"
            >
              Overview
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>
        </div>

        {/* Right Section: Wallet, Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-3">
            {/* Cashback Button */}
            <button 
              onClick={() => setIsCashbackModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cashback-green text-white text-[12px] font-bold shadow-sm hover:bg-[#00C05B] transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Get Cashback</span>
            </button>

            {/* Wallet Button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-text-dark text-[12px] font-bold hover:bg-gray-100 transition-all">
              <Wallet className="w-3.5 h-3.5 text-primary-blue" />
              <span>{formattedBalance}</span>
            </button>
          </div>

          <div className="h-8 w-px bg-gray-100 hidden sm:block" />

          {/* Centralized User Profile & Logout */}
          <UserNav />

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {isNavOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute top-full left-0 w-full z-40 animate-in slide-in-from-top duration-200">
          <ul className="flex flex-col p-4 gap-2">
            <li>
              <Link
                to="/find-ticket"
                onClick={() => setIsNavOpen(false)}
                className="flex items-center px-4 py-3 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:text-primary-blue rounded-xl transition-colors"
              >
                Find Ticket
              </Link>
            </li>
            <li>
              <Link
                to="/bus-status"
                onClick={() => setIsNavOpen(false)}
                className="flex items-center px-4 py-3 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:text-primary-blue rounded-xl transition-colors"
              >
                Bus Status
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsSalesOverviewOpen(true);
                  setIsNavOpen(false);
                }}
                className="w-full text-left flex items-center px-4 py-3 text-gray-600 text-sm font-bold hover:bg-gray-50 hover:text-primary-blue rounded-xl transition-colors"
              >
                Overview
              </button>
            </li>
          </ul>
        </div>
      )}

      <CashbackModal 
        isOpen={isCashbackModalOpen} 
        onClose={() => setIsCashbackModalOpen(false)} 
      />
      <SalesOverviewModal
        isOpen={isSalesOverviewOpen}
        onClose={() => setIsSalesOverviewOpen(false)}
      />
    </header>
  );
};

export default TicketerHeader;
