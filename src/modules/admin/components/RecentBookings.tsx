import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';

const RecentBookings = () => {
  const bookings = [
    { id: '#TRX-7890', passenger: 'Sarah Wilson', route: 'Lagos → Abuja', date: 'Oct 24, 2023', seat: '4A', status: 'Confirmed', price: '₦15,000' },
    { id: '#TRX-7891', passenger: 'James Okon', route: 'Abuja → PHC', date: 'Oct 24, 2023', seat: '12B', status: 'Pending', price: '₦12,500' },
    { id: '#TRX-7892', passenger: 'Anita Baker', route: 'Lagos → Benin', date: 'Oct 23, 2023', seat: '8C', status: 'Cancelled', price: '₦8,000' },
    { id: '#TRX-7893', passenger: 'Michael West', route: 'Kano → Lagos', date: 'Oct 23, 2023', seat: '2A', status: 'Confirmed', price: '₦22,000' },
    { id: '#TRX-7894', passenger: 'Chioma Jesus', route: 'PHC → Lagos', date: 'Oct 22, 2023', seat: '15D', status: 'Confirmed', price: '₦18,500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800">Recent Bookings</h3>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Passenger</th>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Date & Seat</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.passenger}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{booking.route}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{booking.date}</div>
                  <div className="text-xs text-gray-400">Seat {booking.seat}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(booking.status))}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.price}</td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
