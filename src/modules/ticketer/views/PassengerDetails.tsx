import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, AlertCircle, Check } from 'lucide-react';
import logo from '../../../assets/images/logo.webp';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import { useBookingStore } from '../store/useBookingStore';

const PassengerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { registerPassenger, registeredPassenger, isLoading, error } = useBookingStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'Mr',
    surname: '',
    firstname: '',
    dateOfBirth: '',
    occupation: '',
    state: '',
    localGovernment: '',
    nationality: 'Nigerian',
    address: '',
    phone: '',
    officePhone: '',
    email: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinAddress: '',
    nextOfKinRelationship: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerPassenger(formData);
    if (result) {
        setShowSuccess(true);
    }
  };

  const handleFinalContinue = () => {
    navigate('/booking/select-seat');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Header */}
      <header className="bg-white border-b border-border-gray px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src={logo} alt="TARIX" className="h-8 w-auto" />
          <h1 className="text-lg font-bold text-text-dark">Passenger Information</h1>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-border-gray">
        <div className="max-w-5xl mx-auto px-6 py-2">
            <div className="flex justify-between text-xs font-medium text-text-gray mb-1">
                <span></span>
                <span>Step 1 of 5</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-blue w-[20%] rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl border border-border-gray shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-bold text-text-dark mb-6">Enter Passenger Details</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleContinue} className="space-y-6">
            {/* Row 1: Title & Surname */}
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Title</label>
                    <select 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors appearance-none"
                    >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Surname</label>
                    <input 
                        type="text" 
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Enter surname"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Other Names */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Other Names</label>
                <input 
                    type="text" 
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Enter other names"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    required
                />
            </div>

            {/* Date of Birth & Occupation */}
            <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Date of Birth</label>
                    <input 
                        type="date" 
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Occupation</label>
                    <input 
                        type="text" 
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Enter occupation"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
            </div>

             {/* State & LGA */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">State</label>
                    <input 
                        type="text" 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Local Government</label>
                    <input 
                        type="text" 
                        name="localGovernment"
                        value={formData.localGovernment}
                        onChange={handleChange}
                        placeholder="Enter local government"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
            </div>

             {/* Nationality */}
             <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Nationality</label>
                <input 
                    type="text" 
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Nigerian"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    required
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Address</label>
                <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    required
                />
            </div>

             {/* Phones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Mobile Phone</label>
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+234 801 234 5678"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        required
                    />
                </div>
                <div>
                     <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Office Phone (Optional)</label>
                    <input 
                        type="tel" 
                        name="officePhone"
                        value={formData.officePhone}
                        onChange={handleChange}
                        placeholder="+234 801 234 5678"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
            </div>

             {/* Email */}
             <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Email Address</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                />
            </div>

            <hr className="border-gray-100 my-6" />

             {/* Next of Kin Section */}
            <div>
                <h3 className="text-lg font-bold text-text-dark mb-4">Next of Kin Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Next of Kin</label>
                        <input 
                            type="text" 
                            name="nextOfKinName"
                            value={formData.nextOfKinName}
                            onChange={handleChange}
                            placeholder="Enter next of kin full name"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Phone Number</label>
                        <input 
                            type="tel" 
                            name="nextOfKinPhone"
                            value={formData.nextOfKinPhone}
                            onChange={handleChange}
                            placeholder="+234 801 234 5678"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Address/Tel of Next of Kin</label>
                        <input 
                            type="text" 
                            name="nextOfKinAddress"
                            value={formData.nextOfKinAddress}
                            onChange={handleChange}
                            placeholder="Enter next of kin address"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                            required
                        />
                    </div>
                      <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Relationship with Next of Kin</label>
                        <input 
                            type="text" 
                            name="nextOfKinRelationship"
                            value={formData.nextOfKinRelationship}
                            onChange={handleChange}
                            placeholder="e.g., Spouse, Parent, Sibling"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
                <button
                    type="submit"
                    
                    className="w-full bg-[#00C853] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#00A844] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
                >
                    Continue
                </button>
                <button
                    type="button"
                    onClick={handleBack}
                    className="w-full bg-white border border-primary-blue text-primary-blue py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 active:scale-[0.98] transition-all"
                >
                    Back
                </button>
            </div>

          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccess && registeredPassenger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-scale-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-8">Your unique Login ID has been generated. Use this for faster bookings in the future.</p>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 group">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Login ID</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-black text-primary-blue tracking-wider font-mono">
                    {registeredPassenger.loginId}
                  </span>
                  <button 
                    onClick={() => handleCopy(registeredPassenger.loginId)}
                    className={`p-2 rounded-lg transition-colors shadow-sm hover:shadow flex items-center gap-1 ${
                      isCopied ? 'bg-green-50 text-green-600' : 'hover:bg-white text-gray-400 hover:text-primary-blue'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold">Copied!</span>
                      </>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleFinalContinue}
                className="w-full bg-[#00C853] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#00A844] shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Proceed to Seat Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDetails;
