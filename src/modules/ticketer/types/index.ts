// Ticketer-specific types

// Trip related types
export interface Trip {
    id: string;
    departureDate: Date;
    departureTime: string;
    departureTerminal: string;
    arrivalTerminal: string;
    availableSeats: number;
    price: number;
}

// Search filter types
export interface SearchFilters {
    from: string;
    to: string;
    departureDate: Date | null;
    passengers: number;
    busType?: string;
}

// Booking types
export interface Booking {
    id: string;
    tripId: string;
    userId: string;
    seats: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
}
// Passenger type for manifest
export interface Passenger {
    id: string;
    fullName: string;
    seatNumber: string;
    phone: string;
    userId: string;
}
