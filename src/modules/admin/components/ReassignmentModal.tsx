import { useState, useMemo } from 'react';
import { X, AlertCircle, Search, Bus, CheckCircle2, Loader2 } from 'lucide-react';
import { useFleetStore } from '../store/useFleetStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export default function ReassignmentModal() {
  const { conflictData, setConflictData, buses, reassignTrip } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNewBusId, setSelectedNewBusId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!conflictData) return null;

  // Filter available buses that meet the capacity requirement
  const availableReplacements = useMemo(() => {
    return buses.filter(bus => 
      bus.status === 'Available' && 
      bus.id !== conflictData.busId && // Not the current bus
      (parseInt(bus.totalCapacity) || parseInt(bus.capacity) || 0) >= conflictData.requiredCapacity &&
      (bus.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [buses, conflictData, searchTerm]);

  const handleReassign = async () => {
    if (!selectedNewBusId) {
      setError('Please select a replacement bus first.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const loadingToast = toast.loading('Processing Reassignment...');

    try {
      await reassignTrip(conflictData.id, selectedNewBusId, conflictData.targetStatus);
      toast.success(`Trip successfully moved. Bus is now in ${conflictData.targetStatus} status.`, { id: loadingToast });
      setConflictData(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Reassignment failed';
      setError(msg);
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentBus = buses.find(b => b.id === conflictData.busId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden font-sans border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1e293b]">Operational Conflict</h3>
              <p className="text-[12.5px] text-slate-500 font-medium">Reassignment required to proceed</p>
            </div>
          </div>
          <button 
            onClick={() => setConflictData(null)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Conflict Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
            <p className="text-[13.5px] text-slate-600 leading-relaxed">
              <span className="font-bold text-[#1e293b]">{currentBus?.registrationNumber}</span> is currently on the <span className="font-bold text-[#1e293b]">{conflictData.departureTerminal} → {conflictData.arrivalTerminal}</span> route. 
            </p>
            <div className="mt-3 flex items-center gap-4 text-[12px] font-bold uppercase tracking-wider text-amber-600">
              <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-amber-100 shadow-sm">
                <Bus className="w-3.5 h-3.5" />
                Req. Capacity: {conflictData.requiredCapacity}
              </span>
            </div>
          </div>

          <h4 className="text-[14px] font-bold text-[#1e293b] mb-4">Select Replacement Bus</h4>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search available buses..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="space-y-2 mb-4">
            {availableReplacements.length > 0 ? (
              availableReplacements.map(bus => (
                <button
                  key={bus.id}
                  onClick={() => {
                    setSelectedNewBusId(bus.id);
                    setError(null);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    selectedNewBusId === bus.id 
                      ? "border-[#0ea5e9] bg-sky-50 shadow-sm" 
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      selectedNewBusId === bus.id ? "bg-[#0ea5e9] text-white" : "bg-white border border-slate-200 text-slate-400 group-hover:text-slate-600"
                    )}>
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#1e293b]">{bus.registrationNumber}</p>
                      <p className="text-[12px] text-slate-500 font-medium">{bus.manufacturer} {bus.model} • {bus.totalCapacity || bus.capacity} seats</p>
                    </div>
                  </div>
                  {selectedNewBusId === bus.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#0ea5e9] animate-in zoom-in-50 duration-200" />
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[13px] text-slate-400 font-medium">No suitable available buses found.</p>
              </div>
            )}
          </div>

          {error && (
            <p className="text-[12.5px] font-medium text-red-500 mb-4 animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            onClick={() => setConflictData(null)}
            className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleReassign}
            disabled={isSubmitting || !selectedNewBusId}
            className="flex-[1.5] py-3 px-4 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-sky-100 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Swapping Bus...
              </>
            ) : (
              'Confirm & Swap Bus'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
