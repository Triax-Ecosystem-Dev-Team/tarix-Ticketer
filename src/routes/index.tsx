import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardLayout from '../shared/components/layout/DashboardLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import LoginPage from '../modules/auth/views/LoginPage';
import TicketerDashboard from '../modules/ticketer/views/TicketerDashboard';
import UserIdentification from '../modules/ticketer/views/UserIdentification';
import PassengerDetails from '../modules/ticketer/views/PassengerDetails';
import SeatSelection from '../modules/ticketer/views/SeatSelection';
import ExtraBaggage from '../modules/ticketer/views/ExtraBaggage';
import PaymentMethod from '../modules/ticketer/views/PaymentMethod';
import BookingConfirmation from '../modules/ticketer/views/BookingConfirmation';
import BookingSuccess from '../modules/ticketer/views/BookingSuccess';
import FindTicket from '../modules/ticketer/views/FindTicket';

// Placeholder components
import BusStatusPage from '../modules/ticketer/views/BusStatusPage';
import PassengerList from '../modules/ticketer/views/PassengerList';
import Profile from '../shared/views/account/Profile';
import Help from '../shared/views/account/Help';
import Security from '../shared/views/account/Security';
import Preferences from '../shared/views/account/Preferences';

// Admin Module
import {
  AdminLayout,
  AdminDashboard,
  CreateTrip,
  FleetManagement,
  AddBus,
  DriverManagement,
  RevenueAnalytics,
  ReportsAnalytics,
  Settings,
  AddTeamMember,
  MemberManager,
  AddTicketer,
  AddDriver,
  TripOverview,
  TripDetails,
  TripReport,
  CompletedTrips,
  BusReport
} from '../modules/admin/AdminModule';

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
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['Ticketer', 'Passenger', 'Admin']} />,
    children: [
      {
        // Enclosed Flow (Booking)
        path: '',
        element: <App />,
        children: [
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
        ]
      },
      {
        // Utility/Dashboard Routes (Global Nav)
        path: '',
        element: <DashboardLayout />,
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
            path: 'find-ticket',
            element: <FindTicket />,
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
            path: 'account/profile',
            element: <Profile />,
          },
          {
            path: 'account/settings',
            element: <Settings />,
          },
          {
            path: 'account/security',
            element: <Security />,
          },
          {
            path: 'account/preferences',
            element: <Preferences />,
          },
          {
            path: 'account/help',
            element: <Help />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['Admin']} />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'trips',
        element: <TripOverview />,
      },
      {
        path: 'trips/:tripId',
        element: <TripDetails />,
      },
      {
        path: 'trips/report/:tripId',
        element: <TripReport />,
      },
      {
        path: 'trips/completed',
        element: <CompletedTrips />,
      },
      {
        path: 'trips/create',
        element: <CreateTrip />,
      },
      {
        path: 'buses',
        element: <FleetManagement />,
      },
      {
        path: 'buses/add',
        element: <AddBus />,
      },
      {
        path: 'buses/edit/:id',
        element: <AddBus />,
      },
      {
        path: 'fleet/report/:id',
        element: <BusReport />,
      },
      {
        path: 'drivers',
        element: <DriverManagement />,
      },
      {
        path: 'revenue',
        element: <RevenueAnalytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'reports',
        element: <ReportsAnalytics />,
      },
      {
        path: 'team/add',
        element: <AddTeamMember />,
      },
      {
        path: 'team/add/ticketer',
        element: <AddTicketer />,
      },
      {
        path: 'team/edit/ticketer/:id',
        element: <AddTicketer />,
      },
      {
        path: 'team/add/driver',
        element: <AddDriver />,
      },
      {
        path: 'team/edit/driver/:id',
        element: <AddDriver />,
      },
      {
        path: 'team',
        element: <MemberManager />,
      },
      {
        path: 'account/profile',
        element: <Profile />,
      },
      {
        path: 'account/settings',
        element: <Settings />,
      },
      {
        path: 'account/security',
        element: <Security />,
      },
      {
        path: 'account/preferences',
        element: <Preferences />,
      },
      {
        path: 'account/help',
        element: <Help />,
      },
        ],
      },
    ],
  },
]);
