import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Bus,
  Search,
  Printer,
  ChevronRight,
  Edit3,
  XCircle,
  Eye,
  RefreshCcw,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import { useAdminStore } from '../store/useAdminStore';
import { useTripStore, type TripPassenger } from '../store/useTripStore';

// ── Skeleton helpers ──────────────────────────────────────────────────────────

function SkeletonBlock({ w = 'w-32', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={clsx('rounded-md bg-slate-100 animate-pulse', w, h)} />;
}

// ── TripDetails ───────────────────────────────────────────────────────────────

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { currentTrip: trip, isLoading: tripLoading, error: tripError, fetchTripById } = useTripStore();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (tripId) fetchTripById(tripId);
  }, [tripId, fetchTripById]);

  const passengers: TripPassenger[] = trip?.manifest ?? [];

  const filteredPassengers = passengers.filter((p) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Checked In' && p.status === 'Checked In') ||
      (activeTab === 'Pending' && p.status === 'Pending');
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const checkedInCount = passengers.filter((p) => p.status === 'Checked In').length;
  const pendingCount = passengers.filter((p) => p.status === 'Pending').length;

  const occupancyPct = trip ? Math.round((trip.passengers / Math.max(trip.busCapacity, 1)) * 100) : 0;

  // ── Loading state ──
  if (tripLoading) {
    return (
      <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-slate-500 font-medium">Loading trip details…</p>
      </div>
    );
  }

  // ── Error state ──
  if (tripError) {
    return (
      <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">⚠️ {tripError}</p>
        <button
          onClick={() => tripId && fetchTripById(tripId)}
          className="bg-[#0EA5E9] text-white px-4 py-2 rounded-xl font-bold text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen pb-24">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-slate-400 text-[13px] font-medium mb-4">
        <ArrowLeft className="w-3.5 h-3.5" />
        <Link to="/admin/trips" className="hover:text-[#0EA5E9] transition-colors">
          Trips
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-bold">Trip Details</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-bold text-[#1E293B] tracking-tight">
            Trip #{trip ? trip.id.substring(0, 12) : tripId}
          </h1>
          <span
            className={clsx(
              'px-3 py-1 rounded-lg text-[13px] font-bold border',
              trip?.status === 'Active'
                ? 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                : trip?.status === 'Completed'
                  ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                  : 'bg-slate-100 text-slate-500 border-slate-200',
            )}
          >
            {trip?.status || 'Unknown'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0EA5E9] font-bold text-[14px] hover:bg-slate-50 transition-all shadow-sm">
            <Edit3 className="w-4 h-4" />
            Edit Trip
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#FEE2E2] rounded-xl text-[#EF4444] font-bold text-[14px] hover:bg-red-50 transition-all shadow-sm">
            <XCircle className="w-4 h-4" />
            Cancel Trip
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl font-bold text-[14px] hover:bg-[#0284c7] transition-all shadow-sm">
            <Printer className="w-4 h-4" />
            Print Manifest
          </button>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Route & Schedule */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#0EA5E9]" />
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Route & Schedule</h3>
          </div>
          <div className="mb-8">
            {trip ? (
              <div className="flex items-center gap-2 text-[20px] font-bold text-[#1E293B] mb-1">
                {trip.from}
                <ArrowRight className="w-5 h-5 text-slate-300" />
                {trip.to}
              </div>
            ) : (
              <SkeletonBlock w="w-48" h="h-6" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date</p>
              <p className="text-[14px] font-bold text-[#1E293B]">
                {trip ? new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Time</p>
              <p className="text-[14px] font-bold text-[#1E293B]">{trip?.time || '—'}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
              <p className="text-[14px] font-bold text-[#1E293B]">{trip?.status || '—'}</p>
            </div>
          </div>
        </div>

        {/* Bus & Driver */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#fce7f3] flex items-center justify-center">
              <Bus className="w-5 h-5 text-[#EC4899]" />
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Bus & Driver</h3>
          </div>
          <div className="mb-10">
            <p className="text-[20px] font-bold text-[#1E293B] mb-1">{trip?.bus || '—'}</p>
            <p className="text-[14px] text-slate-400 font-medium">{trip ? `${trip.busCapacity} seats` : '—'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-[14px]">
              {trip?.driverInitials || '??'}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#1E293B]">{trip?.driver || 'Unassigned'}</p>
              <p className="text-[12px] text-slate-400 font-medium mb-1">Driver</p>
              <p className="text-[13px] text-[#0EA5E9] font-semibold">{trip?.driverPhone || '—'}</p>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center">
              <span className="text-[#16A34A] font-bold text-[20px]">₦</span>
            </div>
            <h3 className="text-[17px] font-bold text-slate-500">Revenue Summary</h3>
          </div>
          <div className="mb-10">
            <p className="text-[24px] font-bold text-[#16A34A] mb-1">
              ₦{(trip?.totalRevenue ?? 0).toLocaleString()}
            </p>
            <p className="text-[14px] text-slate-400 font-medium">Total Revenue</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tickets Sold</p>
              <p className="text-[14px] font-bold text-[#1E293B]">
                {trip?.passengers ?? 0}/{trip?.busCapacity ?? 0}
              </p>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all duration-700', occupancyPct === 100 ? 'bg-[#EF4444]' : 'bg-[#16A34A]')}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            <p className="text-[12px] font-bold tracking-tight" style={{ color: occupancyPct === 100 ? '#EF4444' : '#16A34A' }}>
              {occupancyPct}% Occupancy
            </p>
          </div>
        </div>
      </div>

      {/* Passenger Manifest Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-[#1E293B] mb-1">Passenger Manifest</h2>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                {checkedInCount} checked in • {pendingCount} pending
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search passenger name..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Tabs */}
          <div className="flex gap-1 border-b border-slate-100">
            {['All', 'Checked In', 'Pending'].map((tab) => {
              const label =
                tab === 'All' ? `All (${passengers.length})` : tab === 'Checked In' ? `Checked In (${checkedInCount})` : `Pending (${pendingCount})`;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx('px-6 py-4 text-[14px] font-bold transition-all relative', activeTab === tab ? 'text-[#0EA5E9]' : 'text-slate-400 hover:text-slate-600')}
                >
                  {label}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0EA5E9] rounded-t-full" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[11px] font-extrabold text-slate-400">
                <th className="px-8 py-5">Seat</th>
                <th className="px-8 py-5">Passenger Name</th>
                <th className="px-8 py-5">Ticket ID</th>
                <th className="px-8 py-5">Phone</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPassengers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 text-sm font-medium">
                    {tripLoading ? 'Loading passengers…' : 'No passengers found.'}
                  </td>
                </tr>
              )}
              {filteredPassengers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0EA5E9] font-bold text-[14px]">
                      {p.seat}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-[#1E293B] text-[15px]">{p.name}</td>
                  <td className="px-8 py-5 font-bold text-[#0EA5E9] text-[14px]">{p.ticketId.substring(0, 12)}</td>
                  <td className="px-8 py-5 text-slate-400 font-semibold text-[14px]">{p.phone}</td>
                  <td className="px-8 py-5">
                    <span
                      className={clsx(
                        'px-3 py-1.5 rounded-xl text-[12px] font-bold shadow-sm inline-block',
                        p.status === 'Checked In' ? 'bg-green-50 text-[#16A34A]' : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-[#0EA5E9] hover:scale-110 transition-transform bg-slate-50 p-2 rounded-full border border-slate-100">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="fixed bottom-0 left-[256px] right-0 bg-[#1A1A2E] text-white p-4 flex items-center justify-between z-30 shadow-2xl border-t border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <span className="text-[14px] font-bold tracking-tight">{trip?.status === 'Active' ? 'En Route' : trip?.status || 'Loading…'}</span>
        </div>
        <div className="text-slate-400 text-[13.5px] font-medium absolute left-1/2 -translate-x-1/2">
          Arrival: <span className="text-white font-bold">{trip?.time || 'TBD'}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <RefreshCcw className="w-4 h-4 animate-spin-slow" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Updates instantly</span>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
