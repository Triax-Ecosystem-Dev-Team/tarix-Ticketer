// Ticketer-specific types

// Trip related types
export interface Trip {
    seatMatrix: any;
    id: string;
    departureDate: Date;
    departureTime: string;
    departureTerminal: string;
    arrivalTerminal: string;
    availableSeats: number;
    price: number;
    bus?: any;
    busModel?: any;
    occupiedSeats?: string[];
}

// Pagination Meta
export interface PaginationMeta {
    totalPages: number;
    currentPage: number;
    totalCount: number;
}

// Search filter types
export interface SearchFilters {
    departureTerminal: string;
    arrivalTerminal: string;
    date: Date | string | null;
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
// Passenger type for manifest
export interface PassengerProfile extends RegisteredPassenger {}
// Registered Passenger type (for recurring users)
export interface RegisteredPassenger {
    id: string;
    loginId: string;
    title: string;
    surname: string;
    firstname: string;
    dateOfBirth: string;
    occupation: string;
    state: string;
    localGovernment: string;
    nationality: string;
    address: string;
    phone: string;
    officePhone: string;
    email: string;
    nextOfKinName: string;
    nextOfKinPhone: string;
    nextOfKinAddress: string;
    nextOfKinRelationship: string;
}
