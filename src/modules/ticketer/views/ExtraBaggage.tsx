import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExtraBaggage: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/booking/payment');
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
            <h1 className="text-xl font-bold text-text-dark">Extra Baggage</h1>
            {/* Keeping the trip info for context */}
            <p className="text-sm text-text-gray">
              Lagos → Ibadan | Nov 15, 2025 | 2:00 PM
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
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="max-w-[1000px] w-full space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weight Limits Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary-blue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-3">Weight Limits</h3>
              <p className="text-sm text-text-gray leading-relaxed">
                Each bag has a maximum weight limit. Exceeding limits may incur additional charges.
              </p>
            </div>

            {/* Fragile Items Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary-blue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-3">Fragile Items</h3>
              <p className="text-sm text-text-gray leading-relaxed">
                Declare fragile items for proper handling and insurance coverage.
              </p>
            </div>

            {/* Refund Policy Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary-blue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-3">Refund Policy</h3>
              <p className="text-sm text-text-gray leading-relaxed">
                Baggage charges are non-refundable unless the trip is cancelled.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-base hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-md"
            >
              Continue to Payment
            </button>
            
            <button
              onClick={handleBack}
              className="w-full py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-base hover:bg-blue-50 active:scale-[0.98] transition-all"
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
