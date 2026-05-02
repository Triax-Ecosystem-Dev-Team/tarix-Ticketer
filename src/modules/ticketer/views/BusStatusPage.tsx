import React, { useEffect } from 'react';
import { Search, Filter, RefreshCw, Download, Loader2 } from 'lucide-react';
import BusStatusCard from '../components/cards/BusStatusCard';
import LiveUpdates from '../components/LiveUpdates';
import { useDispatchStore } from '../store/useDispatchStore';
import EscapeHatch from '../../../shared/components/layout/EscapeHatch';

const BusStatusPage: React.FC = () => {
  const { 
    isLoading, 
    activeTab, 
    searchQuery,
    selectedDate,
    setSearchQuery, 
    setActiveTab, 
    setSelectedDate,
    fetchFleetStatus, 
    getFilteredBuses, 
    getTabCounts 
  } = useDispatchStore();

  useEffect(() => {
    fetchFleetStatus();
  }, [fetchFleetStatus, selectedDate]);

  const filteredBuses = getFilteredBuses();
  const tabCounts = getTabCounts();

  const tabs = [
    { label: 'All Buses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'In Transit', value: 'In Transit' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const { multiStatusFilters, setMultiFilters } = useDispatchStore();

  const handleExportCSV = () => {
    const headers = ['Trip ID', 'Status', 'Route', 'Driver', 'Real Occupancy'];
    const rows = filteredBuses.map(bus => [
      bus.id,
      bus.status,
      `${bus.origin} -> ${bus.destination}`,
      bus.driver,
      `${bus.seatsBooked}/${bus.totalSeats} (${Math.round((bus.seatsBooked / bus.totalSeats) * 100)}%)`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fleet_dispatch_${selectedDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFilter = (status: string) => {
    if (multiStatusFilters.includes(status)) {
      setMultiFilters(multiStatusFilters.filter(s => s !== status));
    } else {
      setMultiFilters([...multiStatusFilters, status]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative mt-6 px-6">
      <div className="max-w-[1400px] mx-auto">
        <EscapeHatch to="/" label="Back to Dashboard" />
        
        <h1 className="text-2xl font-bold text-text-dark mb-1">
          Fleet Dispatch Status
        </h1>
        <p className="text-text-gray text-sm">
          View and manage all active buses and daily departures
        </p>

          {/* Controls Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search and Date Filter */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1 max-w-2xl">
              <div className="relative w-full sm:w-2/3">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by bus number, route, or driver..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-blue transition-colors shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/3">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-blue transition-colors shadow-sm text-text-dark"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative">
                 <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-colors bg-white ${
                    multiStatusFilters.length > 0 ? 'border-primary-blue text-primary-blue' : 'border-gray-200 text-text-gray hover:bg-gray-50'
                  }`}
                 >
                   Filter by Status <Filter className="w-3.5 h-3.5" />
                   {multiStatusFilters.length > 0 && (
                     <span className="bg-primary-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                       {multiStatusFilters.length}
                     </span>
                   )}
                 </button>

                 {isFilterOpen && (
                   <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] py-2">
                     {tabs.filter(t => t.value !== 'All').map(status => (
                       <button
                         key={status.value}
                         onClick={() => toggleFilter(status.value)}
                         className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                       >
                         <span className={multiStatusFilters.includes(status.value) ? 'text-primary-blue font-bold' : 'text-gray-600'}>
                           {status.label}
                         </span>
                         {multiStatusFilters.includes(status.value) && (
                           <div className="w-2 h-2 rounded-full bg-primary-blue" />
                         )}
                       </button>
                     ))}
                     {multiStatusFilters.length > 0 && (
                       <button 
                         onClick={() => setMultiFilters([])}
                         className="w-full mt-1 pt-2 border-t border-gray-100 text-xs text-primary-blue font-bold py-2 hover:underline"
                       >
                         Clear All Filters
                       </button>
                     )}
                   </div>
                 )}
               </div>

               <button 
                 onClick={() => fetchFleetStatus()}
                 disabled={isLoading}
                 className="p-3 bg-primary-blue text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 disabled:opacity-70"
               >
                 <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
               </button>
               <button 
                 onClick={handleExportCSV}
                 className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-text-gray hover:bg-gray-50 transition-colors bg-white"
               >
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
                  {tabCounts[tab.value] || 0}
                </span>
                {activeTab === tab.value && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-blue rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

      {/* Grid Content */}
      <div className="max-w-[1400px] mx-auto p-6 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-blue animate-spin mb-4" />
            <p className="text-text-gray font-medium">Syncing Fleet Dispatch Data...</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Fixed Live Updates - bottom center on mobile, bottom-right on larger screens */}
      <div className="fixed inset-x-0 bottom-4 flex justify-center sm:justify-end sm:bottom-8 sm:right-8 z-50 px-4">
        <LiveUpdates />
      </div>
    </div>
  );
};

export default BusStatusPage;
