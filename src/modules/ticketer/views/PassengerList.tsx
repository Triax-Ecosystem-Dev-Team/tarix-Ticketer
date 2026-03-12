import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download } from 'lucide-react';
import { busStatusData } from '../data/busStatusData';
import logoWhite from '../../../assets/images/logo-white.webp';
import { Passenger } from '../types';

// Mock passenger data generator
const generateMockPassengers = (count: number): Passenger[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `TXU${160 + i}`,
    fullName: [
      'Mohammed Ibrahim', 'Aisha Bello', 'Yusuf Ahmed', 'Halima Sani', 
      'Abdullahi Usman', 'Zainab Garba', 'Ibrahim Musa', 'Fatima Aliyu',
      'Umar Hassan', 'Hadiza Mohammed', 'Sani Abubakar', 'Rahma Bala', 
      'Kabir Yusuf', 'Safiya Umar', 'Bashir Ibrahim', 'Amina Abdullahi',
      'Aliyu Sani', 'Hauwa Hassan', 'Garba Musa', 'Khadija Ahmed',
      'Hassan Bello', 'Maryam Garba', 'Tijani Aliyu', "Asma'u Usman"
    ][i % 24],
    seatNumber: `${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(i / 4)]}${(i % 4) + 1}`,
    phone: `+234 ${960 + i} 123 ${4567 + i}`,
    userId: `TXU${160 + i}`
  }));
};

const PassengerList: React.FC = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Find bus details
  const bus = busStatusData.find(b => b.id === busId);
  
  // Generate passengers based on booked seats
  const passengers = React.useMemo(() => {
    if (!bus) return [];
    return generateMockPassengers(bus.passengersBooked);
  }, [bus]);

  // Filter passengers
  const filteredPassengers = passengers.filter(p => 
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.seatNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!bus) {
    return <div className="p-8 text-center">Bus not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Header */}
      <header className="bg-[#0095FF] h-[60px] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-10">
            <img src={logoWhite} alt="TARIX Logo" className="h-8 w-auto" />
            <nav className="flex items-center gap-6">
                <button onClick={() => navigate('/')} className="text-blue-100 text-sm font-medium hover:text-white transition-colors">Search</button>
                <button onClick={() => navigate('/bus-status')} className="text-blue-100 text-sm font-medium hover:text-white transition-colors">Bus Status</button>
                <div className="relative py-5">
                    <button className="text-white text-sm font-bold">Passenger List</button>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
                </div>
            </nav>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold border border-white/30">
            JD
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Back Link */}
        <button 
          onClick={() => navigate('/bus-status')}
          className="flex items-center gap-2 text-sm font-bold text-[#0095FF] mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bus Status
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-dark mb-1">
          Passenger List - <span className="text-gray-400">{bus.id}</span>
        </h1>
        <p className="text-gray-500 text-sm mb-6">View list of passengers for this bus trip</p>

        {/* Bus Summary Card */}
        <div className="bg-white rounded-xl border border-[#0095FF] p-6 mb-8 flex flex-wrap gap-12 items-center shadow-sm">
           <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ROUTE</p>
               <p className="text-lg font-bold text-text-dark">{bus.origin} → {bus.destination}</p>
           </div>
           <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DEPARTURE</p>
               <p className="text-lg font-bold text-text-dark">{bus.departureTime}</p>
           </div>
           <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">TOTAL PASSENGERS</p>
               <p className="text-2xl font-bold text-[#0095FF]">{bus.passengersBooked}</p>
           </div>
        </div>

        {/* Search & Export Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0095FF]" />
              <input 
                type="text" 
                placeholder="Search by name, seat, phone, or user ID..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0095FF] focus:ring-2 focus:ring-[#0095FF]/10 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#0095FF] text-white rounded-lg text-sm font-bold hover:bg-[#0086E6] transition-colors shadow-sm shadow-blue-100">
                <Download className="w-4 h-4" /> Export List
            </button>
        </div>

        {/* Passenger Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seat Num</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">User-ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPassengers.map((passenger) => (
                            <tr key={passenger.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-medium text-text-dark">{passenger.fullName}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-700">{passenger.seatNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{passenger.phone}</td>
                                <td className="px-6 py-4 text-sm font-bold text-[#0095FF]">{passenger.userId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs font-bold text-gray-500">Showing {filteredPassengers.length} of {passengers.length} passengers</p>
                <p className="text-xs text-gray-400">{bus.totalSeats - bus.seatsBooked} seats remaining</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerList;
