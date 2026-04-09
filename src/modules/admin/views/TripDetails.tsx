import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  ArrowRight,
  MapPin, 
  Bus, 
  User, 
  Search, 
  Printer,
  ChevronRight,
  Clock,
  Ticket,
  Edit3,
  XCircle,
  Eye,
  RefreshCcw,
  Phone
} from 'lucide-react';
import clsx from 'clsx';

const MOCK_PASSENGERS = [
  { seat: '1A', name: 'Chioma Adebayo', ticketId: 'TKT-8829', phone: '0803 234 5678', status: 'Checked In' },
  { seat: '1B', name: 'Ahmed Ibrahim', ticketId: 'TKT-8830', phone: '0801 456 7890', status: 'Checked In' },
  { seat: '2A', name: 'Fatima Yusuf', ticketId: 'TKT-8831', phone: '0805 678 9012', status: 'Checked In' },
  { seat: '2B', name: 'Emeka Okonkwo', ticketId: 'TKT-8832', phone: '0812 345 6789', status: 'Checked In' },
  { seat: '3A', name: 'Blessing Eze', ticketId: 'TKT-8833', phone: '0813 456 7890', status: 'Pending' },
  { seat: '3B', name: 'Oluwaseun Balogun', ticketId: 'TKT-8834', phone: '0814 567 8901', status: 'Checked In' },
  { seat: '4A', name: 'Amina Sani', ticketId: 'TKT-8835', phone: '0815 678 9012', status: 'Checked In' },
  { seat: '4B', name: 'Ibrahim Mohammed', ticketId: 'TKT-8836', phone: '0816 789 0123', status: 'Checked In' },
  { seat: '5A', name: 'Samuel Okoro', ticketId: 'TKT-8837', phone: '0817 890 1234', status: 'Pending' },
  { seat: '5B', name: 'Ngozi Okafor', ticketId: 'TKT-8838', phone: '0818 901 2345', status: 'Checked In' },
  { seat: '6A', name: 'Kunle Ajayi', ticketId: 'TKT-8839', phone: '0819 012 3456', status: 'Checked In' },
  { seat: '6B', name: 'Bisi Adeola', ticketId: 'TKT-8840', phone: '0820 123 4567', status: 'Checked In' },
];

