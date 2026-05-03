import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../shared/api';

interface AddDriverState {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    bloodGroup: string;
    homeAddress: string;
    licenseNumber: string;
    yearsOfExperience: string;
    licenseIssueDate: string;
    licenseExpiryDate: string;
    assignedBusId: string;
    employmentDate: string;
    monthlySalary: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
  isLoading: boolean;
  error: string | null;

  updateForm: (data: Partial<AddDriverState['formData']>) => void;
  resetForm: () => void;
  submitDriver: (files: { profilePhoto?: File, licenseFile?: File, ninFile?: File }) => Promise<any>;
}

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  bloodGroup: '',
  homeAddress: '',
  licenseNumber: '',
  yearsOfExperience: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
  assignedBusId: '',
  employmentDate: new Date().toISOString().split('T')[0],
  monthlySalary: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export const useAddDriverStore = create<AddDriverState>()(
  persist(
    (set, get) => ({
      formData: INITIAL_FORM,
      isLoading: false,
      error: null,

      updateForm: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),

      resetForm: () => set({ formData: INITIAL_FORM, error: null }),

      submitDriver: async (files) => {
        set({ isLoading: true, error: null });
        try {
          const { formData } = get();
          
          // Use FormData for multi-part submission
          const data = new FormData();
          
          // Append JSON fields
          Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
          });

          // Append Files
          if (files.profilePhoto) data.append('profilePhoto', files.profilePhoto);
          if (files.licenseFile) data.append('licenseFile', files.licenseFile);
          if (files.ninFile) data.append('ninFile', files.ninFile);

          const res = await api.post('/drivers', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          set({ isLoading: false });
          return res.data;
        } catch (err: any) {
          const message = err.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
    }),
    {
      name: 'add-driver-draft', // unique name for localStorage
      partialize: (state) => ({ formData: state.formData }), // only persist formData
    }
  )
);
