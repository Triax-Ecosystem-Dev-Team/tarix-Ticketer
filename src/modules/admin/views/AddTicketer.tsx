import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Ticket, Camera, Upload, 
  Mail, Phone, CreditCard, MapPin, 
  Calendar, UserPlus 
} from 'lucide-react';

export default function AddTicketer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    homeAddress: '',
    station: '',
    workShift: '',
    employmentDate: '',
    monthlySalary: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    navigate('/admin/team');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8fafc] w-full p-6 sm:p-8 font-sans pb-20">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <Link 
          to="/admin/team/add" 
          className="inline-flex items-center text-[#64748B] hover:text-[#0EA5E9] mb-6 transition-colors font-medium text-[14px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Selection
        </Link>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-[#E0F2FE] flex items-center justify-center shadow-sm">
            <Ticket className="w-7 h-7 text-[#0EA5E9]" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1E293B]">Add New Ticketer</h1>
        </div>
        <p className="text-[#64748B] mb-8 text-[15px]">Fill in the details to register a new ticketing agent</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Profile Photo</h2>
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 relative overflow-hidden group">
                {profilePhoto ? (
                  <img src={URL.createObjectURL(profilePhoto)} alt="Profile Preview" className="w-full h-full object-cover" />
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
                  className="bg-[#0EA5E9] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium hover:bg-[#0284c7] transition-colors mb-3 text-[14px] shadow-sm"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
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
                    placeholder="ticketer@tarix.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  ID Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="TKT-00000"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                    value={formData.idNumber}
                    onChange={e => setFormData({...formData, idNumber: e.target.value})}
                  />
                </div>
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400 resize-y"
                  value={formData.homeAddress}
                  onChange={e => setFormData({...formData, homeAddress: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-[17px] font-medium text-[#1E293B] mb-6">Employment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Assigned Station *
                </label>
                <select 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 bg-white"
                  value={formData.station}
                  onChange={e => setFormData({...formData, station: e.target.value})}
                >
                  <option value="" disabled>Select station</option>
                  <option value="lagos">Lagos Terminal</option>
                  <option value="abuja">Abuja Main Station</option>
                  <option value="kano">Kano Central</option>
                </select>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Work Shift *
                </label>
                <select 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 bg-white"
                  value={formData.workShift}
                  onChange={e => setFormData({...formData, workShift: e.target.value})}
                >
                  <option value="" disabled>Select shift</option>
                  <option value="morning">Morning (6 AM - 2 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                  <option value="night">Night (10 PM - 6 AM)</option>
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 text-slate-500"
                    value={formData.employmentDate}
                    onChange={e => setFormData({...formData, employmentDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-slate-700 mb-2">
                  Monthly Salary (₦) *
                </label>
                <input 
                  type="number" 
                  placeholder="50000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                  value={formData.monthlySalary}
                  onChange={e => setFormData({...formData, monthlySalary: e.target.value})}
                />
              </div>
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({...formData, emergencyContactName: e.target.value})}
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all text-slate-800 placeholder:text-slate-400"
                    value={formData.emergencyContactPhone}
                    onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-start gap-4 mt-8">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0EA5E9] text-white font-medium text-[14px] hover:bg-[#0284c7] transition-colors shadow-sm flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Ticketer
            </button>
            <Link 
              to="/admin/team/add"
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
