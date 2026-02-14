import React from 'react';

const LiveUpdates: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-100 p-4 w-[280px] animate-fade-in-up">
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
