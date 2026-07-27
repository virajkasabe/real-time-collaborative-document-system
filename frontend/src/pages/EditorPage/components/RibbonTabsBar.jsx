import React from 'react';
import { RIBBON_TABS, STATIC_MENU_ALERTS } from '../utils/constants';

export default function RibbonTabsBar({
  activeRibbonTab, setActiveRibbonTab, theme, isMobile, onFileMenuClick,
}) {
  return (
    <div
      className="word-ribbon-tabs-bar"
      style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: 'nowrap' } : undefined}
    >
      <button className="ribbon-tab-header-btn" onClick={onFileMenuClick}>File</button>
      {RIBBON_TABS.map((tab) => (
        <button
          key={tab}
          className={`ribbon-tab-header-btn ${activeRibbonTab === tab ? 'active' : ''}`}
          onClick={() => setActiveRibbonTab(tab)}
          style={{ whiteSpace: 'nowrap' }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
      {theme && null}
    </div>
  );
}
