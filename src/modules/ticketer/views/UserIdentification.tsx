import React, { useState } from 'react';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from '@/shared/components/LoadingScreen';

const UserIdentification: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsLoading(true);
      // Simulate loading for next step
      setTimeout(() => {
        console.log('Proceeding with User ID:', userId);
        // Navigate to seat selection directly for existing users
        navigate('/booking/select-seat');
      }, 1500);
    }
  };

  const handleNewUser = () => {
    setIsLoading(true);
    setTimeout(() => {
        navigate('/booking/passenger-details');
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold text-primary-blue mb-2">TARIX</h1>
        <p className="text-text-gray text-sm">Enter your details to continue</p>
      </div>

      {/* Card */}
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-sm border border-border-gray p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-text-dark mb-2">User Identification</h2>
          <p className="text-sm text-text-gray">
            Please enter your User ID to proceed with your booking
          </p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium text-text-dark block">
              User ID
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray/50" />
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID"
                className="w-full pl-12 pr-4 py-3 bg-white border border-border-gray rounded-xl text-text-dark placeholder:text-text-gray/50 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Continue Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#00C853] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#00A844] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-text-gray">or</span>
              </div>
            </div>

            {/* New User Button */}
            <button
              type="button"
              onClick={handleNewUser}
              className="w-full py-3.5 bg-white border border-brand-blue-dark text-brand-blue-dark rounded-xl font-bold text-sm hover:bg-brand-blue-dark hover:text-white active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
            >
              I'm a New User
            </button>
          </div>
        </form>

        {/* Back Link */}
        <button
          onClick={handleBack}
          className="w-full mt-8 flex items-center justify-center gap-2 text-text-gray text-sm hover:text-text-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </button>
      </div>

      {/* Footer Text */}
      <p className="mt-8 text-xs text-center text-text-gray/60 max-w-sm">
        Your User ID can be found in your account settings or previous booking confirmations
      </p>
    </div>
  );
};

export default UserIdentification;
