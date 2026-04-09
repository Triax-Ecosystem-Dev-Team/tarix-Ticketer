import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Map as MapIcon, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  ChevronRight,
  Bus,
  ArrowRight,
  MoreVertical
} from 'lucide-react';
import clsx from 'clsx';

const MOCK_TRIPS = [
  { id: 'TRP-001245', from: 'Lagos',  to: 'Ibadan',  driver: 'Ahmed Hassan',   initials: 'AH', bus: 'BUS-045', passengers: 42, capacity: 50, eta: '2:30 PM', status: 'En Route' },
  { id: 'TRP-001246', from: 'Lagos',  to: 'Benin',   driver: 'Chioma Okafor',  initials: 'CO', bus: 'BUS-032', passengers: 48, capacity: 50, eta: '3:15 PM', status: 'En Route' },
  { id: 'TRP-001247', from: 'Ibadan', to: 'Oshogbo', driver: 'Emeka Nwosu',    initials: 'EN', bus: 'BUS-018', passengers: 35, capacity: 50, eta: '1:45 PM', status: 'Completed' },
  { id: 'TRP-001248', from: 'Lagos',  to: 'Abuja',   driver: 'Fatima Ibrahim', initials: 'FI', bus: 'BUS-027', passengers: 50, capacity: 50, eta: '5:00 PM', status: 'En Route' },
  { id: 'TRP-001249', from: 'Benin',  to: 'Lagos',   driver: 'Chukwudi Eze',   initials: 'CE', bus: 'BUS-013', passengers: 38, capacity: 50, eta: '4:20 PM', status: 'Scheduled' },
  { id: 'TRP-001250', from: 'Abuja',  to: 'Kano',    driver: 'Sani Adamu',     initials: 'SA', bus: 'BUS-009', passengers: 0,  capacity: 45, eta: '8:00 AM', status: 'Scheduled' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'En Route':  'bg-[#E0F2FE] text-[#0EA5E9]',
    'Completed': 'bg-[#DCFCE7] text-[#16A34A]',
    'Scheduled': 'bg-[#F1F5F9] text-[#64748B]',
  }[status] || 'bg-gray-100 text-gray-500';

  return (
    <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", styles)}>
      {status}
    </span>
  );
};

const TripOverview = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = MOCK_TRIPS.filter(trip => 
    trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-[#0EA5E9]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Trip Overview</h1>
          </div>
          <p className="text-[#64748B] text-sm font-medium">Manage and monitor all bus trips across the network</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/trips/create"
            className="bg-[#0EA5E9] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#0284c7] transition-all shadow-sm flex items-center gap-2"
          >
            Create New Trip
          </Link>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Trip ID, Route, or Driver..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-[14px] font-bold hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-[14px] font-bold hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" />
            Select Date
          </button>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trip ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Route</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bus ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Passengers</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">ETA/Time</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-sans">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link 
                      to={trip.status === 'Completed' ? `/admin/trips/report/${trip.id}` : `/admin/trips/${trip.id}`}
                      className="text-[#0EA5E9] font-bold text-[13px] hover:underline"
                    >
                      {trip.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#1E293B] font-semibold text-[13px]">
                      {trip.from}
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      {trip.to}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white text-[10px] font-bold flex items-center justify-center">
                        {trip.initials}
                      </div>
                      <span className="text-[13.5px] font-medium text-slate-600">{trip.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13.5px] text-slate-500 font-medium">{trip.bus}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 w-28">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>{trip.passengers}/{trip.capacity}</span>
                        <span>{Math.round((trip.passengers/trip.capacity)*100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full transition-all duration-500",
                            trip.passengers === trip.capacity ? "bg-[#EF4444]" : "bg-[#0EA5E9]"
                          )}
                          style={{ width: `${(trip.passengers/trip.capacity)*100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      {trip.eta}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      to={trip.status === 'Completed' ? `/admin/trips/report/${trip.id}` : `/admin/trips/${trip.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0EA5E9] transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTrips.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bus className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1E293B]">No trips found</h3>
            <p className="text-slate-500 text-sm max-w-xs mt-1">We couldn't find any trips matching your search criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripOverview;
