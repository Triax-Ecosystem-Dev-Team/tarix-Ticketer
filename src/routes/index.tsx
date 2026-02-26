import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import TicketerDashboard from '../modules/ticketer/views/TicketerDashboard';
import UserIdentification from '../modules/ticketer/views/UserIdentification';
import PassengerDetails from '../modules/ticketer/views/PassengerDetails';
import SeatSelection from '../modules/ticketer/views/SeatSelection';
import ExtraBaggage from '../modules/ticketer/views/ExtraBaggage';
import PaymentMethod from '../modules/ticketer/views/PaymentMethod';
import BookingConfirmation from '../modules/ticketer/views/BookingConfirmation';
import BookingSuccess from '../modules/ticketer/views/BookingSuccess';

// Placeholder components
import BusStatusPage from '../modules/ticketer/views/BusStatusPage';
import PassengerList from '../modules/ticketer/views/PassengerList';

// Admin Module
import { AdminLayout, AdminDashboard, CreateTrip } from '../modules/admin/AdminModule';

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
        path: 'booking/identify',
        element: <UserIdentification />,
      },
      {
        path: 'booking/passenger-details',
        element: <PassengerDetails />,
      },
      {
        path: 'booking/select-seat',
        element: <SeatSelection />,
      },
      {
        path: 'booking/baggage',
        element: <ExtraBaggage />,
      },
      {
        path: 'booking/payment',
        element: <PaymentMethod />,
      },
      {
        path: 'booking/confirmation',
        element: <BookingConfirmation />,
      },
      {
        path: 'booking/success',
        element: <BookingSuccess />,
      },
      {
        path: 'bus-status',
        element: <BusStatusPage />,
      },
      {
        path: 'bus-status/passengers/:busId',
        element: <PassengerList />,
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
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'trips/create',
        element: <CreateTrip />,
      },
    ],
  },
]);
