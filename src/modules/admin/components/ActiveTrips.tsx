import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

import { useAdminStore, type ActiveTrip } from '../store/useAdminStore';

// ── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  const widths = ['w-20', 'w-24', 'w-32', 'w-16', 'w-20', 'w-16', 'w-12'];
  return (
    <tr>
      {widths.map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={clsx('h-3 rounded-md bg-gray-200 animate-pulse', w)} />
        </td>
      ))}
    </tr>
  );
}

// ── Passenger progress bar ────────────────────────────────────────────────────

function PassengerBar({ count, capacity }: { count: number; capacity: number }) {
  const pct = Math.round((count / capacity) * 100);
  const full = pct === 100;
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className={clsx('text-[12.5px] font-medium', full ? 'text-red-500' : 'text-gray-800')}>
        {count}/{capacity}
      </span>
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', full ? 'bg-red-400' : 'bg-[#3bb6e0]')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── En Route badge ────────────────────────────────────────────────────────────

function EnRouteBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#3bb6e0] text-white">
      <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
      En Route
    </span>
  );
}

// ── ActiveTrips ───────────────────────────────────────────────────────────────

const ActiveTrips = () => {
  const { activeTrips: data, isLoading: loading, error, fetchAdminDashboard } = useAdminStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading && data) {
      setTimeout(() => setVisible(true), 60);
    } else {
      setVisible(false);
    }
  }, [loading, data]);


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-start justify-between px-5 sm:px-6 pt-5 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight">
            Active Trips (En Route)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {loading ? 'Loading…' : error ? '—' : `${data?.total} trips currently in progress`}
          </p>
        </div>
        <button className="flex items-center gap-1 text-[13px] font-semibold text-[#3bb6e0] hover:gap-2 transition-all mt-0.5 whitespace-nowrap">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* ── Table — scrollable on mobile ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed', minWidth: 620 }}>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '9%'  }} />
          </colgroup>

          <thead>
            <tr className="border-y border-gray-100 bg-gray-50/60 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {['Trip ID', 'Route', 'Driver', 'Bus', 'Passengers', 'Status', 'ETA'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {/* Loading skeletons */}
            {(loading || !data) && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Error */}
            {error && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-red-500 text-sm">
                  ⚠️ {error}
                  <button
                    onClick={fetchAdminDashboard}
                    className="ml-3 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            )}

            {/* Trip rows */}
            {!loading && !error && data && data.trips.map((trip: ActiveTrip, i) => (
              <tr
                key={trip.id}
                className="hover:bg-gray-50/70 transition-colors"
                style={{
                  opacity:   visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
                }}
              >
                {/* Trip ID */}
                <td className="px-4 py-3.5 overflow-hidden">
                  <Link 
                    to={trip.status === 'Completed' ? `/admin/trips/report/${trip.id}` : `/admin/trips/${trip.id}`}
                    className="text-[#3bb6e0] font-semibold text-[12.5px] cursor-pointer hover:underline truncate block"
                  >
                    {trip.id}
                  </Link>
                </td>

                {/* Route */}
                <td className="px-4 py-3.5 overflow-hidden">
                  <span className="text-gray-800 font-medium truncate flex items-center gap-1">
                    {trip.from}
                    <span className="text-gray-300 text-xs">→</span>
                    {trip.to}
                  </span>
                </td>

                {/* Driver */}
                <td className="px-4 py-3.5 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#3bb6e0] text-white text-[10.5px] font-bold flex-shrink-0 flex items-center justify-center">
                      {trip.initials}
                    </div>
                    <span className="text-gray-700 truncate text-[13px]">{trip.driver}</span>
                  </div>
                </td>

                {/* Bus */}
                <td className="px-4 py-3.5 text-gray-500 text-[13px] truncate overflow-hidden">
                  {trip.bus}
                </td>

                {/* Passengers */}
                <td className="px-4 py-3.5 overflow-hidden">
                  <PassengerBar count={trip.passengers} capacity={trip.capacity} />
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 overflow-hidden">
                  <EnRouteBadge />
                </td>

                {/* ETA */}
                <td className="px-4 py-3.5 text-gray-600 font-medium text-[13px] truncate overflow-hidden">
                  {trip.eta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTrips;
