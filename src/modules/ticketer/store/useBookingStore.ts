import { create } from 'zustand';
import { User } from '../../../shared/types';
import { SearchFilters, Trip } from '../types';

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
}

const defaultSearchFilters: SearchFilters = {
    from: 'Edo, Benin (HQ)',
    to: 'Lagos, Iyana-Ipaja',
    departureDate: null,
    passengers: 1,
    busType: undefined,
};

export const useBookingStore = create<BookingState>((set) => ({
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
}));
