import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckCircle2, Shield, AlertCircle, 
  Search, MoreVertical, Mail, Phone, 
  CreditCard, MapPin, Calendar,
  Clock, Eye, Edit, Trash2,
  X, AlertTriangle, Loader2, Ticket, BusFront, UserCheck
} from 'lucide-react';
import { useTeamStore, useTeamStats, useFilteredMembers, Member, MemberRole } from '../store/useTeamStore';
import clsx from 'clsx';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-[#22C55E] text-white';
    case 'Inactive': return 'bg-slate-300 text-slate-700';
    default: return 'bg-gray-500 text-white';
  }
};

const MemberManager = () => {
  const { 
    isLoading, 
    fetchTeamMembers, 
    searchQuery, 
    setSearchQuery, 
    filterStatus, 
    setFilterStatus 
  } = useTeamStore();
  
  const [activeRole, setActiveRole] = useState<MemberRole>('Ticketer');
  const members = useFilteredMembers(activeRole);
  const getStats = useTeamStats();
  const stats = getStats(activeRole);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const STATS_CARDS = [
    { id: 'total', label: 'Total Staff', value: stats.total.toString(), icon: Users, color: 'text-slate-400' },
    { id: 'active', label: 'Active Now', value: stats.active.toString(), icon: UserCheck, color: 'text-[#22C55E]' },
    { id: 'on-shift', label: 'On Shift', value: stats.onTrip.toString(), icon: Clock, color: 'text-[#F59E0B]' },
    { id: 'inactive', label: 'Inactive', value: stats.inactive.toString(), icon: AlertCircle, color: 'text-[#EF4444]' },
  ];

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen relative pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center">
          <Users className="w-6 h-6 text-[#0EA5E9]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">{activeRole} Management</h1>
          <p className="text-[#64748B] text-sm font-medium">Manage your {activeRole.toLowerCase()}s and organization personnel</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
        {STATS_CARDS.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={clsx("w-5 h-5", stat.color)} />
            </div>
            <h2 className="text-[28px] font-bold text-[#1E293B] leading-none">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex bg-slate-50 p-1 rounded-xl">
            {(['Ticketer', 'Driver', 'Admin'] as MemberRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap",
                  activeRole === role 
                    ? "bg-white text-[#1e293b] shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {role}s
              </button>
            ))}
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden lg:block" />

          <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
            <select 
              className="bg-transparent text-[13px] font-bold text-[#1e293b] outline-none cursor-pointer px-3 py-1.5"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link 
          to={`/admin/team/add/${activeRole.toLowerCase()}`}
          className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#0f172a] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
        >
          Add {activeRole}
        </Link>
      </div>

      {/* Member Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 rounded-3xl gap-4 shadow-sm">
          <Loader2 className="w-12 h-12 text-[#0ea5e9] animate-spin" />
          <p className="text-slate-500 font-bold tracking-tight">Synchronizing Team Data...</p>
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all relative group">
              <div className="flex justify-between mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center overflow-hidden">
                    {member.profilePhotoUrl ? (
                      <img src={member.profilePhotoUrl} className="w-full h-full object-cover" alt={member.fullName} />
                    ) : (
                      member.role === 'Driver' ? <BusFront className="w-6 h-6 text-[#0EA5E9]" /> : 
                      member.role === 'Admin' ? <Shield className="w-6 h-6 text-[#0EA5E9]" /> :
                      <Ticket className="w-6 h-6 text-[#0EA5E9]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1E293B] mb-1">{member.fullName}</h3>
                    <span className="bg-[#E0F2FE] text-[#0EA5E9] px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                      {member.displayId}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === member.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                      <button 
                        onClick={() => {
                          setSelectedMember(member);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  {member.role === 'Driver' ? <BusFront className="w-4 h-4 text-slate-400" /> : <MapPin className="w-4 h-4 text-slate-400" />}
                  <span className="text-[13px] font-medium truncate">
                    {member.role === 'Driver' 
                      ? (member.assignedBus?.registrationNumber || 'No Bus Assigned') 
                      : (member.role === 'Admin' ? (member.department || 'Management') : (member.station || 'Not assigned'))
                    }
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    member.status === 'Active' ? "bg-[#22C55E]" : "bg-slate-300"
                  )} />
                  <span className={clsx(
                    "text-[13px] font-bold",
                    member.status === 'Active' ? "text-[#22C55E]" : "text-slate-400"
                  )}>
                    {member.status}
                  </span>
                </div>
                <span className="text-[15px] font-bold text-[#1E293B]">₦{member.monthlySalary?.toLocaleString()}/mo</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] mb-2">No members found</h3>
          <p className="text-[#64748B] max-w-sm mb-8">We couldn't find any team members matching your search criteria.</p>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center shadow-sm overflow-hidden">
                  {selectedMember.profilePhotoUrl ? (
                    <img src={selectedMember.profilePhotoUrl} className="w-full h-full object-cover" alt={selectedMember.fullName} />
                  ) : (
                    selectedMember.role === 'Driver' ? <BusFront className="w-8 h-8 text-[#0EA5E9]" /> : 
                    selectedMember.role === 'Admin' ? <Shield className="w-8 h-8 text-[#0EA5E9]" /> :
                    <Ticket className="w-8 h-8 text-[#0EA5E9]" />
                  )}
                </div>
                <div>
                  <h2 className="text-[22px] font-semibold text-[#1e293b] leading-tight">{selectedMember.fullName}</h2>
                  <p className="text-[14px] font-medium text-slate-500">{selectedMember.displayId}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Job Profile</h4>
                  <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-slate-500">
                        {selectedMember.role === 'Driver' ? 'Assigned Bus' : (selectedMember.role === 'Admin' ? 'Department' : 'Station')}
                      </span>
                      <span className="text-[14px] font-black text-[#1e293b]">
                        {selectedMember.role === 'Driver' 
                          ? (selectedMember.assignedBus?.registrationNumber || 'N/A') 
                          : (selectedMember.role === 'Admin' ? (selectedMember.department || 'Management') : (selectedMember.station || 'N/A'))
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-slate-500">Shift</span>
                      <span className="text-[14px] font-black text-[#0ea5e9]">{selectedMember.workShift}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-bold text-slate-500">Salary</span>
                      <span className="text-[14px] font-black text-[#22c55e]">₦{selectedMember.monthlySalary?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Details</h4>
                  <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-50 space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#0ea5e9]" />
                      <span className="text-[14px] font-bold text-[#1e293b]">{selectedMember.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-[14px] font-bold text-[#1e293b]">{selectedMember.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <button onClick={() => setSelectedMember(null)} className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[15px] font-bold shadow-sm hover:bg-slate-50 transition-all">
                Close
              </button>
              <Link 
                to={selectedMember.role === 'Admin' ? '#' : `/admin/team/edit/${selectedMember.role.toLowerCase()}/${selectedMember.id}`}
                className={clsx(
                  "flex-1 py-3.5 rounded-xl text-[15px] font-bold shadow-sm transition-all text-center",
                  selectedMember.role === 'Admin' 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-[#1e293b] text-white hover:bg-[#0f172a]"
                )}
              >
                {selectedMember.role === 'Admin' ? 'View-Only Profile' : 'Edit Profile'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManager;
