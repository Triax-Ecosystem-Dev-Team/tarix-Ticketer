import React from 'react';
import { Outlet } from 'react-router-dom';
import TicketerHeader from '../../../modules/ticketer/components/layout/TicketerHeader';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TicketerHeader />
      <div className="flex flex-1 w-full">
        <main className="flex-1 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
