import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarItem({ item, isOpen }) {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = currentPath === item.path || 
    (item.path.includes('?') && 
     currentPath.startsWith(item.path.split('?')[0]) && 
     currentPath.includes(item.path.split('?')[1]));

  return (
    <div className="relative group">
      <Link
        to={item.path}
        aria-label={item.label}
        className={`
          flex items-center gap-2.5 px-3 py-2 rounded-lg
          transition-all duration-200 cursor-pointer w-full
          ${isActive
            ? 'bg-[#1a56db]/10 text-[#1a56db] dark:bg-blue-600/20 dark:text-blue-400 font-semibold'
            : 'text-[#555] hover:text-[#1a56db] hover:bg-[#f0f4ff] dark:text-[#94A3B8] dark:hover:text-white dark:hover:bg-[#0F172A]'
          }
          ${!isOpen ? 'justify-center' : ''}
        `}>
        <item.icon
          size={16}
          className="shrink-0"
        />
        {isOpen && (
          <span className="text-[13px] font-medium whitespace-nowrap
            overflow-hidden transition-all duration-200">
            {item.label}
          </span>
        )}
      </Link>

      {/* Tooltip — only when collapsed */}
      {!isOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2
          ml-2 px-2 py-1 bg-gray-900 text-white text-xs
          rounded-md whitespace-nowrap opacity-0
          group-hover:opacity-100 transition-opacity
          duration-150 pointer-events-none z-50
          border border-white/10">
          {item.label}
        </div>
      )}
    </div>
  );
}
