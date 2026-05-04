import { create } from 'zustand';
import api from '../../../shared/api';
import { Passenger } from '../types';

export interface BusStatus {
  id: string;
  status: 'Active' | 'In Transit' | 'Completed' | 'Delayed' | 'Cancelled';
  origin: string;
  destination: string;
  originTerminal: string;
  destinationTerminal: string;
  departureTime: string;
  arrivalTime: string;
  busType: string;
  driver: string;
  seatsBooked: number;
  totalSeats: number;
  passengersBooked: number;
}

export interface LiveLog {
  id: string;
  busId: string;
  message: string;
  timestamp: Date;
}

interface DispatchState {
  buses: BusStatus[];
  isLoading: boolean;
  activeTab: 'All' | 'Active' | 'In Transit' | 'Completed' | 'Delayed' | 'Cancelled';
  searchQuery: string;
  selectedDate: string;
  liveLogs: LiveLog[];
  multiStatusFilters: string[];

  // Passenger Manifest State
  passengers: Passenger[];
  isLoadingPassengers: boolean;
  
  // Sales Stats State
  salesData: {
    totalTickets: number;
    totalRevenue: number;
    breakdown: {
      cash: { tickets: number; revenue: number };
      transfer: { tickets: number; revenue: number };
      card: { tickets: number; revenue: number };
    };
  } | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: DispatchState['activeTab']) => void;
  setSelectedDate: (date: string) => void;
  setMultiFilters: (filters: string[]) => void;
  addLiveLog: (log: LiveLog) => void;
  fetchFleetStatus: () => Promise<void>;
  fetchTripPassengers: (tripId: string) => Promise<void>;
  updateBusStatus: (busId: string, newStatus: string, actualArrival?: string) => Promise<void>;
  fetchSalesStats: () => Promise<void>;
  
  // Getters
  getFilteredBuses: () => BusStatus[];
  getTabCounts: () => Record<string, number>;
}

export const useDispatchStore = create<DispatchState>((set, get) => ({
  buses: [],
  isLoading: false,
  activeTab: 'All',
  searchQuery: '',
  selectedDate: new Date().toISOString().split('T')[0],
  liveLogs: [],
  multiStatusFilters: [],
  passengers: [],
  isLoadingPassengers: false,
  salesData: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setMultiFilters: (filters) => set({ multiStatusFilters: filters }),

  addLiveLog: (log) => set((state) => ({ liveLogs: [log, ...state.liveLogs] })),

  fetchFleetStatus: async () => {
    set({ isLoading: true });
    try {
      const { selectedDate } = get();
      const response = await api.get('/dispatch/status', { params: { date: selectedDate } });
      set({ buses: response.data.data || [], isLoading: false });
    } catch (error) {
      console.error('Failed to fetch fleet status:', error);
      set({ buses: [], isLoading: false });
    }
  },

  fetchTripPassengers: async (tripId: string) => {
    set({ isLoadingPassengers: true, passengers: [] });
    try {
      const response = await api.get(`/dispatch/trips/${tripId}/passengers`);
      set({ passengers: response.data.data || response.data || [], isLoadingPassengers: false });
    } catch (error) {
      console.error(`Failed to fetch passengers for trip "${tripId}":`, error);
      set({ passengers: [], isLoadingPassengers: false });
    }
  },

  updateBusStatus: async (busId: string, newStatus: string, actualArrival?: string) => {
    try {
      await api.patch(`/dispatch/trips/${busId}/status`, { status: newStatus, actualArrival });
      // Re-fetch to sync
      const { fetchFleetStatus } = get();
      await fetchFleetStatus();
    } catch (error) {
      console.error('Failed to update bus status:', error);
      throw error;
    }
  },

  fetchSalesStats: async () => {
    try {
      const response = await api.get('/dispatch/sales-stats');
      set({ salesData: response.data.data });
    } catch (error) {
      console.error('Failed to fetch sales stats:', error);
    }
  },

  getFilteredBuses: () => {
    const { buses, activeTab, searchQuery, multiStatusFilters } = get();
    const query = searchQuery.toLowerCase();
    
    return buses.filter(bus => {
      // Tab filter
      const matchesTab = activeTab === 'All' || bus.status === activeTab;
      
      // Multi-status filter (if active)
      const matchesMulti = multiStatusFilters.length === 0 || multiStatusFilters.includes(bus.status);
      
      // Search filter
      const matchesSearch = 
        bus.id.toLowerCase().includes(query) || 
        bus.origin.toLowerCase().includes(query) || 
        bus.destination.toLowerCase().includes(query) ||
        bus.driver.toLowerCase().includes(query) ||
        (bus.busType && bus.busType.toLowerCase().includes(query));
      
      return matchesTab && matchesMulti && matchesSearch;
    });
  },

  getTabCounts: () => {
    const { buses } = get();
    
    const counts: Record<string, number> = {
      'All': buses.length,
      'Active': 0,
      'In Transit': 0,
      'Completed': 0,
      'Delayed': 0,
      'Cancelled': 0,
    };

    buses.forEach(bus => {
      if (counts[bus.status] !== undefined) {
        counts[bus.status]++;
      }
    });

    return counts;
  }
}));
