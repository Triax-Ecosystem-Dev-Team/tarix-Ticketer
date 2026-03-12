import { useState } from 'react';
import { 
  User, Lock, Key, Shield, 
  Globe, Bell, Sun, Mail, 
  Building, CreditCard, Users, Code,
  Activity, Info, HelpCircle, 
  Upload, Trash2, X
} from 'lucide-react';

export default function Settings() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10">
      {/* Header Section */}
      <div className="bg-[#0ea5e9] -mx-4 sm:-mx-6 -mt-8 px-4 sm:px-6 pt-12 pb-10 mb-8 relative">
        <div className="flex justify-between items-start mb-1">
          <div className="text-white/80 text-sm font-medium">
            Dashboard &gt; Settings
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
            <p className="text-white/90 text-[15px] font-medium max-w-md leading-relaxed">
              Manage your account and preferences
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <Activity className="w-4 h-4 text-white" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider leading-tight">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse"></div>
                <span className="text-[12px] text-white/90">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-12 flex flex-col gap-10">
        
        {/* ── Account Section ── */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1e293b] mb-1">Account</h2>
            <p className="text-[13.5px] text-slate-500">Manage your account security and personal information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <User className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Profile Settings</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Manage your personal information and account details.</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-[#ec4899]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Account Security</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Update password and security settings</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <Key className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Change Password</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Update your account password</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left relative">
              <div className="absolute top-6 right-6">
                <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">Enabled</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Two-Factor Authentication</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Add an extra layer of security to your account</p>
            </button>
          </div>
        </div>

        {/* ── Preferences Section ── */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1e293b] mb-1">Preferences</h2>
            <p className="text-[13.5px] text-slate-500">Customize your dashboard experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Language & Region</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Set your preferred language and regional settings</p>
            </button>
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left relative"
            >
              <div className="absolute top-6 right-6">
                <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">On</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mb-4">
                <Bell className="w-5 h-5 text-[#ec4899]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Notifications</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Manage email, SMS, and push notification preferences</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <Sun className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Theme</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Choose between light, dark, or system theme</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Email Preferences</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Configure your email notification settings</p>
            </button>
          </div>
        </div>

        {/* ── Business Section ── */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#1e293b] mb-1">Business</h2>
            <p className="text-[13.5px] text-slate-500">Configure business settings and integrations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Building className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Company Profile</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Manage your company information and branding</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left relative">
              <div className="absolute top-6 right-6">
                <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">Active</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5 text-[#ec4899]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Billing & Subscription</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">View and manage your subscription and billing</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left relative">
              <div className="absolute top-6 right-6">
                <span className="bg-slate-200 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">3 members</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">Team Members</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Add and manage team members and permissions</p>
            </button>
            <button className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:border-[#0ea5e9]/30 hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Code className="w-5 h-5 text-[#10b981]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1e293b] mb-1.5">API Keys</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">Generate and manage API keys for integrations</p>
            </button>
          </div>
        </div>

        {/* ── System Information Footer ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-4">
          <h2 className="text-lg font-bold text-[#1e293b] mb-6">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Info className="w-5 h-5 text-[#0ea5e9]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1e293b] mb-1">Version</p>
                <p className="text-[13px] text-slate-500">TARIX Manager v2.0.0</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-green-50 rounded-xl">
                <Activity className="w-5 h-5 text-[#10b981]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1e293b] mb-1">System Status</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                  <p className="text-[13px] text-[#10b981]">Operational</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <HelpCircle className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1e293b] mb-1">Support</p>
                <a href="#" className="text-[13px] text-[#0ea5e9] hover:underline font-medium">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      
      {/* Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#1e293b]">Profile Settings</h2>
              <button onClick={() => setShowProfileModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-4">Profile Picture</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                      JM
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#0ea5e9] text-[#0ea5e9] rounded-xl text-[14px] font-medium hover:bg-blue-50 transition-colors">
                        <Upload className="w-4 h-4" /> Change Picture
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#ef4444] rounded-xl text-[14px] font-medium hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">Full Name <span className="text-[#ef4444]">*</span></label>
                    <input type="text" defaultValue="John Manager" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">Email <span className="text-[#ef4444]">*</span></label>
                    <input type="email" defaultValue="john@tarix.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">Phone Number</label>
                    <input type="tel" defaultValue="+234 801 234 5678" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all text-slate-500" />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">Company Name</label>
                    <input type="text" defaultValue="TARIX Transport" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">Country <span className="text-[#ef4444]">*</span></label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all">
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">State/Region <span className="text-[#ef4444]">*</span></label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all">
                      <option>Lagos</option>
                      <option>Abuja</option>
                      <option>Rivers</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[13.5px] font-medium text-[#1e293b] mb-2">City</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all">
                    <option>Lagos</option>
                    <option>Ikeja</option>
                    <option>Victoria Island</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowProfileModal(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14px] font-bold hover:bg-[#0284c7] transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#1e293b]">Notification Preferences</h2>
              <button onClick={() => setShowNotificationModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-8">
                
                {/* Email Notifications */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-[#1e293b]">Email Notifications</h3>
                    <p className="text-[13px] text-slate-500">Receive email updates about your account</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Trip Updates</p>
                        <p className="text-[13px] text-slate-500">Get notified about trip status changes</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Revenue Reports</p>
                        <p className="text-[13px] text-slate-500">Daily/weekly revenue summaries</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Driver Updates</p>
                        <p className="text-[13px] text-slate-500">Notifications about driver activities</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* In-App Notifications */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-[#1e293b]">In-App Notifications</h3>
                    <p className="text-[13px] text-slate-500">Receive notifications within the dashboard</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Critical Alerts</p>
                        <p className="text-[13px] text-slate-500">System errors and critical issues</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Trip Alerts</p>
                        <p className="text-[13px] text-slate-500">Real-time trip notifications</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Marketing Updates</p>
                        <p className="text-[13px] text-slate-500">New features and promotions</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-slate-200">
                        <span className="absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-all shadow-sm"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* SMS Notifications */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-[#1e293b]">SMS Notifications</h3>
                    <p className="text-[13px] text-slate-500">Receive SMS alerts to your phone</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Urgent Alerts</p>
                        <p className="text-[13px] text-slate-500">Critical system alerts via SMS</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between group">
                      <div>
                        <p className="text-[14px] font-medium text-[#1e293b]">Trip Confirmations</p>
                        <p className="text-[13px] text-slate-500">Trip booking confirmations</p>
                      </div>
                      <div className="relative inline-block w-11 h-6 cursor-pointer rounded-full bg-[#0ea5e9]">
                        <span className="absolute top-[2px] left-[22px] bg-white w-5 h-5 rounded-full transition-all"></span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => setShowNotificationModal(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14px] font-bold hover:bg-[#0284c7] transition-colors shadow-sm">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
