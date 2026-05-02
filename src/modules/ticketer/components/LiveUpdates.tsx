import React from 'react';
import { X, Bell } from 'lucide-react';
import { useDispatchStore } from '../store/useDispatchStore';

const LiveUpdates: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  const { liveLogs } = useDispatchStore();

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

  const hasNewLogs = liveLogs.length > 0;

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-50 animate-fade-in-up relative"
        aria-label="Show live updates"
      >
        <Bell className="w-6 h-6 text-primary-blue" />
        {hasNewLogs && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 p-4 w-full max-w-[90vw] sm:w-[280px] animate-fade-in-up relative max-h-[400px] flex flex-col">
      <button
        onClick={() => setExpanded(false)}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
        aria-label="Close live updates"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className={`w-2 h-2 rounded-full ${hasNewLogs ? 'bg-[#22C55E] animate-pulse' : 'bg-gray-300'}`} />
        <p className="text-xs font-bold text-text-dark">Live Updates</p>
      </div>
      
      <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
        {liveLogs.length === 0 ? (
          <p className="text-xs text-gray-400 italic text-center py-4">No recent updates</p>
        ) : (
          liveLogs.map((log) => (
            <div key={log.id} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase">{log.busId}</p>
                <p className="text-[9px] text-gray-400">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <p className="text-xs text-text-gray font-medium">{log.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveUpdates;
