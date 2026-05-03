import { create } from 'zustand';
import api from '../../../shared/api';

export interface AvailableBus {
  id: string;
  registrationNumber: string;
  nickname: string;
  totalCapacity: number;
  amenities: string[];
  maintenanceStatus: string;
  status: string;
}

export interface AvailableDriver {
  id: string;
  fullName: string;
  displayId: string;
}

export interface TripListItem {
  id: string;
  from: string;
  to: string;
  driver: string;
  initials: string;
  bus: string;
  passengers: number;
  capacity: number;
  eta: string;
  status: 'Scheduled' | 'Active' | 'Completed' | 'En Route';
  departureDate: string;
  departureTime: string;
}

export interface TripPassenger {
  id: string;
  seat: string;
  name: string;
  ticketId: string;
  phone: string;
  status: 'Checked In' | 'Pending' | 'No Show';
}

export interface TripDetail extends TripListItem {
  driverPhone: string;
  driverInitials: string;
  busCapacity: number;
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  deductions: number;
  driverEarnings: number;
  ticketPrice: number;
  manifest: TripPassenger[];
}

interface FetchTripsFilters {
  status?: string;
  date?: string;
  searchTerm?: string;
}

interface TripStore {
  trips: TripListItem[];
  currentTrip: TripDetail | null;
  availableBuses: AvailableBus[];
  availableDrivers: AvailableDriver[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  fetchTrips: (filters?: FetchTripsFilters) => Promise<void>;
  fetchTripById: (id: string) => Promise<void>;
  fetchAvailableAssets: () => Promise<void>;
  createTrip: (data: any) => Promise<void>;
  updateTripStatus: (id: string, status: string) => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  currentTrip: null,
  availableBuses: [],
  availableDrivers: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchTrips: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.date) params.append('date', filters.date);
      if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

      const res = await api.get(`/admin/trips?${params.toString()}`);
      set({ trips: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load trips',
        isLoading: false 
      });
    }
  },

  fetchTripById: async (id) => {
    set({ isLoading: true, error: null, currentTrip: null });
    try {
      const res = await api.get(`/admin/trips/${id}`);
      set({ currentTrip: res.data.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load trip details',
        isLoading: false 
      });
    }
  },

  fetchAvailableAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/fleet/assets/available');
      set({ 
        availableBuses: res.data.buses, 
        availableDrivers: res.data.drivers,
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to load available assets',
        isLoading: false 
      });
    }
  },

  createTrip: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await api.post('/admin/trips', data);
      set({ isSubmitting: false });
      // Refresh list if needed or handle navigation in component
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Failed to create trip',
        isSubmitting: false 
      });
      throw err;
    }
  },

  updateTripStatus: async (id, status) => {
    try {
      await api.patch(`/admin/trips/${id}/status`, { status });
      // Refresh current trip or list
      const { currentTrip } = get();
      if (currentTrip && currentTrip.id === id) {
        get().fetchTripById(id);
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to update trip status' });
      throw err;
    }
  }
}));
