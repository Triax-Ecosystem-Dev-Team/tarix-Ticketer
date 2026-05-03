import { create } from 'zustand';
import api from '../../../shared/api';

export interface DriverStats {
  total: number;
  active: number;
  onTrip: number;
  inactive: number;
}

export interface Driver {
  id: string;
  driverId: string;
  fullName: string;
  email: string;
  phone: string;
  bloodGroup?: string;
  homeAddress: string;
  licenseNumber: string;
  yearsOfExperience: number;
  licenseExpiryDate: string;
  assignedBusId?: string;
  assignedBusNumber: string;
  employmentDate: string;
  monthlySalary: number;
  status: 'Active' | 'On Trip' | 'Inactive';
  isLicenseExpired: boolean;
  profilePhotoUrl?: string;
}

interface DriverStore {
  drivers: Driver[];
  stats: DriverStats;
  isLoading: boolean;
  error: string | null;

  fetchDrivers: () => Promise<void>;
}

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  stats: {
    total: 0,
    active: 0,
    onTrip: 0,
    inactive: 0
  },
  isLoading: false,
  error: null,

  fetchDrivers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/drivers');
      set({ 
        drivers: res.data.drivers, 
        stats: res.data.stats,
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load drivers',
        isLoading: false 
      });
    }
  },
}));
