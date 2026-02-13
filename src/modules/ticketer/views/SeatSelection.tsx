import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo.webp';
import LoadingScreen from '../../../shared/components/LoadingScreen';

// Seat types
type SeatStatus = 'available' | 'occupied' | 'selected';

interface Seat {
  id: string;
  status: SeatStatus;
  amenities?: string[];
}

const SeatSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Seat layout with amenities
  const [seats] = useState<Seat[]>([
    { id: 'A1', status: 'available', amenities: ['Aisle access'] },
    { id: 'A2', status: 'available', amenities: ['Window seat'] },
    { id: 'B1', status: 'occupied', amenities: ['Aisle access'] },
    { id: 'B2', status: 'available', amenities: [] },
    { id: 'B3', status: 'available', amenities: [] },
    { id: 'B4', status: 'available', amenities: ['Window seat'] },
    { id: 'C1', status: 'available', amenities: ['Aisle access'] },
    { id: 'C2', status: 'available', amenities: [] },
    { id: 'C3', status: 'available', amenities: [] },
    { id: 'C4', status: 'occupied', amenities: ['Window seat'] },
    { id: 'D1', status: 'available', amenities: ['Aisle access'] },
    { id: 'D2', status: 'available', amenities: [] },
    { id: 'D3', status: 'available', amenities: [] },
    { id: 'D4', status: 'available', amenities: ['Window seat'] },
  ]);

  const handleSeatClick = (seatId: string, status: SeatStatus) => {
    if (status === 'occupied') return;
    
    if (selectedSeat === seatId) {
      setSelectedSeat(null); // Deselect
    } else {
      setSelectedSeat(seatId); // Select
    }
  };

  const handleContinue = () => {
    if (!selectedSeat) return;
    console.log('Selected Seat:', selectedSeat);
    // navigate('/booking/payment');
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get selected seat details
  const getSelectedSeatDetails = () => {
    const seat = seats.find(s => s.id === selectedSeat);
    return seat;
  };

  const selectedSeatDetails = getSelectedSeatDetails();

  // Helper to render a seat button
  const renderSeat = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return <div className="w-14 h-14"></div>;

    const isSelected = selectedSeat === seatId;
    
    let bgClass = 'bg-gray-100 text-text-dark hover:bg-gray-200';
    if (seat.status === 'occupied') {
      bgClass = 'bg-[#FF5252] text-white cursor-not-allowed';
    }
    if (isSelected) {
      bgClass = 'bg-[#0095FF] text-white shadow-lg scale-105';
    }

    return (
      <button
        onClick={() => handleSeatClick(seat.id, seat.status)}
        disabled={seat.status === 'occupied'}
        className={`w-14 h-14 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 ${bgClass}`}
      >
        {seat.id}
      </button>
    );
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
              Lagos → Ibadan | Nov 15, 2025 | 2:00 PM
            </p>
          </div>
        </div>
      </header>

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
          
          {/* Left: Seat Map */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-text-dark mb-12">
              Select Your Seat
            </h2>

            {/* Bus Layout */}
            <div className="flex flex-col items-center max-w-lg mx-auto">
              <div className="space-y-5 w-full">
                
                {/* Driver Row */}
                <div className="flex justify-center gap-16 mb-8">
                  <div className="w-14 h-14"></div>
                  <div className="w-32 h-14 bg-[#2D3748] text-white rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wider">
                    Driver
                  </div>
                  <div className="flex gap-5">
                    {renderSeat('A1')}
                    {renderSeat('A2')}
                  </div>
                </div>

                {/* Row B */}
                <div className="flex justify-between gap-16">
                  <div className="flex gap-5">
                    {renderSeat('B1')}
                    {renderSeat('B2')}
                  </div>
                  <div className="flex gap-5">
                    {renderSeat('B3')}
                    {renderSeat('B4')}
                  </div>
                </div>

                {/* Row C */}
                <div className="flex justify-between gap-16">
                  <div className="flex gap-5">
                    {renderSeat('C1')}
                    {renderSeat('C2')}
                  </div>
                  <div className="flex gap-5">
                    {renderSeat('C3')}
                    {renderSeat('C4')}
                  </div>
                </div>

                {/* Row D */}
                <div className="flex justify-between gap-16">
                  <div className="flex gap-5">
                    {renderSeat('D1')}
                    {renderSeat('D2')}
                  </div>
                  <div className="flex gap-5">
                    {renderSeat('D3')}
                    {renderSeat('D4')}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-8 mt-16">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-gray-100 border border-gray-200"></div>
                  <span className="text-sm text-text-gray">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#0095FF]"></div>
                  <span className="text-sm text-text-gray">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#FF5252]"></div>
                  <span className="text-sm text-text-gray">Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection Panel */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit">
            {!selectedSeat ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-text-gray text-base">
                  Please select a seat to continue
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-dark">
                  Selected Seat
                </h2>
                
                <div>
                  <p className="text-sm text-text-gray mb-1">Seat Number</p>
                  <p className="text-4xl font-bold text-text-dark">
                    {selectedSeat}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-text-gray mb-1">Seat Type</p>
                  <p className="text-base font-bold text-text-dark">Standard</p>
                </div>

                <div>
                  <p className="text-sm text-text-gray mb-1">Price</p>
                  <p className="text-4xl font-bold text-text-dark">₦19,000</p>
                </div>

                {selectedSeatDetails?.amenities && selectedSeatDetails.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-text-gray mb-2">Amenities</p>
                    <ul className="space-y-1">
                      {selectedSeatDetails.amenities.map((amenity, idx) => (
                        <li key={idx} className="text-sm text-primary-blue">
                          • {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 mt-8">
              <button
                onClick={handleContinue}
                disabled={!selectedSeat}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  selectedSeat
                    ? 'bg-[#00C853] text-white hover:bg-[#00B347] active:scale-[0.98] shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
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