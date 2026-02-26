import { useState, useEffect, useCallback } from 'react';
import {
  Bus,
  CheckCircle,
  Navigation,
  Banknote,
  TicketCheck,
  Users,
  TrendingUp,
  Clock,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import StatCard, { StatCardSkeleton, type StatCardProps } from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import ActiveTrips from '../components/ActiveTrips';
import SalesOverviewChart from '../components/SalesOverviewChart';

// ── 🔌 MOCK API — swap fetchDashboardStats() body when backend is ready ──────
// Replace with: return fetch("/api/dashboard/stats").then(r => r.json())
async function fetchDashboardStats() {
  await new Promise(r => setTimeout(r, 1200));
  return {
    totalBuses:      45,
    inactiveBuses:   5,
    availableBuses:  32,
    utilization:     71,
    activeTrips:     13,
    completedToday:  28,
    completedChange: 12,
    revenueToday:    '₦2,450,000',
    revenueChange:   8,
    ticketsSold:     1245,
    driversActive:   38,
    driversTotal:    45,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DashboardData = Awaited<ReturnType<typeof fetchDashboardStats>>;

type CardConfig = Omit<StatCardProps, 'visible'> & { id: number };

interface Cards {
  top:    CardConfig[];
  bottom: CardConfig[];
}

// ── Builds card configs from raw API data ────────────────────────────────────

function buildCards(d: DashboardData): Cards {
  return {
    top: [
      {
        id: 1,
        label:     'TOTAL BUSES',
        value:     d.totalBuses,
        sub:       `${d.inactiveBuses} inactive`,
        subColor:  'orange',
        icon:      Bus,
        subIcon:   Clock,
        iconColor: 'blue',
      },
      {
        id: 2,
        label:     'AVAILABLE BUSES',
        value:     d.availableBuses,
        sub:       `${d.utilization}% utilization`,
        subColor:  'green',
        icon:      CheckCircle,
        subIcon:   TrendingUp,
        iconColor: 'green',
      },
      {
        id: 3,
        label:     'ACTIVE TRIPS',
        value:     d.activeTrips,
        sub:       'En route',
        subColor:  'teal',
        icon:      Navigation,
        subIcon:   Clock,
        iconColor: 'teal',
      },
      {
        id: 4,
        label:     'COMPLETED TODAY',
        value:     d.completedToday,
        sub:       `+${d.completedChange}% from yesterday`,
        subColor:  'green',
        icon:      CheckCircle,
        subIcon:   TrendingUp,
        iconColor: 'green',
      },
    ],
    bottom: [
      {
        id: 5,
        label:     'REVENUE TODAY',
        value:     d.revenueToday,
        sub:       `+${d.revenueChange}% from yesterday`,
        subColor:  'green',
        icon:      Banknote,
        subIcon:   TrendingUp,
        iconColor: 'pink',
      },
      {
        id: 6,
        label:     'TICKETS SOLD',
        value:     d.ticketsSold.toLocaleString(),
        sub:       "Today's bookings",
        subColor:  'teal',
        icon:      TicketCheck,
        subIcon:   BookOpen,
        iconColor: 'purple',
      },
      {
        id: 7,
        label:     'DRIVERS ACTIVE',
        value:     d.driversActive,
        sub:       `Out of ${d.driversTotal} total`,
        subColor:  'orange',
        icon:      Users,
        subIcon:   Users,
        iconColor: 'blue',
      },
    ],
  };
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium mb-4">
      <span>⚠️ Failed to load stats: {message}</span>
      <button
        onClick={onRetry}
        className="ml-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ── AdminDashboard ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [cards,   setCards]   = useState<Cards | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVisible(false);
    try {
      const data = await fetchDashboardStats();
      setCards(buildCards(data));
      setTimeout(() => setVisible(true), 60);
    } catch (e) {
      setError((e as Error).message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-gray-800 tracking-tight">Overview</p>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50
                     text-gray-500 hover:text-gray-800 text-xs font-medium px-3.5 py-2 rounded-lg
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {/* ── Error ── */}
      {error && <ErrorBanner message={error} onRetry={loadData} />}

      {/* ── Stats ── */}
      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        </>
      ) : cards && (
        <>
          {/* Row 1 — 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.top.map((c, i) => (
              <div
                key={c.id}
                style={{
                  transition: `opacity 0.45s ease ${i * 70}ms, transform 0.45s ease ${i * 70}ms`,
                }}
              >
                <StatCard {...c} visible={visible} />
              </div>
            ))}
          </div>

          {/* Row 2 — 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.bottom.map((c, i) => (
              <div
                key={c.id}
                style={{
                  transition: `opacity 0.45s ease ${(i + 4) * 70}ms, transform 0.45s ease ${(i + 4) * 70}ms`,
                }}
              >
                <StatCard {...c} visible={visible} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Quick Actions ── */}
      <QuickActions />

      {/* ── Active Trips ── */}
      <ActiveTrips />

      {/* ── Main Content ── */}
      <div className="w-full">
        <SalesOverviewChart />
      </div>

    </div>
  );
};

export default AdminDashboard;
