import { useState } from 'react';
import { 
  Bus as BusIcon, Search, LayoutGrid, List, Plus, MapPin, Wrench, CheckCircle2, 
  Star, AlertCircle, Clock, MoreVertical, X 
} from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

// --- MOCK DATA --- 
const MOCK_STATS = [
  { id: 'total', label: 'TOTAL BUSES', value: '6', subLabel: 'Active in fleet', trend: '↑ 2 added this month', type: 'info', icon: BusIcon },
  { id: 'avail', label: 'AVAILABLE', value: '2', subLabel: 'Ready for trips', type: 'success', icon: CheckCircle2 },
  { id: 'ontrip', label: 'ON TRIP', value: '3', subLabel: 'Currently active', type: 'warning', icon: MapPin },
  { id: 'maint', label: 'MAINTENANCE', value: '1', subLabel: 'Under service', type: 'danger', icon: Wrench },
];

const MOCK_BUSES = [
  { 
    id: 'BUS-001', status: 'On Trip', type: 'Luxury Coach', capacity: '50 seats', plate: 'ABC-123-XY', service: 'Nov 15, 2025',
    trips: 12, revenue: '₦456,000', utilization: 92, tokens: '45,600', rating: '4.8/5', issues: 0, avgTrip: '8h 20m'
  },
  { 
    id: 'BUS-002', status: 'Available', type: 'Luxury Coach', capacity: '50 seats', plate: 'ABC-124-XY', service: 'Nov 10, 2025',
    trips: 10, revenue: '₦380,000', utilization: 85, tokens: '38,000', rating: '4.7/5', issues: 0, avgTrip: '7h 45m'
  },
  { 
    id: 'BUS-003', status: 'On Trip', type: 'Standard Coach', capacity: '45 seats', plate: 'ABC-125-XY', service: 'Nov 20, 2025',
    trips: 11, revenue: '₦396,000', utilization: 88, tokens: '39,600', rating: '4.6/5', issues: 0, avgTrip: '6h 10m'
  },
  { 
    id: 'BUS-004', status: 'Available', type: 'Luxury Coach', capacity: '50 seats', plate: 'ABC-126-XY', service: 'Nov 16, 2025',
    trips: 13, revenue: '₦494,000', utilization: 95, tokens: '49,400', rating: '4.9/5', issues: 0, avgTrip: '8h 30m'
  },
  { 
    id: 'BUS-005', status: 'Maintenance', type: 'Standard Coach', capacity: '45 seats', plate: 'ABC-127-XY', service: 'Nov 25, 2025',
    trips: 0, revenue: '₦0', utilization: 0, tokens: '0', rating: '4.5/5', issues: 1, avgTrip: '--'
  },
  { 
    id: 'BUS-006', status: 'On Trip', type: 'Luxury Coach', capacity: '50 seats', plate: 'ABC-128-XY', service: 'Nov 12, 2025',
    trips: 14, revenue: '₦532,000', utilization: 98, tokens: '53,200', rating: '4.8/5', issues: 0, avgTrip: '8h 15m'
  },
];

// --- HELPERS ---
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available': return 'bg-[#22c55e] text-white';
    case 'On Trip': return 'bg-[#f59e0b] text-white';
    case 'Maintenance': return 'bg-[#ef4444] text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getStatusIndicator = (status: string) => {
  switch (status) {
    case 'Available': return 'bg-[#22c55e]';
    case 'On Trip': return 'bg-[#f59e0b]';
    case 'Maintenance': return 'bg-[#ef4444]';
    default: return 'bg-gray-500';
  }
};


