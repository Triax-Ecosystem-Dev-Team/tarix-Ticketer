import { create } from 'zustand';
import api from '../../../shared/api';
import { useFleetStore } from './useFleetStore';

export type MemberRole = 'Admin' | 'Driver' | 'Ticketer';
export type MemberStatus = 'Active' | 'On Trip' | 'Inactive';

export interface Member {
  id: string;
  displayId: string; // DRV-XXX or TKT-XXX
  fullName: string;
  email: string;
  phone: string;
  role: MemberRole;
  status: MemberStatus;
  profilePhotoUrl?: string;
  // Role specific fields
  licenseNumber?: string;
  licenseExpiryDate?: string;
  isLicenseExpired?: boolean;
  assignedBusId?: string;
  assignedBus?: {
    id: string;
    registrationNumber: string;
    nickname?: string;
  };
  station?: string;
  workShift?: string;
  department?: string; // For Admins
  monthlySalary: number;
  employmentDate: string;
}

interface TeamState {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: string;

  // Form States
  driverForm: Record<string, any>;
  ticketerForm: Record<string, any>;

  // Actions
  fetchTeamMembers: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  updateDriverForm: (data: Partial<Record<string, any>>) => void;
  updateTicketerForm: (data: Partial<Record<string, any>>) => void;
  resetForms: () => void;
  registerMember: (role: MemberRole, files: { [key: string]: File | undefined }) => Promise<any>;
  updateMember: (role: MemberRole, id: string, files: { [key: string]: File | undefined }) => Promise<any>;
  fetchMemberById: (role: MemberRole, id: string) => Promise<any>;
  assignBusToDriver: (driverId: string, busId: string) => Promise<void>;
  unassignBus: (driverId: string) => Promise<void>;
}

