// import removed
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import clsx from 'clsx';

import { useAdminStore, type RevenueTrend } from '../store/useAdminStore';

type DayPoint  = RevenueTrend['days'][number];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtAxis = (v: number) => `₦${(v / 1_000_000).toFixed(1)}M`;
const fmtFull = (v: number) => `₦${v.toLocaleString()}`;

function deriveStats(days: DayPoint[]) {
  if (!days.length) return { highDay: '', highVal: 0, lowDay: '', lowVal: 0 };
  const high = days.reduce((a, b) => (b.value > a.value ? b : a));
  const low  = days.reduce((a, b) => (b.value < a.value ? b : a));
  return { highDay: high.day, highVal: high.value, lowDay: low.day, lowVal: low.value };
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?:  boolean;
  payload?: Array<{ value?: number }>;
  label?:   string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-[#1a2233] text-white rounded-lg px-3 py-2 shadow-xl pointer-events-none">
      <p className="text-[11px] font-medium text-slate-400 mb-0.5">{String(label)}</p>
      <p className="text-[13px] font-semibold">{val != null ? fmtFull(val) : '—'}</p>
    </div>
  );
}

// ── Skeleton helpers ──────────────────────────────────────────────────────────

function Skel({ className }: { className: string }) {
  return <div className={clsx('rounded-md bg-gray-200 animate-pulse', className)} />;
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-2 flex-1 justify-end pt-2">
      <Skel className="w-full h-44 rounded-xl" />
      <div className="flex justify-between mt-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skel key={i} className="w-7 h-3" />
        ))}
      </div>
    </div>
  );
}

function StatsSkeleton() {
  const rows = [70, 50, 90, 50, 70, 50, 90, 50];
  return (
    <div className="flex flex-col gap-2">
      {rows.map((w, i) => (
        <div
          key={i}
          className={clsx('rounded-md bg-gray-200 animate-pulse', i % 2 === 0 ? 'h-5' : 'h-3')}
          style={{ width: `${w}%`, marginBottom: i % 2 !== 0 ? 8 : 0 }}
        />
      ))}
    </div>
  );
}

// ── Stat block ────────────────────────────────────────────────────────────────

interface StatBlockProps {
  label:     string;
  value:     string;
  sub?:      string;
  subColor?: string;
  large?:    boolean;
  last?:     boolean;
}

function StatBlock({ label, value, sub, subColor = 'text-green-500', large = false, last = false }: StatBlockProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-1.5">
        {label}
      </p>
      <p className={clsx(
        'font-bold text-gray-900 leading-none mb-1.5 tracking-tight',
        large ? 'text-[22px]' : 'text-[18px]'
      )}>
        {value}
      </p>
      {sub && (
        <p className={clsx('flex items-center gap-1 text-[12px] font-semibold', subColor)}>
          {sub}
        </p>
      )}
      {!last && <div className="h-px bg-gray-100 my-4" />}
    </div>
  );
}

// ── SalesOverviewChart (Revenue Trend) ───────────────────────────────────────

const SalesOverviewChart = () => {
  const { revenueTrend: data, isLoading: loading, error, fetchAdminDashboard: load } = useAdminStore();

  const stats = data ? deriveStats(data.days) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden
                    grid grid-cols-1 sm:grid-cols-[1fr_210px]">

      {/* ── Chart panel ── */}
      <div className="flex flex-col p-5 sm:p-6 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Revenue Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
          </div>
          {!loading && !error && data && (
            <div className="flex items-center gap-1 text-[12px] font-semibold text-green-500 mt-0.5">
              <TrendingUp size={13} />
              +{data.totalChange}%
            </div>
          )}
        </div>

        {/* Chart area */}
        <div className="mt-4 flex-1 min-h-[300px]">
          {loading || !data ? (
            <ChartSkeleton />
          ) : error ? (
            <div className="flex items-center gap-3 text-red-500 text-sm mt-6">
              <span>⚠️ {error}</span>
              <button
                onClick={load}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data!.days} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f4f8" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  dy={6}
                />
                <YAxis
                  tickFormatter={fmtAxis}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  width={56}
                  tickCount={5}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3bb6e0"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#3bb6e0', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Stats panel ── */}
      <div className="border-t sm:border-t-0 sm:border-l border-gray-100
                      p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-1 gap-x-6
                      sm:flex sm:flex-col sm:justify-center">
        {loading || !data ? (
          <StatsSkeleton />
        ) : error ? null : (
          <>
            <StatBlock
              label="Total Revenue"
              value={fmtFull(data!.totalRevenue)}
              sub={`↗ +${data!.totalChange}% from last week`}
              subColor="text-green-500"
            />
            <StatBlock
              label="Average Daily"
              value={fmtFull(data!.averageDaily)}
              sub={`↗ +${data!.averageChange}% from last week`}
              subColor="text-green-500"
            />
            <StatBlock
              label="Highest Day"
              value={stats!.highDay}
              sub={fmtFull(stats!.highVal)}
              subColor="text-[#3bb6e0]"
              large
            />
            <StatBlock
              label="Lowest Day"
              value={stats!.lowDay}
              sub={fmtFull(stats!.lowVal)}
              subColor="text-amber-500"
              large
              last
            />
          </>
        )}
      </div>

    </div>
  );
};

export default SalesOverviewChart;
