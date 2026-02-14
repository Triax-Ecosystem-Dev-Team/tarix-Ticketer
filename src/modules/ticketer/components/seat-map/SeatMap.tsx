import React from 'react';

// Seat types matching the parent component
type SeatStatus = 'available' | 'occupied' | 'selected';

export interface Seat {
  id: string;
  status: SeatStatus;
  amenities?: string[];
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeatId, onSeatSelect }) => {
  const handleSeatClick = (seatId: string, status: SeatStatus) => {
    if (status === 'occupied') return;
    onSeatSelect(seatId);
  };

  const renderSeat = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return <div className="w-14 h-14" />;

    const isSelected = selectedSeatId === seatId;

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
        aria-pressed={isSelected}
        aria-label={`Seat ${seat.id} ${seat.status}`}
        className={`w-14 h-14 rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 justify-self-center ${bgClass}`}
      >
        {seat.id}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-text-dark mb-8">Select Your Seat</h2>

      {/* Bus Layout - CSS Grid */}
      <div className="max-w-md mx-auto">
        <div
          className="grid gap-y-4 gap-x-2"
          style={{
            gridTemplateColumns: '3.5rem 3.5rem 0.15fr 3.5rem 3.5rem',
            justifyItems: 'stretch',
          }}
        >
          {/* Row A: Driver (spans 2 cols on left) + A1, A2 on right */}
          <button
            className="col-span-2 w-full h-14 bg-[#2D3748] text-white rounded-xl flex items-center justify-center text-xs font-bold uppercase tracking-wider cursor-default justify-self-stretch"
            disabled
          >
            Driver
          </button>

          <div /> {/* Aisle gap */}
          {renderSeat('A1')}
          {renderSeat('A2')}

          {/* Row B */}
          {renderSeat('B1')}
          {renderSeat('B2')}
          <div /> {/* Aisle gap */}
          {renderSeat('B3')}
          {renderSeat('B4')}

          {/* Row C */}
          {renderSeat('C1')}
          {renderSeat('C2')}
          <div /> {/* Aisle gap */}
          {renderSeat('C3')}
          {renderSeat('C4')}

          {/* Row D */}
          {renderSeat('D1')}
          {renderSeat('D2')}
          <div /> {/* Aisle gap */}
          {renderSeat('D3')}
          {renderSeat('D4')}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-10">
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
  );
};

export default SeatMap;