const initialDriverForm = {
  fullName: '',
  email: '',
  phone: '',
  bloodGroup: '',
  homeAddress: '',
  licenseNumber: '',
  yearsOfExperience: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
  assignedBusId: '',
  employmentDate: '',
  monthlySalary: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

const initialTicketerForm = {
  fullName: '',
  email: '',
  phone: '',
  idNumber: '',
  homeAddress: '',
  station: '',
  workShift: '',
  employmentDate: '',
  monthlySalary: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  filterStatus: 'All',

  driverForm: initialDriverForm,
  ticketerForm: initialTicketerForm,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  updateDriverForm: (data) => set((state) => ({ driverForm: { ...state.driverForm, ...data } })),
  updateTicketerForm: (data) => set((state) => ({ ticketerForm: { ...state.ticketerForm, ...data } })),
  resetForms: () => set({ driverForm: initialDriverForm, ticketerForm: initialTicketerForm }),

  fetchTeamMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const [driversRes, staffRes] = await Promise.all([
        api.get('/admin/drivers'),
        api.get('/admin/staff')
      ]);

      const drivers: Member[] = driversRes.data.drivers.map((d: any) => ({
        ...d,
        displayId: d.driverId,
        role: 'Driver' as MemberRole,
      }));

      const staffMembers: Member[] = staffRes.data.staff.map((s: any) => ({
        id: s.id,
        displayId: s.ticketer?.idNumber || (s.role === 'Admin' ? `ADM-${s.id.slice(0, 4)}` : `TKT-${s.id.slice(0, 4)}`),
        fullName: s.name,
        email: s.email,
        phone: s.ticketer?.phone || s.phone,
        role: s.role as MemberRole,
        status: 'Active',
        monthlySalary: s.ticketer?.monthlySalary || 0,
        employmentDate: s.ticketer?.employmentDate || s.createdAt,
        station: s.ticketer?.station,
        workShift: s.ticketer?.workShift,
        profilePhotoUrl: s.ticketer?.profilePhotoUrl || s.avatar,
        department: s.role === 'Admin' ? 'Management' : undefined
      }));

      set({ members: [...drivers, ...staffMembers], isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to fetch team members', 
        isLoading: false 
      });
    }
  },

  registerMember: async (role, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      const formValues = role === 'Driver' ? get().driverForm : get().ticketerForm;

      // Append form fields
      Object.entries(formValues).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const endpoint = role === 'Driver' ? '/admin/drivers' : '/admin/ticketers';
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Reset and refresh
      get().resetForms();
      await get().fetchTeamMembers();
      
      set({ isLoading: false });
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || `Failed to register ${role}`;
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  updateMember: async (role, id, files) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      const formValues = role === 'Driver' ? get().driverForm : get().ticketerForm;

      Object.entries(formValues).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const endpoint = role === 'Driver' ? `/admin/drivers/${id}` : `/admin/ticketers/${id}`;
      const res = await api.patch(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      get().resetForms();
      await get().fetchTeamMembers();
      set({ isLoading: false });
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || `Failed to update ${role}`;
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  fetchMemberById: async (role, id) => {
    set({ isLoading: true, error: null });
    try {
      const endpoint = role === 'Driver' ? `/admin/drivers/${id}` : `/admin/staff/${id}`;
      const res = await api.get(endpoint);
      const data = res.data.data;

      if (role === 'Driver') {
        set({ driverForm: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          bloodGroup: data.bloodGroup || '',
          homeAddress: data.homeAddress,
          licenseNumber: data.licenseNumber,
          yearsOfExperience: data.yearsOfExperience,
          licenseIssueDate: data.licenseIssueDate?.split('T')[0],
          licenseExpiryDate: data.licenseExpiryDate?.split('T')[0],
          assignedBusId: data.assignedBusId || '',
          employmentDate: data.employmentDate?.split('T')[0],
          monthlySalary: data.monthlySalary,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,
        }});
      } else {
        const t = data.ticketer;
        set({ ticketerForm: {
          fullName: data.name,
          email: data.email,
          phone: t?.phone || '',
          idNumber: t?.idNumber || '',
          homeAddress: t?.homeAddress || '',
          station: t?.station || '',
          workShift: t?.workShift || '',
          employmentDate: t?.employmentDate?.split('T')[0] || '',
          monthlySalary: t?.monthlySalary || '',
          emergencyContactName: t?.emergencyContactName || '',
          emergencyContactPhone: t?.emergencyContactPhone || '',
        }});
      }

      set({ isLoading: false });
      return data;
    } catch (err: any) {
      set({ error: 'Failed to fetch member details', isLoading: false });
      throw err;
    }
  },

  assignBusToDriver: async (driverId, busId) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/admin/drivers/${driverId}/assign-bus`, { busId });
      // Tell, Don't Ask: Refresh the state to ensure sync
      await Promise.all([
        get().fetchTeamMembers(),
        useFleetStore.getState().fetchAvailableBuses()
      ]);
      set({ isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to assign bus';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  unassignBus: async (driverId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/admin/drivers/${driverId}/unassign-bus`);
      // Sync both stores: Team and Fleet (for available buses)
      await Promise.all([
        get().fetchTeamMembers(),
        useFleetStore.getState().fetchAvailableBuses()
      ]);
      set({ isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to unassign bus';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  }
}));

// ── Selectors (Derived State) ────────────────────────────────────────────────

export const useTeamStats = () => {
  const members = useTeamStore((state) => state.members);
  
  return (role?: MemberRole) => {
    const filtered = role ? members.filter(m => m.role === role) : members;
    
    return {
      total: filtered.length,
      active: filtered.filter(m => m.status === 'Active').length,
      onTrip: filtered.filter(m => m.status === 'On Trip').length,
      inactive: filtered.filter(m => m.status === 'Inactive').length,
    };
  };
};

export const useFilteredMembers = (role?: MemberRole) => {
  const { members, searchQuery, filterStatus } = useTeamStore();
  
  return members.filter(m => {
    const matchesRole = !role || m.role === role;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchesSearch = 
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.displayId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRole && matchesStatus && matchesSearch;
  });
};
