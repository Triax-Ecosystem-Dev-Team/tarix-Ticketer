import React, { useEffect, useState } from 'react';
import { X, PartyPopper } from 'lucide-react';

interface CashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnings?: number;
  totalBookings?: number;
  rate?: number;
  totalTrips?: number;
}

const CashbackModal: React.FC<CashbackModalProps> = ({
  isOpen,
  onClose,
  earnings = 950.00,
  totalBookings = 380000,
  rate = 0.25,
  totalTrips = 20,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}>
      <div 
        className={`bg-white w-full max-w-[420px] rounded-3xl shadow-2xl transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        <div className="p-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💰</span> Your Cashback Earnings
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-[#1DBF57] rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-90 mb-1">Total Cashback Earned</p>
              <h3 className="text-4xl font-bold mb-2">
                ₦{earnings.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-white/80">From ₦{totalBookings.toLocaleString()} in total bookings</p>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Cashback Rate</p>
              <p className="text-xl font-bold text-gray-800">{rate}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium mb-1">Total Trips</p>
              <p className="text-xl font-bold text-gray-800">{totalTrips}</p>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex items-center justify-center gap-2">
            <PartyPopper className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-semibold text-blue-600">
              Keep booking to earn more cashback!
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[#00A86B]/20"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashbackModal;
