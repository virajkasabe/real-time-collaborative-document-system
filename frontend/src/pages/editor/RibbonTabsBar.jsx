import { RIBBON_TABS } from "../../utils/editingpage.helper";


export default function RibbonTabsBar({
  activeRibbonTab, setActiveRibbonTab, theme, isMobile,
}) {
  return (
    <div
      className="word-ribbon-tabs-bar"
      style={isMobile ? { overflowX: 'auto', WebkitOverflowScrolling: 'touch', flexWrap: 'nowrap' } : undefined}
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
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.references)}>References</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.mailings)}>Mailings</button>
      <button className="ribbon-tab-header-btn" onClick={() => alert(STATIC_MENU_ALERTS.help)}>Help</button>
      {theme && null}
    </div>
  );
}