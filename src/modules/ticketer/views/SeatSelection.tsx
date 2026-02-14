import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatMap, { Seat } from '../components/seat-map/SeatMap';

const SeatSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Seat layout with amenities
  const [seats] = useState<Seat[]>([
    // Row A (right side only — driver occupies left)
    { id: 'A1', status: 'available', amenities: ['Aisle access'] },
    { id: 'A2', status: 'available', amenities: ['Window seat'] },
    // Row B
    { id: 'B1', status: 'occupied', amenities: ['Window seat'] },
    { id: 'B2', status: 'available', amenities: ['Aisle access'] },
    { id: 'B3', status: 'available', amenities: ['Aisle access'] },
    { id: 'B4', status: 'available', amenities: ['Window seat'] },
    // Row C
    { id: 'C1', status: 'available', amenities: ['Window seat'] },
    { id: 'C2', status: 'available', amenities: ['Aisle access'] },
    { id: 'C3', status: 'available', amenities: ['Aisle access'] },
    { id: 'C4', status: 'occupied', amenities: ['Window seat'] },
    // Row D
    { id: 'D1', status: 'available', amenities: ['Window seat'] },
    { id: 'D2', status: 'available', amenities: ['Aisle access'] },
    { id: 'D3', status: 'available', amenities: ['Aisle access'] },
    { id: 'D4', status: 'available', amenities: ['Window seat'] },
  ]);

  const handleSeatSelect = (seatId: string) => {
    if (selectedSeat === seatId) {
      setSelectedSeat(null); // Deselect
    } else {
      setSelectedSeat(seatId); // Select
    }
  };

  const handleContinue = () => {
    if (!selectedSeat) return;
    console.log('Selected Seat:', selectedSeat);
    navigate('/booking/baggage');
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
          <SeatMap 
            seats={seats}
            selectedSeatId={selectedSeat}
            onSeatSelect={handleSeatSelect}
          />

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
                    ? 'bg-[#00A97C] text-white hover:bg-[#008F68] active:scale-[0.98] shadow-md'
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