import { useState, useEffect, memo, useRef } from 'react';
import { 
  Bus, 
  Settings, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  UploadCloud, 
  X, 
  Loader2, 
  RefreshCcw 
} from 'lucide-react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useFleetStore } from '../store/useFleetStore';
import { useBusFormStore } from '../store/useBusFormStore';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Bus details', icon: Bus },
  { id: 2, title: 'Specifications', description: 'Technical details', icon: Settings },
  { id: 3, title: 'Documentation', description: 'Upload documents', icon: FileText },
  { id: 4, title: 'Review', description: 'Confirm details', icon: CheckCircle },
];

// ── OPTIMIZED HELPER COMPONENTS (Defined outside to prevent recreation on every render) ──
const FormInput = memo(({ label, placeholder, field, type = 'text', required, subLabel }: any) => {
  const value = useBusFormStore(s => (s.formData as any)[field] || '');
  const setField = useBusFormStore(s => s.setFormData);

  return (
    <div className="w-full">
      <label htmlFor={field} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        id={field}
        name={field}
        type={type} 
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
        value={value as string}
        onChange={e => setField({ [field]: e.target.value })}
      />
      {subLabel && <p className="text-[11px] text-slate-400 mt-1.5">{subLabel}</p>}
    </div>
  );
});

const FormSelect = memo(({ label, options, field, required }: any) => {
  const value = useBusFormStore(s => (s.formData as any)[field] || '');
  const setField = useBusFormStore(s => s.setFormData);

  return (
    <div className="w-full">
      <label htmlFor={field} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select 
          id={field}
          name={field}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-slate-600 appearance-none bg-white"
          value={value as string}
          onChange={e => setField({ [field]: e.target.value })}
        >
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </div>
  );
});

const FileUpload = memo(({ 
  label, 
  required, 
  subLabel, 
  field 
}: { 
  label: string, 
  required?: boolean, 
  subLabel?: string,
  field: any
}) => {
  const file = useBusFormStore(s => (s.formData as any)[field]);
  const busPhotos = useBusFormStore(s => s.formData.busPhotos);
  const setFormData = useBusFormStore(s => s.setFormData);

  const validateFile = (file: File, type: 'pdf' | 'image'): string | null => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) return `"${file.name}" is too large. Max limit is 5MB.`;
    if (type === 'pdf' && file.type !== 'application/pdf') return `"${file.name}" must be a PDF file.`;
    if (type === 'image' && !file.type.startsWith('image/')) return `"${file.name}" must be an image (JPG/PNG/WEBP).`;
    return null;
  };

  const handleFiles = (files: FileList) => {
    if (!files || files.length === 0) return;

    if (field === 'busPhotos') {
      const newFiles = Array.from(files);
      if (busPhotos.length + newFiles.length > 10) {
        toast.error("You can only upload a maximum of 10 photos.");
        return;
      }

      for (const f of newFiles) {
        const error = validateFile(f, 'image');
        if (error) {
          toast.error(error);
          return;
        }
      }

      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      
      setFormData((prev: any) => ({
        busPhotos: [...(prev.busPhotos || []), ...newFiles],
        previews: [...(prev.previews || []), ...newPreviews]
      }));
      
      toast.success(`${newFiles.length} photo(s) added to gallery`);
    } else {
      // For certificates, allow both PDF and Image (some users take photos of docs)
      const isImage = files[0].type.startsWith('image/');
      const error = validateFile(files[0], isImage ? 'image' : 'pdf');
      
      if (error) {
        toast.error(error);
        return;
      }
      
      setFormData({ [field]: files[0] });
      toast.success(`${label} attached`);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ [field]: null });
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
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById(`file-upload-${field}`)?.click()}
      >
        <input 
          type="file" 
          id={`file-upload-${field}`}
          className="hidden" 
          accept={field === 'busPhotos' ? "image/*" : "application/pdf,image/*"}
          multiple={field === 'busPhotos'}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {field === 'busPhotos' && Array.isArray(busPhotos) && busPhotos.length > 0 ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-[#f0fdf4] rounded-full flex items-center justify-center mb-3 text-[#22c55e]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-bold text-slate-700 mb-1">{busPhotos.length} photos added</p>
            <p className="text-[12px] text-slate-500">Click or drag to add more</p>
          </div>
        ) : file && !(Array.isArray(file)) ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-[#22c55e]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-bold text-slate-700 mb-1 truncate max-w-[250px]">{(file as File).name}</p>
            <p className="text-[11px] text-slate-500 mb-3">{((file as File).size / (1024 * 1024)).toFixed(2)} MB</p>
            <button onClick={removeFile} className="text-[12px] font-semibold text-red-500 hover:text-red-600">Remove File</button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform text-[#0ea5e9]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-[13px] font-medium text-slate-700 mb-1">
              {field === 'busPhotos' ? 'Upload bus photos' : 'Drag and drop your file here'}
            </p>
            <p className="text-[12px] text-slate-500 mb-3">or click to browse</p>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {field === 'busPhotos' ? 'JPG, PNG, WEBP (Max 10 photos)' : 'PDF, JPG, PNG (Max 5MB)'}
            </p>
          </>
        )}
      </div>
    </div>
  );
});

