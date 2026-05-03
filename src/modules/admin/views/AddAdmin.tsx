import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shield, Camera, Upload, 
  Mail, Phone, MapPin, CreditCard,
  Calendar, UserPlus, Briefcase, Loader2
} from 'lucide-react';
import { useTeamStore } from '../store/useTeamStore';
import toast from 'react-hot-toast';

export default function AddAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    ticketerForm, 
    updateTicketerForm, 
    registerMember, 
    updateMember,
    fetchMemberById,
    resetForms,
    isLoading 
  } = useTeamStore();

  const isEdit = !!id;
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchMemberById('Ticketer', id).catch(() => {
        toast.error("Failed to load admin details");
        navigate('/admin/team');
      });
    }
    return () => resetForms();
  }, [isEdit, id]);

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
    try {
      if (isEdit && id) {
        await updateMember('Admin', id, { profilePhoto: profilePhoto || undefined });
        toast.success("Admin updated successfully");
      } else {
        await registerMember('Admin', { profilePhoto: profilePhoto || undefined });
        toast.success("Admin registered successfully");
      }
      navigate('/admin/team');
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEdit ? 'update' : 'register'} admin`);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8fafc] w-full p-6 sm:p-8 font-sans pb-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <Link 
          to="/admin/team" 
          className="inline-flex items-center text-[#64748B] hover:text-[#6366f1] mb-6 transition-colors font-medium text-[14px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Team
        </Link>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-[#eef2ff] flex items-center justify-center shadow-sm">
            <Shield className="w-7 h-7 text-[#6366f1]" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1E293B]">
            {isEdit ? 'Edit Admin Profile' : 'Add New Admin'}
          </h1>
        </div>
        <p className="text-[#64748B] mb-8 text-[15px]">
          {isEdit ? `Modifying details for ${ticketerForm.fullName}` : 'Fill in the details to register a new system administrator'}
        </p>

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
                <div 
                  className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all"
                  onClick={() => document.getElementById('admin-photo-upload')?.click()}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <button 
                  type="button"
                  onClick={() => document.getElementById('admin-photo-upload')?.click()}
                  className="bg-[#6366f1] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-[#4f46e5] transition-colors mb-3 text-[14px] shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </button>
                <p className="text-[13px] text-slate-400">JPG, PNG or GIF. Max size 2MB</p>
                <input 
                  type="file" 
                  id="admin-photo-upload" 
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
                <label className="block text-[14px] text-slate-700 mb-2">Full Name *</label>
                <input 
                  type="text" required placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400"
                  value={ticketerForm.fullName}
                  onChange={e => updateTicketerForm({ fullName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" required placeholder="admin@tarix.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400"
                    value={ticketerForm.email}
                    onChange={e => updateTicketerForm({ email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="tel" required placeholder="+234 800 000 0000"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400"
                    value={ticketerForm.phone}
                    onChange={e => updateTicketerForm({ phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Staff ID Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" required placeholder="ADM-00001"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400"
                    value={ticketerForm.idNumber}
                    onChange={e => updateTicketerForm({ idNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[14px] text-slate-700 mb-2">Home Address *</label>
              <div className="relative">
                <div className="absolute top-3.5 left-0 pl-4 pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <textarea 
                  required rows={3} placeholder="Enter full address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400 resize-y"
                  value={ticketerForm.homeAddress}
                  onChange={e => updateTicketerForm({ homeAddress: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Employment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Department *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 bg-white appearance-none"
                    value={ticketerForm.station}
                    onChange={e => updateTicketerForm({ station: e.target.value })}
                  >
                    <option value="" disabled>Select department</option>
                    <option value="Management">Management</option>
                    <option value="Finance">Finance</option>
                    <option value="Support">Support</option>
                    <option value="IT">IT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Employment Date *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="date" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800"
                    value={ticketerForm.employmentDate}
                    onChange={e => updateTicketerForm({ employmentDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">Monthly Salary (₦) *</label>
                <input 
                  type="number" required placeholder="250000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] transition-all text-slate-800 placeholder:text-slate-400"
                  value={ticketerForm.monthlySalary}
                  onChange={e => updateTicketerForm({ monthlySalary: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-start gap-4 mt-8">
            <button 
              type="submit" disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#6366f1] text-white font-medium text-[14px] hover:bg-[#4f46e5] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
              {isLoading ? (isEdit ? "Saving..." : "Registering...") : (isEdit ? "Update Admin" : "Add Admin")}
            </button>
            <Link 
              to="/admin/team"
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-[14px] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
