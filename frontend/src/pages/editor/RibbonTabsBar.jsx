import { RIBBON_TABS, STATIC_MENU_ALERTS } from "../../utils/editingpage.helper";


export default function RibbonTabsBar({
  activeRibbonTab, setActiveRibbonTab, theme, isMobile,
}) {
  return (
    <div
      className="word-ribbon-tabs-bar"
      style={{
        background: theme === 'dark' ? '#0d1117' : '#f8fafc',
        color: theme === 'dark' ? '#ffffff' : '#0f172a',
        borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
        ...(isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: 'nowrap' } : {})
      }}
    >
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.file)}>File</button>
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