import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info, Bus, MapPin, Calendar, Clock, User, DollarSign, Users, Loader2, CheckCircle
} from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import clsx from 'clsx';
import { Wifi, Wind, Zap, Tv, ShieldCheck, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { 
    availableBuses, 
    availableDrivers, 
    isLoading, 
    isSubmitting,
    error,
    fetchAvailableAssets,
    createTrip 
  } = useTripStore();

  const [formData, setFormData] = useState({
    busId: '',
    departureTerminal: '',
    arrivalTerminal: '',
    departureDate: '',
    departureTime: '',
    driverId: '',
    price: '',
    availableSeats: '',
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAvailableAssets();
  }, [fetchAvailableAssets]);

  const selectedBus = availableBuses.find((b) => b.id === formData.busId);

  // Auto-sync capacity and availableSeats
  useEffect(() => {
    if (selectedBus) {
      setFormData(prev => ({ 
        ...prev, 
        availableSeats: selectedBus.totalCapacity.toString() 
      }));
    }
  }, [selectedBus]);

  const handlePriceClick = (price: string) => {
    setFormData((prev) => ({ ...prev, price }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Standardize payload to match backend expectations
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats),
        // Map frontend fields to backend if different
        date: formData.departureDate,
        time: formData.departureTime
      };

      await createTrip(payload);
      setSuccess(true);
      toast.success('Trip created successfully!');
      setTimeout(() => navigate('/admin/trips'), 1800);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#1E293B]">Trip Created!</h2>
        <p className="text-slate-500">Redirecting to Trip Overview…</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in duration-300">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#2c3e50] tracking-tight mb-1">
          Create New Trip
        </h1>
        <p className="text-[15px] sm:text-[16px] text-slate-500">
          Fill in the details below to create a new trip for your fleet
        </p>
      </div>

      {/* ── Info Banner ── */}
      <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-xl px-4 py-3.5 flex items-start sm:items-center gap-3 mb-10 shadow-sm">
        <Info className="w-5 h-5 text-[#0ea5e9] flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-[#0284c7] text-[13.5px] font-medium leading-snug">
          All fields are required. The trip will be available for booking once created.
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium mb-6">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Form Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Select Bus */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Select Bus <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {isLoading ? <Loader2 className="w-4 h-4 text-[#3bb6e0] animate-spin" /> : <Bus className="w-4 h-4 text-[#3bb6e0]" />}
                </div>
                <select
                  required
                  className={clsx(
                    "w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-[14px] text-slate-700 focus:outline-none focus:ring-1 appearance-none cursor-pointer hover:border-slate-300 transition-colors disabled:opacity-60",
                    error?.includes("Conflict") && error.includes(selectedBus?.registrationNumber || '') 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-slate-200 focus:border-[#3bb6e0] focus:ring-[#3bb6e0]"
                  )}
                  value={formData.busId}
                  onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="" disabled>{isLoading ? 'Loading buses…' : 'Select a bus'}</option>
                  {availableBuses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.registrationNumber} — {b.nickname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Features Preview */}
              {selectedBus && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  {selectedBus.status === 'On Trip' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2.5 mb-4">
                      <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                      <p className="text-amber-700 text-[12px] font-medium leading-relaxed">
                        <span className="font-bold">Warning:</span> This vehicle is currently <span className="font-bold">In Transit</span> and may not return in time for this departure.
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Features</span>
                    {selectedBus.maintenanceStatus === 'Excellent' ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase">Excellent Condition</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full uppercase">Maintenance Due Soon</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['Air Conditioning', 'WiFi', 'Charging Ports', 'Entertainment System', 'Fire Extinguisher', 'Luggage Compartment'].map((amenity) => {
                      const hasAmenity = (selectedBus.amenities || []).includes(amenity);
                      const getIcon = () => {
                        switch (amenity) {
                          case 'Air Conditioning': return Wind;
                          case 'WiFi': return Wifi;
                          case 'Charging Ports': return Zap;
                          case 'Entertainment System': return Tv;
                          case 'Fire Extinguisher': return ShieldCheck;
                          case 'Luggage Compartment': return Briefcase;
                          default: return Info;
                        }
                      };
                      const Icon = getIcon();
                      return (
                        <div key={amenity} className={clsx(
                          "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium",
                          hasAmenity ? "bg-white text-[#0ea5e9] border border-[#bae6fd] shadow-sm" : "text-slate-400 grayscale opacity-40"
                        )}>
                          <Icon className="w-3.5 h-3.5" />
                          {amenity}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Departure Terminal */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Departure Terminal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-[#3bb6e0]" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                  value={formData.departureTerminal}
                  onChange={(e) => setFormData({ ...formData, departureTerminal: e.target.value })}
                />
              </div>
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Select Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-[#3bb6e0]" />
                </div>
                <input
                  type="date"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                />
              </div>
            </div>

            {/* Assign Driver */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Assign Driver <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {isLoading ? <Loader2 className="w-4 h-4 text-[#3bb6e0] animate-spin" /> : <User className="w-4 h-4 text-[#3bb6e0]" />}
                </div>
                <select
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] appearance-none cursor-pointer hover:border-slate-300 transition-colors disabled:opacity-60"
                  value={formData.driverId}
                  onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="" disabled>{isLoading ? 'Loading drivers…' : 'Choose a driver'}</option>
                  {availableDrivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Capacity (from selected bus) */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-[13px] font-medium text-slate-700">Set Capacity</label>
                <span className="text-[11px] text-slate-400">Auto-filled from bus</span>
              </div>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="w-4 h-4 text-[#3bb6e0]" />
                </div>
                <input
                  type="text"
                  value={selectedBus ? `${selectedBus.totalCapacity} seats` : '—'}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Total Seats</span>
                  <span className="text-[13px] font-semibold text-slate-700">{selectedBus?.totalCapacity ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Reserved</span>
                  <span className="text-[13px] font-semibold text-slate-700">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Available</span>
                  <span className={clsx("text-[13px] font-bold", selectedBus ? 'text-[#10b981]' : 'text-slate-400')}>{selectedBus?.totalCapacity ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500">Occupancy</span>
                  <span className="text-[13px] font-semibold text-slate-700">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Arrival Terminal */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Arrival Terminal <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-[#3bb6e0]" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ibadan"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                  value={formData.arrivalTerminal}
                  onChange={(e) => setFormData({ ...formData, arrivalTerminal: e.target.value })}
                />
              </div>
            </div>

            {/* Select Time */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Select Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-[#3bb6e0]" />
                </div>
                <input
                  type="time"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                />
              </div>
            </div>

            {/* Set Fare Price */}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-2">
                Set Fare Price <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center gap-1.5 pointer-events-none">
                  <DollarSign className="w-4 h-4 text-[#3bb6e0]" />
                  <span className="text-[13px] font-semibold text-slate-600">₦</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter fare price"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              {/* Quick Price Pills */}
              <div className="border border-slate-100 rounded-xl p-3 flex flex-wrap gap-2.5 bg-white">
                {['8500', '9000', '9500', '10000'].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => handlePriceClick(price)}
                    className={clsx(
                      "px-3.5 py-1.5 border text-[12.5px] font-medium rounded-md transition-colors",
                      formData.price === price
                        ? "bg-[#3bb6e0] border-[#3bb6e0] text-white"
                        : "border-[#bae6fd] bg-[#f0f9ff] text-[#0ea5e9] hover:bg-[#e0f2fe]"
                    )}
                  >
                    ₦{Number(price).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-[#f4faff] border border-[#e0f2fe] rounded-xl p-5 shadow-sm mt-6">
              <h3 className="text-[#64748b] text-[15px] font-medium mb-4">Trip Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0f2fe]">
                  <span className="text-[13.5px] text-[#94a3b8] font-medium">Fare Price:</span>
                  <span className="text-[13.5px] font-medium text-[#0ea5e9]">
                    {formData.price ? `₦${Number(formData.price).toLocaleString()}` : '₦0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] text-[#94a3b8] font-medium">Estimated Revenue:</span>
                  <span className="text-[13.5px] font-medium text-[#22c55e]">
                    {formData.price && selectedBus
                      ? `₦${(Number(formData.price) * selectedBus.totalCapacity).toLocaleString()}`
                      : '₦0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="mt-14 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/trips')}
            className="px-6 py-2.5 bg-white border-2 border-[#3bb6e0] text-[#0ea5e9] text-[14px] font-semibold rounded-xl hover:bg-[#f0f9ff] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              "px-8 py-2.5 text-white text-[14px] font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2",
              error?.includes("Schedule Conflict") 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-[#0ea5e9] hover:bg-[#0284c7]"
            )}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Creating…' : error?.includes("Schedule Conflict") ? 'Conflict Found' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
}
