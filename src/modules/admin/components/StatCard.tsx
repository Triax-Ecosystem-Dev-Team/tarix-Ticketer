import { type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

// ── Color maps ────────────────────────────────────────────────────────────────

const iconColorMap: Record<string, { bg: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-500'   },
  green:  { bg: 'bg-green-50',  text: 'text-green-500'  },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-500'   },
  pink:   { bg: 'bg-pink-50',   text: 'text-pink-500'   },
  purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
};

const subColorMap: Record<string, string> = {
  green:  'text-green-500',
  orange: 'text-orange-400',
  teal:   'text-teal-500',
  red:    'text-red-500',
  blue:   'text-blue-500',
  gray:   'text-gray-400',
};

// ── Props ─────────────────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: keyof typeof subColorMap;
  icon: LucideIcon;
  subIcon?: LucideIcon;
  iconColor?: keyof typeof iconColorMap;
  /** Drives the fade-in/slide-up entrance animation */
  visible?: boolean;
}

// ── Skeleton (shown while loading) ────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse" />
        <div className="w-24 h-4 rounded-md bg-gray-100 animate-pulse" />
      </div>
      <div className="w-20 h-9 rounded-md bg-gray-200 animate-pulse" />
      <div className="w-28 h-3.5 rounded-md bg-gray-100 animate-pulse" />
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  subColor = 'orange',
  icon: Icon,
  subIcon: SubIcon,
  iconColor = 'blue',
  visible = true,
}: StatCardProps) => {
  const ic = iconColorMap[iconColor] ?? iconColorMap.blue;
  const sc = subColorMap[subColor] ?? subColorMap.orange;

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3
                 transition-all duration-450 ease-out hover:-translate-y-0.5 hover:shadow-md cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease, box-shadow 0.22s ease',
      }}
    >
      {/* Top row: icon + label */}
      <div className="flex items-start justify-between">
        <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', ic.bg, ic.text)}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <span className="text-[11px] font-medium tracking-widest text-gray-400 uppercase text-right leading-snug mt-1">
          {label}
        </span>
      </div>

      {/* Value */}
      <p className="text-[34px] font-bold text-gray-900 leading-none tracking-tight font-['Sora',sans-serif]">
        {value}
      </p>

      {/* Sub-line */}
      {sub && (
        <div className={clsx('flex items-center gap-1.5 text-[12.5px] font-medium', sc)}>
          {SubIcon && <SubIcon size={13} strokeWidth={2.2} />}
          {sub}
        </div>
      )}
    </div>
  );
};

export default StatCard;
