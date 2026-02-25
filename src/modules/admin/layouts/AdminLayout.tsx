import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* ── Content area shifts right only on desktop ── */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <AdminHeader onMenuToggle={toggleSidebar} />
        <main className="flex-1 pt-16 sm:pt-20 px-4 sm:px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
