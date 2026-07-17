import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-[#f4f6fa] dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300 overflow-hidden w-full relative">
      {/* Sidebar navigation */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header 
          onSearchChange={setSearchQuery} 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
        />
        
        {/* Scrollable page container */}
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-[#f4f6fa] dark:bg-[#070B14] transition-colors duration-300">
          <Outlet context={{ sidebarOpen: !sidebarCollapsed, sidebarCollapsed, searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
}
