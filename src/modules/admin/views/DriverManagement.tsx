import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Navigation, AlertCircle, 
  Search, LayoutGrid, List, Plus, Phone, Mail, MoreVertical, X,
  FileText, Download, Star, AlertTriangle, Calendar, Loader2
} from 'lucide-react';
import { useTeamStore, useTeamStats, useFilteredMembers, Member } from '../store/useTeamStore';
import { useFleetStore } from '../store/useFleetStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const getStatusStyles = (status: string, isExpired?: boolean) => {
  if (isExpired) return 'bg-[#ef4444] text-white';
  switch (status) {
    case 'Active': return 'bg-[#22c55e] text-white';
    case 'On Trip': return 'bg-[#f59e0b] text-white';
    case 'Inactive': return 'bg-slate-300 text-slate-700';
    default: return 'bg-gray-500 text-white';
  }
};

export default function DriverManagement() {
  const { 
    isLoading, 
    fetchTeamMembers, 
    searchQuery, 
    setSearchQuery, 
    filterStatus, 
    setFilterStatus,
    assignBusToDriver,
    unassignBusFromDriver
  } = useTeamStore();

  const { availableBuses, fetchAvailableBuses } = useFleetStore();
  
  const drivers = useFilteredMembers('Driver');
  const getStats = useTeamStats();
  const stats = getStats('Driver');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDriver, setSelectedDriver] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Trip History' | 'Earnings' | 'Documents' | 'Actions'>('Overview');
  
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedBusId, setSelectedBusId] = useState('');

  useEffect(() => {
    fetchTeamMembers();
    fetchAvailableBuses();
  }, [fetchTeamMembers, fetchAvailableBuses]);

  const STATS_CARDS = [
    { id: 'total', label: 'TOTAL DRIVERS', value: stats.total.toString(), subLabel: 'In fleet', type: 'info', icon: Users },
    { id: 'active', label: 'ACTIVE', value: stats.active.toString(), subLabel: 'Available for trips', type: 'success', icon: CheckCircle2 },
    { id: 'ontrip', label: 'ON TRIP', value: stats.onTrip.toString(), subLabel: 'Currently driving', type: 'warning', icon: Navigation },
    { id: 'blocked', label: 'BLOCKED/INACTIVE', value: stats.inactive.toString(), subLabel: 'Suspended accounts', type: 'danger', icon: AlertCircle },
  ];

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Link 
            to="/admin/team/add/driver"
            className="flex items-center justify-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2.5 rounded-xl font-semibold text-[13.5px] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Driver
          </Link>
        </div>
      </div>

      {/* ── Top Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS_CARDS.map((stat) => {
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
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className={clsx("text-[32px] font-bold leading-none mb-2", stat.type === 'success' ? 'text-[#22c55e]' : stat.type === 'warning' ? 'text-[#f59e0b]' : stat.type === 'danger' ? 'text-[#ef4444]' : 'text-[#1e293b]')}>
                {stat.value}
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] text-slate-500 font-medium">{stat.subLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Driver Grid ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-3xl gap-4">
          <Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
          <p className="text-slate-500 font-medium">Fetching drivers...</p>
        </div>
      ) : (
        <div className={clsx("grid gap-5", viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col font-sans">
              
              {/* Header: Avatar, Name, Badge */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-[18px] shadow-sm relative shrink-0">
                    {driver.profilePhotoUrl ? (
                      <img src={driver.profilePhotoUrl} className="w-full h-full rounded-full object-cover" alt={driver.fullName} />
                    ) : (
                      driver.fullName.split(' ').map(n => n[0]).join('')
                    )}
                    <div className="absolute top-0 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className={clsx("w-2 h-2 rounded-full", driver.isLicenseExpired ? "bg-[#ef4444]" : "bg-[#22c55e]")}></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1e293b] leading-snug">
                      {driver.fullName}
                    </h3>
                    <p className="text-[12.5px] font-medium text-slate-400">{driver.displayId}</p>
                  </div>
                </div>
                <span className={clsx("px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide mt-1", getStatusStyles(driver.status, driver.isLicenseExpired))}>
                  {driver.isLicenseExpired ? 'EXPIRED' : driver.status}
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
              <span className="text-[13px] font-bold text-[#1e293b] text-right">{driver.licenseNumber}</span>
              
              <span className="text-[12px] font-semibold text-slate-500">Expiry:</span>
              <span className={clsx("text-[13px] font-bold text-right", driver.isLicenseExpired ? "text-[#ef4444]" : "text-[#1e293b]")}>
                {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </span>
              
              <span className="text-[12px] font-semibold text-slate-500">Status:</span>
              <span className={clsx("text-[13px] font-bold text-right flex items-center justify-end gap-1", driver.isLicenseExpired ? "text-[#ef4444]" : "text-[#22c55e]")}>
                {driver.isLicenseExpired ? '⚠ Expired' : '✓ Valid'}
              </span>
            </div>

            {/* Performance Stats */}
            <div className="flex justify-between items-center mb-6 px-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e0f2fe] flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-[#0ea5e9]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 mb-0.5">Exp</span>
                <span className="text-[15px] font-bold text-[#1e293b]">{driver.yearsOfExperience}y</span>
              </div>
              <div className="w-px h-12 bg-slate-100"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] flex items-center justify-center mb-2">
                  <Navigation className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 mb-0.5">Salary</span>
                <span className="text-[15px] font-bold text-[#1e293b]">₦{driver.monthlySalary?.toLocaleString()}</span>
              </div>
            </div>

            {/* Assigned Bus Details */}
            <div className="mb-6 border-t border-slate-100 pt-5">
              <span className="block text-[11px] font-semibold text-slate-400 mb-2">Assigned Bus</span>
              {driver.assignedBus ? (
                <div className="flex justify-between items-center bg-[#f0f9ff] p-2.5 rounded-xl border border-[#bae6fd]">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#0ea5e9]">{driver.assignedBus.registrationNumber}</span>
                    {driver.assignedBus.nickname && (
                      <span className="text-[10px] text-slate-500 italic">"{driver.assignedBus.nickname}"</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase text-[#0ea5e9] bg-white px-2 py-0.5 rounded-full border border-[#bae6fd]">
                    Active
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#f8fafc] p-2.5 rounded-xl border border-slate-50">
                  <span className="text-[13px] font-medium text-slate-500 italic">No vehicle assigned</span>
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
                Profile
              </button>
              
              {driver.assignedBusId ? (
                <button 
                  disabled={isLoading}
                  onClick={async () => {
                    try {
                      await useTeamStore.getState().unassignBus(driver.id);
                      toast.success("Bus unassigned successfully");
                    } catch (err: any) {
                      toast.error(err.message);
                    }
                  }}
                  className="flex-1 py-2 text-white bg-[#ef4444] border border-[#ef4444] rounded-xl text-[13px] font-semibold hover:bg-[#dc2626] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Unassign'}
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSelectedDriver(driver);
                    setShowAssignModal(true);
                  }}
                  className="flex-1 py-2 text-[#0ea5e9] bg-white border border-[#bae6fd] rounded-xl text-[13px] font-semibold hover:bg-[#f0f9ff] transition-colors"
                >
                  Assign
                </button>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === driver.id ? null : driver.id)}
                  className="p-2 text-slate-400 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openMenuId === driver.id && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link 
                      to={`/admin/team/edit/driver/${driver.id}`}
                      className="w-full px-4 py-2.5 text-left text-[14px] text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Edit Profile
                    </Link>
                    <button 
                      onClick={() => {
                        setSelectedDriver(driver);
                        setShowBlockModal(true);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[14px] text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {driver.status === 'Inactive' ? 'Unblock Driver' : 'Block Driver'}
                    </button>
                    <div className="h-px bg-slate-50 my-1 mx-2"></div>
                    <button className="w-full px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <X className="w-4 h-4" />
                      Delete Driver
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
          ))}
        </div>
      )}

      {/* ── Driver Profile Modal ── */}
      {selectedDriver && !showAssignModal && !showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
             {/* Header */}
             <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold text-[24px] overflow-hidden shadow-sm">
                    {selectedDriver.profilePhotoUrl ? (
                      <img src={selectedDriver.profilePhotoUrl} className="w-full h-full object-cover" alt={selectedDriver.fullName} />
                    ) : (
                      selectedDriver.fullName.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-bold text-[#1e293b] leading-tight">{selectedDriver.fullName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[14px] font-medium text-slate-500">{selectedDriver.displayId}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className={clsx("text-[12px] font-bold uppercase", selectedDriver.status === 'Active' ? 'text-[#22c55e]' : 'text-[#f59e0b]')}>
                        {selectedDriver.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDriver(null)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
             </div>

             {/* Modal Tabs */}
             <div className="flex px-6 border-b border-slate-100 gap-6">
               {['Overview', 'Trip History', 'Earnings', 'Documents'].map(tab => (
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
             <div className="p-6 overflow-y-auto flex-1 bg-white">
                {activeTab === 'Overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">License Number</p>
                        <p className="text-[15px] font-bold text-[#1e293b]">{selectedDriver.licenseNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Experience</p>
                        <p className="text-[15px] font-bold text-[#1e293b]">{selectedDriver.yearsOfExperience} Years Professional</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</p>
                        <p className="text-[15px] font-bold text-[#0ea5e9]">{selectedDriver.phone}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</p>
                        <p className="text-[15px] font-bold text-[#0ea5e9]">{selectedDriver.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">License Expiry</p>
                        <p className={clsx("text-[15px] font-bold", selectedDriver.isLicenseExpired ? "text-[#ef4444]" : "text-[#1e293b]")}>
                          {selectedDriver.licenseExpiryDate ? new Date(selectedDriver.licenseExpiryDate).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Monthly Salary</p>
                        <p className="text-[15px] font-bold text-[#22c55e]">₦{selectedDriver.monthlySalary?.toLocaleString() || '0'}</p>
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5">
                       <p className="text-[13px] font-bold text-[#1e293b] mb-3">Emergency Contact</p>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Name</p>
                            <p className="text-[14px] font-semibold text-[#1e293b]">{selectedDriver.emergencyContactName || 'N/A'}</p>
                         </div>
                         <div>
                            <p className="text-[11px] font-medium text-slate-500 mb-0.5">Phone</p>
                            <p className="text-[14px] font-semibold text-[#1e293b]">{selectedDriver.emergencyContactPhone || 'N/A'}</p>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Documents' && (
                  <div className="space-y-3">
                    {[
                      { label: 'Driver License (PDF)', key: 'licenseFileUrl' },
                      { label: 'National ID / NIN (PDF)', key: 'ninFileUrl' },
                    ].map((doc, idx) => {
                      const url = (selectedDriver as any)[doc.key];
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-100 rounded-xl group hover:border-[#0ea5e9]/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#0ea5e9]">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#1e293b]">{doc.label}</p>
                              <p className="text-[12px] text-slate-500 font-medium">{url ? 'Verified & Encrypted' : 'Not Uploaded'}</p>
                            </div>
                          </div>
                          {url && (
                            <a 
                              href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}?token=${localStorage.getItem('token')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded-xl transition-all shadow-sm"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'Trip History' && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Navigation className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#1e293b] mb-1">No Active Trips</h3>
                    <p className="text-[13.5px] text-slate-500 max-w-[280px]">This driver has no trips recorded in the current billing cycle.</p>
                  </div>
                )}

                {activeTab === 'Earnings' && (
                  <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-6 text-center">
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">Projected Monthly Earnings</p>
                    <h2 className="text-[32px] font-black text-[#22c55e]">₦{selectedDriver.monthlySalary?.toLocaleString() || '0'}</h2>
                    <div className="mt-6 flex gap-2">
                       <button className="flex-1 py-2.5 bg-white border border-slate-200 text-[#1e293b] rounded-xl text-[13px] font-bold hover:bg-white/50 transition-colors">
                         View Paystub
                       </button>
                       <button className="flex-1 py-2.5 bg-white border border-slate-200 text-[#1e293b] rounded-xl text-[13px] font-bold hover:bg-white/50 transition-colors">
                         Incentives
                       </button>
                    </div>
                  </div>
                )}
             </div>

             {/* Footer */}
             <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
                <button 
                  onClick={() => setSelectedDriver(null)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[14.5px] hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <Link 
                  to={`/admin/team/edit/driver/${selectedDriver.id}`}
                  className="flex-1 py-3 bg-[#1e293b] text-white rounded-xl font-bold text-[14.5px] hover:bg-[#0f172a] transition-colors text-center"
                >
                  Edit Profile
                </Link>
             </div>
          </div>
        </div>
      )}
      {/* ── Assign Bus Modal ── */}
      {showAssignModal && selectedDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1e293b]">Assign Bus to Driver</h3>
              <button onClick={() => setShowAssignModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 bg-[#f0f9ff] rounded-xl border border-[#bae6fd]">
                 <div className="w-12 h-12 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold">
                    {selectedDriver.fullName.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div>
                    <p className="text-[14px] font-bold text-[#1e293b]">{selectedDriver.fullName}</p>
                    <p className="text-[12px] text-slate-500">{selectedDriver.displayId}</p>
                 </div>
              </div>
              
              <label className="block text-[13px] font-bold text-slate-500 mb-2 uppercase">Select Available Bus</label>
              <select 
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] mb-6"
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
              >
                <option value="">Select an available bus...</option>
                {availableBuses.map(bus => (
                  <option key={bus.id} value={bus.id}>{bus.label}</option>
                ))}
              </select>

              <div className="flex gap-3">
                 <button 
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[14px]"
                  disabled={isLoading}
                 >
                   Cancel
                 </button>
                 <button 
                  disabled={isLoading || !selectedBusId}
                  onClick={async () => {
                    try {
                      await assignBusToDriver(selectedDriver.id, selectedBusId);
                      toast.success("Bus assigned successfully");
                      setShowAssignModal(false);
                      setSelectedBusId('');
                    } catch (err: any) {
                      toast.error(err.message || "Assignment failed");
                    }
                  }}
                  className="flex-1 py-3 bg-[#0ea5e9] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Assignment'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Block Driver Modal ── */}
      {showBlockModal && selectedDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-[19px] font-bold text-[#1e293b] mb-2">
                {selectedDriver.status === 'Inactive' ? 'Unblock Driver?' : 'Block Driver?'}
              </h3>
              <p className="text-[14.5px] text-slate-500 mb-8">
                {selectedDriver.status === 'Inactive' 
                  ? `Are you sure you want to unblock ${selectedDriver.fullName}? They will be able to take trips again.`
                  : `Are you sure you want to block ${selectedDriver.fullName}? This will prevent them from being assigned to new trips.`}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[14px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 bg-[#ef4444] text-white rounded-xl font-bold text-[14px]"
                >
                  {selectedDriver.status === 'Inactive' ? 'Confirm Unblock' : 'Confirm Block'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
