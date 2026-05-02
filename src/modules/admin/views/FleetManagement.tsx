import { useState, useEffect } from 'react';
import { 
  Bus as BusIcon, Search, LayoutGrid, List, Plus, MapPin, Wrench, CheckCircle2, 
  Star, AlertCircle, Clock, MoreVertical, X, FileText, Download 
} from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFleetStore } from '../store/useFleetStore';
import toast from 'react-hot-toast';
import ReassignmentModal from '../components/ReassignmentModal';

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
  const { 
    buses, fleetStats, isLoading, performanceData, 
    fetchFleet, fetchFleetPerformance, updateBusStatus, updateBus, deleteBus 
  } = useFleetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Performance' | 'Trip History' | 'Maintenance'>('Overview');
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState('');
  const [decommissioningBus, setDecommissioningBus] = useState<any | null>(null);
  const [forceDecommission, setForceDecommission] = useState(false);

  useEffect(() => {
    fetchFleet();
    fetchFleetPerformance();
  }, [fetchFleet, fetchFleetPerformance]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenFor(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Notification timeout - no longer needed with react-hot-toast

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10 relative">
      
      <ReassignmentModal />

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
        {[
          { id: 'total', label: 'TOTAL BUSES', value: fleetStats.total.toString(), subLabel: 'Active in fleet', type: 'info', icon: BusIcon },
          { id: 'avail', label: 'AVAILABLE', value: fleetStats.available.toString(), subLabel: 'Ready for trips', type: 'success', icon: CheckCircle2 },
          { id: 'ontrip', label: 'ON TRIP', value: fleetStats.onTrip.toString(), subLabel: 'Currently active', type: 'warning', icon: MapPin },
          { id: 'maint', label: 'MAINTENANCE', value: fleetStats.maintenance.toString(), subLabel: 'Under service', type: 'danger', icon: Wrench },
        ].map((stat) => {
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
            {!performanceData ? (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 animate-pulse">
                    <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div>
                    <div className="h-6 w-24 bg-slate-200 rounded mb-1"></div>
                    <div className="h-2.5 w-20 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
                  <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Trips</p>
                  <p className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#1e293b] mb-1">{performanceData.totalTrips || 0}</p>
                  <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">Weekly window</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
                  <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-[15px] sm:text-[22px] lg:text-[26px] font-bold text-[#22c55e] mb-1">₦{(performanceData.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">Confirmed bookings</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
                  <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Avg Utilization</p>
                  <p className="text-[18px] sm:text-[24px] lg:text-[26px] font-bold text-[#0ea5e9] mb-1">{performanceData.avgUtilization || 0}%</p>
                  <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">Avg capacity used</p>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-3 sm:p-4 border border-slate-50 flex flex-col justify-center text-center sm:text-left">
                  <p className="text-[11px] sm:text-[12px] font-medium text-slate-500 mb-1">Total Tokens</p>
                  <p className="text-[16px] sm:text-[22px] lg:text-[26px] font-bold text-[#f59e0b] mb-1">{(performanceData.totalTokens || 0).toLocaleString()}</p>
                  <p className="text-[10px] sm:text-[12px] font-semibold text-[#22c55e]">10:1 conversion</p>
                </div>
              </>
            )}
          </div>

          {/* Chart Section */}
          <div className="bg-[#f8fafc] rounded-xl border border-slate-50 flex flex-col justify-between p-5 min-h-[160px]">
            <p className="text-[12px] font-medium text-slate-500">Daily Trips This Week</p>
            {!performanceData ? (
              <div className="flex-1 flex items-end justify-between px-2 mt-4 gap-2 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="w-full bg-slate-100 rounded-t-sm h-8"></div>
                ))}
              </div>
            ) : performanceData.dailyStats.every(s => s === 0) ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[13px] text-slate-400 font-medium italic">No Data Available</p>
              </div>
            ) : (
              <div className="flex-1 flex items-end justify-between px-2 mt-4 gap-2">
                {performanceData.dailyStats.map((count, i) => {
                  const maxCount = Math.max(...performanceData.dailyStats, 1);
                  const height = (count / maxCount) * 100;
                  return (
                    <div 
                      key={i} 
                      className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] rounded-t-sm transition-all duration-500 relative group" 
                      style={{ height: `${Math.max(height, 5)}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* X-axis labels */}
            <div className="flex border-t border-slate-200 mt-2 pt-2 justify-between text-[11px] font-medium text-slate-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bus Grid ── */}
      {isLoading ? (
        <div className="flex justify-center py-20 text-slate-400">Loading fleet data...</div>
      ) : (
        <div className={clsx("grid gap-5", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
          {buses.filter(b => filterStatus === 'All' || b.status === filterStatus)
          .filter(b => (b.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()))
          .map((bus) => (
          
          <div key={bus.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            
            {/* Top row: ID & Badge */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-bold text-[#1e293b]">{bus.registrationNumber}</h3>
                <span className={clsx("w-2 h-2 rounded-full", getStatusIndicator(bus.status))}></span>
              </div>
              <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", getStatusColor(bus.status))}>
                {bus.status}
              </span>
            </div>
            <p className="text-[12px] font-medium text-slate-400 mb-4">{bus.nickname || `${bus.manufacturer} ${bus.model}`}</p>

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
                <span className="text-[15px] font-bold text-[#1e293b]">{bus.tripsCount}</span>
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
            <div className="flex items-center gap-2 mt-auto relative">
              <button 
                onClick={() => {
                  setSelectedBus(bus);
                  setActiveTab('Overview');
                }}
                className="flex-1 py-2 text-[#0ea5e9] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#bae6fd] rounded-xl text-[13px] font-semibold transition-colors"
              >
                View Details
              </button>
              <Link 
                to={`/admin/buses/edit/${bus.id}`}
                className="px-5 py-2 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-[13px] font-semibold transition-colors"
              >
                Edit
              </Link>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenFor(menuOpenFor === bus.id ? null : bus.id);
                }}
                className="p-2 text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {menuOpenFor === bus.id && (
                <div className="absolute right-0 bottom-12 w-52 bg-white border border-slate-100 shadow-lg rounded-xl py-2 z-10 animate-in fade-in slide-in-from-bottom-2">
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setMenuOpenFor(null);
                      try {
                        await updateBusStatus(bus.id, 'Available');
                        toast.success('Bus is now available');
                      } catch (err: any) {
                        if (err.response?.status !== 409) {
                          toast.error(err.response?.data?.message || 'Failed to update status');
                        }
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-emerald-600 hover:bg-emerald-50 font-medium border-b border-slate-50"
                  >
                    Set to Available
                  </button>
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setMenuOpenFor(null);
                      try {
                        await updateBusStatus(bus.id, 'Maintenance');
                        toast.success('Bus marked for maintenance');
                      } catch (err: any) {
                        if (err.response?.status !== 409) {
                          toast.error(err.response?.data?.message || 'Failed to update status');
                        }
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Mark for Maintenance
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenFor(null);
                      setDecommissioningBus(bus);
                    }}
                    className="w-full text-left px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 font-medium"
                  >
                    Decommission Bus
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* ── Bus Details Modal ── */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans">
             
             {/* Modal Header */}
             <div className="flex items-center justify-between p-6 border-b border-slate-100">
               <h2 className="text-[20px] font-semibold text-[#1e293b]">
                 {selectedBus.registrationNumber} - {selectedBus.nickname || `${selectedBus.manufacturer} ${selectedBus.model}`}
               </h2>
               <button onClick={() => { setSelectedBus(null); setShowDatePicker(false); }} className="text-slate-400 hover:text-slate-600 transition-colors">
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
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.registrationNumber}</p>
                     </div>
                     <div>
                        <p className="text-[12px] text-[#64748b] mb-1">Type</p>
                        <p className="text-[14.5px] text-[#1e293b]">{selectedBus.manufacturer} {selectedBus.model}</p>
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
                     <div className="col-span-2 mt-4">
                        <p className="text-[13px] font-bold text-[#1e293b] mb-3">Sensitive Documents</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { label: 'Registration Cert', url: selectedBus.vehicleRegistrationCertUrl },
                            { label: 'Insurance Cert', url: selectedBus.insuranceCertUrl },
                            { label: 'Roadworthiness', url: selectedBus.roadworthinessCertUrl },
                            { label: 'Inspection Report', url: selectedBus.inspectionReportUrl },
                            { label: 'Emission Test', url: selectedBus.emissionTestCertUrl },
                          ].map((doc, idx) => {
                            if (!doc.url) return null;
                            const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${doc.url}?token=${localStorage.getItem('token')}`;
                            return (
                              <a 
                                key={idx}
                                href={fullUrl}
                                onClick={(e) => {
                                  if (!localStorage.getItem('token')) {
                                    e.preventDefault();
                                    toast.error("Unauthorized: Admin access required");
                                  }
                                }}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-[#f8fafc] border border-slate-100 rounded-xl hover:border-[#0ea5e9]/30 transition-colors group"
                              >
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-[#0ea5e9]">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-[13px] font-medium text-slate-600 group-hover:text-[#1e293b]">{doc.label}</span>
                                <Download className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-[#0ea5e9]" />
                              </a>
                            );
                          })}
                        </div>
                     </div>
                 </div>
               )}

               {activeTab === 'Performance' && (
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                     <p className="text-[12px] text-[#64748b] mb-2">Trips Completed</p>
                     <p className="text-[24px] text-[#1e293b]">{selectedBus.tripsCount}</p>
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
                   
                   <div className="relative">
                     {showDatePicker ? (
                       <div className="w-full p-4 border border-slate-200 rounded-xl bg-[#f8fafc] mb-2 flex items-end gap-3">
                         <div className="flex-1">
                           <label className="text-[12px] font-medium text-slate-500 mb-1 block">Select Date</label>
                           <input 
                             type="date" 
                             className="w-full px-3 py-2 rounded-lg border border-slate-300 text-[13.5px]"
                             value={maintenanceDate}
                             onChange={e => setMaintenanceDate(e.target.value)}
                           />
                         </div>
                         <button 
                           onClick={async () => {
                             if (maintenanceDate) {
                               await updateBus(selectedBus.id, { nextServiceDue: maintenanceDate });
                               setShowDatePicker(false);
                               setMaintenanceDate('');
                               // We should also ideally update the selectedBus locally but fetchFleet handles the grid
                             }
                           }}
                           className="py-2 px-4 bg-[#0ea5e9] text-white rounded-lg text-[13.5px] font-medium hover:bg-[#0284c7]"
                         >
                           Save
                         </button>
                         <button 
                           onClick={() => setShowDatePicker(false)}
                           className="py-2 px-4 bg-white text-slate-600 border border-slate-300 rounded-lg text-[13.5px] font-medium hover:bg-slate-50"
                         >
                           Cancel
                         </button>
                       </div>
                     ) : (
                       <button 
                         onClick={() => setShowDatePicker(true)}
                         className="w-full py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium hover:bg-[#0284c7] transition-colors"
                       >
                         Schedule Maintenance
                       </button>
                     )}
                   </div>
                 </div>
               )}
             </div>

             {/* Modal Footer */}
             <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
               <Link 
                 to={`/admin/fleet/report/${selectedBus.id}`}
                 className="flex-1 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium hover:bg-[#0284c7] transition-colors text-center block"
               >
                 View Full Report
               </Link>
               <button onClick={() => { setSelectedBus(null); setShowDatePicker(false); }} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium hover:bg-slate-50 transition-colors">
                 Close
               </button>
             </div>
          </div>
        </div>
      )}

      {/* ── Decommission Confirmation Modal ── */}
      {decommissioningBus && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-sans border border-slate-100">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-[20px] font-bold text-[#1e293b] mb-2">Decommission Bus?</h3>
              <p className="text-[14.5px] text-slate-500 mb-6">
                Are you sure you want to permanently remove <span className="font-bold text-[#1e293b]">{decommissioningBus.registrationNumber}</span> from the active fleet? This action cannot be undone.
              </p>

              {/* Force Option */}
              <label className="flex items-center gap-3 bg-red-50 p-4 rounded-xl mb-6 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-red-500 focus:ring-red-500"
                  checked={forceDecommission}
                  onChange={e => setForceDecommission(e.target.checked)}
                />
                <span className="text-[13px] font-medium text-red-700 group-hover:text-red-800">
                  Force Decommission (Cancels all active trips)
                </span>
              </label>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setDecommissioningBus(null);
                    setForceDecommission(false);
                  }}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await deleteBus(decommissioningBus.id, forceDecommission);
                      toast.success('Bus decommissioned successfully');
                      setDecommissioningBus(null);
                      setForceDecommission(false);
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || 'Failed to decommission bus');
                    }
                  }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-[14.5px] font-semibold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                >
                  Decommission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
