import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Download, Printer, Search, CheckCircle2 } from 'lucide-react';
import TicketModal from '../components/TicketModal';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const bookingReference = 'MKD-LOS-20250214-B001-A01';
  const [copied, setCopied] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const handleCopyReference = () => {
    navigator.clipboard.writeText(bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearchAnother = () => {
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 print:min-h-0 print:p-0 print:block print:bg-white">
      <TicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
      />
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden print:hidden">
        
        <div className="p-12 pb-8 text-center">
          <div className="w-20 h-20 bg-[#00C853] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </div>
          
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-text-gray text-lg">
            Your ticket has been booked successfully
          </p>
        </div>

        <div className="px-12 pb-12 space-y-8">
          {/* Booking Reference Card */}
          <div className="bg-[#00C853]/5 border border-[#00C853] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold text-[#004D40] mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-primary-blue bg-clip-text">
                {bookingReference}
              </p>
              <p className="text-xs text-[#004D40]/70 mt-1">
                Save this reference for your records
              </p>
            </div>
            <button
              onClick={handleCopyReference}
              className="p-3 hover:bg-[#00C853]/10 rounded-xl transition-colors text-primary-blue relative group"
              title="Copy Reference"
            >
              {copied ? (
                <div className="flex flex-col items-center">
                   <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
                   <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded shadow-lg">Copied!</span>
                </div>
              ) : (
                <Copy className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Ticket Details */}
          <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
            <h2 className="text-lg font-bold text-text-dark mb-6">Ticket Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-gray">Trip</p>
                <p className="font-bold text-text-dark">Lagos → Ibadan</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-gray">Date & Time</p>
                <p className="text-sm font-medium text-text-dark">Nov 15, 2025 at 2:00 PM</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-gray">Passenger</p>
                <p className="text-sm font-bold text-text-dark">Mr. Johnson Adebayo</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-gray">Seat</p>
                <p className="font-bold text-text-dark">A1</p>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-end">
                <p className="font-bold text-text-dark">Total Paid</p>
                <div className="text-right">
                  <p className="text-xl font-bold text-text-dark">₦19,500</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
           <div>
            <h3 className="font-bold text-text-dark mb-4">What's Next?</h3>
            <div className="space-y-4">
               <div className="flex gap-4 items-start icon-list-item">
                 <div className="w-6 h-6 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                 <p className="text-sm text-text-gray">Check your email for ticket details</p>
               </div>
               <div className="flex gap-4 items-start icon-list-item">
                 <div className="w-6 h-6 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                 <p className="text-sm text-text-gray">Arrive 90 minutes before departure</p>
               </div>
               <div className="flex gap-4 items-start icon-list-item">
                 <div className="w-6 h-6 rounded-full bg-primary-blue text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                 <p className="text-sm text-text-gray">Show your booking reference at the terminal</p>
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button 
              onClick={() => setIsTicketModalOpen(true)}
              className="w-full py-3.5 border border-primary-blue text-primary-blue rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Ticket
            </button>
            
            <button 
              onClick={() => setIsTicketModalOpen(true)}
              className="w-full py-3.5 border border-primary-blue text-primary-blue rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
               <Printer className="w-4 h-4" />
              Print Ticket
            </button>

             <button
              onClick={handleSearchAnother}
              className="w-full py-4 bg-[#00A97C] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-[#008F68] active:scale-[0.98] transition-all shadow-md mt-4"
            >
              <Search className="w-5 h-5" />
              Search for another trip
            </button>
          </div>

          <div className="text-center pt-4">
            <a href="#" className="text-sm text-primary-blue hover:underline">
              Need help? Contact support@tarix.ng
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
