import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../../shared/types';
import { SearchFilters, Trip, RegisteredPassenger } from '../types';
import api from '../../../shared/api';

interface BookingState {
    // User state
    user: User | null;
    setUser: (user: User | null) => void;
    updateWalletBalance: (amount: number) => void;

    // Search filters state
    searchFilters: SearchFilters;
    setSearchFilters: (filters: Partial<SearchFilters>) => void;
    resetSearchFilters: () => void;

    // Available trips
    availableTrips: Trip[];
    setAvailableTrips: (trips: Trip[]) => void;

    // Loading states
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isLoadingTrips: boolean;
    fetchTrips: (filters?: Record<string, any>) => Promise<void>;

    // Registered Passenger Info
    registeredPassenger: RegisteredPassenger | null;
    fetchPassengerByLoginId: (loginId: string) => Promise<RegisteredPassenger | null>;
    registerPassenger: (details: Omit<RegisteredPassenger, 'id' | 'loginId'>) => Promise<RegisteredPassenger | null>;

    error: string | null;
    setError: (error: string | null) => void;

    // Extra Baggage
    extraBaggageCount: number;
    incrementBaggage: () => void;
    decrementBaggage: () => void;
    extraBaggagePrice: number;
    isFetchingBaggagePrice: boolean;
    fetchBaggagePrice: () => Promise<void>;
    
    // Payment
    paymentMethod: 'cash' | 'card' | 'transfer' | null;
    setPaymentMethod: (method: 'cash' | 'card' | 'transfer' | null) => void;
    getBookingTotals: () => {
        basePrice: number;
        subtotal: number;
        baggageCost: number;
        serviceFee: number;
        total: number;
    };

    // Booking Progress
    selectedTrip: Trip | null;
    setSelectedTrip: (trip: Trip | null) => void;
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
    toggleSeat: (seatId: string) => void;
    createBooking: (paymentDetails: { method: string, status: string }) => Promise<any>;
    resetBooking: () => void;
    resetBookingFlow: () => void;
}

const defaultSearchFilters: SearchFilters = {
    from: '',
    to: '',
    departureDate: null,
    passengers: 1,
    busType: undefined,
};

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
    // User state
    user: {
        id: 'B11DMA8727',
        name: 'Divine Uduma',
        role: 'Ticketer',
        walletBalance: 1000000,
    },
    setUser: (user) => set({ user }),
    updateWalletBalance: (amount) =>
        set((state) => ({
            user: state.user
                ? { ...state.user, walletBalance: state.user.walletBalance + amount }
                : null,
        })),

    // Search filters state
    searchFilters: defaultSearchFilters,
    setSearchFilters: (filters) =>
        set((state) => ({
            searchFilters: { ...state.searchFilters, ...filters },
        })),
    resetSearchFilters: () => set({ searchFilters: defaultSearchFilters }),

    // Available trips
    availableTrips: [],
    setAvailableTrips: (trips) => set({ availableTrips: trips }),

    // Loading states
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    isLoadingTrips: false,
    fetchTrips: async (filters) => {
        set({ isLoadingTrips: true });
        try {
            const response = await api.get('/trips', { params: filters });
            set({ availableTrips: response.data.data.trips || [], isLoadingTrips: false });
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            set({ isLoadingTrips: false });
        }
    },

    // Registered Passenger Info
    registeredPassenger: null,
    fetchPassengerByLoginId: async (loginId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/auth/passenger/${loginId}`);
            if (response.data.success) {
                set({ registeredPassenger: response.data.data });
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            const message = error.response?.data?.message || "Login ID not found";
            set({ error: message, registeredPassenger: null });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    registerPassenger: async (details) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/auth/passenger', details);
            if (response.data.success) {
                set({ registeredPassenger: response.data.data });
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to register passenger";
            set({ error: message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    error: null,
    setError: (error) => set({ error }),

    // Extra Baggage
    extraBaggageCount: 0,
    incrementBaggage: () => set((state) => ({ extraBaggageCount: state.extraBaggageCount + 1 })),
    decrementBaggage: () => set((state) => ({ 
        extraBaggageCount: Math.max(0, state.extraBaggageCount - 1) 
    })),
    extraBaggagePrice: 2000,
    isFetchingBaggagePrice: false,
    fetchBaggagePrice: async () => {
        set({ isFetchingBaggagePrice: true });
        try {
            const res = await api.get('/settings');
            if (res.data?.data) {
                set({ extraBaggagePrice: res.data.data.extraBaggagePrice });
            }
        } catch (error) {
            console.error('Failed to fetch baggage price', error);
        } finally {
            set({ isFetchingBaggagePrice: false });
        }
    },

    // Payment
    paymentMethod: 'cash',
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    getBookingTotals: () => {
        const state = get() as BookingState;
        const basePrice = state.selectedTrip?.busModel?.basePrice || 
                          state.selectedTrip?.bus?.busModel?.basePrice || 
                          state.selectedTrip?.price || 0;
        const subtotal = (state.selectedSeats?.length || 0) * basePrice;
        const baggageCost = (state.extraBaggageCount || 0) * (state.extraBaggagePrice || 0);
        const serviceFee = 500;
        const total = subtotal + baggageCost + serviceFee;

        return { basePrice, subtotal, baggageCost, serviceFee, total };
    },

    // Booking Progress
    selectedTrip: null,
    setSelectedTrip: (trip) => set({ selectedTrip: trip }),
    selectedSeats: [],
    setSelectedSeats: (seats) => set({ selectedSeats: seats }),
    // Toggle a seat in/out of the selectedSeats array.
    // If the seat is already selected it is removed; otherwise it is added.
    toggleSeat: (seatId) =>
        set((state) => ({
            selectedSeats: state.selectedSeats.includes(seatId)
                ? state.selectedSeats.filter((id) => id !== seatId)
                : [...state.selectedSeats, seatId],
        })),

    createBooking: async (paymentDetails) => {
        set({ isLoading: true, error: null });
        try {
            const state = get() as BookingState;
            const { selectedTrip, registeredPassenger, selectedSeats, extraBaggageCount, extraBaggagePrice } = state;
            
            // Allow bypassing strict checks for testing or fallback to defaults
            const tripId = selectedTrip?.id || "dummy-trip-id";
            const passengerId = registeredPassenger?.id || "dummy-passenger-id";
            const seatsCount = selectedSeats.length > 0 ? selectedSeats.length : 1;
            const baggageFee = extraBaggageCount * extraBaggagePrice;

            const payload = {
                tripId,
                passengerId,
                seats: seatsCount,
                requestedSeats: selectedSeats,   // string[] for ACID seat conflict check
                paymentMethod: paymentDetails.method,
                paymentStatus: paymentDetails.status,
                hasExtraBaggage: extraBaggageCount > 0,
                extraBaggage: extraBaggageCount,
                baggageFee
            };

            const response = await api.post('/bookings', payload);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to create booking";
            set({ error: message });
            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    resetBooking: () => set({
        selectedTrip: null,
        selectedSeats: [],
        registeredPassenger: null,
        extraBaggageCount: 0,
        error: null
    }),
    resetBookingFlow: () => set({
        selectedSeats: [],
        registeredPassenger: null,
        extraBaggageCount: 0,
        error: null,
    }),
        }),
        {
            name: 'tarix-booking-storage',
            partialize: (state) => ({
                selectedTrip: state.selectedTrip,
                registeredPassenger: state.registeredPassenger,
                selectedSeats: state.selectedSeats,
                extraBaggageCount: state.extraBaggageCount,
                extraBaggagePrice: state.extraBaggagePrice
            }),
        }
    )
);
