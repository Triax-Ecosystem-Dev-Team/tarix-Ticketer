import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { TicketerDashboard } from '@/modules/ticketer/TicketerModule';

// Placeholder components - you'll create these later
const BusStatusPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Bus Status</h1>
    <p className="text-text-gray mt-2">Real-time bus tracking</p>
  </div>
);

const OverviewPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Overview</h1>
    <p className="text-text-gray mt-2">Dashboard overview</p>
  </div>
);

const BookingPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">My Bookings</h1>
    <p className="text-text-gray mt-2">Your booking history</p>
  </div>
);

const NotFoundPage = () => (
  <div className="p-6 text-center">
    <h1 className="text-4xl font-bold text-text-dark">404</h1>
    <p className="text-text-gray mt-2">Page not found</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <TicketerDashboard />,
      },
      {
        path: 'bus-status',
        element: <BusStatusPage />,
      },
      {
        path: 'overview',
        element: <OverviewPage />,
      },
      {
        path: 'bookings',
        element: <BookingPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
