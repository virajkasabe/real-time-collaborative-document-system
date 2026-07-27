import { LuCheck } from "react-icons/lu";

export default function StatusBar({
  wordCount, isSyncing, zoomPercent, setZoomPercent, isMobile,
}) {
  return (
    <footer className="word-status-bar" style={isMobile ? { flexWrap: 'wrap', gap: '6px', fontSize: '11px' } : undefined}>
      <div className="status-bar-left">
        <span>Page 1 of 1</span>
        <span className="status-bar-separator">|</span>
        <span>{wordCount} words</span>
        {!isMobile && (
          <>
            <span className="status-bar-separator">|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LuCheck size={12} style={{ color: '#10b981' }} /> Spelling: Checked
            </span>
            <span className="status-bar-separator">|</span>
            <span>English (India)</span>
            <span className="status-bar-separator">|</span>
            <span>Accessibility: Good to go</span>
          </>
        )}
      </div>
      <div className="status-bar-center">
        <div className={`sync-badge ${isSyncing ? 'syncing' : ''}`} style={{ border: 'none', background: 'transparent', padding: 0 }}>
          <span className="sync-dot" />
          <span>{isSyncing ? 'AutoSave: Syncing...' : 'Saved to Cloud'}</span>
        </div>
      </div>
      <div className="status-bar-right">
        {!isMobile && (
          <>
            <button
              type="button"
              className="status-bar-btn"
              onClick={() => alert('Focus Mode activated! Enjoy distraction-free writing.')}
              style={{
                background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer',
              }}
            >
              Focus
            </button>
            <span className="status-bar-separator">|</span>
          </>
        )}
        <button onClick={() => setZoomPercent((p) => Math.max(50, p - 10))} className="zoom-btn" title="Zoom Out">-</button>
        {!isMobile && (
          <input
            type="range"
            min="50"
            max="150"
            value={zoomPercent}
            onChange={(e) => setZoomPercent(Number(e.target.value))}
            className="zoom-slider"
            title="Zoom slider"
          />
        )}
        <button onClick={() => setZoomPercent((p) => Math.min(150, p + 10))} className="zoom-btn" title="Zoom In">+</button>
        <span style={{ fontWeight: 600, width: '36px', textAlign: 'right' }}>{zoomPercent}%</span>
      </div>
    </footer>
  );
}

