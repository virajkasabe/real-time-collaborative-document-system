import React from 'react';
import { LuX } from 'react-icons/lu';

const TOAST_ICON = { success: '✅', error: '⛔', warning: '⚠️', info: 'ℹ️' };
const TOAST_ACCENT = { success: '#26DE81', error: '#EB3B5A', warning: '#FED330', info: '#45AAF2' };

export default function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      className="own-toast-stack"
      style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '8px',
        maxWidth: 'min(90vw, 340px)',
      }}
    >
      <style>{'@keyframes ownToastIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }'}</style>
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          onClick={() => onDismiss(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg, #ffffff)', color: 'var(--text, #111827)',
            borderLeft: `4px solid ${TOAST_ACCENT[t.type] || TOAST_ACCENT.info}`,
            borderRadius: '8px', padding: '10px 12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            fontSize: '13px', cursor: 'pointer',
            animation: 'ownToastIn 0.18s ease-out',
          }}
        >
          <span aria-hidden="true">{TOAST_ICON[t.type] || TOAST_ICON.info}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <LuX size={12} />
        </div>
      ))}
    </div>
  );
}
