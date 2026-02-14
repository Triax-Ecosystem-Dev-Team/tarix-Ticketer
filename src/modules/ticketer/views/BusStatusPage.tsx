import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, RefreshCw, Download, Bell } from 'lucide-react';
import BusStatusCard from '../components/cards/BusStatusCard';
import LiveUpdates from '../components/LiveUpdates';
import { busStatusData } from '../data/busStatusData';
import logoWhite from '../../../assets/images/logo-white.webp';

const BusStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'In Transit' | 'Completed' | 'Delayed' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Count items for tabs
  const getCount = (status: string) => {
    if (status === 'All') return busStatusData.length;
    return busStatusData.filter(bus => bus.status === status).length;
  };

  const tabs = [
    { label: 'All Buses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  // Filter logic
  const filteredBuses = busStatusData.filter(bus => {
    const matchesTab = activeTab === 'All' || bus.status === activeTab;
    const matchesSearch = 
      bus.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bus.origin.toLowerCase().includes(searchQuery.toLowerCase()) || 
      bus.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Custom Blue Header */}
      <header className="bg-[#0095FF] h-[60px] px-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-10">
            {/* White Logo */}
            <img src={logoWhite} alt="TARIX Logo" className="h-8 w-auto" />
            
            <nav className="flex items-center gap-6">
                <button className="text-blue-100 text-sm font-medium hover:text-white transition-colors">Search</button>
                <div className="relative py-5">
                    <button className="text-white text-sm font-bold">Bus Status</button>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
                </div>
            </nav>
        </div>

        <div className="flex items-center gap-4">
            <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0095FF]" />
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold border border-white/30">
                JD
            </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-8 px-6">
        <div className="max-w-[1400px] mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-bold text-primary-blue mb-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          
          <h1 className="text-2xl font-bold text-text-dark mb-1">
            Bus Status & Management
          </h1>
          <p className="text-text-gray text-sm">
            View and manage all active buses and passenger bookings
          </p>

          {/* Controls Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by bus number, route, or booking ref..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-blue transition-colors shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
               <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-text-gray hover:bg-gray-50 transition-colors bg-white">
                 Filter by Status <Filter className="w-3.5 h-3.5" />
               </button>
               <button className="p-3 bg-primary-blue text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200">
                 <RefreshCw className="w-4 h-4" />
               </button>
               <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-text-gray hover:bg-gray-50 transition-colors bg-white">
                 <Download className="w-3.5 h-3.5" /> Export
               </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mt-8 border-b border-gray-200 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${
                  activeTab === tab.value 
                    ? 'text-primary-blue' 
                    : 'text-text-gray hover:text-text-dark'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.value ? 'bg-blue-50 text-primary-blue' : 'bg-gray-100 text-gray-500'
                }`}>
                  {getCount(tab.value)}
                </span>
                {activeTab === tab.value && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-blue rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-[1400px] mx-auto p-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => (
            <BusStatusCard key={bus.id} bus={bus} />
          ))}
        </div>
        
        {filteredBuses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-gray text-lg">No buses found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Fixed Live Updates - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <LiveUpdates />
      </div>
    </div>
  );
};

export default BusStatusPage;
