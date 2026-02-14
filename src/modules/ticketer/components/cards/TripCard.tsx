import React from 'react';
import { Users, Clock, Calendar, MapPin } from 'lucide-react';
import { Trip } from '../../types';
import { useDateFormat } from '../../../../shared/utils/useDateFormat';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onSelect }) => {
  const { formatDate } = useDateFormat();

  return (
    <div className="bg-white rounded-xl border border-border-gray shadow-sm hover:shadow-md hover:border-primary-blue hover:border-2 hover:scale-[1.01] transition-all duration-300">
      {/* Mobile Layout (default) */}
      <div className="block sm:hidden">
        {/* Header with Date and Time */}
        <div className="flex justify-between items-start p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-text-gray">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {formatDate(trip.departureDate, 'EEE, do MMM yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-dark mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-bold">{trip.departureTime}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-blue-dark">
              ₦{trip.price.toLocaleString('en-NG')}
            </p>
            <p className="text-xs text-text-gray">per person</p>
          </div>
        </div>

        {/* Route Information */}
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            {/* Origin */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#00C853]" />
                <div className="w-0.5 h-12 bg-gradient-to-b from-[#00C853] to-[#FF5252] opacity-30" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-gray">From</p>
                <p className="text-base font-semibold text-text-dark">
                  {trip.departureTerminal}
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#FF5252]" />
              <div className="flex-1">
                <p className="text-sm text-text-gray">To</p>
                <p className="text-base font-semibold text-text-dark">
                  {trip.arrivalTerminal}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-primary-blue" />
              <span className="text-sm font-medium text-text-dark">
                {trip.availableSeats} seats left
              </span>
            </div>
            <button
              onClick={() => onSelect(trip)}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-blue-dark to-brand-blue-light text-white text-sm font-semibold rounded-lg hover:shadow-lg active:scale-[0.98] transition-all"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      {/* Tablet Layout (sm to lg) */}
      <div className="hidden sm:block lg:hidden p-5">
        <div className="space-y-4">
          {/* Top Row: Date, Time, and Price */}
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              <div>
                <p className="text-sm font-medium text-text-dark">
                  {formatDate(trip.departureDate, 'EEE, do MMM yyyy')}
                </p>
                <p className="text-xs text-text-gray mt-0.5">Departure Date</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">
                  {trip.departureTime}
                </p>
                <p className="text-xs text-text-gray mt-0.5">Departure Time</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brand-blue-dark">
                ₦{trip.price.toLocaleString('en-NG')}
              </p>
              <p className="text-xs text-text-gray">per person</p>
            </div>
          </div>

          {/* Middle: Route */}
          <div className="flex gap-6 py-4 border-y border-gray-100">
            <div className="flex items-center gap-4 flex-1">
              <MapPin className="w-5 h-5 text-[#00C853]" />
              <div>
                <p className="text-xs text-text-gray">From</p>
                <p className="text-base font-semibold text-text-dark">
                  {trip.departureTerminal}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-1">
              <MapPin className="w-5 h-5 text-[#FF5252]" />
              <div>
                <p className="text-xs text-text-gray">To</p>
                <p className="text-base font-semibold text-text-dark">
                  {trip.arrivalTerminal}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: Seats and Select Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-primary-blue" />
              <span className="text-sm font-semibold text-text-dark">
                {trip.availableSeats} seats
              </span>
              <span className="text-xs text-text-gray">available</span>
            </div>
            <button
              onClick={() => onSelect(trip)}
              className="px-8 py-2.5 bg-gradient-to-r from-brand-blue-dark to-brand-blue-light text-white text-sm font-bold rounded-xl hover:shadow-lg active:scale-[0.98] transition-all"
            >
              Select Trip
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:block p-8">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-12 items-center">
          {/* Col 1: Date & Time */}
          <div className="flex flex-col gap-6 min-w-[140px]">
            <div>
              <p className="text-lg font-bold text-text-dark">
                {formatDate(trip.departureDate, 'EEE, do MMM yyyy')}
              </p>
              <p className="text-xs text-text-gray mt-1">Departure Date</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-dark">
                {trip.departureTime}
              </p>
              <p className="text-xs text-text-gray mt-1">Departure Time</p>
            </div>
          </div>

          {/* Col 2: Route */}
          <div className="flex flex-col gap-4 relative">
            {/* Connecting Line */}
            <div className="absolute left-[5px] top-[10px] bottom-[25px] w-0.5 border-l-2 border-dashed border-gray-300" />
            
            {/* Origin */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-3 h-3 rounded-full bg-[#00C853] mt-1.5" />
              <div>
                <p className="text-base font-bold text-text-dark">
                  {trip.departureTerminal}
                </p>
                <p className="text-xs text-text-gray mt-0.5">
                  Departure Terminal
                </p>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-3 h-3 rounded-full bg-[#FF5252] mt-1.5" />
              <div>
                <p className="text-base font-bold text-text-dark">
                  {trip.arrivalTerminal}
                </p>
                <p className="text-xs text-text-gray mt-0.5">
                  Arrival Terminal
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Seats */}
          <div className="flex flex-col items-center min-w-[100px]">
            <div className="flex items-center gap-2 text-primary-blue mb-1">
              <Users className="w-5 h-5" />
              <span className="text-lg font-bold text-text-dark">
                {trip.availableSeats} seats
              </span>
            </div>
            <span className="text-xs text-text-gray">available</span>
          </div>

          {/* Col 4: Price & Action */}
          <div className="flex flex-col items-end gap-4 min-w-[160px]">
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-blue-dark">
                ₦{trip.price.toLocaleString('en-NG')}
              </p>
              <p className="text-xs text-text-gray mt-1">per person</p>
            </div>

            <button
              onClick={() => onSelect(trip)}
              className="w-full px-8 py-3 bg-gradient-to-r from-[#0062E6] to-[#0095FF] text-white text-sm font-bold rounded-xl hover:shadow-lg active:scale-[0.98] transition-all"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;