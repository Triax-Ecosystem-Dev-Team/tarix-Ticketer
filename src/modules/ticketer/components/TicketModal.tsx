import React, { useRef, useState } from 'react';
import { X, Printer, Download, Loader2 } from 'lucide-react';
import { useBookingStore } from '../store/useBookingStore';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface OfficialBooking {
  id: string;
  totalPrice: number;
  paymentReference: string | null;
  paymentStatus: string;
  status: string;
  bookedSeats: string[];
  trip?: any;
  passenger?: any;
}

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  officialBooking?: OfficialBooking | null;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose, officialBooking }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Disconnect financial data from Zustand, but keep passenger/trip as fallback
  const { selectedTrip: storeTrip, registeredPassenger: storePassenger } = useBookingStore();

  if (!isOpen || !officialBooking) return null;

  // Single Source of Truth (SSOT) Mappings
  const total = officialBooking.totalPrice;
  const bookingReference = officialBooking.paymentReference || officialBooking.id;
  const seats = officialBooking.bookedSeats || [];
  
  // Use backend nested data if available, fallback to Zustand
  const trip = officialBooking.trip || storeTrip;
  const passenger = officialBooking.passenger || storePassenger;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!ticketRef.current || !officialBooking) return;
    
    try {
      setIsDownloading(true);
      
      // Capture the exact styled element
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2, // Higher resolution for crisp text
        useCORS: true,
        backgroundColor: '#ffffff', // Force white background
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions to preserve aspect ratio
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add a 10mm margin
      const margin = 10;
      const imgWidth = pdfWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save(`TARIX-Ticket-${officialBooking.id}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF ticket. Please try again or use the Print option.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:absolute print:inset-0 print:p-0 print:bg-white print:items-start" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:w-full print:h-auto print:overflow-visible"
        onClick={e => e.stopPropagation()}
        ref={contentRef}
      >
        {/* Header - Hidden during print */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 print:hidden">
          <h2 className="text-xl font-bold text-text-dark">Your TARIX Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Actions Bar - Hidden during print */}
        <div className="flex gap-4 p-6 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0095FF] text-white rounded-lg font-bold text-sm hover:bg-[#007ACC] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E91E63] text-white rounded-lg font-bold text-sm hover:bg-[#D81B60] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* Ticket Content - The element captured by html2canvas and printer */}
        <div className="p-8 pt-2 print:p-0">
          <div 
            ref={ticketRef} 
            className="border border-gray-100 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-0 bg-white"
          >
            
            <div className="flex justify-between items-start mb-6">
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider">BUS TICKET:</p>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${officialBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {officialBooking.status}
                </span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-text-dark mb-1 uppercase tracking-tight">{passenger?.title} {passenger?.firstname} {passenger?.surname}</h3>
              <p className="text-text-gray font-medium mb-1">{passenger?.phone}</p>
              <p className="text-text-gray mb-1">{passenger?.email}</p>
              <p className="text-text-gray">{passenger?.address}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-6 mb-8 pb-8 border-b border-gray-100">
               <div className="flex flex-wrap gap-x-12 gap-y-4">
                 <div>
                   <p className="text-sm text-text-gray mb-1 uppercase tracking-wider font-semibold">Date</p>
                   <p className="font-bold text-text-dark text-lg">{trip ? new Date(trip.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                 </div>
                 <div>
                   <p className="text-sm text-text-gray mb-1 uppercase tracking-wider font-semibold">Reference No.</p>
                   <p className="font-bold text-text-dark text-lg">{bookingReference}</p>
                 </div>
               </div>
               
               {/* QR Code Implementation */}
               <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm shrink-0 flex flex-col items-center">
                 <QRCodeCanvas 
                   value={bookingReference} 
                   size={100} 
                   level={"H"}
                   includeMargin={true}
                 />
                 <span className="text-[10px] text-gray-400 font-medium mt-1">SCAN AT TERMINAL</span>
               </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4 mb-6">
              <div>
                <p className="text-xs text-text-gray mb-1 uppercase tracking-wider font-semibold">Route</p>
                <p className="font-bold text-text-dark text-xl">{trip?.departureTerminal} → {trip?.arrivalTerminal}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-gray mb-1 uppercase tracking-wider font-semibold">Seats</p>
                <p className="font-black text-primary-blue text-xl">{seats.join(', ')}</p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4 mb-8 pb-8 border-b border-gray-200">
              <div>
                <p className="text-xs text-text-gray mb-1 uppercase tracking-wider font-semibold">Bus Model</p>
                <p className="font-bold text-text-dark">{trip?.busModel?.name || trip?.bus?.busModel?.name || 'Standard'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-gray mb-1 uppercase tracking-wider font-semibold">Time</p>
                <p className="font-bold text-text-dark">{trip?.departureTime}</p>
              </div>
            </div>

             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-text-gray uppercase tracking-wider font-semibold mb-1">Payment Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${officialBooking.paymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <p className={`font-bold uppercase tracking-wider ${officialBooking.paymentStatus === 'completed' ? 'text-green-700' : 'text-yellow-700'}`}>
                      {officialBooking.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="text-right w-full sm:w-auto">
                  <p className="text-sm text-text-gray uppercase tracking-wider font-semibold mb-1">Total Paid</p>
                  <p className="text-4xl font-black text-[#00A97C]">₦{total.toLocaleString()}</p>
                </div>
             </div>

             <div className="bg-gray-900 rounded-xl p-5 text-white">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Important Information</p>
               <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                 <li>Please arrive at the terminal at least 90 minutes before departure.</li>
                 <li>Present this QR code to the terminal staff for rapid boarding.</li>
                 <li>Valid ID matching the passenger name is required.</li>
               </ul>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