export default function AddBus() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, setFormData, clearDraft } = useBusFormStore();
  
  const previews = useBusFormStore(s => s.formData.previews);
  const previewsRef = useRef<string[]>([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      // Safety check: ensure previewsRef.current exists before cleanup
      if (previewsRef.current) {
        previewsRef.current.forEach(url => URL.revokeObjectURL(url));
      }
    };
  }, []);

  const { id } = useParams();
  const { registerBus, updateBus, getBusById, isLoading } = useFleetStore();

  useEffect(() => {
    if (id) {
      getBusById(id).then(bus => {
        if (bus) {
          setFormData(prev => ({
            ...prev,
            ...bus,
            registrationNumber: bus.registrationNumber || '',
            nickname: bus.nickname || '',
            chassisNumber: bus.chassisNumber || '',
            engineNumber: bus.engineNumber || '',
            ownerName: bus.ownerName || '',
            ownerPhone: bus.ownerPhone || '',
            manufacturer: bus.manufacturer || '',
            model: bus.model || '',
            year: bus.year || '',
            color: bus.color || '',
            fuelType: bus.fuelType || '',
            totalCapacity: bus.totalCapacity || '',
            availableSeats: bus.availableSeats || '',
            maintenanceStatus: bus.maintenanceStatus || '',
            transmissionType: bus.transmissionType || '',
            amenities: bus.amenities || [],
            registrationDate: bus.registrationDate ? new Date(bus.registrationDate).toISOString().split('T')[0] : '',
            insuranceExpiry: bus.insuranceExpiry ? new Date(bus.insuranceExpiry).toISOString().split('T')[0] : '',
            lastServiceDate: bus.lastServiceDate ? new Date(bus.lastServiceDate).toISOString().split('T')[0] : '',
            nextServiceDue: bus.nextServiceDue ? new Date(bus.nextServiceDue).toISOString().split('T')[0] : '',
          }));
        }
      });
    }
  }, [id, getBusById]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB client-side pre-check

  const validateFile = (file: File, type: 'pdf' | 'image'): string | null => {
    if (file.size > MAX_FILE_SIZE) return `"${file.name}" is too large. Max limit is 5MB.`;
    if (type === 'pdf' && file.type !== 'application/pdf') return `"${file.name}" must be a PDF file.`;
    if (type === 'image' && !file.type.startsWith('image/')) return `"${file.name}" must be an image (JPG/PNG/WEBP).`;
    return null;
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const required = ['registrationNumber', 'nickname', 'chassisNumber', 'engineNumber', 'ownerName', 'ownerPhone', 'registrationDate', 'insuranceProvider', 'insuranceExpiry', 'manufacturer', 'model', 'year', 'color', 'fuelType'];
      return required.every(field => formData[field as keyof typeof formData]);
    }
    if (currentStep === 2) {
      const required = ['totalCapacity', 'availableSeats', 'currentMileage', 'lastServiceDate', 'nextServiceDue', 'maintenanceStatus', 'transmissionType'];
      return required.every(field => formData[field as keyof typeof formData]);
    }
    if (currentStep === 3) {
      const required = ['vehicleRegistrationCert', 'insuranceCert', 'roadworthinessCert', 'busPhotos'];
      return required.every(field => formData[field as keyof typeof formData]);
    }
    return true;
  };



  const handleNext = async () => {
    if (!validateStep()) {
      toast.error(
        currentStep === 3
          ? 'Please upload all required documents before continuing.'
          : 'Please fill all required fields before proceeding.'
      );
      return;
    }
    
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        const val = formData[key as keyof typeof formData];
        if (key === 'busPhotos' && Array.isArray(val)) {
          val.forEach((file: File) => data.append('busPhotos', file));
        } else if (val instanceof File) {
          data.append(key, val);
        } else if (val instanceof FileList) {
          Array.from(val).forEach((file: any) => data.append(key, file));
        } else if (key === 'amenities') {
          data.append(key, JSON.stringify(val));
        } else if (val !== null && val !== undefined && val !== '') {
          data.append(key, String(val));
        }
      });
      const loadingToast = toast.loading(id ? 'Updating bus...' : 'Registering bus...');
      try {
        if (id) {
          await updateBus(id, data);
          toast.success('Bus updated successfully', { id: loadingToast });
        } else {
          const result = await registerBus(data);
          const regNum = (result as any)?.bus?.registrationNumber || formData.registrationNumber;
          toast.success(`Asset registered: ${regNum}`, { id: loadingToast });
        }
        clearDraft();
        navigate('/admin/buses');
      } catch (err: any) {
        toast.error(err.message || 'Action failed', { id: loadingToast });
      }
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
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[12px] font-medium text-sky-100/80 flex items-center gap-1.5">
                Dashboard <ChevronRight className="w-3 h-3" /> 
                Fleet Management <ChevronRight className="w-3 h-3" /> 
                {id ? 'Edit Bus' : 'Add New Bus'}
              </p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Draft Saved</span>
              </div>
            </div>
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
              {id ? 'Update Asset Details' : 'Register New Fleet Asset'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/admin/buses')}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-white font-medium text-[14px] hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleNext}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-white text-[#0ea5e9] font-bold text-[14px] hover:bg-sky-50 transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (currentStep === 4 ? 'Submit Bus' : 'Save & Continue')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 -mt-6">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center justify-between w-full max-w-3xl mx-auto relative">
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
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <FormInput label="Registration Number" placeholder="e.g. LAG-123-XY" field="registrationNumber" required />
                  <FormInput label="Nickname" placeholder="e.g. Blue Thunder" field="nickname" />
                  <FormInput label="Chassis Number" placeholder="Enter chassis ID" field="chassisNumber" required />
                  <FormInput label="Engine Number" placeholder="Enter engine ID" field="engineNumber" required />
                  <FormInput label="Owner Name" placeholder="Full name" field="ownerName" required />
                  <FormInput label="Owner Phone" placeholder="080XXXXXXXX" field="ownerPhone" required />
                  <FormInput label="Registration Date" type="date" field="registrationDate" required />
                  <FormInput label="Insurance Provider" placeholder="e.g. AXA Mansard" field="insuranceProvider" required />
                  <FormInput label="Insurance Expiry" type="date" field="insuranceExpiry" required />
                  <FormInput label="Manufacturer" placeholder="e.g. Mercedes-Benz" field="manufacturer" required />
                  <FormInput label="Model" placeholder="e.g. Marcopolo G7" field="model" required />
                  <FormInput label="Year" placeholder="2023" type="number" field="year" required />
                  <FormInput label="Color" placeholder="e.g. Royal Blue" field="color" required />
                  <FormSelect label="Fuel Type" options={['Diesel', 'Petrol', 'CNG', 'Electric']} field="fuelType" required />
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear the entire form? All unsaved progress will be lost.')) {
                        clearDraft();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-[13px] font-semibold transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Clear Form Draft
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-8">
                <h2 className="text-[18px] font-bold text-[#1e293b] mb-1">Specifications</h2>
                <p className="text-[13px] text-slate-500">Technical and capacity details</p>
              </div>

              <div className="mb-10">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Capacity & Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput label="Total Capacity" placeholder="e.g. 50" type="number" field="totalCapacity" required />
                  <FormInput label="Available Seats" placeholder="e.g. 50" type="number" field="availableSeats" required />
                  <FormInput label="Wheelchair Seats" placeholder="e.g. 2" type="number" field="wheelchairSeats" />
                  <FormInput label="Bus Length (m)" placeholder="e.g. 12.5" type="number" field="busLength" />
                  <FormInput label="Bus Width (m)" placeholder="e.g. 2.5" type="number" field="busWidth" />
                  <FormInput label="Bus Height (m)" placeholder="e.g. 3.8" type="number" field="busHeight" />
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Technical Specs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput label="Current Mileage (km)" placeholder="e.g. 45000" type="number" field="currentMileage" required />
                  <FormInput label="Last Service Date" type="date" field="lastServiceDate" required subLabel="When was the last maintenance?" />
                  <FormInput label="Next Service Due" type="date" field="nextServiceDue" required subLabel="Scheduled maintenance date" />
                  <FormInput label="Engine Capacity (cc)" placeholder="e.g. 5900" type="number" field="engineCapacity" subLabel="Engine displacement in cubic centimeters" />
                </div>
              </div>

              {/* Maintenance Status Radio Buttons */}
              <div className="mb-6">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Operational Status</h3>
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
                        onChange={(e) => setFormData({ maintenanceStatus: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission Type Text Radios */}
              <div className="mb-10">
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
                        onChange={(e) => setFormData({ transmissionType: e.target.value })}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-2">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-5 border-b border-slate-100 pb-2">Amenities</h3>
                <div className="flex flex-wrap gap-4">
                  {['Air Conditioning', 'WiFi', 'Charging Ports', 'Entertainment System', 'Fire Extinguisher', 'Luggage Compartment'].map((amenity) => {
                    const isSelected = (formData.amenities || []).includes(amenity);
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
                            const currentAmenities = formData.amenities || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, amenities: [...currentAmenities, amenity] });
                            } else {
                              setFormData({ ...formData, amenities: (formData.amenities || []).filter(a => a !== amenity) });
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
                
                <div className="flex flex-col gap-6">
                  <FileUpload label="Vehicle Registration Certificate" required field="vehicleRegistrationCert" />
                  <FileUpload label="Insurance Certificate" required field="insuranceCert" />
                  <FileUpload label="Roadworthiness Certificate" required field="roadworthinessCert" />
                  <FileUpload label="Inspection Report" field="inspectionReport" />
                  <FileUpload label="Emission Test Certificate" field="emissionTestCert" />
                  <FileUpload 
                    label="Bus Photos" 
                    required 
                    subLabel="Upload up to 10 photos (front, side, interior)" 
                    field="busPhotos" 
                  />
                </div>

                {/* --- PHOTO GALLERY PREVIEW SECTION --- */}
                {formData.busPhotos.length > 0 && (
                  <div className="mt-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300 min-h-[220px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] font-bold text-[#1e293b]">Image Gallery ({formData.busPhotos.length}/10)</h3>
                      <button 
                        onClick={() => {
                          setFormData({ busPhotos: [], previews: [] });
                        }}
                        className="text-[11px] font-bold text-red-500 uppercase tracking-wider hover:text-red-600 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {previews.map((url, index) => (
                        <div 
                          key={url} 
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50"
                        >
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <button
                            onClick={() => {
                              const newPhotos = [...formData.busPhotos];
                              const newPreviews = [...previews];
                              
                              // Revoke the URL to clean up memory
                              URL.revokeObjectURL(newPreviews[index]);
                              
                              newPhotos.splice(index, 1);
                              newPreviews.splice(index, 1);
                              
                              setFormData({ busPhotos: newPhotos, previews: newPreviews });
                            }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all scale-90 hover:scale-100 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                        {(formData.amenities || []).length > 0 ? (formData.amenities || []).map((amenity, idx) => (
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
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl bg-[#0ea5e9] text-white font-bold text-[14px] hover:bg-[#0284c7] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {currentStep === 4 ? 'Submitting...' : 'Processing...'}
                </>
              ) : (
                <>
                  {currentStep === 4 ? 'Submit Bus' : 'Next'} <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
