import React, { useState } from 'react';
import { User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import LoadingScreen from '../../../shared/components/LoadingScreen';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { RegisteredPassenger } from '../types';

const UserIdentification: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const { fetchPassengerByLoginId, setRegisteredPassenger, error, isLoading } = useBookingStore();
  const [userId, setUserId] = useState('');

  // Auto-sync if user is logged in as Passenger
  React.useEffect(() => {
    if (authUser && authUser.role === 'Passenger') {
      const nameParts = authUser.name.split(' ');
      const firstname = nameParts[0] || '';
      const surname = nameParts.slice(1).join(' ') || '';
      
      const passengerData: RegisteredPassenger = {
        id: authUser.id,
        loginId: `PASS-${authUser.id.slice(0, 8)}`,
        title: 'Mr',
        firstname,
        surname,
        email: authUser.email,
        phone: authUser.phone || '',
        dateOfBirth: '',
        occupation: '',
        state: '',
        localGovernment: '',
        nationality: 'Nigerian',
        address: '',
        officePhone: '',
        nextOfKinName: '',
        nextOfKinPhone: '',
        nextOfKinAddress: '',
        nextOfKinRelationship: ''
      };
      
      setRegisteredPassenger(passengerData);
      navigate('/booking/select-seat');
    }
  }, [authUser, setRegisteredPassenger, navigate]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      const passenger = await fetchPassengerByLoginId(userId);
      if (passenger) {
        navigate('/booking/select-seat');
      }
    }
  };

  const handleNewUser = () => {
    navigate('/booking/passenger-details');
  };

  const handleBack = () => {
    navigate(-1);
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

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
