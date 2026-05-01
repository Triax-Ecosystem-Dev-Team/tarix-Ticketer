import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, FileText, Calendar, MapPin, ChevronRight } from 'lucide-react';
import TicketModal, { OfficialBooking } from '../components/TicketModal';
import api from '../../../shared/api';

const FindTicket: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchResults, setSearchResults] = useState<OfficialBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<OfficialBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSearchResults([]);
      setSelectedBooking(null);

      const response = await api.get('/bookings/search', {
        params: { q: query.trim() }
      });
      
      const results: OfficialBooking[] = response.data.data || response.data || [];
      
      if (results.length === 0) {
        setError("No tickets found. Please check the reference or ID and try again.");
      } else if (results.length === 1) {
        // Fast Path: Only one booking found
        setSearchResults(results);
        handleOpenTicket(results[0]);
      } else {
        // Multiple bookings found
        setSearchResults(results);
      }
    } catch (err: any) {
      console.error('Error searching tickets:', err);
      setError("An error occurred while searching for tickets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTicket = (booking: OfficialBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-12 px-4 sm:px-6 pb-20">
      
      {/* Search Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary-blue" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark mb-2">Omni-Search Tickets</h1>
          <p className="text-text-gray text-sm max-w-sm mx-auto">
            Find bookings instantly using a Booking Reference, User ID, or Phone Number.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. TARIX-1234 or USR-9876"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue focus:bg-white transition-all uppercase text-lg font-medium"
              required
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full py-4 bg-primary-blue text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#007ACC] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Disambiguation UI: Results List */}
      {searchResults.length > 1 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-bold text-text-dark mb-4 px-2">
            Found {searchResults.length} Bookings
          </h2>
          <div className="space-y-3">
            {searchResults.map((booking) => (
              <div 
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-primary-blue transition-colors group shadow-sm"
              >
                <div className="space-y-2 flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-blue" />
                      <span className="font-bold text-text-dark text-sm uppercase tracking-wide">
                        {booking.paymentReference || booking.id.slice(0, 8)}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                    <div className="flex items-center gap-1.5 text-text-gray text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {booking.trip ? new Date(booking.trip.departureDate).toLocaleDateString() : 'N/A'} 
                        {' • '}
                        {booking.trip?.departureTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-gray text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        {booking.trip?.departureTerminal} → {booking.trip?.arrivalTerminal}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenTicket(booking)}
                  className="w-full sm:w-auto mt-2 sm:mt-0 py-2.5 px-5 bg-blue-50 text-primary-blue rounded-xl font-bold text-sm hover:bg-[#0095FF] hover:text-white transition-all flex items-center justify-center gap-1 group-hover:shadow-md"
                >
                  View Ticket
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        officialBooking={selectedBooking}
      />
    </div>
  );
};

export default FindTicket;
