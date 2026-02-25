import { Plus, Bus, Map } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <button className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all group">
        <div className="text-left">
          <h3 className="font-bold text-lg">Add New Booking</h3>
          <p className="text-blue-100 text-sm mt-1">Create a ticket booking</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
          <Plus className="w-6 h-6" />
        </div>
      </button>

      <button className="flex items-center justify-between p-6 bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all group">
        <div className="text-left">
          <h3 className="font-bold text-lg">Add New Bus</h3>
          <p className="text-green-100 text-sm mt-1">Register a vehicle</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
          <Bus className="w-6 h-6" />
        </div>
      </button>

      <button className="flex items-center justify-between p-6 bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all group">
        <div className="text-left">
          <h3 className="font-bold text-lg">Create Route</h3>
          <p className="text-orange-100 text-sm mt-1">Set up new schedule</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg group-hover:bg-white/30 transition-colors">
          <Map className="w-6 h-6" />
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
