import React, { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useDispatchStore } from '../store/useDispatchStore';

interface SalesOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalesOverviewModal: React.FC<SalesOverviewModalProps> = ({ isOpen, onClose }) => {
  const { salesData, fetchSalesStats } = useDispatchStore();
  const [error, setError] = React.useState<string | null>(null);
  const [isInternalLoading, setIsInternalLoading] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setIsInternalLoading(true);
        setError(null);
        try {
          await fetchSalesStats();
        } catch (err: any) {
          console.error(err);
          if (err.response?.status === 403) {
            setError("Access Denied: You don't have permission to view sales data.");
          } else {
            setError("Failed to load sales data. Please try again later.");
          }
        } finally {
          setIsInternalLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen, fetchSalesStats]);

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

           {error ? (
             <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
               <div className="bg-red-50 p-3 rounded-full mb-4">
                 <X className="w-6 h-6 text-red-500" />
               </div>
               <p className="text-text-dark font-bold mb-1">Error Loading Data</p>
               <p className="text-text-gray text-sm">{error}</p>
               <button 
                 onClick={() => fetchSalesStats()}
                 className="mt-6 text-primary-blue font-bold text-sm hover:underline"
               >
                 Try Again
               </button>
             </div>
           ) : isInternalLoading || !salesData ? (
             <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-4" />
               <p className="text-text-gray text-sm">Loading sales data...</p>
             </div>
           ) : (
             <>
               {/* Total Tickets Card */}
               <div className="bg-[#0095FF] rounded-xl p-4 sm:p-6 text-white shadow-lg shadow-blue-100">
                 <p className="text-sm font-medium opacity-90 mb-1">Total Tickets Sold</p>
                 <p className="text-4xl sm:text-[2.5rem] font-bold">{salesData.totalTickets}</p>
               </div>

               {/* Breakdown */}
               <div>
                 <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-4">PAYMENT METHOD BREAKDOWN</p>
                 
                 <div className="space-y-3">
                   {/* Cash */}
                   <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                     <div>
                       <p className="text-sm font-bold text-text-gray mb-1">Cash</p>
                       <p className="text-lg font-bold text-text-dark">{salesData.breakdown.cash.tickets} tickets</p>
                     </div>
                     <p className="text-lg font-bold text-[#F44336]">₦{salesData.breakdown.cash.revenue.toLocaleString()}</p>
                   </div>

                   {/* Transfer */}
                   <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                     <div>
                       <p className="text-sm font-bold text-text-gray mb-1">Transfer</p>
                       <p className="text-lg font-bold text-text-dark">{salesData.breakdown.transfer.tickets} tickets</p>
                     </div>
                     <p className="text-lg font-bold text-[#0095FF]">₦{salesData.breakdown.transfer.revenue.toLocaleString()}</p>
                   </div>

                   {/* Card */}
                   <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                     <div>
                       <p className="text-sm font-bold text-text-gray mb-1">Card</p>
                       <p className="text-lg font-bold text-text-dark">{salesData.breakdown.card.tickets} tickets</p>
                     </div>
                     <p className="text-lg font-bold text-[#00C853]">₦{salesData.breakdown.card.revenue.toLocaleString()}</p>
                   </div>
                 </div>
               </div>

               <hr className="border-gray-100" />

               {/* Total Revenue */}
               <div className="flex justify-between items-center pt-2 pb-2">
                 <p className="font-bold text-text-gray">Total Revenue</p>
                 <p className="text-2xl sm:text-3xl font-bold text-text-dark">₦{salesData.totalRevenue.toLocaleString()}</p>
               </div>
             </>
           )}

        </div>
      </div>
    </div>
  );
};

export default SalesOverviewModal;
