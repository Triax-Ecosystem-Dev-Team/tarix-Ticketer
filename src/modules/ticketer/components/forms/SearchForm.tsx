import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';
import { SearchFilters } from '../../types';

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { searchFilters, setSearchFilters } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFilters>({
    defaultValues: searchFilters,
  });

  const onSubmit = (data: SearchFilters) => {
    setSearchFilters(data);
    onSearch?.(data);
    console.log('Search filters:', data);
  };

  return (
    <div className="w-full h-full bg-white rounded-none md:rounded-xl border-r border-border-gray md:shadow-sm p-5">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-dark">Search Filters</h2>
        <p className="text-xs text-text-gray mt-1">Customize your search</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* From Field */}
        <div>
          <label className="block text-xs font-medium text-text-gray mb-2">
            From
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue" />
            <input
              type="text"
              {...register('from', { required: 'Origin is required' })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border-gray rounded-lg text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
              placeholder="Edo, Benin (HQ)"
            />
          </div>
          {errors.from && (
            <p className="text-xs text-red-500 mt-1">{errors.from.message}</p>
          )}
        </div>

        {/* To Field */}
        <div>
          <label className="block text-xs font-medium text-text-gray mb-2">
            To
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF5252]" />
            <input
              type="text"
              {...register('to', { required: 'Destination is required' })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border-gray rounded-lg text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
              placeholder="Lagos, Iyana-Ipaja"
            />
          </div>
          {errors.to && (
            <p className="text-xs text-red-500 mt-1">{errors.to.message}</p>
          )}
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-xs font-medium text-text-gray mb-2">
            Departure Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue pointer-events-none" />
            <input
              type="date"
              {...register('departureDate')}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border-gray rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
            />
          </div>
          {errors.departureDate && (
            <p className="text-xs text-red-500 mt-1">
              {errors.departureDate.message}
            </p>
          )}
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-xs font-medium text-text-gray mb-2">
            Passengers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue pointer-events-none" />
            <input
              type="number"
              min="1"
              max="10"
              {...register('passengers', {
                required: 'Number of passengers is required',
                min: { value: 1, message: 'At least 1 passenger required' },
                max: { value: 10, message: 'Maximum 10 passengers' },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border-gray rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          {errors.passengers && (
            <p className="text-xs text-red-500 mt-1">
              {errors.passengers.message}
            </p>
          )}
        </div>

        {/* Bus Type */}
        <div>
          <label className="block text-xs font-medium text-text-gray mb-2">
            Bus Type
          </label>
          <select
            {...register('busType')}
            className="w-full px-4 py-2.5 bg-gray-50 border border-border-gray rounded-lg text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors appearance-none cursor-pointer"
          >
            <option value="">Select bus type</option>
            <option value="standard">Standard</option>
            <option value="luxury">Luxury</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue-dark to-brand-blue-light text-white py-3 rounded-lg font-semibold text-sm hover:shadow-lg active:scale-[0.98] transition-all shadow-md"
        >
          <Search className="w-4 h-4" />
          Search Trips
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