export default function FleetManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBus, setSelectedBus] = useState<typeof MOCK_BUSES[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Performance' | 'Trip History' | 'Maintenance'>('Overview');

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10">
      
      {/* ── Breadcrumbs & Header ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-400 mb-1">
            Dashboard &gt; Fleet Management
          </p>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1e293b] tracking-tight leading-tight">
            Fleet Management
          </h1>
          <p className="text-[14.5px] text-slate-500 mt-1">
            Monitor all buses and their performance
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="relative bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center shadow-sm">
            <span className="text-[13px] font-medium text-slate-500 mr-2">Status:</span>
            <select 
              className="bg-transparent text-[13.5px] font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-4"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by bus number..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] shadow-sm placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm hidden sm:flex">
            <button 
              onClick={() => setViewMode('grid')}
              className={clsx("p-1.5 rounded-lg transition-colors", viewMode === 'grid' ? "bg-[#0ea5e9] text-white" : "text-slate-400 hover:text-slate-600")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={clsx("p-1.5 rounded-lg transition-colors", viewMode === 'list' ? "bg-[#0ea5e9] text-white" : "text-slate-400 hover:text-slate-600")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Bus Button */}
          <Link 
            to="/admin/buses/add"
            className="flex items-center justify-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl font-semibold text-[13.5px] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Bus
          </Link>
        </div>
      </div>

      {/* ── Top Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MOCK_STATS.map((stat) => {
          const IconStyle = 
            stat.type === 'info' ? 'bg-[#e0f2fe] text-[#0ea5e9]' :
            stat.type === 'success' ? 'bg-[#dcfce7] text-[#22c55e]' :
            stat.type === 'warning' ? 'bg-[#fef3c7] text-[#f59e0b]' :
            'bg-[#fee2e2] text-[#ef4444]';
          
          return (
            <div key={stat.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", IconStyle)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.id === 'avail' && <span className="text-[14px] font-bold text-[#22c55e]">33%</span>}
                {stat.id === 'ontrip' && <span className="text-[14px] font-bold text-[#f59e0b]">50%</span>}
                {stat.id === 'maint' && <span className="text-[14px] font-bold text-[#ef4444]">17%</span>}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className="text-[32px] font-bold text-[#1e293b] leading-none mb-2">{stat.value}</h2>
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] text-slate-500 font-medium">{stat.subLabel}</p>
              </div>
              {stat.trend && (
                <p className="text-[12px] font-semibold text-[#22c55e] mt-1">{stat.trend}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── This Week's Performance ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-[15px] font-bold text-[#1e293b] mb-5">This Week's Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Trips</p>
              <p className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#1e293b] mb-1">156</p>
              <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">+12% vs last</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Revenue</p>
              <p className="text-[15px] sm:text-[22px] lg:text-[26px] font-bold text-[#22c55e] mb-1">₦7,280,000</p>
              <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">+8% vs last</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Avg Utilization</p>
              <p className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0ea5e9] mb-1">87%</p>
              <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">+5% vs last</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Tokens</p>
              <p className="text-[16px] sm:text-[22px] lg:text-[26px] font-bold text-[#f59e0b] mb-1">728,000</p>
              <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">+10% vs last</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-[#f8fafc] rounded-xl border border-slate-50 flex flex-col justify-between p-5 min-h-[160px]">
            <p className="text-[12px] font-medium text-slate-500">Daily Trips This Week</p>
            {/* Fake chart bars area */}
            <div className="flex-1 flex items-end justify-between px-2 mt-4 gap-2">
              {[40, 60, 45, 80, 70, 95, 85].map((h, i) => (
                <div key={i} className="w-full bg-[#e0f2fe] rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            {/* X-axis labels */}
            <div className="flex border-t border-slate-200 mt-2 pt-2 justify-between text-[11px] font-medium text-slate-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bus Grid ── */}
      <div className={clsx("grid gap-5", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
        {MOCK_BUSES.filter(b => filterStatus === 'All' || b.status === filterStatus)
          .filter(b => b.id.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((bus) => (
          
          <div key={bus.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            
            {/* Top row: ID & Badge */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-bold text-[#1e293b]">{bus.id}</h3>
                <span className={clsx("w-2 h-2 rounded-full", getStatusIndicator(bus.status))}></span>
              </div>
              <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", getStatusColor(bus.status))}>
                {bus.status}
              </span>
            </div>
            <p className="text-[12px] font-medium text-slate-400 mb-4">{bus.type}</p>

            {/* General Info Grid */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mb-5">
              <span className="text-[12.5px] font-medium text-slate-500">Capacity:</span>
              <span className="text-[12.5px] font-semibold text-[#1e293b] text-right">{bus.capacity}</span>
              
              <span className="text-[12.5px] font-medium text-slate-500">License Plate:</span>
              <span className="text-[12.5px] font-semibold text-[#1e293b] text-right">{bus.plate}</span>
              
              <span className="text-[12.5px] font-medium text-slate-500">Last Service:</span>
              <span className="text-[12.5px] font-semibold text-[#1e293b] text-right">{bus.service}</span>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Trips Completed</span>
                <span className="text-[15px] font-bold text-[#1e293b]">{bus.trips}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Revenue</span>
                <span className="text-[15px] font-bold text-[#22c55e]">{bus.revenue}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Utilization</span>
                <span className="text-[15px] font-bold text-[#0ea5e9]">{bus.utilization}%</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-0.5">Tokens</span>
                <span className="text-[15px] font-bold text-[#f59e0b]">{bus.tokens}</span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Utilization</span>
                <span className="text-[12px] font-bold text-[#1e293b]">{bus.utilization}%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={clsx("h-full rounded-full", bus.utilization > 80 ? "bg-[#10b981]" : bus.utilization > 40 ? "bg-[#f59e0b]" : "bg-[#ef4444]")} 
                  style={{ width: `${bus.utilization}%` }}
                ></div>
              </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-6 border-t border-slate-100 pt-3">
              <div className="text-center">
                <Star className="w-4 h-4 text-[#f59e0b] mx-auto mb-1" />
                <p className="text-[10px] font-medium text-slate-400">Avg Rating</p>
                <p className="text-[12px] font-bold text-[#1e293b]">{bus.rating}</p>
              </div>
              <div className="text-center">
                <AlertCircle className="w-4 h-4 text-[#ef4444] mx-auto mb-1" />
                <p className="text-[10px] font-medium text-slate-400">Issues</p>
                <p className="text-[12px] font-bold text-[#1e293b]">{bus.issues}</p>
              </div>
              <div className="text-center">
                <Clock className="w-4 h-4 text-[#0ea5e9] mx-auto mb-1" />
                <p className="text-[10px] font-medium text-slate-400">Avg Trip</p>
                <p className="text-[12px] font-bold text-[#1e293b]">{bus.avgTrip}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto">
              <button 
                onClick={() => {
                  setSelectedBus(bus);
                  setActiveTab('Overview');
                }}
                className="flex-1 py-2 text-[#0ea5e9] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] rounded-xl text-[13px] font-semibold transition-colors"
              >
                View Details
              </button>
              <button className="px-5 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[13px] font-semibold transition-colors">
                Edit
              </button>
              <button className="p-2 text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bus Details Modal ── */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans">
             
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-[20px] font-semibold text-[#1e293b]">{selectedBus.id} - Detailed View</h2>
               <button onClick={() => setSelectedBus(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             {/* Modal Tabs */}
             <div className="flex px-6 border-b border-slate-100 gap-6">
               {['Overview', 'Performance', 'Trip History', 'Maintenance'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={clsx(
                     "py-3.5 text-[14.5px] font-medium transition-colors border-b-[2.5px] -mb-[1px]",
                     activeTab === tab ? "border-[#0ea5e9] text-[#0ea5e9]" : "border-transparent text-slate-500 hover:text-slate-800"
                   )}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             
             {/* Modal Content */}
             <div className="p-6 bg-white flex-1 overflow-y-auto max-h-[60vh]">
               
               {activeTab === 'Overview' && (
                 <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Bus Number</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.id}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Type</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.type}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Capacity</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.capacity}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">License Plate</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.plate}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Status</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.status}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Last Service</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.service}</p>
                     </div>
                 </div>
               )}

               {activeTab === 'Performance' && (
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Trips Completed</p>
                     <p className="text-[24px] text-[#1e293b]">{selectedBus.trips}</p>
                   </div>
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Revenue</p>
                     <p className="text-[24px] text-[#22c55e]">{selectedBus.revenue}</p>
                   </div>
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Utilization</p>
                     <p className="text-[24px] text-[#0ea5e9]">{selectedBus.utilization}%</p>
                   </div>
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Average Rating</p>
                     <p className="text-[24px] text-[#1e293b]">{selectedBus.rating.replace('/5', '')}<span className="text-[18px] text-slate-500">/5</span></p>
                   </div>
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Issues Reported</p>
                     <p className="text-[24px] text-[#1e293b]">{selectedBus.issues}</p>
                   </div>
                 </div>
               )}

               {activeTab === 'Trip History' && (
                 <div>
                   <p className="text-[13px] text-[#64748b] mb-4">Last 5 trips</p>
                   <div className="flex flex-col gap-3">
                     {[
                       { id: 'TRP-001248', route: 'Lagos → Owerri', date: 'Nov 28', revenue: '₦456,000', passengers: '48' },
                       { id: 'TRP-001247', route: 'Owerri → Lagos', date: 'Nov 27', revenue: '₦475,000', passengers: '50' },
                       { id: 'TRP-001246', route: 'Lagos → Abuja', date: 'Nov 26', revenue: '₦540,000', passengers: '45' },
                       { id: 'TRP-001245', route: 'Abuja → Lagos', date: 'Nov 25', revenue: '₦564,000', passengers: '47' },
                       { id: 'TRP-001244', route: 'Lagos → Port Harcourt', date: 'Nov 24', revenue: '₦441,000', passengers: '49' },
                     ].map((trip, idx) => (
                       <div key={idx} className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 flex justify-between items-center">
                         <div>
                           <p className="text-[14px] text-[#1e293b] mb-1">{trip.id}</p>
                           <p className="text-[12.5px] text-[#64748b]">{trip.route} • {trip.date}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-[14px] text-[#22c55e] mb-1">{trip.revenue}</p>
                           <p className="text-[12.5px] text-[#64748b]">{trip.passengers} passengers</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {activeTab === 'Maintenance' && (
                 <div>
                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Last Service</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.service}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Next Service</p>
                        <p className="text-[14.5px] text-[#1e293b]">Dec 15, 2025</p>
                     </div>
                   </div>
                   
                   <p className="text-[13.5px] text-[#1e293b] mb-3">Service History</p>
                   <div className="flex flex-col gap-3 mb-6">
                     <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                       <div>
                         <p className="text-[14px] text-[#1e293b] mb-1">Regular Maintenance</p>
                         <p className="text-[12.5px] text-[#64748b]">Oil change, tire rotation, brake inspection</p>
                       </div>
                       <p className="text-[12.5px] text-[#64748b] shrink-0">Nov 15, 2025</p>
                     </div>
                     <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                       <div>
                         <p className="text-[14px] text-[#1e293b] mb-1">Engine Service</p>
                         <p className="text-[12.5px] text-[#64748b]">Full engine diagnostic and tune-up</p>
                       </div>
                       <p className="text-[12.5px] text-[#64748b] shrink-0">Oct 20, 2025</p>
                     </div>
                   </div>
                   
                   <button className="w-full py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium hover:bg-[#0284c7] transition-colors">
                     Schedule Maintenance
                   </button>
                 </div>
               )}
             </div>

             {/* Modal Footer */}
             <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
               <button className="flex-1 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium hover:bg-[#0284c7] transition-colors">
                 View Full Report
               </button>
               <button onClick={() => setSelectedBus(null)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium hover:bg-slate-50 transition-colors">
                 Close
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
