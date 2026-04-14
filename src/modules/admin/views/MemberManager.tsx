import { useState, useRef, useEffect } from 'react';
import { 
  Users, Ticket, Bus, UserCheck, 
  Search, MoreVertical, Mail, Phone, 
  CreditCard, MapPin, BusFront, Calendar,
  Clock, Eye, Edit, Trash2,
  X, AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

const STATS = [
  { id: 'total', label: 'Total Members', value: '6', icon: Users, color: 'text-slate-400' },
  { id: 'ticketers', label: 'Ticketers', value: '3', icon: Ticket, color: 'text-[#0EA5E9]' },
  { id: 'drivers', label: 'Drivers', value: '3', icon: BusFront, color: 'text-[#EC4899]' },
  { id: 'active', label: 'Active', value: '5', icon: UserCheck, color: 'text-[#22C55E]' },
];

const MOCK_MEMBERS = [
  {
    id: 'TKT-001',
    name: 'Adebayo Okafor',
    role: 'Ticketer',
    email: 'adebayo.okafor@tarix.com',
    phone: '+234 801 234 5678',
    address: '23 Allen Avenue, Ikeja, Lagos',
    location: 'Lagos Station',
    status: 'Active',
    salary: '₦50,000',
    employmentDate: '15/01/2024',
    shift: 'Morning',
    emergencyContact: {
      name: 'Chioma Okafor',
      phone: '+234 802 345 6789'
    }
  },
  {
    id: 'TKT-002',
    name: 'Ngozi Eze',
    role: 'Ticketer',
    email: 'ngozi.eze@tarix.com',
    phone: '+234 803 456 7890',
    address: '12 Garki Road, Abuja',
    location: 'Abuja Station',
    status: 'Active',
    salary: '₦50,000',
    employmentDate: '10/02/2024',
    shift: 'Afternoon',
    emergencyContact: {
      name: 'Emeka Eze',
      phone: '+234 804 567 8901'
    }
  },
  {
    id: 'DRV-001',
    name: 'Ibrahim Musa',
    role: 'Driver',
    email: 'ibrahim.musa@tarix.com',
    phone: '+234 805 678 9012',
    address: '45 Sabo Street, Kaduna',
    location: 'BUS-001',
    status: 'Active',
    salary: '₦100,000',
    employmentDate: '05/01/2024',
    shift: 'Morning',
    emergencyContact: {
      name: 'Fatima Musa',
      phone: '+234 806 789 0123'
    }
  },
  {
    id: 'DRV-002',
    name: 'Chukwudi Nwosu',
    role: 'Driver',
    email: 'chukwudi.nwosu@tarix.com',
    phone: '+234 807 890 1234',
    address: '88 Onitsha Way, Enugu',
    location: 'BUS-003',
    status: 'Active',
    salary: '₦100,000',
    employmentDate: '20/01/2024',
    shift: 'Night',
    emergencyContact: {
      name: 'Amaka Nwosu',
      phone: '+234 808 901 2345'
    }
  },
  {
    id: 'TKT-003',
    name: 'Amina Bello',
    role: 'Ticketer',
    email: 'amina.bello@tarix.com',
    phone: '+234 809 012 3456',
    address: '67 Bompai Road, Kano',
    location: 'Kano Station',
    status: 'Inactive',
    salary: '₦50,000',
    employmentDate: '12/03/2024',
    shift: 'Afternoon',
    emergencyContact: {
      name: 'Umar Bello',
      phone: '+234 810 123 4567'
    }
  },
  {
    id: 'DRV-003',
    name: 'Samuel Adeleke',
    role: 'Driver',
    email: 'samuel.adeleke@tarix.com',
    phone: '+234 811 234 5678',
    address: '15 Challenge Area, Ibadan',
    location: 'BUS-005',
    status: 'Active',
    salary: '₦100,000',
    employmentDate: '01/02/2024',
    shift: 'Morning',
    emergencyContact: {
      name: 'Bisi Adeleke',
      phone: '+234 812 345 6789'
    }
  },
];

const MemberManager = () => {
  const [activeTab, setActiveTab] = useState('All Members');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesTab = 
      activeTab === 'All Members' || 
      (activeTab === 'Ticketers' && member.role === 'Ticketer') ||
      (activeTab === 'Drivers' && member.role === 'Driver');
    
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen relative pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full bg-[#E0F2FE] flex items-center justify-center">
          <Users className="w-6 h-6 text-[#0EA5E9]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">Member Manager</h1>
          <p className="text-[#64748B] text-sm font-medium">View, edit, and manage your team members</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
        {STATS.map((stat) => (
          <div key={stat.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={clsx("w-5 h-5", stat.color)} />
            </div>
            <h2 className="text-[28px] font-bold text-[#1E293B] leading-none">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
          {['All Members', 'Ticketers', 'Drivers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === tab 
                  ? "bg-[#0EA5E9] text-white shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
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
      </div>

      {/* Member Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow relative">
              <div className="flex justify-between mb-6">
                <div className="flex gap-4">
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    member.role === 'Ticketer' ? "bg-[#E0F2FE]" : "bg-[#fce7f3]"
                  )}>
                    {member.role === 'Ticketer' 
                      ? <Ticket className="w-6 h-6 text-[#0EA5E9]" /> 
                      : <Bus className="w-6 h-6 text-[#EC4899]" />
                    }
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1E293B] mb-1">{member.name}</h3>
                    <span className={clsx(
                      "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider",
                      member.role === 'Ticketer' ? "bg-[#E0F2FE] text-[#0EA5E9]" : "bg-[#fce7f3] text-[#EC4899]"
                    )}>
                      {member.role}
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
                    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
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
                      <button className="w-full px-4 py-2.5 text-left text-[14px] text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Member
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2" />
                      <button 
                        onClick={() => {
                          setMemberToDelete(member);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14px] text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Member
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
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium">ID: {member.id}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  {member.role === 'Ticketer' 
                    ? <MapPin className="w-4 h-4 text-slate-400" />
                    : <BusFront className="w-4 h-4 text-slate-400" />
                  }
                  <span className="text-[13px] font-medium truncate">
                    {member.role === 'Ticketer' ? member.location : `Assigned: ${member.location}`}
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
                <span className="text-[15px] font-bold text-[#1E293B]">{member.salary}/mo</span>
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
          <p className="text-[#64748B] max-w-sm mb-8">We couldn't find any team members matching your search criteria. Try a different search term or filter.</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setActiveTab('All Members');
            }}
            className="text-[#0EA5E9] font-bold text-[15px] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            <div className="flex items-start justify-between p-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-sm",
                  selectedMember.role === 'Ticketer' ? "bg-[#E0F2FE]" : "bg-[#fce7f3]"
                )}>
                  {selectedMember.role === 'Ticketer' 
                    ? <Ticket className="w-8 h-8 text-[#0EA5E9]" /> 
                    : <Bus className="w-8 h-8 text-[#EC4899]" />
                  }
                </div>
                <div>
                  <h2 className="text-[22px] font-semibold text-[#1e293b] leading-tight">
                    {selectedMember.name}
                  </h2>
                  <p className="text-[14px] font-medium text-slate-500">Member Details</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Personal Information */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h4>
                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-50 space-y-5">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Email</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Phone</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Address</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Employment Details</h4>
                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-50 grid grid-cols-2 gap-y-6 gap-x-8">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Employment Date</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.employmentDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Monthly Salary</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Station</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Shift</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.shift}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4">Emergency Contact</h4>
                <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-50 space-y-5">
                  <div className="flex items-start gap-4">
                    <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Contact Name</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.emergencyContact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-[12px] text-slate-500 font-medium mb-0.5">Contact Phone</p>
                      <p className="text-[14px] font-semibold text-[#1e293b]">{selectedMember.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
              <button 
                className="flex-1 py-3.5 bg-[#0EA5E9] text-white rounded-xl text-[15px] font-bold shadow-sm hover:bg-[#0284c7] transition-all flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Member
              </button>
              <button 
                onClick={() => setSelectedMember(null)} 
                className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[15px] font-bold shadow-sm hover:bg-slate-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden p-8 flex flex-col items-center text-center font-sans animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-[26px] font-bold text-[#1e293b] mb-3">Delete Member?</h2>
            <p className="text-slate-500 text-[16px] leading-relaxed mb-8">
              Are you sure you want to remove <strong className="text-slate-700">{memberToDelete.name}</strong> from the team? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-4 bg-[#ef4444] text-white rounded-xl text-[15px] font-bold shadow-sm hover:bg-[#dc2626] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Member
              </button>
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl text-[15px] font-bold shadow-sm hover:bg-slate-50 transition-all"
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

export default MemberManager;