const TripDetails = () => {
  const { tripId } = useParams();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPassengers = MOCK_PASSENGERS.filter(p => {
    const matchesTab = 
      activeTab === 'All' || 
      (activeTab === 'Checked In' && p.status === 'Checked In') ||
      (activeTab === 'Pending' && p.status === 'Pending');
    
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const checkedInCount = MOCK_PASSENGERS.filter(p => p.status === 'Checked In').length;
  const pendingCount = MOCK_PASSENGERS.filter(p => p.status === 'Pending').length;

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-slate-400 text-[13px] font-medium mb-4">
        <ArrowLeft className="w-3.5 h-3.5" />
        <Link to="/admin/trips" className="hover:text-[#0EA5E9] transition-colors">Trips</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-bold">Trip Details</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight">
            Trip #{tripId || 'TRP-001248'}
          </h1>
          <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] rounded-lg text-[13px] font-bold border border-[#FDE68A]">
            Not Departed
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0EA5E9] font-bold text-[14px] hover:bg-slate-50 transition-all shadow-sm">
            <Edit3 className="w-4 h-4" />
            Edit Trip
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-[#EF4444] font-bold text-[14px] hover:bg-red-50 transition-all shadow-sm">
            <XCircle className="w-4 h-4" />
            Cancel Trip
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl font-bold text-[14px] hover:bg-[#0284c7] transition-all shadow-sm">
            <Printer className="w-4 h-4" />
            Print Manifest
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Route & Schedule Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#0EA5E9]" />
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Route & Schedule</h3>
          </div>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[20px] font-bold text-[#1E293B] mb-1">
              Lagos <ArrowRight className="w-5 h-5 text-slate-300" /> Owerri
            </div>
            <p className="text-[14px] text-slate-400 font-medium">450 km</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</p>
              <p className="text-[14px] font-bold text-[#1E293B]">Nov 28, 2025</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Time</p>
              <p className="text-[14px] font-bold text-[#1E293B]">8:00 AM</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Duration</p>
              <p className="text-[14px] font-bold text-[#1E293B]">6h 30m</p>
            </div>
          </div>
        </div>

        {/* Bus & Driver Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#fce7f3] flex items-center justify-center">
              <Bus className="w-5 h-5 text-[#EC4899]" />
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Bus & Driver</h3>
          </div>
          <div className="mb-10">
            <p className="text-[20px] font-bold text-[#1E293B] mb-1">BUS-001</p>
            <p className="text-[14px] text-slate-400 font-medium">Luxury Coach (50 seats)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-[14px]">
              AH
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1E293B]">Ahmed Hassan</p>
              <p className="text-[12px] text-slate-400 font-medium mb-1">Driver</p>
              <p className="text-[13px] text-[#0EA5E9] font-semibold">+234 801 234 5678</p>
            </div>
          </div>
        </div>

        {/* Revenue Summary Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
              <span className="text-[#16A34A] font-bold text-[20px]">$</span>
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Revenue Summary</h3>
          </div>
          <div className="mb-10">
            <p className="text-[24px] font-bold text-[#16A34A] mb-1">₦475,000</p>
            <p className="text-[14px] text-slate-400 font-medium">Total Revenue</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tickets Sold</p>
              <p className="text-[14px] font-bold text-[#1E293B]">50/50</p>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#16A34A] w-full rounded-full transition-all duration-700" />
            </div>
            <p className="text-[12px] text-[#16A34A] font-bold tracking-tight">100% Occupancy</p>
          </div>
        </div>
      </div>

      {/* Passenger Manifest Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-[#1E293B] mb-1">Passenger Manifest</h2>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                {checkedInCount} checked in • {pendingCount} pending
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search passenger name..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Tabs */}
          <div className="flex gap-1 border-b border-slate-100">
            {['All', 'Checked In', 'Pending'].map((tab) => {
              const label = tab === 'All' ? `All (${MOCK_PASSENGERS.length})` : 
                           tab === 'Checked In' ? `Checked In (${checkedInCount})` : 
                           `Pending (${pendingCount})`;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-6 py-4 text-[14px] font-bold transition-all relative",
                    activeTab === tab 
                      ? "text-[#0EA5E9]" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {label}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0EA5E9] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[11px] font-extrabold text-slate-400">
                <th className="px-8 py-5">Seat</th>
                <th className="px-8 py-5">Passenger Name</th>
                <th className="px-8 py-5">Ticket ID</th>
                <th className="px-8 py-5">Phone</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPassengers.map((p) => (
                <tr key={p.ticketId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0EA5E9] font-bold text-[14px]">
                      {p.seat}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-[#1E293B] text-[15px]">{p.name}</td>
                  <td className="px-8 py-5 font-bold text-[#0EA5E9] text-[14px]">{p.ticketId}</td>
                  <td className="px-8 py-5 text-slate-400 font-semibold text-[14px]">{p.phone}</td>
                  <td className="px-8 py-5">
                    <span className={clsx(
                      "px-3 py-1.5 rounded-xl text-[12px] font-bold shadow-sm inline-block",
                      p.status === 'Checked In' ? "bg-green-50 text-[#16A34A]" : "bg-slate-100 text-slate-400"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-[#0EA5E9] hover:scale-110 transition-transform bg-slate-50 p-2 rounded-full border border-slate-100">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-[#1A1A2E] text-white p-4 flex items-center justify-between z-30 shadow-2xl border-t border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <span className="text-[14px] font-bold tracking-tight">Waiting for Departure</span>
        </div>
        <div className="text-slate-400 text-[13.5px] font-medium absolute left-1/2 -translate-x-1/2">
          Next: <span className="text-white font-bold">Driver clicks Departed</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <RefreshCcw className="w-4 h-4 animate-spin-slow" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Updates instantly</span>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
