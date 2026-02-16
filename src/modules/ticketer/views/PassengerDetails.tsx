import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo.webp';
import LoadingScreen from '../../../shared/components/LoadingScreen';

const PassengerDetails: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call/processing
    setTimeout(() => {
        // Navigate to next step (e.g., Seat Selection)
        navigate('/booking/select-seat'); 
        console.log('Navigate to next step');
        setIsLoading(false); 
    }, 1500);
  };

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(-1);
    }, 1500);
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

          <form onSubmit={handleContinue} className="space-y-6">
            {/* Row 1: Title & Surname */}
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Title</label>
                    <select className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors appearance-none">
                        <option>Mr</option>
                        <option>Mrs</option>
                        <option>Miss</option>
                        <option>Dr</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Surname</label>
                    <input 
                        type="text" 
                        placeholder="Enter surname"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
            </div>

            {/* Other Names */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Other Names</label>
                <input 
                    type="text" 
                    placeholder="Enter other names"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                />
            </div>

            {/* Date of Birth & Occupation */}
            <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Date of Birth</label>
                    <input 
                        type="date" 
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Occupation</label>
                    <input 
                        type="text" 
                        placeholder="Enter occupation"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
            </div>

             {/* State & LGA */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">State</label>
                    <input 
                        type="text" 
                        placeholder="Enter state"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Local Government</label>
                    <input 
                        type="text" 
                        placeholder="Enter local government"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
            </div>

             {/* Nationality */}
             <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Nationality</label>
                <input 
                    type="text" 
                    placeholder="Nigerian"
                    defaultValue="Nigerian"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Address</label>
                <input 
                    type="text" 
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                />
            </div>

            {/* Phones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Mobile Phone</label>
                    <input 
                        type="tel" 
                        placeholder="+234 801 234 5678"
                        className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                    />
                </div>
                <div>
                     <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Office Phone (Optional)</label>
                    <input 
                        type="tel" 
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
                            placeholder="Enter next of kin full name"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Phone Number</label>
                        <input 
                            type="tel" 
                            placeholder="+234 801 234 5678"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Address/Tel of Next of Kin</label>
                        <input 
                            type="text" 
                            placeholder="Enter next of kin address"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
                        />
                    </div>
                      <div>
                        <label className="block text-xs font-bold text-text-dark mb-1.5 ml-1">Relationship with Next of Kin</label>
                        <input 
                            type="text" 
                            placeholder="e.g., Spouse, Parent, Sibling"
                            className="w-full px-4 py-3 bg-white border border-border-gray rounded-xl text-sm text-text-dark placeholder:text-text-gray focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors"
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
    </div>
  );
};

export default PassengerDetails;
