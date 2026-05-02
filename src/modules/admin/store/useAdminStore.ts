import { create } from 'zustand';
import api from '../../../shared/api';

// ── Dashboard Interfaces ───────────────────────────────────────────────────────

export interface DashboardStats {
  totalBuses: number;
  inactiveBuses: number;
  availableBuses: number;
  utilization: number;
  activeTrips: number;
  completedToday: number;
  completedChange: number;
  revenueToday: string;
  revenueChange: number;
  ticketsSold: number;
  driversActive: number;
  driversTotal: number;
}

export interface RevenueTrend {
  days: { day: string; value: number }[];
  totalRevenue: number;
  totalChange: number;
  averageDaily: number;
  averageChange: number;
}

export interface ActiveTrip {
  id: string;
  from: string;
  to: string;
  driver: string;
  initials: string;
  bus: string;
  passengers: number;
  capacity: number;
  eta: string;
  status: string;
}

export interface ActiveTripsData {
  total: number;
  trips: ActiveTrip[];
}

// ── Trip Interfaces ────────────────────────────────────────────────────────────

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
  status: string;
}

export interface TripPassenger {
  id: string;
  seat: string;
  name: string;
  ticketId: string;
  phone: string;
  status: 'Checked In' | 'Pending' | 'No Show';
}

export interface TripDetail {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: string;
  driver: string;
  driverInitials: string;
  driverPhone: string;
  bus: string;
  busCapacity: number;
  passengers: number;
  totalRevenue: number;
  grossRevenue: number;
  netRevenue: number;
  deductions: number;
  driverEarnings: number;
  ticketPrice: number;
  manifest: TripPassenger[];
}

// ── Form Option Interfaces ─────────────────────────────────────────────────────

export interface BusOption {
  id: string;
  label: string;
  capacity: number;
}

export interface DriverOption {
  id: string;
  label: string;
}

// ── Search Interfaces ──────────────────────────────────────────────────────────

export interface SearchResults {
  trips: { id: string; label: string }[];
  buses: { id: string; label: string }[];
  drivers: { id: string; label: string }[];
}

export interface FetchTripsFilters {
  status?: string;
  date?: string;
  searchTerm?: string;
}

// ── Store State ────────────────────────────────────────────────────────────────

interface AdminState {
  // Dashboard
  dashboardStats: DashboardStats | null;
  revenueTrend: RevenueTrend | null;
  activeTrips: ActiveTripsData | null;
  isLoading: boolean;
  error: string | null;

  // Trips list
  trips: TripListItem[];
  tripsLoading: boolean;
  tripsError: string | null;

  // Trip detail
  currentTrip: TripDetail | null;
  tripLoading: boolean;
  tripError: string | null;

  // Create trip options
  busOptions: BusOption[];
  driverOptions: DriverOption[];
  formOptionsLoading: boolean;

  // Notification count
  notificationCount: number;

  // Search
  searchResults: SearchResults | null;
  searchLoading: boolean;

  // Actions
  fetchAdminDashboard: () => Promise<void>;
  fetchTrips: (filters?: FetchTripsFilters) => Promise<void>;
  fetchTripById: (tripId: string) => Promise<void>;
  fetchFormOptions: () => Promise<void>;
  createTrip: (data: Record<string, string>) => Promise<void>;
  searchGlobal: (q: string) => Promise<void>;
  fetchNotificationCount: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Dashboard
  dashboardStats: null,
  revenueTrend: null,
  activeTrips: null,
  isLoading: false,
  error: null,

  // Trips
  trips: [],
  tripsLoading: false,
  tripsError: null,

  // Trip detail
  currentTrip: null,
  tripLoading: false,
  tripError: null,

  // Form options
  busOptions: [],
  driverOptions: [],
  formOptionsLoading: false,

  // Notifications
  notificationCount: 0,

  // Search
  searchResults: null,
  searchLoading: false,

  // ── fetchAdminDashboard ────────────────────────────────────────────────────
  fetchAdminDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const [statsRes, trendRes, tripsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/revenue-trend'),
        api.get('/admin/active-trips'),
      ]);
      set({
        dashboardStats: statsRes.data.data,
        revenueTrend: trendRes.data.data,
        activeTrips: tripsRes.data.data,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to load dashboard data',
        isLoading: false,
      });
    }
  },

  // ── fetchTrips ────────────────────────────────────────────────────────────
  fetchTrips: async (filters) => {
    set({ tripsLoading: true, tripsError: null });
    try {
      const query = new URLSearchParams();
      if (filters?.status) query.append('status', filters.status);
      if (filters?.date) query.append('date', filters.date);
      if (filters?.searchTerm) query.append('searchTerm', filters.searchTerm);

      const res = await api.get(`/admin/trips?${query.toString()}`);
      set({ trips: res.data.data, tripsLoading: false });
    } catch (err: any) {
      set({
        tripsError: err.response?.data?.message || 'Failed to load trips',
        tripsLoading: false,
      });
    }
  },

  // ── fetchTripById ─────────────────────────────────────────────────────────
  fetchTripById: async (tripId: string) => {
    set({ tripLoading: true, tripError: null, currentTrip: null });
    try {
      const res = await api.get(`/admin/trips/${tripId}`);
      set({ currentTrip: res.data.data, tripLoading: false });
    } catch (err: any) {
      set({
        tripError: err.response?.data?.message || 'Failed to load trip details',
        tripLoading: false,
      });
    }
  },

  // ── fetchFormOptions ──────────────────────────────────────────────────────
  fetchFormOptions: async () => {
    set({ formOptionsLoading: true });
    try {
      const [busRes, driverRes] = await Promise.all([
        api.get('/admin/buses/available'),
        api.get('/admin/drivers/available'),
      ]);
      set({
        busOptions: busRes.data.data,
        driverOptions: driverRes.data.data,
        formOptionsLoading: false,
      });
    } catch {
      set({ formOptionsLoading: false });
    }
  },

  // ── createTrip ────────────────────────────────────────────────────────────
  createTrip: async (data) => {
    await api.post('/admin/trips', data);
  },

  // ── searchGlobal ──────────────────────────────────────────────────────────
  searchGlobal: async (q: string) => {
    if (!q.trim()) { set({ searchResults: null }); return; }
    set({ searchLoading: true });
    try {
      const res = await api.get(`/admin/search?q=${encodeURIComponent(q)}`);
      set({ searchResults: res.data.data, searchLoading: false });
    } catch {
      set({ searchLoading: false });
    }
  },

  // ── fetchNotificationCount ────────────────────────────────────────────────
  fetchNotificationCount: async () => {
    try {
      const res = await api.get('/admin/notifications/count');
      set({ notificationCount: res.data.data.count });
    } catch {
      // silently fail — fallback to 0
    }
  },
}));
