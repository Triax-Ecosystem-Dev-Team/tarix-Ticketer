import { create } from 'zustand';
import api from '../../../shared/api';

export interface FleetStats {
  total: number;
  available: number;
  onTrip: number;
  maintenance: number;
}

export interface BusData {
  id: string;
  registrationNumber: string;
  nickname: string;
  chassisNumber: string;
  engineNumber: string;
  ownerName: string;
  ownerPhone: string;
  manufacturer: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  totalCapacity: number;
  availableSeats: number;
  maintenanceStatus: string;
  transmissionType: string;
  amenities: string[];
  
  // Computed by backend
  status: string;
  tripsCount: number;
  revenue: string;
  utilization: number;
  tokens: string;
  rating: string;
  issues: number;
  avgTrip: string;
  capacity: string;
  plate: string;
  service: string;
  type: string;
}

interface FleetStore {
  buses: BusData[];
  fleetStats: FleetStats;
  isLoading: boolean;
  error: string | null;
  fetchFleet: () => Promise<void>;
  registerBus: (formData: FormData) => Promise<any>;
  updateBus: (id: string, formData: FormData | any) => Promise<void>;
  updateBusStatus: (id: string, status: string) => Promise<void>;
  reassignTrip: (tripId: string, newBusId: string, oldBusStatus: string) => Promise<void>;
  deleteBus: (id: string, force?: boolean) => Promise<void>;
  getBusById: (id: string) => Promise<any>;
  fetchBusReport: (id: string) => Promise<void>;
  fetchFleetPerformance: () => Promise<void>;
  conflictData: any | null;
  busReport: any | null;
  performanceData: {
    totalRevenue: number;
    totalTrips: number;
    avgUtilization: number;
    totalTokens: number;
    dailyStats: number[];
  } | null;
  availableBuses: { id: string, label: string, capacity: number }[];
  fetchAvailableBuses: () => Promise<void>;
}

export const useFleetStore = create<FleetStore>((set) => ({
  buses: [],
  fleetStats: {
    total: 0,
    available: 0,
    onTrip: 0,
    maintenance: 0,
  },
  conflictData: null,
  busReport: null,
  performanceData: null,
  setConflictData: (data) => set({ conflictData: data }),
  isLoading: false,
  error: null,
  availableBuses: [],

  fetchAvailableBuses: async () => {
    try {
      const res = await api.get('/admin/buses/available');
      set({ availableBuses: res.data.data });
    } catch (err: any) {
      console.error('Failed to fetch available buses:', err);
    }
  },

  fetchFleet: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/fleet');
      if (response.data.success) {
        set({
          buses: response.data.buses,
          fleetStats: response.data.stats,
          isLoading: false
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
    }
  },

  registerBus: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/fleet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set({ isLoading: false });
      // Re-fetch fleet after adding
      const store = useFleetStore.getState();
      await store.fetchFleet();
      return response.data; // Return so caller can read registrationNumber
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  updateBusStatus: async (id: string, status: string) => {
    // Optimistic update
    const previousBuses = useFleetStore.getState().buses;
    const updatedBuses = previousBuses.map(bus => 
      bus.id === id ? { ...bus, status, maintenanceStatus: status === 'Available' ? 'Excellent' : 'Poor' } : bus
    );
    set({ buses: updatedBuses });

    try {
      await api.patch(`/fleet/${id}/status`, { status });
      // Re-fetch to sync any backend derived logic (like "On Trip" detection)
      const store = useFleetStore.getState();
      await store.fetchFleet();
    } catch (err: any) {
      if (err.response?.status === 409) {
        set({ conflictData: { ...err.response.data.activeTrip, targetStatus: status, busId: id } });
      }
      // Revert on error
      set({ buses: previousBuses, error: err.response?.data?.message || err.message });
      throw err;
    }
  },

  reassignTrip: async (tripId, newBusId, oldBusStatus) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/trips/${tripId}/reassign-bus`, { newBusId, newStatusForOldBus: oldBusStatus });
      set({ isLoading: false, conflictData: null });
      const store = useFleetStore.getState();
      await store.fetchFleet();
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  fetchBusReport: async (id) => {
    set({ isLoading: true, error: null, busReport: null });
    try {
      const response = await api.get(`/fleet/report/${id}`);
      set({ busReport: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  fetchFleetPerformance: async () => {
    try {
      const response = await api.get('/fleet/performance');
      set({ performanceData: response.data });
    } catch (err: any) {
      console.error('Failed to fetch fleet performance:', err);
    }
  },

  updateBus: async (id: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      if (data instanceof FormData) {
        await api.put(`/fleet/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.put(`/fleet/${id}`, data);
      }
      set({ isLoading: false });
      const store = useFleetStore.getState();
      await store.fetchFleet();
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  deleteBus: async (id: string, force: boolean = false) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/fleet/${id}${force ? '?force=true' : ''}`);
      set({ isLoading: false });
      const store = useFleetStore.getState();
      await store.fetchFleet();
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message, isLoading: false });
      throw err;
    }
  },

  getBusById: async (id: string) => {
    try {
      const res = await api.get(`/fleet/${id}`);
      return res.data.bus;
    } catch (err: any) {
      console.error(err);
      return null;
    }
  }
}));
