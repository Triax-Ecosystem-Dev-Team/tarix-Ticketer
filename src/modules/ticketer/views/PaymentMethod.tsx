import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, Building2, CheckCircle2, MapPin, Calendar, Users, Briefcase } from 'lucide-react';
import { useBookingStore } from '../store/useBookingStore';

const PaymentMethod: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedTrip, selectedSeats, registeredPassenger, 
    extraBaggageCount, user,
    paymentMethod, setPaymentMethod, getBookingTotals
  } = useBookingStore();

  const { subtotal, baggageCost, serviceFee, total } = getBookingTotals() as any;

  const handleProceed = () => {
    // Principal Architect Note: Persisting choice in store, not router state.
    navigate('/booking/confirmation');
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
          
          {/* Booking Overview - Order 1 on mobile, Order 2 on desktop */}
          <div className="order-1 lg:order-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-fit lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-text-dark mb-8 flex items-center gap-2">
              Booking Overview
            </h2>

            <div className="space-y-6">
              {/* Route & Time */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="mt-1 bg-primary-blue/10 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-text-dark text-base leading-tight">
                      {selectedTrip?.departureTerminal} → {selectedTrip?.arrivalTerminal}
                    </p>
                    <p className="text-sm font-medium text-text-gray mt-1">
                      {selectedTrip?.busModel?.name || 'Standard Bus'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary-blue/10 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">
                      {selectedTrip ? new Date(selectedTrip.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </p>
                    <p className="text-xs font-medium text-text-gray">{selectedTrip?.departureTime}</p>
                  </div>
                </div>
              </div>

              {/* Selection Details */}
              <div className="space-y-4 px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-text-gray" />
                    <span className="text-sm font-medium text-text-gray">Seats</span>
                  </div>
                  <div className="flex gap-1.5">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="px-2 py-0.5 bg-blue-100 text-primary-blue text-xs font-bold rounded-md">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-text-gray" />
                    <span className="text-sm font-medium text-text-gray">Extra Baggage</span>
                  </div>
                  <span className="text-sm font-bold text-text-dark">{extraBaggageCount} unit(s)</span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3">Passenger Information</p>
                  <p className="text-base font-bold text-text-dark">
                    {registeredPassenger?.title} {registeredPassenger?.firstname} {registeredPassenger?.surname}
                  </p>
                  <p className="text-sm text-text-gray mt-0.5">{registeredPassenger?.phone}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray font-medium">Subtotal ({selectedSeats.length} seats)</span>
                  <span className="text-text-dark font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray font-medium">Baggage Fee</span>
                  <span className="text-text-dark font-bold">₦{baggageCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-gray font-medium">Service Fee</span>
                  <span className="text-text-dark font-bold">₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-base font-bold text-text-dark">Grand Total</span>
                  <span className="text-3xl font-black text-primary-blue">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options - Order 2 on mobile, Order 1 on desktop */}
          <div className="order-2 lg:order-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-200 h-fit">
            <h2 className="text-xl font-bold text-text-dark mb-6">
              Select Payment Method
            </h2>

            <div className="space-y-4">
              {/* Cash */}
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  paymentMethod === 'cash'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     paymentMethod === 'cash' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
                  }`}>
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-text-dark text-lg">Cash</p>
                    <p className="text-sm font-medium text-[#00C853]">
                      Balance: ₦{user?.walletBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
                {paymentMethod === 'cash' && (
                  <CheckCircle2 className="w-6 h-6 text-primary-blue" />
                )}
              </button>

              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  paymentMethod === 'card'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     paymentMethod === 'card' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
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
                {paymentMethod === 'card' && (
                  <CheckCircle2 className="w-6 h-6 text-primary-blue" />
                )}
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => setPaymentMethod('transfer')}
                className={`w-full p-6 rounded-xl border-2 flex items-center justify-between transition-all group ${
                  paymentMethod === 'transfer'
                    ? 'border-primary-blue bg-blue-50/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                     paymentMethod === 'transfer' ? 'bg-primary-blue text-white' : 'bg-gray-100 text-text-gray'
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
                {paymentMethod === 'transfer' && (
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
        </div>
      </main>
    </div>
  );
};

export default PaymentMethod;
