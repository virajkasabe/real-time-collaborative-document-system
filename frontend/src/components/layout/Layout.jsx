import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor/');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="flex h-screen bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 overflow-hidden w-full relative"
      style={{ background: isEditor ? '#0d1117' : undefined }}
    >
      {/* Sidebar navigation */}
      {!isEditor && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

      {/* Mobile sidebar overlay backdrop */}
      {!isEditor && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-35 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"
        style={{ background: isEditor ? '#0d1117' : undefined }}
      >
        {/* Navbar */}
        {!isEditor && <Navbar onSearchChange={setSearchQuery} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}

        {/* Scrollable page container */}
        <main
          className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300"
          style={{
            background: isEditor ? '#0d1117' : undefined,
            overflow: isEditor ? 'hidden' : undefined,
            marginLeft: 0,
          }}
        >
          <Outlet context={{ sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
}
