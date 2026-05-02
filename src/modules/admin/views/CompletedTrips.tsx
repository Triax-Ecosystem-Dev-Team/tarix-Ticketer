import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Search, 
  Filter, 
  Calendar,
  ChevronRight,
  ArrowRight,
  FileText,
  TrendingUp,
  History,
  Download,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';
import { useAdminStore } from '../store/useAdminStore';

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[32, 48, 48, 32, 24, 32, 24].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div className={`h-3 rounded-md bg-gray-100 animate-pulse w-${w}`} style={{ width: `${w * 2}px` }} />
        </td>
      ))}
    </tr>
  );
}

const CompletedTrips = () => {
  const { trips, tripsLoading, fetchTrips, dashboardStats, fetchAdminDashboard } = useAdminStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch Dashboard Stats once if null
  useEffect(() => {
    if (!dashboardStats) {
      fetchAdminDashboard();
    }
  }, [dashboardStats, fetchAdminDashboard]);

  // Fetch Trips with debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips({ 
        status: 'Completed', 
        searchTerm: searchQuery,
        date: filterDate || undefined
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filterDate, fetchTrips]);

  const handleExportHistory = () => {
    if (!trips || trips.length === 0) return;
    
    const headers = ['Trip ID', 'Route', 'Driver', 'Date', 'Passengers', 'Capacity'];
    const rows = trips.map(t => [
      t.id, 
      `${t.from} to ${t.to}`, 
      t.driver, 
      t.eta || '—', 
      t.passengers.toString(), 
      t.capacity.toString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Completed_Trips_History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <History className="w-5 h-5 text-[#16A34A]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Completed Trips</h1>
          </div>
          <p className="text-[#64748B] text-sm font-medium">History and performance reports for all finished journeys</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportHistory}
            className="bg-white text-slate-600 border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-[14px] hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export History
          </button>
        </div>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { 
            label: 'Trips Completed Today', 
            value: dashboardStats?.completedToday ?? '—', 
            icon: FileText, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50' 
          },
          { 
            label: 'Tickets Sold Today', 
            value: dashboardStats?.ticketsSold ?? '—', 
            icon: CheckCircle, 
            color: 'text-green-500', 
            bg: 'bg-green-50' 
          },
          { 
            label: 'Total Revenue Today', 
            value: dashboardStats?.revenueToday ?? '—', 
            icon: TrendingUp, 
            color: 'text-purple-500', 
            bg: 'bg-purple-50' 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={clsx("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-[20px] font-bold text-[#1E293B]">
                {!dashboardStats ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Trip ID, Route, or Driver..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-[14px] font-bold hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 text-[14px] font-bold hover:bg-slate-50 transition-all outline-none"
          />
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Trip ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Route</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date/Time</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Passengers</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tripsLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

              {!tripsLoading && trips.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No completed trips found.
                  </td>
                </tr>
              )}

              {!tripsLoading && trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link 
                      to={`/admin/trips/report/${trip.id}`}
                      className="text-[#0EA5E9] font-bold text-[13px] hover:underline"
                    >
                      {trip.id.substring(0, 12)}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#1E293B] font-semibold text-[13px]">
                      {trip.from}
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      {trip.to}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                        {trip.initials}
                      </div>
                      <span className="text-[13.5px] font-medium text-slate-600">{trip.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13.5px] text-slate-500 font-medium">{trip.eta || '—'}</td>
                  <td className="px-6 py-4 text-[13.5px] text-slate-700 font-bold">
                    {trip.passengers}/{trip.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-bold text-[#16A34A]">TBD</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      to={`/admin/trips/report/${trip.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E0F2FE] text-[#0EA5E9] text-[12px] font-bold hover:bg-[#0EA5E9] hover:text-white transition-all shadow-sm"
                    >
                      Report <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedTrips;
