import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Phone, Save, 
  Loader2, Upload, Trash2, 
  ArrowLeft, Camera 
} from 'lucide-react';
import { useAuthStore } from '../../../modules/auth/store/useAuthStore';
import { getAvatarSrc } from '../../utils/imageUtils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.avatar || null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      // Create FormData to support file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);

      if (profilePhoto) {
        // Append the actual File object, not the blob preview URL
        formDataToSend.append('avatar', profilePhoto);
      } else if (!photoPreview) {
        // If photoPreview is null, it means the user explicitly removed the photo
        formDataToSend.append('avatar', ''); 
      }

      await updateProfile(formDataToSend);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = user?.role === 'Admin';
  const backPath = isAdmin ? '/admin/account/settings' : '/account/settings';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500 pb-20">
      {/* Back Button */}
      <Link 
        to={backPath}
        className="inline-flex items-center text-slate-500 hover:text-[#0ea5e9] mb-8 transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Settings
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-500 text-sm">Update your personal information and contact details</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Header/Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-50">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-blue-50 overflow-hidden">
                  {photoPreview ? (
                    <img src={getAvatarSrc(photoPreview)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-[#0ea5e9] rounded-full shadow-md border-2 border-white text-white hover:bg-[#0284c7] transition-all transform hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h2>
                <p className="text-slate-500 text-sm mb-4">{user?.role} — Terminal Operations</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Change Photo
                  </button>
                  {photoPreview && (
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto}
                      className="px-5 py-2.5 bg-white text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors flex items-center gap-2 border border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0ea5e9]" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium text-slate-700 shadow-sm"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0ea5e9]" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-5 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-[14px] font-medium text-slate-400 cursor-not-allowed"
                  title="Email cannot be changed. Contact Admin for updates."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0ea5e9]" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium text-slate-700 shadow-sm"
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50">
              <div className="text-sm">
                {message && (
                  <span className={`flex items-center gap-2 font-bold ${message.type === 'success' ? 'text-green-500' : 'text-red-500'} animate-in slide-in-from-left duration-300`}>
                    {message.type === 'success' ? '✓' : '✕'} {message.text}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3.5 bg-[#0ea5e9] text-white rounded-2xl text-sm font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-blue-100 disabled:opacity-70 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
