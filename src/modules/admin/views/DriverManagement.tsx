import { useState } from 'react';
import { 
  Users, CheckCircle2, Navigation, AlertCircle, 
  Search, LayoutGrid, List, Plus, Phone, Mail, MoreVertical, X,
  FileText, Download, Star, AlertTriangle, Calendar
} from 'lucide-react';
import clsx from 'clsx';

// MOCK DATA
const MOCK_STATS = [
  { id: 'total', label: 'TOTAL DRIVERS', value: '6', subLabel: 'In fleet', trend: '↑ 3 added this month', type: 'info', icon: Users },
  { id: 'active', label: 'ACTIVE', value: '5', subLabel: 'Available for trips', percentage: '83%', type: 'success', icon: CheckCircle2 },
  { id: 'ontrip', label: 'ON TRIP', value: '3', subLabel: 'Currently driving', percentage: '50%', type: 'warning', icon: Navigation },
  { id: 'blocked', label: 'BLOCKED/INACTIVE', value: '1', subLabel: 'Suspended accounts', percentage: '17%', type: 'danger', icon: AlertCircle },
];

const MOCK_DRIVERS = [
  {
    id: 'DRV-0847', firstName: 'Ahmed', lastName: 'Hassan', status: 'On Trip', 
    phone: '+234 801 234 5678', email: 'ahmed@example.com',
    license: 'DL-123456789', expiry: 'Dec 15, 2026', licenseStatus: 'Valid',
    trips: 156, tokens: '15,600',
    assignedBus: 'BUS-001', assignedBusStatus: 'On Trip'
  },
  {
    id: 'DRV-0848', firstName: 'Ibrahim', lastName: 'Musa', status: 'On Trip', 
    phone: '+234 802 345 6789', email: 'ibrahim@example.com',
    license: 'DL-987654321', expiry: 'Nov 20, 2026', licenseStatus: 'Valid',
    trips: 142, tokens: '14,200',
    assignedBus: 'BUS-003', assignedBusStatus: 'On Trip'
  },
  {
    id: 'DRV-0849', firstName: 'Chidi', lastName: 'Okafor', status: 'On Trip', 
    phone: '+234 803 456 7890', email: 'chidi@example.com',
    license: 'DL-456789123', expiry: 'Jan 10, 2027', licenseStatus: 'Valid',
    trips: 138, tokens: '13,800',
    assignedBus: 'BUS-006', assignedBusStatus: 'On Trip'
  },
  {
    id: 'DRV-0850', firstName: 'Emeka', lastName: 'Nwosu', status: 'Active', 
    phone: '+234 804 567 8901', email: 'emeka@example.com',
    license: 'DL-789123456', expiry: 'Feb 15, 2027', licenseStatus: 'Valid',
    trips: 125, tokens: '12,500',
    assignedBus: 'BUS-002', assignedBusStatus: 'Available'
  },
  {
    id: 'DRV-0851', firstName: 'Taiwo', lastName: 'Adeleke', status: 'Active', 
    phone: '+234 805 678 9012', email: 'taiwo@example.com',
    license: 'DL-321654987', expiry: 'Mar 20, 2027', licenseStatus: 'Valid',
    trips: 118, tokens: '11,800',
    assignedBus: null, assignedBusStatus: null
  },
  {
    id: 'DRV-0852', firstName: 'Yusuf', lastName: 'Garba', status: 'Inactive', 
    phone: '+234 806 789 0123', email: 'yusuf@example.com',
    license: 'DL-654987321', expiry: 'Apr 25, 2027', licenseStatus: 'Valid',
    trips: 89, tokens: '8,900',
    assignedBus: null, assignedBusStatus: null
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-[#22c55e] text-white';
    case 'On Trip': return 'bg-[#f59e0b] text-white';
    case 'Inactive': return 'bg-slate-300 text-slate-700';
    default: return 'bg-gray-500 text-white';
  }
};

const getInitials = (first: string, last: string) => `${first[0]}${last[0]}`;

export default function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [selectedDriver, setSelectedDriver] = useState<typeof MOCK_DRIVERS[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Trip History' | 'Earnings' | 'Documents' | 'Actions'>('Overview');
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10">
      
      {/* ── Breadcrumbs & Header ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-400 mb-1">
            Dashboard &gt; Driver Management
          </p>
          <h1 className="text-[32px] font-bold text-[#1e293b] tracking-tight leading-tight">
            Driver Management
          </h1>
          <p className="text-[14.5px] text-slate-500 mt-1">
            Manage drivers and assign them to buses
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
              <option value="Active">Active</option>
              <option value="On Trip">On Trip</option>
              <option value="Inactive">Blocked/Inactive</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search driver name or ID..."
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

          {/* Add Driver Button */}
          <button 
            className="flex items-center justify-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl font-semibold text-[13.5px] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Driver
          </button>
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
            <div key={stat.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", IconStyle)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.percentage && <span className={clsx("text-[14px] font-bold", stat.type === 'success' ? 'text-[#22c55e]' : stat.type === 'warning' ? 'text-[#f59e0b]' : 'text-[#ef4444]')}>{stat.percentage}</span>}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className={clsx("text-[32px] font-bold leading-none mb-2", stat.type === 'success' ? 'text-[#22c55e]' : stat.type === 'warning' ? 'text-[#f59e0b]' : stat.type === 'danger' ? 'text-[#ef4444]' : 'text-[#1e293b]')}>
                {stat.value}
              </h2>
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

      {/* ── Driver Grid ── */}
      <div className={clsx("grid gap-5", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
        {MOCK_DRIVERS.filter(d => filterStatus === 'All' || d.status === filterStatus)
          .filter(d => 
            d.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            d.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            d.id.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((driver) => (
          
          <div key={driver.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col font-sans">
            
            {/* Header: Avatar, Name, Badge */}
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-[18px] shadow-sm relative shrink-0">
                  {getInitials(driver.firstName, driver.lastName)}
                  <div className="absolute top-0 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1e293b] leading-snug">
                    {driver.firstName} {driver.lastName}
                  </h3>
                  <p className="text-[12.5px] font-medium text-slate-400">{driver.id}</p>
                </div>
              </div>
              <span className={clsx("px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide mt-1", getStatusStyles(driver.status))}>
                {driver.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-2.5 mb-5 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[12.5px] font-medium text-[#0ea5e9] hover:underline cursor-pointer">{driver.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[12.5px] font-medium text-[#0ea5e9] hover:underline cursor-pointer">{driver.email}</span>
              </div>
            </div>

            {/* License Details */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mb-6">
              <span className="text-[12px] font-semibold text-slate-500">License:</span>
              <span className="text-[13px] font-bold text-[#1e293b] text-right">{driver.license}</span>
              
              <span className="text-[12px] font-semibold text-slate-500">Expiry:</span>
              <span className="text-[13px] font-bold text-[#1e293b] text-right">{driver.expiry}</span>
              
              <span className="text-[12px] font-semibold text-slate-500">Status:</span>
              <span className="text-[13px] font-bold text-[#22c55e] text-right flex items-center justify-end gap-1">
                ✓ {driver.licenseStatus}
              </span>
            </div>

            {/* Performance Stats */}
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e0f2fe] flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-400 mb-0.5">Trips</span>
                <span className="text-[15px] font-bold text-[#1e293b]">{driver.trips}</span>
              </div>
              <div className="w-px h-12 bg-slate-100"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-slate-400 mb-0.5">Tokens</span>
                <span className="text-[15px] font-bold text-[#1e293b]">{driver.tokens}</span>
              </div>
            </div>

            {/* Assigned Bus Details */}
            <div className="mb-6 border-t border-slate-100 pt-5">
              <span className="block text-[11px] font-semibold text-slate-400 mb-2">Assigned Bus</span>
              {driver.assignedBus ? (
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-slate-50">
                  <span className="text-[14px] font-bold text-[#0ea5e9] hover:underline cursor-pointer">{driver.assignedBus}</span>
                  <span className={clsx(
                    "text-[11px] font-bold uppercase",
                    driver.assignedBusStatus === 'Available' ? "text-[#f59e0b]" :
                    driver.assignedBusStatus === 'On Trip' ? "text-[#f59e0b]" : "text-slate-400"
                  )}>
                    {driver.assignedBusStatus}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-slate-50">
                  <span className="text-[13px] font-medium text-slate-500">Not assigned</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto">
              <button 
                onClick={() => {
                  setSelectedDriver(driver);
                  setActiveTab('Overview');
                }}
                className="flex-1 py-2 text-[#0ea5e9] bg-white border border-[#bae6fd] rounded-xl text-[13px] font-semibold hover:bg-[#f0f9ff] transition-colors"
              >
                View Profile
              </button>
              <button className="flex-1 py-2 text-[#0ea5e9] bg-white border border-[#bae6fd] rounded-xl text-[13px] font-semibold hover:bg-[#f0f9ff] transition-colors">
                Assign Bus
              </button>
              <button className="p-2 text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── Driver Profile Modal ── */}
      {selectedDriver && !showAssignModal && !showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
             
             {/* Scrollable Area */}
             <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
               
               {/* Modal Header */}
               <div className="flex items-start justify-between p-6 pb-4">
                 <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-[32px] shadow-sm">
                    {getInitials(selectedDriver!.firstName, selectedDriver!.lastName)}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-semibold text-[#1e293b] leading-tight">
                      {selectedDriver!.firstName} {selectedDriver!.lastName}
                    </h2>
                    <p className="text-[14px] font-medium text-slate-500 mb-2">{selectedDriver!.id}</p>
                    <span className={clsx("px-3 py-1 rounded-full text-[12px] font-bold tracking-wide", getStatusStyles(selectedDriver!.status))}>
                      {selectedDriver!.status}
                    </span>
                  </div>
                </div>
               <button onClick={() => setSelectedDriver(null)} className="text-slate-400 hover:text-slate-600 transition-colors mt-1">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             {/* Modal Tabs */}
             <div className="flex px-6 border-b border-slate-100 gap-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
               {['Overview', 'Trip History', 'Earnings', 'Documents', 'Actions'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={clsx(
                     "py-3.5 text-[14.5px] font-medium transition-colors border-b-[2.5px] -mb-[1px] whitespace-nowrap",
                     activeTab === tab ? "border-[#0ea5e9] text-[#0ea5e9]" : "border-transparent text-slate-500 hover:text-slate-800"
                   )}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             
             {/* Modal Content */}
             <div className="p-6 bg-white min-h-[300px]">
               
               {activeTab === 'Overview' && (
                 <div className="space-y-6">
                   <div>
                     <h4 className="text-[13px] font-medium text-slate-800 mb-3">Personal Information</h4>
                     <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">Phone:</span>
                         <span className="text-[14px] text-[#0ea5e9] hover:underline cursor-pointer">{selectedDriver!.phone}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">Email:</span>
                         <span className="text-[14px] text-[#0ea5e9] hover:underline cursor-pointer">{selectedDriver!.email}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">License:</span>
                         <span className="text-[14px] font-medium text-slate-700">{selectedDriver!.license}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">License Expiry:</span>
                         <span className="text-[14px] font-medium text-[#22c55e]">{selectedDriver!.expiry}</span>
                       </div>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-[13px] font-medium text-slate-800 mb-3">Current Assignment</h4>
                     <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">Assigned Bus:</span>
                         <span className="text-[14px] font-medium text-[#0ea5e9] hover:underline cursor-pointer">
                           {selectedDriver!.assignedBus || 'Not assigned'}
                         </span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">Assignment Date:</span>
                         <span className="text-[14px] font-medium text-slate-700">{selectedDriver!.assignedBus ? 'Nov 1, 2025' : '-'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-[13px] text-slate-500">Status:</span>
                         <span className={clsx(
                           "text-[14px] font-medium",
                           selectedDriver!.assignedBusStatus === 'Available' ? "text-[#f59e0b]" :
                           selectedDriver!.assignedBusStatus === 'On Trip' ? "text-[#f59e0b]" : "text-slate-400"
                         )}>
                           {selectedDriver!.assignedBusStatus || '-'}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div>
                     <h4 className="text-[13px] font-medium text-slate-800 mb-3">Performance Summary</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                          <p className="text-[12px] text-slate-500 mb-2">Trips Completed</p>
                          <p className="text-[24px] text-[#1e293b]">{selectedDriver!.trips}</p>
                        </div>
                        <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                          <p className="text-[12px] text-slate-500 mb-2">On Time Performance</p>
                          <p className="text-[24px] text-[#f59e0b]">96%</p>
                        </div>
                        <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                          <p className="text-[12px] text-slate-500 mb-2">Average Rating</p>
                          <p className="text-[24px] text-[#1e293b] flex items-center gap-1.5">
                            <Star className="w-5 h-5 text-[#f59e0b] fill-current" />
                            4.8/5
                          </p>
                        </div>
                        <div className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50">
                          <p className="text-[12px] text-slate-500 mb-2">Safety Score</p>
                          <p className="text-[24px] text-[#0ea5e9]">97/100</p>
                        </div>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === 'Trip History' && (
                 <div>
                   <p className="text-[13px] text-slate-500 mb-4">Last 10 trips</p>
                   <div className="flex flex-col gap-3">
                     {[
                       { id: 'TRP-001248', route: 'Lagos → Owerri', date: 'Nov 28, 2025', revenue: '₦456,000', passengers: '48', rating: 5 },
                       { id: 'TRP-001247', route: 'Owerri → Lagos', date: 'Nov 27, 2025', revenue: '₦475,000', passengers: '50', rating: 4.8 },
                       { id: 'TRP-001246', route: 'Lagos → Abuja', date: 'Nov 26, 2025', revenue: '₦540,000', passengers: '45', rating: 5 },
                     ].map((trip, idx) => (
                       <div key={idx} className="bg-[#f8fafc] rounded-xl p-4 border border-slate-50 flex justify-between items-center">
                         <div>
                           <p className="text-[14px] text-[#1e293b] mb-1">{trip.id}</p>
                           <p className="text-[12.5px] text-slate-500 mb-1">{trip.route} • {trip.date}</p>
                           <p className="text-[12.5px] text-slate-500">{trip.passengers} passengers</p>
                         </div>
                         <div className="flex flex-col items-end gap-3">
                           <div className="flex items-center gap-1">
                             <Star className="w-4 h-4 text-[#f59e0b] fill-current" />
                             <span className="text-[14px] font-medium text-slate-700">{trip.rating}</span>
                           </div>
                           <p className="text-[14px] text-[#22c55e]">{trip.revenue}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {activeTab === 'Earnings' && (
                 <div className="space-y-4">
                   <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-50">
                     <p className="text-[13px] text-slate-500 mb-2">Total Earnings</p>
                     <p className="text-[32px] text-[#22c55e] leading-none">₦156,000</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-50">
                       <p className="text-[12px] text-slate-500 mb-2">This Month</p>
                       <p className="text-[20px] text-[#1e293b]">₦12,500</p>
                     </div>
                     <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-50">
                       <p className="text-[12px] text-slate-500 mb-2">This Week</p>
                       <p className="text-[20px] text-[#1e293b]">₦2,800</p>
                     </div>
                   </div>
                 </div>
               )}

               {activeTab === 'Documents' && (
                 <div className="flex flex-col gap-4">
                   <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-50 flex justify-between items-center">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                         <FileText className="w-5 h-5 text-[#0ea5e9]" />
                       </div>
                       <div>
                         <p className="text-[14.5px] text-[#1e293b] mb-1">Driver's License</p>
                         <p className="text-[12.5px] text-slate-500 mb-1">Expiry: {selectedDriver!.expiry}</p>
                         <p className="text-[12.5px] text-[#22c55e] flex items-center gap-1">✓ {selectedDriver!.licenseStatus}</p>
                       </div>
                     </div>
                     <button className="flex items-center gap-2 text-[13.5px] text-[#0ea5e9] font-medium hover:text-[#0284c7] transition-colors">
                       <Download className="w-4 h-4" />
                       Download
                     </button>
                   </div>
                   
                   <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-50 flex justify-between items-center">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                         <FileText className="w-5 h-5 text-[#0ea5e9]" />
                       </div>
                       <div>
                         <p className="text-[14.5px] text-[#1e293b] mb-1">Insurance Certificate</p>
                         <p className="text-[12.5px] text-slate-500 mb-1">Expiry: Dec 31, 2025</p>
                         <p className="text-[12.5px] text-[#22c55e] flex items-center gap-1">✓ Valid</p>
                       </div>
                     </div>
                     <button className="flex items-center gap-2 text-[13.5px] text-[#0ea5e9] font-medium hover:text-[#0284c7] transition-colors">
                       <Download className="w-4 h-4" />
                       Download
                     </button>
                   </div>
                 </div>
               )}
               
               {activeTab === 'Actions' && (
                 <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => setShowAssignModal(true)}
                     className="w-full py-3.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-[#0284c7] transition-colors"
                   >
                     Assign to Bus
                   </button>
                   <button className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-slate-50 transition-colors">
                     Edit Driver
                   </button>
                   <button 
                     onClick={() => setShowBlockModal(true)}
                     className="w-full py-3.5 bg-[#ef4444] text-white rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-[#dc2626] transition-colors mt-2"
                   >
                     Block Account
                   </button>
                   <button className="w-full py-3.5 bg-white border border-[#ef4444] text-[#ef4444] rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-red-50 transition-colors">
                     Remove Driver
                   </button>
                 </div>
               )}

               </div>
             </div>

             {/* Modal Footer */}
             <div className="p-5 border-t border-slate-100 flex gap-3 bg-white mt-auto">
               <button onClick={() => setSelectedDriver(null)} className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-slate-50 transition-colors">
                 Close
               </button>
             </div>
           </div>
         </div>
       )}

      {/* ── Assign Driver to Bus Modal ── */}
      {showAssignModal && selectedDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-slate-100">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1e293b] leading-tight mb-1">Assign Driver to Bus</h2>
                <p className="text-[13.5px] text-slate-500">Assigning: {selectedDriver!.firstName} {selectedDriver!.lastName} ({selectedDriver!.id})</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Select Bus <span className="text-[#ef4444]">*</span>
                </label>
                <select defaultValue="" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14.5px] text-slate-700 outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] appearance-none shadow-sm cursor-pointer invalid:text-slate-400">
                  <option value="" disabled>Search or select bus...</option>
                  <option value="BUS-001" className="text-slate-700">BUS-001 (Toyota Hiace)</option>
                  <option value="BUS-002" className="text-slate-700">BUS-002 (Mercedes Sprinter)</option>
                  <option value="BUS-003" className="text-slate-700">BUS-003 (Toyota Coaster)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Assignment Date <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    defaultValue="26/02/2026"
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-[14.5px] text-slate-700 outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] shadow-sm"
                  />
                  <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Notes <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Add any notes about this assignment..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14.5px] text-slate-700 outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] shadow-sm resize-none placeholder:text-slate-400"
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-[#0284c7] transition-colors">
                Assign Driver
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* ── Block Driver Account Modal ── */}
      {showBlockModal && selectedDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col font-sans">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold text-[#1e293b] leading-tight mb-1">Block Driver Account</h2>
                  <p className="text-[13.5px] text-slate-500">{selectedDriver!.firstName} {selectedDriver!.lastName} ({selectedDriver!.id})</p>
                </div>
              </div>
              <button onClick={() => setShowBlockModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="px-6 pb-2">
              <div className="bg-[#fff1f2] border-l-4 border-[#ef4444] p-4 text-[13.5px] text-slate-700 font-medium">
                Blocking this driver will prevent them from accepting new trips. They will be unable to log in to the driver app.
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-4 space-y-5">
              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Reason for Blocking <span className="text-[#ef4444]">*</span>
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-red-200 bg-white text-[14.5px] text-slate-700 outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] appearance-none shadow-sm cursor-pointer invalid:text-slate-400" defaultValue="">
                  <option value="" disabled>Select reason</option>
                  <option value="Poor Performance" className="text-slate-700">Poor Performance</option>
                  <option value="Safety Violation" className="text-slate-700">Safety Violation</option>
                  <option value="Misconduct" className="text-slate-700">Misconduct</option>
                  <option value="Document Expired" className="text-slate-700">Document Expired</option>
                  <option value="Other" className="text-slate-700">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Additional Notes <span className="text-[#ef4444]">*</span>
                </label>
                <textarea 
                  rows={4} 
                  placeholder="Provide details about why this driver is being blocked..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-[14.5px] text-slate-700 outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] shadow-sm resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0ea5e9] rounded border-slate-300 focus:ring-[#0ea5e9]" />
                <span className="text-[14px] text-[#1e293b]">Notify driver via email and SMS</span>
              </label>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button 
                onClick={() => setShowBlockModal(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-[#ef4444] text-white rounded-xl text-[14.5px] font-medium shadow-sm hover:bg-[#dc2626] transition-colors">
                Block Account
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
