import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Main content area - routes will render here */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
