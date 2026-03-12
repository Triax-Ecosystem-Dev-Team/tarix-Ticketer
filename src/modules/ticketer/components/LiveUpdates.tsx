import React from 'react';
import { X, Bell } from 'lucide-react';

const LiveUpdates: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);

  // toggle when clicking outside the expanded card
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (expanded && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-50 animate-fade-in-up"
        aria-label="Show live updates"
      >
        <Bell className="w-6 h-6 text-primary-blue" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 p-4 w-full max-w-[90vw] sm:w-[280px] animate-fade-in-up relative">
      <button
        onClick={() => setExpanded(false)}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close live updates"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
        <p className="text-xs font-bold text-text-dark">Live Updates</p>
      </div>
      
      <div className="space-y-3">
        <div className="pb-3 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 mb-0.5">BUS-001</p>
          <p className="text-xs text-text-gray">2 new passengers boarded</p>
        </div>
        <div className="pb-3 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 mb-0.5">BUS-004</p>
          <p className="text-xs text-text-gray">Now in transit</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 mb-0.5">BUS-007</p>
          <p className="text-xs text-text-gray">Arrived at destination</p>
        </div>
      </div>
    </div>
  );
};

export default LiveUpdates;
