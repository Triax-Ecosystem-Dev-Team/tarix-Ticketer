import { useState } from 'react';
import { Bus, Settings, FileText, CheckCircle, ChevronRight, UploadCloud } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Bus details', icon: Bus },
  { id: 2, title: 'Specifications', description: 'Technical details', icon: Settings },
  { id: 3, title: 'Documentation', description: 'Upload documents', icon: FileText },
  { id: 4, title: 'Review', description: 'Confirm details', icon: CheckCircle },
];

export default function AddBus() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Bus Identification
    registrationNumber: '',
    nickname: '',
    chassisNumber: '',
    engineNumber: '',
    // Ownership
    ownerName: '',
    ownerPhone: '',
    registrationDate: '',
    insuranceProvider: '',
    insuranceExpiry: '',
    // Vehicle Details
    manufacturer: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    // Step 2: Specifications
    totalCapacity: '',
    availableSeats: '',
    wheelchairSeats: '',
    busLength: '',
    busWidth: '',
    busHeight: '',
    currentMileage: '',
    lastServiceDate: '',
    nextServiceDue: '',
    engineCapacity: '',
    maintenanceStatus: '',
    transmissionType: '',
    amenities: [] as string[],
    // Step 3: Documentation
    vehicleRegistrationCert: null,
    insuranceCert: null,
    roadworthinessCert: null,
    inspectionReport: null,
    emissionTestCert: null,
    busPhotos: null,
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else {
      // Handle Final Submit
      navigate('/admin/buses');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8fafc] w-full animate-in fade-in duration-300 relative pb-24">
      
      {/* ── Top Header (Blue Background) ── */}
      <div className="bg-[#0ea5e9] px-6 py-8 w-full">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-white">
            <p className="text-[12px] font-medium text-sky-100/80 mb-1 flex items-center gap-1.5">
              Dashboard <ChevronRight className="w-3 h-3" /> 
              Fleet Management <ChevronRight className="w-3 h-3" /> 
              Add Bus
            </p>
            <h1 className="text-[28px] font-bold tracking-tight mb-1">
              Add New Bus
            </h1>
            <p className="text-[14px] text-sky-50">
              Register a new bus to your fleet
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/buses')}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-medium text-[14px] hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-white text-[#0ea5e9] font-bold text-[14px] hover:bg-sky-50 transition-colors shadow-sm">
              Save & Continue
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6">
        
        {/* Horizontal Wizard Stepper Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between w-full max-w-3xl mx-auto relative">
            {/* Connecting Lines */}
            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-0"></div>
            
            {STEPS.map((step) => {
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-2 cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                  <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white mb-2 transition-colors",
                    isActive ? "bg-[#0ea5e9] text-white" : 
                    isPast ? "bg-[#22c55e] text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {isPast ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <p className={clsx("text-[13px] font-bold mb-0.5 transition-colors text-center whitespace-nowrap", isActive ? "text-[#1e293b]" : "text-slate-500")}>
                    {step.title}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 text-center">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content Area */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Basic Information</h2>
                <p className="text-[13px] text-slate-500">Enter the basic details of your bus</p>
              </div>

              {/* Bus Identification */}
              <div className="mb-10">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Bus Identification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Bus Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter your vehicle registration number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.registrationNumber}
                      onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Bus Name/Nickname <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Give your bus a memorable name"
                      maxLength={50}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.nickname}
                      onChange={e => setFormData({...formData, nickname: e.target.value})}
                    />
                    <div className="flex justify-between mt-1.5">
                      <p className="text-[11px] text-slate-400">e.g., Express 1, Premium Coach</p>
                      <p className="text-[11px] text-slate-400">{formData.nickname.length}/50</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Chassis Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Vehicle Identification Number (VIN)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.chassisNumber}
                      onChange={e => setFormData({...formData, chassisNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Engine Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Engine identification number"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.engineNumber}
                      onChange={e => setFormData({...formData, engineNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Ownership & Registration */}
              <div className="mb-10">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Ownership & Registration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Name of the registered owner"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.ownerName}
                      onChange={e => setFormData({...formData, ownerName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Owner Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      placeholder="Contact number for the owner"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.ownerPhone}
                      onChange={e => setFormData({...formData, ownerPhone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Registration Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600"
                      value={formData.registrationDate}
                      onChange={e => setFormData({...formData, registrationDate: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Date of vehicle registration</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Insurance Provider <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600 appearance-none bg-white"
                      value={formData.insuranceProvider}
                      onChange={e => setFormData({...formData, insuranceProvider: e.target.value})}
                    >
                      <option value="" disabled>Select your insurance company</option>
                      <option value="leadway">Leadway Assurance</option>
                      <option value="axa">AXA Mansard</option>
                      <option value="aiico">AIICO Insurance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Insurance Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600"
                      value={formData.insuranceExpiry}
                      onChange={e => setFormData({...formData, insuranceExpiry: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">When does your insurance expire?</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Manufacturer <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600 appearance-none bg-white"
                      value={formData.manufacturer}
                      onChange={e => setFormData({...formData, manufacturer: e.target.value})}
                    >
                      <option value="" disabled>Bus manufacturer</option>
                      <option value="toyota">Toyota</option>
                      <option value="mercedes">Mercedes-Benz</option>
                      <option value="volvo">Volvo</option>
                      <option value="scania">Scania</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Bus model name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.model}
                      onChange={e => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Year of Manufacture <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600 appearance-none bg-white"
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: e.target.value})}
                    >
                      <option value="" disabled>When was the bus manufactured?</option>
                      {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600 appearance-none bg-white"
                      value={formData.color}
                      onChange={e => setFormData({...formData, color: e.target.value})}
                    >
                      <option value="" disabled>Primary color of the bus</option>
                      <option value="white">White</option>
                      <option value="silver">Silver</option>
                      <option value="blue">Blue</option>
                      <option value="black">Black</option>
                    </select>
                  </div>
                </div>

                {/* Fuel Type Radio Buttons */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                    Fuel Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Diesel', 'Petrol', 'CNG', 'Hybrid'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <div className={clsx(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                          formData.fuelType === type ? "border-[#0ea5e9]" : "border-slate-300"
                        )}>
                          {formData.fuelType === type && <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />}
                        </div>
                        <span className="text-[14px] text-slate-700 font-medium">{type}</span>
                        <input 
                          type="radio" 
                          name="fuelType" 
                          value={type} 
                          className="hidden" 
                          checked={formData.fuelType === type}
                          onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">Type of fuel the bus uses</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Bus Specifications</h2>
                <p className="text-[13px] text-slate-500">Enter technical specifications of your bus</p>
              </div>

              {/* Capacity & Dimensions */}
              <div className="mb-10">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Capacity & Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Total Seating Capacity <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 50"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.totalCapacity}
                      onChange={e => setFormData({...formData, totalCapacity: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Total number of seats</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Available Seats <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 48"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.availableSeats}
                      onChange={e => setFormData({...formData, availableSeats: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Seats available for passengers</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Wheelchair Accessible Seats
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 2"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.wheelchairSeats}
                      onChange={e => setFormData({...formData, wheelchairSeats: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Number of wheelchair accessible seats</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Bus Length (meters)
                    </label>
                    <input 
                      type="number" step="0.1"
                      placeholder="e.g., 12.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.busLength}
                      onChange={e => setFormData({...formData, busLength: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Length of the bus in meters</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Bus Width (meters)
                    </label>
                    <input 
                      type="number" step="0.1"
                      placeholder="e.g., 2.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.busWidth}
                      onChange={e => setFormData({...formData, busWidth: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Width of the bus in meters</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Bus Height (meters)
                    </label>
                    <input 
                      type="number" step="0.1"
                      placeholder="e.g., 3.8"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.busHeight}
                      onChange={e => setFormData({...formData, busHeight: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Height of the bus in meters</p>
                  </div>
                </div>
              </div>

              {/* Performance & Maintenance */}
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Performance & Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Current Mileage (km) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 150000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.currentMileage}
                      onChange={e => setFormData({...formData, currentMileage: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Current odometer reading</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Last Service Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600"
                      value={formData.lastServiceDate}
                      onChange={e => setFormData({...formData, lastServiceDate: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">When was the last maintenance?</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Next Service Due <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600"
                      value={formData.nextServiceDue}
                      onChange={e => setFormData({...formData, nextServiceDue: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Scheduled maintenance date</p>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                      Engine Capacity (cc)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g., 5900"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
                      value={formData.engineCapacity}
                      onChange={e => setFormData({...formData, engineCapacity: e.target.value})}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Engine displacement in cubic centimeters</p>
                  </div>
                </div>

                {/* Maintenance Status Radio Buttons */}
                <div className="mb-6">
                  <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                    Maintenance Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-3">
                    {[
                      { value: 'Excellent', color: 'bg-emerald-500' },
                      { value: 'Good', color: 'bg-green-500' },
                      { value: 'Fair', color: 'bg-amber-500' },
                      { value: 'Poor', color: 'bg-red-500' }
                    ].map((status) => (
                      <label key={status.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={clsx(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors shadow-sm",
                          formData.maintenanceStatus === status.value ? "border-[#0ea5e9]" : "border-slate-300 group-hover:border-slate-400"
                        )}>
                          {formData.maintenanceStatus === status.value && <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />}
                        </div>
                        <span className={clsx("w-3 h-3 rounded-full", status.color)}></span>
                        <span className="text-[14px] text-slate-700 font-medium">{status.value}</span>
                        <input 
                          type="radio" 
                          name="maintenanceStatus" 
                          value={status.value} 
                          className="hidden" 
                          checked={formData.maintenanceStatus === status.value}
                          onChange={(e) => setFormData({...formData, maintenanceStatus: e.target.value})}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">Current condition of the bus</p>
                </div>

                {/* Transmission Type Text Radios */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-3">
                    Transmission Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-6">
                    {['Manual', 'Automatic', 'Semi-Automatic'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer group">
                        <div className={clsx(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors shadow-sm",
                          formData.transmissionType === type ? "border-[#0ea5e9]" : "border-slate-300 group-hover:border-slate-400"
                        )}>
                          {formData.transmissionType === type && <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />}
                        </div>
                        <span className="text-[14px] text-slate-700 font-medium">{type}</span>
                        <input 
                          type="radio" 
                          name="transmissionType" 
                          value={type} 
                          className="hidden" 
                          checked={formData.transmissionType === type}
                          onChange={(e) => setFormData({...formData, transmissionType: e.target.value})}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3">Type of transmission</p>
                </div>

              </div>

              {/* Amenities */}
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Amenities</h3>
                <div className="flex flex-wrap gap-4">
                  {['Air Conditioning', 'WiFi', 'Charging Ports', 'Entertainment System', 'Fire Extinguisher', 'Luggage Compartment'].map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <label 
                        key={amenity} 
                        className={clsx(
                          "flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors shadow-sm",
                          isSelected ? "border-[#0ea5e9] bg-[#f0f9ff]/50" : "border-slate-200 hover:border-slate-300 bg-white"
                        )}
                      >
                        <div className={clsx(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          isSelected ? "bg-[#0ea5e9] border-[#0ea5e9] text-white" : "border-slate-300 bg-white"
                        )}>
                          {isSelected && <svg viewBox="0 0 14 14" className="w-2.5 h-2.5 fill-current"><path d="M11.666 3.5L5.25 9.917 2.333 7l-.833.833L5.25 11.583l7.25-7.25z"/></svg>}
                        </div>
                        <span className="text-[13px] text-slate-700 font-medium">{amenity}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
                            } else {
                              setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
                            }
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Documentation</h2>
                <p className="text-[13px] text-slate-500">Upload required documents for your bus</p>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* File Upload Helper Component */}
                {(() => {
                  const FileUpload = ({ 
                    label, 
                    required, 
                    subLabel, 
                    field 
                  }: { 
                    label: string, 
                    required?: boolean, 
                    subLabel?: string,
                    field: keyof typeof formData
                  }) => {
                    const file = formData[field] as File | null;

                    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files[0]) {
                        setFormData({ ...formData, [field]: e.target.files[0] });
                      }
                    };

                    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setFormData({ ...formData, [field]: e.dataTransfer.files[0] });
                      }
                    };

                    const removeFile = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      setFormData({ ...formData, [field]: null });
                    };

                    return (
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <label className="text-[13px] font-semibold text-slate-700">{label}</label>
                          {required && <span className="text-red-500 text-[13px]">*</span>}
                        </div>
                        {subLabel && <p className="text-[11px] text-slate-500 mb-2">{subLabel}</p>}
                        
                        <div 
                          className={clsx(
                            "w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer group transition-colors relative",
                            file 
                              ? "border-[#22c55e]/50 bg-[#f0fdf4]/50" 
                              : "border-[#0ea5e9]/30 bg-[#f0f9ff]/50 hover:bg-[#f0f9ff]"
                          )}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById(`file-upload-${field}`)?.click()}
                        >
                          <input 
                            type="file" 
                            id={`file-upload-${field}`}
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />

                          {file ? (
                            <div className="flex flex-col items-center text-center">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-[#22c55e]">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <p className="text-[13px] font-bold text-slate-700 mb-1 truncate max-w-[250px]">
                                {file.name}
                              </p>
                              <p className="text-[11px] text-slate-500 mb-3">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <button 
                                onClick={removeFile}
                                className="text-[12px] font-semibold text-red-500 hover:text-red-600 transition-colors"
                              >
                                Remove File
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform text-[#0ea5e9]">
                                <UploadCloud className="w-5 h-5" />
                              </div>
                              <p className="text-[13px] font-medium text-slate-700 mb-1">
                                Drag and drop your file here
                              </p>
                              <p className="text-[12px] text-slate-500 mb-3">
                                or click to browse
                              </p>
                              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                                PDF, JPG, PNG (Max 5MB)
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  };
                  
                  return (
                    <>
                      <FileUpload label="Vehicle Registration Certificate" required field="vehicleRegistrationCert" />
                      <FileUpload label="Insurance Certificate" required field="insuranceCert" />
                      <FileUpload label="Roadworthiness Certificate" required field="roadworthinessCert" />
                      <FileUpload label="Inspection Report" field="inspectionReport" />
                      <FileUpload label="Emission Test Certificate" field="emissionTestCert" />
                      <FileUpload 
                        label="Bus Photos" 
                        required 
                        subLabel="Upload at least 3 photos (front, side, interior)" 
                        field="busPhotos"
                      />
                    </>
                  );
                })()}

              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Review & Confirm</h2>
                <p className="text-[13px] text-slate-500">Please review all details before submitting</p>
              </div>

              {/* Data Helper */}
              {(() => {
                const SummarySection = ({ title, stepIndex, children }: { title: string, stepIndex: number, children: React.ReactNode }) => (
                  <div className="mb-6 bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[15px] font-medium text-slate-800">{title}</h3>
                      <button 
                        onClick={() => setCurrentStep(stepIndex)} 
                        className="text-[13px] font-medium text-[#0ea5e9] hover:underline transition-all"
                      >
                        Edit
                      </button>
                    </div>
                    {children}
                  </div>
                );

                const DataItem = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-medium text-slate-500">{label}</p>
                    <div className="text-[13.5px] font-medium text-slate-700">{value}</div>
                  </div>
                );

                return (
                  <>
                    <SummarySection title="Basic Information" stepIndex={1}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                        <DataItem label="Bus Registration" value={formData.registrationNumber || '-'} />
                        <DataItem label="Bus Name" value={formData.nickname || '-'} />
                        <DataItem label="Chassis Number" value={formData.chassisNumber || '-'} />
                        <DataItem label="Engine Number" value={formData.engineNumber || '-'} />
                        <DataItem label="Owner Name" value={formData.ownerName || '-'} />
                        <DataItem label="Owner Phone" value={formData.ownerPhone || '-'} />
                        <DataItem label="Manufacturer" value={formData.manufacturer ? <span className="capitalize">{formData.manufacturer}</span> : '-'} />
                        <DataItem label="Year" value={formData.year || '-'} />
                      </div>
                    </SummarySection>

                    <SummarySection title="Specifications" stepIndex={2}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                        <DataItem label="Total Seating" value={formData.totalCapacity || '-'} />
                        <DataItem label="Available Seats" value={formData.availableSeats || '-'} />
                        <DataItem label="Dimensions" value={(formData.busLength || formData.busWidth || formData.busHeight) 
                          ? `${formData.busLength || '?'}m × ${formData.busWidth || '?'}m × ${formData.busHeight || '?'}m` 
                          : '-'} />
                        <DataItem label="Mileage" value={formData.currentMileage ? `${formData.currentMileage} km` : '-'} />
                        <DataItem label="Transmission" value={formData.transmissionType || '-'} />
                        <DataItem label="Maintenance Status" value={formData.maintenanceStatus || '-'} />
                      </div>
                    </SummarySection>

                    <SummarySection title="Amenities" stepIndex={2}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        {formData.amenities.length > 0 ? formData.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full border border-green-500/30 flex items-center justify-center text-green-500 bg-green-50">
                              <CheckCircle className="w-3 h-3" />
                            </span>
                            <span className="text-[13.5px] font-medium text-slate-700">{amenity}</span>
                          </div>
                        )) : (
                          <p className="text-[13.5px] font-medium text-slate-500">No amenities selected.</p>
                        )}
                      </div>
                    </SummarySection>

                    <SummarySection title="Documentation" stepIndex={3}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                        {([] as { label: string, file: File | null }[]).concat([
                          { label: 'Vehicle Registration', file: formData.vehicleRegistrationCert as File | null },
                          { label: 'Insurance Certificate', file: formData.insuranceCert as File | null },
                          { label: 'Roadworthiness Cert.', file: formData.roadworthinessCert as File | null },
                          { label: 'Bus Photos', file: formData.busPhotos as File | null },
                          { label: 'Inspection Report', file: formData.inspectionReport as File | null },
                          { label: 'Emission Test', file: formData.emissionTestCert as File | null },
                        ]).map((doc, idx) => (
                          <div key={idx} className="flex flex-col gap-2">
                            <p className="text-[12px] font-medium text-slate-500">{doc.label}</p>
                            {doc.file ? (
                              <div className="text-[13.5px] font-medium text-slate-700 truncate max-w-full">
                                {doc.file.name}
                              </div>
                            ) : (
                              <div className="text-[13.5px] font-medium text-slate-400">
                                -
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </SummarySection>
                  </>
                );
              })()}

            </div>
          )}

        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-2">
          
          <div className="flex items-center gap-4 hidden sm:block">
            <p className="text-[13px] font-medium text-slate-500">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-[14px] hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="px-8 py-2.5 rounded-xl bg-[#0ea5e9] text-white font-bold text-[14px] hover:bg-[#0284c7] transition-colors shadow-sm flex items-center gap-2"
            >
              {currentStep === 4 ? 'Submit Bus' : 'Next'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
