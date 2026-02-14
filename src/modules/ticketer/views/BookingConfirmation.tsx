import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const paymentMethod = state?.paymentMethod || 'manual';

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card':
        return 'Card Payment';
      case 'transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return 'Indigo Wallet';
    }
  };

  const handleConfirmPay = () => {
    // Logic for final payment processing
    // Simulate successful payment
    navigate('/booking/success');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="font-display font-extrabold text-xl tracking-tight">
            TARIX
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-text-dark">Confirm Payment</h1>
            <p className="text-sm text-text-gray">
              Step 4 of 4
            </p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-gray-200 h-2">
            <div className="bg-primary-blue h-2 transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 flex items-start justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-text-dark mb-1">
              Review Your Booking
            </h2>
            <p className="text-sm text-text-gray mb-8">
              Please review all details before confirming
            </p>

            {/* Trip Details */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-text-dark mb-4">Trip Details</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs text-text-gray mb-1">From</p>
                  <p className="font-bold text-text-dark">Lagos</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">To</p>
                  <p className="font-bold text-text-dark">Ibadan</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">Date</p>
                  <p className="font-bold text-text-dark">November 15, 2025</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">Time</p>
                  <p className="font-bold text-text-dark">2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

            {/* Passenger Details */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-text-dark mb-4">Passenger Details</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs text-text-gray mb-1">Name</p>
                  <p className="font-bold text-text-dark">Mr. Johnson Adebayo</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">Email</p>
                  <p className="text-sm text-text-dark">johnson.adebayo@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">Phone</p>
                  <p className="text-sm text-text-dark">+234 801 234 5678</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray mb-1">USER-ID</p>
                  <p className="text-sm text-text-dark">C1ANY7991</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

            {/* Seat & Bus */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-text-dark mb-4">Seat & Bus</h3>
              <div>
                <p className="text-xs text-text-gray mb-1">Seat</p>
                <p className="font-bold text-text-dark">A1</p>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

            {/* Price Breakdown */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-text-dark mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-text-gray">Ticket</p>
                  <p className="text-sm font-bold text-text-dark">₦19,000</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-text-gray">Service Fee</p>
                  <p className="text-sm font-bold text-text-dark">₦500</p>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <p className="text-base font-bold text-text-dark">Total</p>
                  <div className="text-right">
                     <p className="text-2xl font-bold text-text-dark">₦19,500</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

             {/* Payment Method */}
             <div className="mb-8">
              <h3 className="text-base font-bold text-text-dark mb-2">Payment Method</h3>
              <p className="font-medium text-text-dark">{getPaymentMethodLabel(paymentMethod)}</p>
            </div>


             <div className="space-y-4 pt-4">
              <button
                onClick={handleConfirmPay}
                className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-base hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-md"
              >
                Confirm & Pay
              </button>
              
              <button
                onClick={handleBack}
                className="w-full py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-base hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                Back
              </button>
            </div>

        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
