import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import { Plus, Minus, Info } from 'lucide-react';

const ExtraBaggage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    extraBaggageCount, incrementBaggage, decrementBaggage,
    extraBaggagePrice, isFetchingBaggagePrice, fetchBaggagePrice,
    selectedTrip
  } = useBookingStore();

  useEffect(() => {
    fetchBaggagePrice();
  }, [fetchBaggagePrice]);

  const handleContinue = () => {
    navigate('/booking/payment');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const totalBaggageFee = extraBaggageCount * extraBaggagePrice;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="font-display font-extrabold text-xl tracking-tight">
            TARIX
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-text-dark">Extra Baggage</h1>
            {/* Keeping the trip info for context */}
            <p className="text-sm text-text-gray">
              {selectedTrip?.departureTerminal} → {selectedTrip?.arrivalTerminal} | {selectedTrip ? new Date(selectedTrip.departureDate).toLocaleDateString() : ''} | {selectedTrip?.departureTime}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-gray-200 h-2">
            <div className="bg-primary-blue h-2 transition-all duration-500" style={{ width: '50%' }}></div>
          </div>
          <div className="flex justify-end px-6 py-2">
            <p className="text-xs text-text-gray font-medium">Step 2 of 4</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center py-12">
        <div className="max-w-2xl w-full space-y-8">
          
          {/* Baggage Selector Card */}
          <div className="bg-white rounded-3xl border border-border-gray shadow-sm p-8 md:p-10">
            <h2 className="text-2xl font-bold text-text-dark mb-2">Need extra luggage space?</h2>
            <p className="text-text-gray mb-8">Each passenger is allowed one standard bag. Purchase extra baggage slots below if you have more.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4 mb-6 sm:mb-0">
                <div className="w-16 h-16 bg-blue-100 text-primary-blue rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text-dark">Extra Baggage</h3>
                  {isFetchingBaggagePrice ? (
                    <div className="h-5 w-24 bg-blue-100/50 animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-sm font-medium text-text-gray">₦{extraBaggagePrice.toLocaleString()} per unit</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5">
                <button 
                  onClick={decrementBaggage}
                  disabled={extraBaggageCount === 0}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 text-text-gray hover:border-primary-blue hover:text-primary-blue disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-text-gray transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-3xl font-black text-text-dark w-8 text-center">{extraBaggageCount}</span>
                <button 
                  onClick={incrementBaggage}
                  className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-primary-blue bg-primary-blue text-white hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
              <span className="text-text-gray font-medium">Baggage Subtotal:</span>
              <span className="text-2xl font-black text-primary-blue">
                ₦{totalBaggageFee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
            <Info className="w-6 h-6 text-primary-blue flex-shrink-0" />
            <div>
              <h4 className="font-bold text-primary-blue mb-1">Important Notice</h4>
              <p className="text-sm text-blue-900/80 leading-relaxed">
                Weight limits apply. Fragile items must be declared at the terminal. Baggage fees are non-refundable unless the trip itself is cancelled.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-lg hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
              Continue to Payment
            </button>
            
            <button
              onClick={handleBack}
              className="w-full py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-lg hover:bg-blue-50 active:scale-[0.98] transition-all"
            >
              Back to Passenger Details
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ExtraBaggage;
