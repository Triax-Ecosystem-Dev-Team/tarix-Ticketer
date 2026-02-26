import { useState } from 'react';
import { 
  Info, Bus, MapPin, Calendar, Clock, User, DollarSign, Users 
} from 'lucide-react';

export default function CreateTrip() {
  const [formData, setFormData] = useState({
    bus: '',
    route: '',
    date: '',
    time: '',
    driver: '',
    fare: '',
  });

  const handlePriceClick = (price: string) => {
    setFormData((prev) => ({ ...prev, fare: price }));
  };

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
                <Bus className="w-4 h-4 text-[#3bb6e0]" />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                value={formData.bus}
                onChange={(e) => setFormData({ ...formData, bus: e.target.value })}
              >
                <option value="" disabled>Select a bus</option>
                <option value="bus-1">BUS-045 (Toyota Hiace)</option>
                <option value="bus-2">BUS-089 (Mercedes Sprinter)</option>
              </select>
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                <User className="w-4 h-4 text-[#3bb6e0]" />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              >
                <option value="" disabled className="bg-gray-500 text-white">Choose a driver</option>
                <option value="d1">Ahmed Hassan (Rating: 4.8/5, 150 trips)</option>
                <option value="d2">Chioma Okafor (Rating: 4.9/5, 200 trips)</option>
                <option value="d3">Emeka Nwosu (Rating: 4.7/5, 120 trips)</option>
                <option value="d4">Fatima Ibrahim (Rating: 4.6/5, 95 trips)</option>
                <option value="d5">Chukwudi Eze (Rating: 4.8/5, 180 trips) - On Trip</option>
              </select>
            </div>
          </div>

          {/* Set Capacity (Readonly) */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-[13px] font-medium text-slate-700">Set Capacity</label>
              <span className="text-[11px] text-slate-400">Auto-filled from bus model</span>
            </div>
            
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Users className="w-4 h-4 text-[#3bb6e0]" />
              </div>
              <input 
                type="text"
                value="50 seats"
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-500 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Capacity Summary Grid */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Total Seats</span>
                <span className="text-[13px] font-semibold text-slate-700">50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Reserved</span>
                <span className="text-[13px] font-semibold text-slate-700">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Available:</span>
                <span className="text-[13px] font-bold text-[#10b981]">50</span>
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
          
          {/* Select Route */}
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Select Route <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MapPin className="w-4 h-4 text-[#3bb6e0]" />
              </div>
              <select 
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              >
                <option value="" disabled className="bg-gray-500 text-white">Choose a route</option>
                <option value="r1">Lagos → Ibadan (120 km)</option>
                <option value="r2">Lagos → Benin (300 km)</option>
                <option value="r3">Lagos → Owerri (450 km)</option>
                <option value="r4">Lagos → Oshogbo (250 km)</option>
                <option value="r5">Lagos → Asaba (400 km)</option>
                <option value="r6">Ibadan → Oshogbo (150 km)</option>
                <option value="r7">Benin → Asaba (200 km)</option>
              </select>
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
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                placeholder="Enter fare price"
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-700 focus:outline-none focus:border-[#3bb6e0] focus:ring-1 focus:ring-[#3bb6e0] hover:border-slate-300 transition-colors placeholder:text-slate-400"
                value={formData.fare}
                onChange={(e) => setFormData({ ...formData, fare: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            {/* Quick Price Pills */}
            <div className="border border-slate-100 rounded-xl p-3 flex flex-wrap gap-2.5 bg-white">
              {['8500', '9000', '9500', '10000'].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => handlePriceClick(price)}
                  className="px-3.5 py-1.5 border border-[#bae6fd] bg-[#f0f9ff] text-[#0ea5e9] text-[12.5px] font-medium rounded-md hover:bg-[#e0f2fe] focus:bg-[#3bb6e0] focus:border-[#3bb6e0] focus:text-white transition-colors"
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
                  {formData.fare ? `₦${Number(formData.fare).toLocaleString()}` : "₦0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-[#94a3b8] font-medium">Estimated Revenue:</span>
                <span className="text-[13.5px] font-medium text-[#22c55e]">
                  {formData.fare ? `₦${(Number(formData.fare) * 50).toLocaleString()}` : "₦0"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer Actions ── */}
      <div className="mt-14 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
        <button 
          className="px-6 py-2.5 bg-white border-2 border-[#3bb6e0] text-[#0ea5e9] text-[14px] font-semibold rounded-xl hover:bg-[#f0f9ff] transition-colors"
        >
          Cancel
        </button>
        <button 
          className="px-8 py-2.5 bg-[#fbcfe8] text-white text-[14px] font-semibold rounded-xl hover:bg-[#f9a8d4] transition-colors shadow-sm"
        >
          Create Trip
        </button>
      </div>

    </div>
  );
}
