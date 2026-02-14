import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, Building2, CheckCircle2 } from 'lucide-react';

type PaymentMethodType = 'cash' | 'card' | 'transfer';

const PaymentMethod: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('cash');

  const handleProceed = () => {
    // Navigate to confirmation with selected method
    navigate('/booking/confirmation', { state: { paymentMethod: selectedMethod } });
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
            <h1 className="text-xl font-bold text-text-dark">Payment Method</h1>
            <p className="text-sm text-text-gray">
              Step 3 of 4
            </p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <div className="w-full bg-gray-200 h-2">
            <div className="bg-primary-blue h-2 transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          
          {/* Left: Payment Options */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-text-dark mb-6">
              Select Payment Method
            </h2>

            <div className="space-y-4">
              {/* Cash */}
              <button
                onClick={() => setSelectedMethod('cash')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  selectedMethod === 'cash'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     selectedMethod === 'cash' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-text-dark text-lg">Cash</p>
                    <p className="text-sm font-medium text-[#00C853]">
                      Balance: ₦1,000,000.00
                    </p>
                  </div>
                </div>
                {selectedMethod === 'cash' && (
                  <CheckCircle2 className="w-6 h-6 text-primary-blue" />
                )}
              </button>

              {/* Card Payment */}
              <button
                onClick={() => setSelectedMethod('card')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  selectedMethod === 'card'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     selectedMethod === 'card' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-text-dark text-lg">Card Payment</p>
                    <p className="text-sm text-text-gray">
                      Pay with debit or credit card
                    </p>
                  </div>
                </div>
                {selectedMethod === 'card' && (
                  <CheckCircle2 className="w-6 h-6 text-primary-blue" />
                )}
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => setSelectedMethod('transfer')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  selectedMethod === 'transfer'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     selectedMethod === 'transfer' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-text-dark text-lg">Bank Transfer</p>
                    <p className="text-sm text-text-gray">
                      Transfer directly to our account
                    </p>
                  </div>
                </div>
                {selectedMethod === 'transfer' && (
                  <CheckCircle2 className="w-6 h-6 text-primary-blue" />
                )}
              </button>
            </div>

            <div className="space-y-4 mt-8">
              <button
                onClick={handleProceed}
                className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-base hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-md"
              >
                Proceed to Payment
              </button>
              
              <button
                onClick={handleBack}
                className="w-full py-4 bg-white border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-base hover:bg-blue-50 active:scale-[0.98] transition-all"
              >
                Back
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-text-dark mb-6">
              Order Summary
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-text-dark">Lagos → Ibadan</p>
                </div>
                <p className="text-sm text-text-gray">
                  Nov 15, 2025 at 2:00 PM
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-sm text-text-gray">
                  Seat: <span className="font-medium text-text-dark">A1</span>
                </p>
                <p className="text-sm text-text-gray">
                  Passenger: <span className="font-medium text-text-dark">Mr. Johnson Adebayo</span>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-text-gray">Subtotal</p>
                  <p className="text-sm font-bold text-text-dark">₦19,000</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-text-gray">Service Fee</p>
                  <p className="text-sm font-medium text-text-gray">₦500</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-text-gray">Baggage Cost</p>
                  <p className="text-sm font-medium text-text-gray">₦0</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <p className="text-lg font-bold text-text-dark">Total</p>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-text-dark">₦19,500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PaymentMethod;
