import clsx from 'clsx';
import { Bus } from 'lucide-react';

const LiveStatusList = () => {
  const buses = [
    { id: 'BUS-104', route: 'Lagos - Abuja', status: 'On Route', progress: 65, statusColor: 'green' },
    { id: 'BUS-203', route: 'Abuja - PHC', status: 'Delayed', progress: 30, statusColor: 'red' },
    { id: 'BUS-115', route: 'Lagos - Benin', status: 'Boarding', progress: 10, statusColor: 'blue' },
    { id: 'BUS-108', route: 'Kano - Lagos', status: 'On Route', progress: 85, statusColor: 'green' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Live Bus Status</h3>
      
      <div className="space-y-6">
        {buses.map((bus) => (
          <div key={bus.id} className="relative">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "p-2 rounded-lg", 
                  bus.statusColor === 'green' ? "bg-green-100 text-green-600" :
                  bus.statusColor === 'red' ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">{bus.id}</h4>
                  <p className="text-xs text-gray-500">{bus.route}</p>
                </div>
              </div>
              <span className={clsx(
                "text-xs font-medium px-2 py-1 rounded-full",
                bus.statusColor === 'green' ? "bg-green-50 text-green-600" :
                bus.statusColor === 'red' ? "bg-red-50 text-red-600" :
                "bg-blue-50 text-blue-600"
              )}>
                {bus.status}
              </span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className={clsx(
                  "h-1.5 rounded-full",
                  bus.statusColor === 'green' ? "bg-green-500" :
                  bus.statusColor === 'red' ? "bg-red-500" :
                  "bg-blue-500"
                )}
                style={{ width: `${bus.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        View All Status
      </button>
    </div>
  );
};

export default LiveStatusList;
