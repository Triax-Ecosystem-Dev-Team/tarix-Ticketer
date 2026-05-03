import { create } from 'zustand';
import api from '../../../shared/api';
import toast from 'react-hot-toast';

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

// ── Search Interfaces ──────────────────────────────────────────────────────────

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
  error: { error: string; message: string } | null;

  // Notification count
  notificationCount: number;

  // Search
  searchResults: SearchResults | null;
  searchLoading: boolean;

  // Actions
  fetchAdminDashboard: () => Promise<void>;
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
      toast.success('Dashboard synchronized');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to load dashboard data';
      set({
        error: {
          error: err.response?.data?.error || 'Fetch Error',
          message,
        },
        isLoading: false,
      });
      toast.error(message);
    }
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
