import React from 'react';
import { X } from 'lucide-react';

interface SalesOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalesOverviewModal: React.FC<SalesOverviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-full sm:max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-2">
          <h2 className="text-xl font-bold text-text-dark">Sales Overview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 pt-2 space-y-6">
           <hr className="border-gray-100" />

           {/* Total Tickets Card */}
           <div className="bg-[#0095FF] rounded-xl p-4 sm:p-6 text-white shadow-lg shadow-blue-100">
             <p className="text-sm font-medium opacity-90 mb-1">Total Tickets Sold</p>
             <p className="text-4xl sm:text-[2.5rem] font-bold">100</p>
           </div>

           {/* Breakdown */}
           <div>
             <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-4">PAYMENT METHOD BREAKDOWN</p>
             
             <div className="space-y-3">
               {/* Cash */}
               <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                 <div>
                   <p className="text-sm font-bold text-text-gray mb-1">Cash</p>
                   <p className="text-lg font-bold text-text-dark">46 tickets</p>
                 </div>
                 <p className="text-lg font-bold text-[#F44336]">₦386,750</p>
               </div>

               {/* Transfer */}
               <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                 <div>
                   <p className="text-sm font-bold text-text-gray mb-1">Transfer</p>
                   <p className="text-lg font-bold text-text-dark">33 tickets</p>
                 </div>
                 <p className="text-lg font-bold text-[#0095FF]">₦278,800</p>
               </div>

               {/* Card */}
               <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                 <div>
                   <p className="text-sm font-bold text-text-gray mb-1">Card</p>
                   <p className="text-lg font-bold text-text-dark">22 tickets</p>
                 </div>
                 <p className="text-lg font-bold text-[#00C853]">₦184,450</p>
               </div>
             </div>
           </div>

           <hr className="border-gray-100" />

           {/* Total Revenue */}
           <div className="flex justify-between items-center pt-2 pb-2">
             <p className="font-bold text-text-gray">Total Revenue</p>
             <p className="text-2xl sm:text-3xl font-bold text-text-dark">₦850,000</p>
           </div>

        </div>
      </div>
    </div>
  );
};

export default SalesOverviewModal;
