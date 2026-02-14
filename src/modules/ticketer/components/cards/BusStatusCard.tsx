import React from 'react';
import { ArrowRight, Users, ChevronRight } from 'lucide-react';
import { BusStatus } from '../../data/busStatusData';

interface BusStatusCardProps {
  bus: BusStatus;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ bus }) => {
  const occupancyPercentage = Math.round((bus.seatsBooked / bus.totalSeats) * 100);

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
             {/* Text align right for the container but we want the content to be aligned nicely. 
                 The screenshot shows standard left alignment for text even on the right side? 
                 Actually looking at the screenshot, "TO" is left aligned relative to its column. 
                 Let's keep it simple. */}
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
          <p className="font-bold text-text-dark text-sm">{bus.arrivalTime}</p>
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
         <button className="flex items-center gap-1 text-[11px] font-bold text-[#0095FF] hover:text-[#007ACC] transition-colors">
             View List <ChevronRight className="w-3.5 h-3.5" />
         </button>
      </div>
      
      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button className="py-3 bg-[#0095FF] text-white rounded-lg text-sm font-bold hover:bg-[#0086E6] transition-colors shadow-sm shadow-blue-100">
          View Details
        </button>
        <button className="py-3 bg-white border border-gray-200 text-[#0095FF] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
          Manage
        </button>
      </div>

    </div>
  );
};

export default BusStatusCard;
