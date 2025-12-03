import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import AppRoutes from './routes/AppRoutes';
import { colors } from './styles/colors';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: colors.gray50 }}>
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
        />
        
        <div className="lg:ml-72">
          <Topbar setIsOpen={setSidebarOpen} />
          
          <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto">
              <AppRoutes />
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;