import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Basic print implementation - in real app would style @media print
    window.print();
  };

  const handleDownload = () => {
    // Generate simple text file content
    const content = `
TARIX BUS TICKET
----------------
Reference: MKD-LOS-20250214-B001-A01
Date: Nov 15, 2025
Time: 2:00 PM

PASSENGER:
Mr. Johnson Adebayo
+123-456-7890
johnson.adebayo@example.com

TRIP:
Lagos -> Ibadan
Seat: D4
Bus: Toyota Hiace 16
Price: ₦22,800
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tarix-ticket-MKD-LOS-20250214.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:absolute print:p-0 print:bg-white print:items-start" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:w-full print:h-auto print:overflow-visible"
        onClick={e => e.stopPropagation()}
        ref={contentRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 print:hidden">
          <h2 className="text-xl font-bold text-text-dark">Your TARIX Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Actions Bar */}
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E91E63] text-white rounded-lg font-bold text-sm hover:bg-[#D81B60] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-8 pt-2">
          <div className="border border-gray-100 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
            
            <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-6">BUS TICKET:</p>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-dark mb-1">Mr. Johnson Adebayo</h3>
              <p className="text-text-gray mb-1">+123-456-7890</p>
              <p className="text-text-gray mb-1">johnson.adebayo@example.com</p>
              <p className="text-text-gray">123 Anywhere St., Any City</p>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-4 mb-8 pb-8 border-b border-gray-100">
               <div>
                 <p className="text-sm text-text-gray mb-1">Date:</p>
                 <p className="font-bold text-text-dark">Nov 15, 2025</p>
               </div>
               <div>
                 <p className="text-sm text-text-gray mb-1">Invoice No:</p>
                 <p className="font-bold text-text-dark">LOS-IBD-20251115-B001-A12</p>
               </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4 mb-6">
              <div>
                <p className="text-xs text-text-gray mb-1">Route</p>
                <p className="font-bold text-text-dark text-lg">Lagos → Ibadan</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-gray mb-1">Seats</p>
                <p className="font-bold text-text-dark text-lg">D4</p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-4 mb-8 pb-8 border-b border-gray-200">
              <div>
                <p className="text-xs text-text-gray mb-1">Bus Type</p>
                <p className="font-bold text-text-dark">Toyota Hiace 16</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-gray mb-1">Trip Type</p>
                <p className="font-bold text-text-dark">One Way</p>
              </div>
            </div>

             <div className="flex justify-between items-end mb-8">
                <p className="text-xl font-bold text-text-dark">Total:</p>
                <p className="text-3xl font-bold text-text-dark">₦22,800</p>
             </div>

             <div className="bg-gray-50 rounded-xl p-4">
               <p className="text-sm font-bold text-text-dark mb-1">Bank Info</p>
               <p className="text-sm text-text-gray">Bank Name: Fauget</p>
               <p className="text-sm text-text-gray">Bank Account: 123-456-7890</p>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
