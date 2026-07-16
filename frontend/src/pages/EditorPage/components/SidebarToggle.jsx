import React from 'react';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { LuX } from 'react-icons/lu';

export default function SidebarToggle({
  side, collapsed, onClick, isMobile,
}) {
  const Icon = collapsed ? FaPlus : LuX;
  const style = side === 'left'
    ? { left: collapsed ? '8px' : (isMobile ? 'calc(85vw + 8px)' : '268px'), transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }
    : { right: collapsed ? '8px' : (isMobile ? 'calc(85vw + 8px)' : '268px'), transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };

  return (
    <div style={{
      position: 'absolute', top: '12px', zIndex: 1600, ...style,
    }}
    >
      <button
        className="sidebar-toggle-btn"
        onClick={onClick}
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
        title={`${collapsed ? 'Expand' : 'Collapse'} ${side === 'left' ? 'Navigation' : 'Collaborations'} Sidebar`}
      >
        {side === 'left'
          ? <Icon size={16} />
          : (collapsed ? <FaUsers size={16} /> : <LuX size={16} />)}
      </button>
    </div>
  );
}
