import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';

// Fallback for legacy trips that pre-date the dynamic seat-matrix architecture.
// Layout: 10 rows, 2+2 seats per row with a centre aisle (null = aisle gap).
const DEFAULT_SEAT_MATRIX: (string | null)[][] = [
  ['1A', '1B', null, '1C', '1D'],
  ['2A', '2B', null, '2C', '2D'],
  ['3A', '3B', null, '3C', '3D'],
  ['4A', '4B', null, '4C', '4D'],
  ['5A', '5B', null, '5C', '5D'],
  ['6A', '6B', null, '6C', '6D'],
  ['7A', '7B', null, '7C', '7D'],
  ['8A', '8B', null, '8C', '8D'],
  ['9A', '9B', null, '9C', '9D'],
  ['10A', '10B', null, '10C', '10D'],
];

const SeatSelection: React.FC = () => {
  const navigate = useNavigate();

  // Local state for 409 conflict toast
  const [conflictError, setConflictError] = useState<string | null>(null);
  
  const { selectedTrip, selectedSeats, toggleSeat } = useBookingStore();

  const handleSeatSelect = (seatId: string) => {
    setConflictError(null); // clear any previous conflict banner on new interaction
    toggleSeat(seatId);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    navigate('/booking/baggage');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-text-gray">No trip selected. Please go back and select a trip.</p>
        <button onClick={handleBack} className="mt-4 px-6 py-2 bg-primary-blue text-white rounded-lg font-bold">Go Back</button>
      </div>
    );
  }

  // Handle nested relations dynamically, with fallback for legacy trips.
  const busModel = selectedTrip.busModel || selectedTrip.bus?.busModel;
  const layoutMatrix: (string | null)[][] =
    busModel?.seatMatrix ||
    selectedTrip.bus?.seatMatrix ||
    DEFAULT_SEAT_MATRIX;
  const basePrice = busModel?.basePrice || selectedTrip.bus?.basePrice || selectedTrip.price;

  const totalSeatsPrice = selectedSeats.length * basePrice;
  const columnsCount = layoutMatrix[0]?.length ?? 0;

  // Extract occupied seats from the backend trip object, default to empty array
  const occupiedSeats: string[] = selectedTrip.occupiedSeats || [];

  const getSeatStatus = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="font-display font-extrabold text-xl tracking-tight">
            TARIX
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-text-dark">Seat Selection</h1>
            <p className="text-sm text-text-gray">
              {selectedTrip.departureTerminal} → {selectedTrip.arrivalTerminal} | {new Date(selectedTrip.departureDate).toLocaleDateString()} | {selectedTrip.departureTime}
            </p>
          </div>
        </div>
      </header>

      {/* 409 Conflict Toast */}
      {conflictError && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce-once max-w-sm text-sm font-semibold">
          <span>⚠️</span>
          <span>{conflictError}</span>
          <button
            onClick={() => setConflictError(null)}
            className="ml-2 text-white/70 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-gray-200 h-2">
            <div className="bg-primary-blue h-2 transition-all duration-500" style={{ width: '25%' }}></div>
          </div>
          <div className="flex justify-end px-6 py-2">
            <p className="text-xs text-text-gray font-medium">Step 1 of 4</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* Left: Dynamic Seat Map */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-text-dark mb-8">Select Your Seat</h2>

            <div className="max-w-md mx-auto">
              <div 
                className="grid gap-4 mx-auto" 
                style={{ 
                  gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`,
                  width: 'fit-content'
                }}
              >
                {layoutMatrix.map((row, rowIndex) => (
                  <React.Fragment key={`row-${rowIndex}`}>
                    {row.map((seatId, colIndex) => {
                      if (!seatId) {
                        // Centre aisle spacer
                        return <div key={`aisle-${rowIndex}-${colIndex}`} className="w-12 h-12 md:w-14 md:h-14" />;
                      }

                      const status = getSeatStatus(seatId);
                      const isSelected = status === 'selected';
                      const isOccupied = status === 'occupied';

                      let bgClass = 'bg-gray-100 text-text-dark hover:bg-gray-200';
                      if (isOccupied) bgClass = 'bg-[#FF5252] text-white cursor-not-allowed opacity-80';
                      if (isSelected) bgClass = 'bg-[#0095FF] text-white shadow-lg scale-105';

                      return (
                        <button
                          key={seatId}
                          onClick={() => !isOccupied && handleSeatSelect(seatId)}
                          disabled={isOccupied}
                          aria-pressed={isSelected}
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 ${bgClass}`}
                        >
                          {seatId}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-6 mt-12">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gray-100 border border-gray-200"></div>
                  <span className="text-sm text-text-gray font-medium">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#0095FF]"></div>
                  <span className="text-sm text-text-gray font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#FF5252]"></div>
                  <span className="text-sm text-text-gray font-medium">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit sticky top-6">
            {selectedSeats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-text-gray text-base font-medium">
                  Please select one or more seats to continue
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-dark">
                  Selected Seats
                </h2>
                
                <div>
                  <p className="text-sm text-text-gray mb-1 font-medium">Seats ({selectedSeats.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="px-3 py-1 bg-blue-50 text-primary-blue font-bold rounded-lg text-lg">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-text-gray mb-1 font-medium">Bus Model</p>
                  <p className="text-base font-bold text-text-dark">{busModel?.name || "Standard"}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-text-gray mb-1 font-medium">Total Price</p>
                    <p className="text-4xl font-black text-primary-blue">₦{totalSeatsPrice.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-text-gray text-right mt-1 font-medium">₦{basePrice.toLocaleString()} per seat</p>
                </div>
              </div>
            )}

            <div className="space-y-3 mt-8">
              <button
                onClick={handleContinue}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-[#00A97C] text-white hover:bg-[#008F68] active:scale-[0.98] shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Baggage
              </button>
              
              <button
                onClick={handleBack}
                className="w-full py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-base hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                Back
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SeatSelection;