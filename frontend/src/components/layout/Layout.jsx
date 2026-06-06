import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#F7FAFF] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 overflow-hidden w-full">
      {/* Sidebar navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Navbar */}
        <Navbar onSearchChange={setSearchQuery} />
        
        {/* Scrollable page container */}
        <main className="flex-1 overflow-auto bg-[#F7FAFF] dark:bg-[#070B14] transition-colors duration-300">
          <Outlet context={{ sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
}
