import { Link } from 'react-router-dom';
import athenuraLogo from '../assets/athenura-logo.png';

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/athenura/',
    icon: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/athenura.in?igsh=Ynl5aHBrajUxMDc4',
    icon: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.73 3.73 0 0 1-1.38-.9 3.73 3.73 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.66.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />,
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/athenura_in',
    icon: <path d="M23.95 4.57a9.83 9.83 0 0 1-2.83.78 4.94 4.94 0 0 0 2.17-2.72 9.86 9.86 0 0 1-3.13 1.2 4.92 4.92 0 0 0-8.38 4.48A13.94 13.94 0 0 1 1.67 3.15a4.9 4.9 0 0 0 1.52 6.57 4.9 4.9 0 0 1-2.23-.62v.06a4.92 4.92 0 0 0 3.95 4.83 4.94 4.94 0 0 1-2.21.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.55 2.21c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.01-.63a10 10 0 0 0 2.4-2.54z" />,
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@athenura',
    icon: <path d="M13.54 12a6.72 6.72 0 0 1-6.72 6.72A6.72 6.72 0 0 1 .1 12a6.72 6.72 0 0 1 6.72-6.72A6.72 6.72 0 0 1 13.54 12zM20.96 12c0 3.54-1.5 6.42-3.36 6.42S14.24 15.54 14.24 12s1.5-6.42 3.36-6.42 3.36 2.88 3.36 6.42zM23.9 12c0 3.17-.53 5.75-1.18 5.75-.65 0-1.18-2.58-1.18-5.75s.53-5.75 1.18-5.75c.65 0 1.18 2.58 1.18 5.75z" />,
  },
];

export default function FooterPage() {
  return (
    <footer style={{ backgroundColor: '#0d1b3e', color: '#cbd5e1' }}>
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img src={athenuraLogo} alt="Athenura" className="h-9 w-auto object-contain" style={{ filter: 'brightness(10)', opacity: '0.95' }} />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
              Real-time collaboration document system inspired by Google Docs and Microsoft Word with secure access and powerful editing. 
            </p>
            <h4 className="mt-6 text-sm font-semibold" style={{ color: '#ffffff' }}>Follow Us</h4>
            <div className="mt-3 flex gap-3">
              {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">{icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-base font-semibold" style={{ color: '#ffffff' }}>Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {[['About Us', '/about'], ['Contact Us', '/contact'], ['Help', '/help'], ['FAQs', '/help']].map(([label, to]) => (
                <li key={label}><Link to={to} style={{ color: '#cbd5e1' }} className="hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold" style={{ color: '#ffffff' }}>Services</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {['Real-Time Document Editing', 'Secure File Sharing', 'Version History & Restore', 'Team Collaboration Tools'].map(s => (
                <li key={s}><a href="#" style={{ color: '#cbd5e1' }} className="hover:text-white">{s}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold" style={{ color: '#ffffff' }}>Contact Us</h4>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="currentColor"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 2.24-7.4 5.55a1 1 0 0 1-1.2 0L4 8.24V18h16V8.24z" /></svg>
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Email</p>
                  <a href="mailto:official@athenura.in" className="font-medium hover:underline" style={{ color: '#ffffff' }}>official@athenura.in</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="currentColor"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.56 1 1 0 0 1-.25 1.02l-2.2 2.21z" /></svg>
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: '#64748b' }}>Phone</p>
                  <a href="tel:+919835051934" className="font-medium hover:underline" style={{ color: '#ffffff' }}>+91 98350 51934</a>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-base font-semibold" style={{ color: '#ffffff' }}>Location</h4>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Athenura+Technologies+Noida+Uttar+Pradesh+201309+India"
              target="_blank" rel="noopener noreferrer"
              className="relative overflow-hidden h-36 rounded-xl border border-white/10 mt-4 flex cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #1e2d5a, #0f1f3d)' }}
            >
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                {[0, 25, 50, 75, 100].map((p) => (
                  <g key={p}>
                    <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#3f5f8f" />
                    <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#3f5f8f" />
                  </g>
                ))}
              </svg>
              <div className="relative z-10 w-full flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="white"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" /></svg>
                </div>
                <p className="font-semibold text-sm" style={{ color: '#93c5fd' }}>Athenura Technologies</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>Noida, Uttar Pradesh, India</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-center" style={{ color: '#64748b' }}>
          <p>© 2026 Athenura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
