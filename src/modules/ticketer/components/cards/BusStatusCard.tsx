import React from 'react';
import { ArrowRight, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatchStore } from '../../store/useDispatchStore';

export interface BusStatus {
  id: string;
  status: 'Active' | 'In Transit' | 'Completed' | 'Delayed' | 'Cancelled';
  origin: string;
  destination: string;
  originTerminal: string;
  destinationTerminal: string;
  departureTime: string;
  arrivalTime: string;
  busType: string;
  driver: string;
  seatsBooked: number;
  totalSeats: number;
  passengersBooked: number;
}

interface BusStatusCardProps {
  bus: BusStatus;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ bus }) => {
  const navigate = useNavigate();
  const [isManageModalOpen, setIsManageModalOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null);
  const [actualArrival, setActualArrival] = React.useState('');
  const { updateBusStatus } = useDispatchStore();
  
  const occupancyPercentage = Math.round((bus.seatsBooked / bus.totalSeats) * 100) || 0;

  // 1. The Arrival Time "NaN" Fix Helper
  const calculateETA = (departure: string, durationHours: number = 4): string => {
    try {
      if (!departure) return 'Scheduled';
      
      const timeParts = departure.match(/(\d+):(\d+)/);
      if (!timeParts) return 'Scheduled';

      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);

      if (departure.toLowerCase().includes('pm') && hours < 12) hours += 12;
      if (departure.toLowerCase().includes('am') && hours === 12) hours = 0;

      const date = new Date();
      date.setHours(hours, minutes, 0);
      
      if (isNaN(date.getTime())) return 'Scheduled';

      const arrivalDate = new Date(date.getTime() + durationHours * 60 * 60 * 1000);
      return `${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')} (ETA)`;
    } catch (error) {
      return 'Scheduled';
    }
  };

  const arrivalDisplay = bus.arrivalTime && bus.arrivalTime !== 'TBD' 
    ? bus.arrivalTime 
    : calculateETA(bus.departureTime);

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === 'Completed' && selectedStatus !== 'Completed') {
        setSelectedStatus('Completed');
        setActualArrival(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        return;
    }

    try {
      setIsUpdating(true);
      await updateBusStatus(bus.id, newStatus, newStatus === 'Completed' ? actualArrival : undefined);
      setIsManageModalOpen(false);
      setSelectedStatus(null);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#22C55E] text-white';
      case 'In Transit':
        return 'bg-[#F59E0B] text-white';
      case 'Completed':
        return 'bg-gray-500 text-white';
      case 'Delayed':
        return 'bg-red-500 text-white';
      case 'Cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col shadow-sm hover:shadow-lg hover:border-[#0095FF] transition-all duration-300 group relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">BUS REFERENCE</p>
          <p className="text-lg font-bold text-[#0095FF]">{bus.id}</p>
        </div>
        <div className={`pl-2 pr-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 ${getStatusColor(bus.status)}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          {bus.status}
        </div>
      </div>

      {/* Route */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">FROM</p>
          <p className="font-bold text-text-dark text-base">{bus.origin}</p>
          <p className="text-xs text-text-gray mt-0.5">{bus.originTerminal}</p>
        </div>
        <ArrowRight className="w-5 h-5 text-[#0095FF] flex-shrink-0" />
        <div className="flex-1 text-right">
          <div className="flex flex-col items-start pl-4">
             <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">TO</p>
             <p className="font-bold text-text-dark text-base">{bus.destination}</p>
             <p className="text-xs text-text-gray mt-0.5">{bus.destinationTerminal}</p>
          </div>
        </div>
      </div>

      {/* Time & Info Grid - Separate Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">DEPARTURE</p>
          <p className="font-bold text-text-dark text-sm">{bus.departureTime}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">ARRIVAL</p>
          <p className="font-bold text-text-dark text-sm">{arrivalDisplay}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">BUS TYPE</p>
          <p className="font-bold text-text-dark text-sm truncate" title={bus.busType}>{bus.busType}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50">
          <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">DRIVER</p>
          <p className="font-bold text-text-dark text-sm truncate" title={bus.driver}>{bus.driver || 'N/A'}</p>
        </div>
      </div>

      {/* Seat Occupancy - Card Style */}
      <div className="border border-gray-100 rounded-xl p-4 mb-4">
        <p className="text-[11px] font-bold text-text-dark mb-3">Seat Occupancy</p>
        
        <div className="flex items-center gap-4">
            <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full rounded-full"
                    style={{ 
                    width: `${occupancyPercentage}%`,
                    background: 'linear-gradient(90deg, #22C55E 0%, #F59E0B 100%)'
                    }} 
                />
            </div>
            
            <div className="flex items-center gap-4 min-w-fit">
                <div className="text-right">
                    <p className="text-xs font-bold text-text-dark leading-tight">{bus.seatsBooked}/{bus.totalSeats}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">Seats</p>
                </div>
                <p className="text-sm font-bold text-[#0095FF]">{occupancyPercentage}%</p>
            </div>
        </div>
      </div>

      {/* Passengers Action */}
      <div className="flex items-center justify-between p-4 bg-[#E0F2FE] rounded-xl border border-[#BAE6FD] mb-6">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Users className="w-4 h-4 text-[#0095FF]" />
             </div>
             <div>
                 <p className="text-sm font-bold text-[#0284C7] leading-tight">
                     {bus.passengersBooked} Passengers
                 </p>
                 <p className="text-[10px] font-bold text-[#0284C7] opacity-80 leading-tight">
                     Booked
                 </p>
             </div>
         </div>
         <button 
             onClick={(e) => {
                 e.stopPropagation();
                 navigate(`/bus-status/passengers/${bus.id}`);
             }}
             className="flex items-center gap-1 text-[11px] font-bold text-[#0095FF] hover:text-[#007ACC] transition-colors"
         >
             View List <ChevronRight className="w-3.5 h-3.5" />
         </button>
      </div>
      
      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => navigate(`/bus-status/passengers/${bus.id}`)}
          className="py-3 bg-[#0095FF] text-white rounded-lg text-sm font-bold hover:bg-[#0086E6] transition-colors shadow-sm shadow-blue-100"
        >
          View Details
        </button>
        <button 
          onClick={() => setIsManageModalOpen(true)}
          className="py-3 bg-white border border-gray-200 text-[#0095FF] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
        >
          Manage
        </button>
      </div>

      {/* Manage Status Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-text-dark">Update Trip Status</h3>
              <p className="text-xs text-text-gray mt-1">Bus Reference: <span className="font-bold text-primary-blue">{bus.id}</span></p>
            </div>
            <div className="p-4 space-y-2">
              {['Active', 'In Transit', 'Delayed', 'Cancelled', 'Completed'].map((status) => (
                <div key={status}>
                  <button
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isUpdating}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                      (selectedStatus || bus.status) === status ? 'bg-primary-blue text-white' : 'hover:bg-gray-50 text-text-gray'
                    }`}
                  >
                    {status}
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${(selectedStatus || bus.status) === status ? 'opacity-100' : ''}`} />
                  </button>
                  
                  {status === 'Completed' && selectedStatus === 'Completed' && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in slide-in-from-top-2 duration-200">
                        <label className="block text-[10px] font-bold text-blue-600 uppercase mb-2">Actual Arrival Time</label>
                        <input 
                            type="time" 
                            value={actualArrival}
                            onChange={(e) => setActualArrival(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-bold text-text-dark focus:outline-none focus:border-primary-blue"
                        />
                        <button 
                            onClick={() => handleStatusUpdate('Completed')}
                            disabled={isUpdating}
                            className="w-full mt-3 py-2.5 bg-primary-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
                        >
                            Confirm Arrival & Complete
                        </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50">
              <button 
                onClick={() => {
                    setIsManageModalOpen(false);
                    setSelectedStatus(null);
                }}
                className="w-full py-3 text-sm font-bold text-text-gray hover:text-text-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusStatusCard;
