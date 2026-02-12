import React, { useState } from 'react';
import SearchForm from '../components/forms/SearchForm';
import TripCard from '../components/cards/TripCard';
import Pagination from '@/shared/components/Pagination';
import MobileSearchButton from '../components/forms/MobileSearchButton';
import { Trip } from '../types';

// Mock data for available trips
const mockTrips: Trip[] = [
  {
    id: '1',
    departureDate: new Date('2025-11-11'),
    departureTime: '7:30 AM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 13,
    price: 19000,
  },
  {
    id: '2',
    departureDate: new Date('2025-11-11'),
    departureTime: '9:00 AM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 8,
    price: 25000,
  },
  {
    id: '3',
    departureDate: new Date('2025-11-11'),
    departureTime: '11:30 AM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 15,
    price: 17500,
  },
  {
    id: '4',
    departureDate: new Date('2025-11-11'),
    departureTime: '2:00 PM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 10,
    price: 21000,
  },
  {
    id: '5',
    departureDate: new Date('2025-11-11'),
    departureTime: '4:30 PM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 12,
    price: 18500,
  },
  {
    id: '6',
    departureDate: new Date('2025-11-11'),
    departureTime: '6:00 PM',
    departureTerminal: 'Edo, Benin (HQ)',
    arrivalTerminal: 'Lagos, Iyana-Ipaja',
    availableSeats: 6,
    price: 27000,
  },
];

const TicketerDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // As shown in the image

  const handleTripSelect = (trip: Trip) => {
    console.log('Selected trip:', trip);
    // Handle trip selection - navigate to booking page, etc.
  };

  const handleSearch = () => {
    console.log('Search triggered');
    // Handle search - fetch new trips based on filters
  };

  return (
    <div className="flex min-h-[calc(100vh-170px)]">
      {/* Left Sidebar - Search Filters (Desktop) */}
      <aside className="hidden lg:block w-[230px] flex-shrink-0">
        <div className="sticky top-[50px]">
          <SearchForm onSearch={handleSearch} />
        </div>
      </aside>

      {/* Main Content - Available Trips */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:pl-6 lg:pr-8">
          {/* Section Header */}
          <h1 className="text-xl font-bold text-text-dark mb-6">
            Available Trips
          </h1>

          {/* Trip Cards */}
          <div className="space-y-4">
            {mockTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onSelect={handleTripSelect} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      {/* Mobile Search Button */}
      <MobileSearchButton />
    </div>
  );
};

export default TicketerDashboard;
