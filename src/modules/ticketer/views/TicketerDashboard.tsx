import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/forms/SearchForm';
import TripCard from '../components/cards/TripCard';
import Pagination from '../../../shared/components/Pagination';
import MobileSearchButton from '../components/forms/MobileSearchButton';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import { Trip } from '../types';
import Header from '../../../shared/components/Header';
import { useBookingStore } from '../store/useBookingStore';



const TicketerDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // As shown in the image
  const navigate = useNavigate();

  const { fetchTrips, availableTrips, isLoadingTrips, searchFilters } = useBookingStore();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleSearch = () => {
    console.log('Search triggered');
    fetchTrips(searchFilters);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-170px)]">
      <Header />
      <div className="flex flex-1">
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
            {isLoadingTrips ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : availableTrips.length > 0 ? (
              availableTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No trips found.
              </div>
            )}
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
    </div>
  );
};

export default TicketerDashboard;
