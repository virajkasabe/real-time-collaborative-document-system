export const RIBBON_TABS = ['home', 'insert', 'design', 'layout', 'review', 'view'];

export const STATIC_MENU_ALERTS = {
  file: 'File Options:\n- Back to Dashboard\n- Document is auto-saved locally.',
  references: 'References Ribbon: Heading indexes are automatically built.',
  mailings: 'Mailings Ribbon: Collaborative share triggers are active.',
  help: 'Help Ribbon: Contact Antigravity AI for developer notes.',
};

export const STYLE_CARDS = [
  { type: 'normal', label: 'Normal', preview: 'AaBbCc', style: {} },
  { type: 'title', label: 'Title', preview: 'Title', style: { fontWeight: 'bold' } },
  { type: 'heading1', label: 'Heading 1', preview: 'Heading 1', style: { color: 'var(--accent)', fontWeight: '600' } },
  { type: 'heading2', label: 'Heading 2', preview: 'Heading 2', style: { color: 'var(--accent)', fontWeight: '500' } },
  { type: 'subtitle', label: 'Subtitle', preview: 'Sub', style: { fontStyle: 'italic' } },
];

export const ACCENT_SWATCHES = ['#0D6EFD', '#7C3AED', '#DC2626', '#059669', '#EA580C', '#0891B2'];

export const PAGE_LAYOUTS = {
  narrow: { label: 'Narrow', maxWidth: '680px' },
  normal: { label: 'Normal', maxWidth: '816px' },
  wide: { label: 'Wide', maxWidth: '1000px' },
};

export const SIMULATED_TEAM_REPLIES = [
  'That looks perfect! The structure flows really well.',
  'Oh nice, I see you updated the main objectives block.',
  'Makes sense! I will check the proposal outlines again.',
  'Let me know when you need my review on the setup notes.',
  'Awesome! The live outline widget is matching perfectly.',
  'Should we add another section describing our REST endpoint specs?',
];

export const SIMULATED_TEAM_MEMBERS = ['Lisa Chen', 'Alex Johnson', 'Team Member'];

export const FONT_SIZE_GROW = { small: 'medium', medium: 'large', large: 'huge', huge: 'huge' };
export const FONT_SIZE_SHRINK = { huge: 'large', large: 'medium', medium: 'small', small: 'small' };

export const AUTOSAVE_DEBOUNCE_MS = 80;
export const CURSOR_SEND_DEBOUNCE_MS = 70;
export const REMOTE_CURSOR_TTL_MS = 500;
export const TYPING_CURSOR_BROADCAST_DEBOUNCE_MS = 15;
export const OPERATION_DEDUPE_WINDOW_MS = 80;
export const TITLE_SAVE_DEBOUNCE_MS = 100;
export const TOAST_DURATION_MS = 1500;
export const MOBILE_BREAKPOINT = 768;
export const MAX_UNDO_STACK = 100;

export const CURSOR_COLOR_PALETTE = ['#FF6B6B', '#4ECDC4', '#45AAF2', '#FED330', '#A55EEA', '#26DE81', '#FD9644', '#EB3B5A'];
