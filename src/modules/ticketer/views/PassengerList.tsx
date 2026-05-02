import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Download, Loader2, Users } from 'lucide-react';
import { useDispatchStore } from '../store/useDispatchStore';
import EscapeHatch from '../../../shared/components/layout/EscapeHatch';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PassengerList: React.FC = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    buses,
    fetchFleetStatus,
    passengers,
    isLoadingPassengers,
    fetchTripPassengers,
  } = useDispatchStore();

  const bus = buses.find(b => b.id === busId);

  // 1. If we landed here directly (store is cold), re-hydrate the fleet
  useEffect(() => {
    if (buses.length === 0) {
      fetchFleetStatus();
    }
  }, [buses.length, fetchFleetStatus]);

  // 2. Fetch real passenger manifest from the backend
  useEffect(() => {
    if (busId) {
      fetchTripPassengers(busId);
    }
  }, [busId, fetchTripPassengers]);

  const handleExportPDF = () => {
    if (!bus) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 149, 255); // Tarix Blue
    doc.text('TARIX DISPATCH MANIFEST', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
    
    // Trip Details Card
    doc.setDrawColor(0, 149, 255);
    doc.setLineWidth(0.5);
    doc.line(15, 35, 195, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Trip ID: ${bus.id}`, 15, 45);
    doc.text(`Driver: ${bus.driver}`, 195, 45, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Route: ${bus.origin} to ${bus.destination}`, 15, 52);
    doc.text(`Departure: ${bus.departureTime}`, 15, 59);
    doc.text(`Total Passengers: ${passengers.length}`, 195, 59, { align: 'right' });
    
    doc.line(15, 65, 195, 65);
    
    // Table
    const tableColumn = ["#", "Passenger Name", "Seat Number", "Phone", "User ID"];
    const tableRows = passengers.map((p, i) => [
      i + 1,
      p.fullName,
      p.seatNumber,
      p.phone,
      p.userId
    ]);
    
    autoTable(doc, {
      startY: 75,
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [0, 149, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 75 },
      styles: { fontSize: 9 }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
        doc.text('Tarix Global Ticketing System - Secure Dispatch Service', 105, 290, { align: 'center' });
    }
    
    doc.save(`manifest_${bus.id}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // 3. Client-side search filter
  const filteredPassengers = passengers.filter(p =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading / not-found guard
  if (!bus) {
    return (
      <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        {buses.length === 0
          ? <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-4" />
          : null
        }
        <p className="text-gray-500 font-medium">
          {buses.length === 0 ? 'Loading bus details...' : 'Bus not found'}
        </p>
        <button
          onClick={() => navigate('/bus-status')}
          className="mt-4 text-primary-blue hover:underline text-sm font-bold"
        >
          Return to Dispatch
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative mt-6">
      <div className="max-w-[1200px] mx-auto px-6">
        <EscapeHatch to="/bus-status" label="Back to Bus Status" />

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-dark mb-1">
              Passenger List — <span className="text-gray-400">{bus.id}</span>
            </h1>
            <p className="text-gray-500 text-sm">Live passenger manifest for this trip</p>
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-100 active:scale-95"
          >
            <Download className="w-4 h-4" /> Generate Manifest
          </button>
        </div>

        {/* Bus Summary Card */}
        <div className="bg-white rounded-xl border border-primary-blue/30 p-6 mb-8 flex flex-wrap gap-10 items-center shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ROUTE</p>
            <p className="text-lg font-bold text-text-dark">{bus.origin} → {bus.destination}</p>
            <p className="text-xs text-gray-400 mt-0.5">{bus.originTerminal}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DEPARTURE</p>
            <p className="text-lg font-bold text-text-dark">{bus.departureTime}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DRIVER</p>
            <p className="text-lg font-bold text-text-dark">{bus.driver}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">PASSENGERS</p>
            <p className="text-3xl font-bold text-primary-blue">{bus.passengersBooked}</p>
            <p className="text-xs text-gray-400 mt-0.5">of {bus.totalSeats} seats</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-blue" />
            <input
              type="text"
              placeholder="Search by name, seat, phone, or user ID..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Passenger Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoadingPassengers ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-blue mb-3" />
              <p className="text-gray-500 text-sm font-medium">Loading passenger manifest...</p>
            </div>
          ) : filteredPassengers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No passengers match your search.' : 'No passengers booked for this trip.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seat</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">User ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPassengers.map((passenger, idx) => (
                    <tr key={passenger.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-primary-blue flex-shrink-0">
                            {passenger.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-text-dark">{passenger.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">{passenger.seatNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{passenger.phone}</td>
                      <td className="px-6 py-4 text-sm font-bold text-primary-blue">{passenger.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs font-bold text-gray-500">
              Showing {filteredPassengers.length} of {passengers.length} passengers
            </p>
            <p className="text-xs text-gray-400">{bus.totalSeats - bus.seatsBooked} seats remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerList;
