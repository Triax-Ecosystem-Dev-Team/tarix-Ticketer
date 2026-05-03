import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Camera, Upload, 
  Mail, Phone, CreditCard, MapPin, 
  Calendar, UserPlus, Briefcase, Shield, FileText, Loader2,
  CheckCircle2
} from 'lucide-react';
import { useTeamStore } from '../store/useTeamStore';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function AddDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    driverForm, 
    updateDriverForm, 
    registerMember, 
    updateMember,
    fetchMemberById,
    resetForms,
    isLoading 
  } = useTeamStore();

  const isEdit = !!id;
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [ninFile, setNinFile] = useState<File | null>(null);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch member if in edit mode
  useEffect(() => {
    if (isEdit && id) {
      fetchMemberById('Driver', id).catch(() => {
        toast.error("Failed to load driver details");
        navigate('/admin/team');
      });
    }
    return () => resetForms();
  }, [isEdit, id]);

  // Cleanup profile photo preview URL to prevent memory leaks
  useEffect(() => {
    if (profilePhoto) {
      const url = URL.createObjectURL(profilePhoto);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [profilePhoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend Validation
    if (new Date(driverForm.licenseExpiryDate) <= new Date()) {
      toast.error("License expiry date must be in the future");
      return;
    }

    try {
      const files = { 
        profilePhoto: profilePhoto || undefined, 
        licenseFile: licenseFile || undefined, 
        ninFile: ninFile || undefined 
      };

      if (isEdit && id) {
        await updateMember('Driver', id, files);
        toast.success("Driver updated successfully");
      } else {
        await registerMember('Driver', files);
        toast.success("Driver registered successfully");
      }
      
      navigate('/admin/team');
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEdit ? 'update' : 'register'} driver`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8fafc] w-full p-6 sm:p-8 font-sans pb-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <Link 
          to="/admin/team/add" 
          className="inline-flex items-center text-[#64748B] hover:text-[#EC4899] mb-6 transition-colors font-medium text-[14px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Link>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-[#fce7f3] flex items-center justify-center shadow-sm">
            <User className="w-7 h-7 text-[#EC4899]" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1E293B]">{isEdit ? 'Edit Driver Profile' : 'Add New Driver'}</h1>
        </div>
        <p className="text-[#64748B] mb-8 text-[15px]">{isEdit ? `Modifying details for ${driverForm.fullName}` : 'Fill in the details to register a new driver'}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Profile Photo</h2>
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 relative overflow-hidden group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <button 
                  type="button"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="bg-[#EC4899] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-[#db2777] transition-colors mb-3 text-[14px] shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
                <p className="text-[13px] text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
                <input 
                  type="file" 
                  id="photo-upload" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfilePhoto(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                  value={driverForm.fullName}
                  onChange={e => updateDriverForm({ fullName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="driver@tarix.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                    value={driverForm.email}
                    onChange={e => updateDriverForm({ email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="+234 800 000 0000"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                    value={driverForm.phone}
                    onChange={e => updateDriverForm({ phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Blood Group
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 bg-white"
                  value={driverForm.bloodGroup}
                  onChange={e => updateDriverForm({ bloodGroup: e.target.value })}
                >
                  <option value="" disabled>Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[14px] text-slate-700 mb-2">
                Home Address *
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-4 pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <textarea 
                  placeholder="Enter full address"
                  required
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400 resize-y"
                  value={driverForm.homeAddress}
                  onChange={e => updateDriverForm({ homeAddress: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          {/* License Information Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-[#EC4899]" />
              <h2 className="text-[17px] font-medium text-[#1E293B]">License Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  License Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="DL-000000000"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                    value={driverForm.licenseNumber}
                    onChange={e => updateDriverForm({ licenseNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Years of Experience *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    placeholder="5"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                    value={driverForm.yearsOfExperience}
                    onChange={e => updateDriverForm({ yearsOfExperience: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  License Issue Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 text-slate-500"
                    value={driverForm.licenseIssueDate}
                    onChange={e => updateDriverForm({ licenseIssueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  License Expiry Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 text-slate-500"
                    value={driverForm.licenseExpiryDate}
                    onChange={e => updateDriverForm({ licenseExpiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  License PDF *
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => document.getElementById('license-upload')?.click()}
                    className={clsx(
                      "flex-1 px-4 py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all",
                      licenseFile ? "border-[#22c55e] bg-green-50 text-[#22c55e]" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-[#EC4899] hover:text-[#EC4899]"
                    )}
                  >
                    {licenseFile ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    <span className="text-[13.5px] font-medium">{licenseFile ? licenseFile.name : "Upload License PDF"}</span>
                  </button>
                  <input 
                    type="file" 
                    id="license-upload" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={(e) => e.target.files && setLicenseFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  NIN Document PDF *
                </label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => document.getElementById('nin-upload')?.click()}
                    className={clsx(
                      "flex-1 px-4 py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all",
                      ninFile ? "border-[#22c55e] bg-green-50 text-[#22c55e]" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-[#EC4899] hover:text-[#EC4899]"
                    )}
                  >
                    {ninFile ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    <span className="text-[13.5px] font-medium">{ninFile ? ninFile.name : "Upload NIN PDF"}</span>
                  </button>
                  <input 
                    type="file" 
                    id="nin-upload" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={(e) => e.target.files && setNinFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Employment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Assigned Bus
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 bg-white"
                  value={driverForm.assignedBusId}
                  onChange={e => updateDriverForm({ assignedBusId: e.target.value })}
                >
                  <option value="" disabled>Select bus (optional)</option>
                  <option value="bus-1">Toyota Coaster - ABC-123</option>
                  <option value="bus-2">Mercedes Sprinter - XYZ-789</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Employment Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 text-slate-500"
                    value={driverForm.employmentDate}
                    onChange={e => updateDriverForm({ employmentDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[14px] text-slate-700 mb-2">
                Monthly Salary (₦) *
              </label>
              <input 
                type="number" 
                placeholder="100000"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                value={driverForm.monthlySalary}
                onChange={e => updateDriverForm({ monthlySalary: e.target.value })}
              />
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Emergency Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Contact Name *
                </label>
                <input 
                  type="text" 
                  placeholder="Enter emergency contact name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                  value={driverForm.emergencyContactName}
                  onChange={e => updateDriverForm({ emergencyContactName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Contact Phone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="+234 800 000 0000"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-all text-slate-800 placeholder:text-slate-400"
                    value={driverForm.emergencyContactPhone}
                    onChange={e => updateDriverForm({ emergencyContactPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-start gap-4 mt-8">
            <button 
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#EC4899] text-white font-medium text-[15px] hover:bg-[#db2777] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? (isEdit ? "Saving..." : "Registering...") : (isEdit ? "Update Profile" : "Add Driver")}
            </button>
            <Link 
              to="/admin/team/add"
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-[15px] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
