import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import { Loader2, AlertCircle, CheckCircle2, Ticket, Bus, User, MapPin, Calendar, CreditCard, Luggage } from 'lucide-react';
import api from '../../../shared/api';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const storePaymentMethod = useBookingStore((state) => state.paymentMethod);
  const paymentMethod = state?.paymentMethod || storePaymentMethod || 'cash';
  
  const { 
    selectedTrip, 
    selectedSeats, 
    registeredPassenger, 
    extraBaggageCount, 
    getBookingTotals
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Strict TDA Adherence: Consume pre-calculated totals from store
  const { subtotal, baggageCost, serviceFee, total } = getBookingTotals();

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'card': return 'Card Payment';
      case 'transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      default: return 'Indigo Wallet';
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!selectedTrip || !registeredPassenger) {
        throw new Error('Missing critical booking information. Please restart the booking process.');
      }

      // Exact JSON payload expected by the backend
      const payload = {
        tripId: selectedTrip.id,
        passengerId: registeredPassenger.id,
        requestedSeats: selectedSeats,
        totalPrice: total,
        hasExtraBaggage: extraBaggageCount > 0,
        extraBaggage: extraBaggageCount,
        paymentMethod: paymentMethod
      };

      // API request with JWT injected automatically by our interceptor
      const response = await api.post('/bookings', payload);

      if (response.data.success || response.status === 201) {
        navigate('/booking/success');
      }
    } catch (error: any) {
      console.error('Booking submission failed:', error);
      
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      // Enterprise Error Handling: Race Condition / Seat Taken
      if (status === 409 || status === 400) {
        const warning = backendMessage || "Sorry, one of your selected seats was just booked by someone else.";
        setErrorMsg(`Seat Conflict: ${warning}`);
        
        // Auto-navigate after a short delay so the user can read the message
        setTimeout(() => {
          navigate('/booking/select-seat', { 
            state: { error: warning },
            replace: true
          });
        }, 3500);
      } else {
        setErrorMsg(backendMessage || "An unexpected error occurred while confirming your booking. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1000px] mx-auto flex justify-between items-center">
          <div className="font-display font-extrabold text-2xl tracking-tight text-primary-blue flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#00A97C]" />
            TARIX
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold text-gray-900">Confirm Payment</h1>
            <p className="text-sm text-gray-500 font-medium">Step 4 of 4</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto">
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00A97C] h-full transition-all duration-500 ease-out" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 flex items-start justify-center">
        <div className="w-full max-w-[800px] bg-white rounded-2xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-bl-full -z-10 pointer-events-none" />

            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Review Your Booking
              </h2>
              <p className="text-base text-gray-500 font-medium">
                Please verify all details before confirming your ticket.
              </p>
            </div>

            {/* Error Notification Toast (In-component) */}
            {errorMsg && (
              <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 mb-1">Booking Failed</h4>
                  <p className="text-sm text-red-600 leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Column: Details */}
              <div className="space-y-8">
                {/* Trip Details */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary-blue" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Trip Overview</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">From</p>
                        <p className="font-bold text-gray-900">{selectedTrip?.departureTerminal}</p>
                      </div>
                      <div className="px-4 text-gray-300">
                        <Bus className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">To</p>
                        <p className="font-bold text-gray-900">{selectedTrip?.arrivalTerminal}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between">
                       <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Date</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {selectedTrip ? new Date(selectedTrip.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Time</p>
                        <p className="font-semibold text-gray-900">{selectedTrip?.departureTime}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Passenger Details */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <User className="w-4 h-4 text-[#00A97C]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Passenger Info</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Name</p>
                      <p className="font-bold text-gray-900">{registeredPassenger?.title} {registeredPassenger?.firstname} {registeredPassenger?.surname}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
                      <p className="font-medium text-gray-900">{registeredPassenger?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                      <p className="font-medium text-gray-900 break-all">{registeredPassenger?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">USER-ID</p>
                      <p className="font-mono font-bold text-primary-blue bg-blue-50 py-0.5 px-2 rounded inline-block">{registeredPassenger?.loginId}</p>
                    </div>
                  </div>
                </section>
                
                {/* Seating & Extras */}
                <section>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Seats Selected</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                          <span key={seat} className="bg-primary-blue text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                       <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                         <Luggage className="w-3.5 h-3.5" /> Extra Baggage
                       </p>
                       <p className="font-bold text-gray-900">{extraBaggageCount} {extraBaggageCount === 1 ? 'Unit' : 'Units'}</p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Receipt */}
              <div>
                <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl h-full flex flex-col relative overflow-hidden">
                  
                  {/* Decorative Ticket Circles */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full -translate-y-1/2"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2"></div>
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    Payment Summary
                  </h3>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-800/60">
                      <span className="text-gray-400 font-medium">Tickets ({selectedSeats.length})</span>
                      <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {baggageCost > 0 && (
                      <div className="flex justify-between items-center pb-4 border-b border-gray-800/60">
                        <span className="text-gray-400 font-medium">Extra Baggage</span>
                        <span className="font-semibold">₦{baggageCost.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pb-4 border-b border-gray-800/60">
                      <span className="text-gray-400 font-medium">Service Fee</span>
                      <span className="font-semibold text-gray-300">₦{serviceFee.toLocaleString()}</span>
                    </div>

                    <div className="pt-2">
                       <p className="text-sm text-gray-400 font-medium mb-1">Payment Method</p>
                       <div className="flex items-center gap-2">
                         <CheckCircle2 className="w-4 h-4 text-[#00A97C]" />
                         <span className="font-semibold">{getPaymentMethodLabel(paymentMethod)}</span>
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-gray-700">
                    <div className="flex justify-between items-end mb-8">
                      <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Grand Total</span>
                      <span className="text-3xl font-black text-[#00A97C]">
                        ₦{total.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={isLoading}
                      className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-lg hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(0,169,124,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-[#00A97C] disabled:active:scale-100 disabled:shadow-none relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Confirm & Pay'
                        )}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleBack}
                      disabled={isLoading}
                      className="w-full mt-3 py-3 bg-transparent text-gray-300 rounded-xl font-bold text-sm hover:text-white hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      Go Back to Edit
                    </button>
                  </div>
                </div>
              </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default BookingConfirmation;
