import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BusFormState {
  // Step 1: Basic Info
  registrationNumber: string;
  nickname: string;
  chassisNumber: string;
  engineNumber: string;
  ownerName: string;
  ownerPhone: string;
  registrationDate: string;
  insuranceProvider: string;
  insuranceExpiry: string;
  manufacturer: string;
  model: string;
  year: string;
  color: string;
  fuelType: string;

  // Step 2: Specifications
  totalCapacity: string;
  availableSeats: string;
  wheelchairSeats: string;
  busLength: string;
  busWidth: string;
  busHeight: string;
  currentMileage: string;
  lastServiceDate: string;
  nextServiceDue: string;
  engineCapacity: string;
  maintenanceStatus: string;
  transmissionType: string;
  amenities: string[];

  // Step 3: Documentation (Note: Files are NOT persisted)
  vehicleRegistrationCert: File | null;
  insuranceCert: File | null;
  roadworthinessCert: File | null;
  inspectionReport: File | null;
  emissionTestCert: File | null;
  busPhotos: File[];
  previews: string[];
}

interface BusFormStore {
  formData: BusFormState;
  updateField: (field: keyof BusFormState, value: any) => void;
  setFormData: (data: Partial<BusFormState> | ((prev: BusFormState) => Partial<BusFormState>)) => void;
  clearDraft: () => void;
}

const initialFormState: BusFormState = {
  registrationNumber: '',
  nickname: '',
  chassisNumber: '',
  engineNumber: '',
  ownerName: '',
  ownerPhone: '',
  registrationDate: '',
  insuranceProvider: '',
  insuranceExpiry: '',
  manufacturer: '',
  model: '',
  year: '',
  color: '',
  fuelType: '',
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
  amenities: [],
  vehicleRegistrationCert: null,
  insuranceCert: null,
  roadworthinessCert: null,
  inspectionReport: null,
  emissionTestCert: null,
  busPhotos: [],
  previews: [],
};

export const useBusFormStore = create<BusFormStore>()(
  persist(
    (set) => ({
      formData: initialFormState,
      updateField: (field, value) => 
        set((state) => ({ 
          formData: { ...state.formData, [field]: value } 
        })),
      setFormData: (data) => 
        set((state) => {
          const newData = typeof data === 'function' ? data(state.formData) : data;
          return { formData: { ...state.formData, ...newData } };
        }),
      clearDraft: () => set({ formData: initialFormState }),
    }),
    {
      name: 'tarix-bus-draft',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          // Debounce localStorage writes to prevent UI jank on every keystroke
          if ((window as any)._persistTimeout) {
            clearTimeout((window as any)._persistTimeout);
          }
          (window as any)._persistTimeout = setTimeout(() => {
            localStorage.setItem(name, JSON.stringify(value));
          }, 500);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      // Only persist non-file fields
      partialize: (state) => ({
        formData: {
          ...state.formData,
          vehicleRegistrationCert: null,
          insuranceCert: null,
          roadworthinessCert: null,
          inspectionReport: null,
          emissionTestCert: null,
          busPhotos: [],
          previews: [],
        },
      }),
    }
  )
);
