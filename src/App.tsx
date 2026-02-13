import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './shared/components/Header';
import LoadingScreen from './shared/components/LoadingScreen';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main content area - routes will render here */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
