import { useState } from 'react';
import './Layout.css';
import { Link, useLocation } from 'react-router-dom';

const SG_LINKS = [
  { label: 'Should I Get a Car?', to: '/singapore/should-i-get-a-car' },
  { label: 'Buying Guide', to: '/singapore/buying-guide' },
  { label: 'Leasing Guide', to: '/singapore/leasing-guide' },
  { label: 'COE Explained', to: '/singapore/coe-guide' },
  { label: 'On-Road Price Calculator', to: '/singapore/car-on-road-price-calculator' },
  { label: 'Cost of Driving (ERP)', to: '/singapore/cost-of-driving' },
  { label: 'Car Loans', to: '/singapore/car-loans' },
  { label: 'Insurance Guide', to: '/singapore/insurance-guide' },
  { label: 'EV Guide', to: '/singapore/ev-guide' },
  { label: 'Licence Conversion', to: '/singapore/licence-conversion' },
  { label: 'Child Car Seats', to: '/singapore/child-car-seats' },
  { label: 'Subscription vs Ownership', to: '/singapore/subscription-vs-ownership' },
  { label: 'Lease vs Buy Calculator', to: '/singapore/calculators' },
  { label: 'Garage Finder', to: '/singapore/garage-finder' },
];

const SG_ARTICLES = [
  { label: 'Buying a Used Car: COE, PARF & Paperwork', to: '/singapore/buying-guide' },
  { label: 'How the COE System Works for Expats', to: '/singapore/coe-guide' },
  { label: 'ERP 2.0: The Real Cost of Driving', to: '/singapore/cost-of-driving' },
  { label: 'Car Loans: MAS LTV Rules Explained', to: '/singapore/car-loans' },
  { label: 'Child Car Seats & ISOFIX Laws', to: '/singapore/child-car-seats' },
  { label: 'Subscription vs Ownership Compared', to: '/singapore/subscription-vs-ownership' },
];

const HK_LINKS = [
  { label: 'Should I Get a Car?', to: '/hong-kong/should-i-get-a-car' },
  { label: 'Buying Guide', to: '/hong-kong/buying-guide' },
  { label: 'Leasing Guide', to: '/hong-kong/leasing-guide' },
  { label: 'FRT Explained', to: '/hong-kong/frt-tax-explained' },
  { label: 'FRT Calculator', to: '/hong-kong/first-registration-tax-calculator' },
  { label: 'Insurance Guide', to: '/hong-kong/insurance-guide' },
  { label: 'EV Guide', to: '/hong-kong/ev-guide' },
  { label: 'Licence Conversion', to: '/hong-kong/licence-conversion' },
  { label: 'MOT & Maintenance', to: '/hong-kong/mot-maintenance' },
  { label: 'Selling Your Car', to: '/hong-kong/selling-guide' },
  { label: 'Lease vs Buy Calculator', to: '/hong-kong/calculators' },
  { label: 'Garage Finder', to: '/hong-kong/garage-finder' },
];

const HK_ARTICLES = [
  { label: 'Buying a Car in HK: The Parking Reality', to: '/hong-kong/buying-guide' },
  { label: 'First Registration Tax Explained', to: '/hong-kong/frt-tax-explained' },
  { label: 'Car Insurance for HK Expats', to: '/hong-kong/insurance-guide' },
  { label: 'Converting Your Driving Licence', to: '/hong-kong/licence-conversion' },
  { label: 'Selling Your Car When Leaving HK', to: '/hong-kong/selling-guide' },
];

const SIDEBAR_BG = '#0d1117';
const SIDEBAR_W = 240;

// Brand name styled to match home page (Auto in smaller red)
function BrandName({ size }) {
  const s = size || 18;
  return (
    <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, lineHeight: 1 }}>
      <span style={{ fontSize: s, color: '#fff' }}>Expat</span>
      <span style={{ fontSize: Math.round(s * 0.72), color: '#e63946' }}>Auto</span>
      <span style={{ fontSize: s, color: '#fff' }}>Adviser</span>
    </span>
  );
}

function NavSection({ title, links, location, flagEmoji, landingPath, accentHex, accentRgb }) {
  return (
    <div>
      <Link
        to={landingPath}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', padding: '14px 20px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{ fontSize: 20 }}>{flagEmoji}</span>
        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 15, color: '#fff' }}>
          {title}
        </span>
      </Link>
      <div style={{ padding: '8px 0' }}>
        {links.map(link => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block',
                padding: '7px 20px 7px 44px',
                fontSize: 13.5,
                color: active ? '#fff' : '#94a3b8',
                background: active ? ('rgba(' + accentRgb + ',0.18)') : 'transparent',
                fontWeight: active ? 600 : 400,
                borderLeft: active ? ('3px solid ' + accentHex) : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


export default function Layout({ city, children, relatedLinks }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isSG = city === 'sg';
  const links = isSG ? SG_LINKS : HK_LINKS;
  const accentHex = isSG ? '#e63946' : '#2a9d8f';
  const accentRgb = isSG ? '232,52,28' : '42,157,143';
  const landingPath = isSG ? '/singapore' : '/hong-kong';
  const flagEmoji = isSG ? '🇸🇬' : '🇭🇰';
  const cityLabel = isSG ? 'Singapore' : 'Hong Kong';

  const articles = isSG ? SG_ARTICLES : HK_ARTICLES;

  const sidebarContent = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <NavSection
        title={cityLabel}
        links={links}
        location={location}
        flagEmoji={flagEmoji}
        landingPath={landingPath}
        accentHex={accentHex}
        accentRgb={accentRgb}
      />
      {/* Articles section */}
      <div style={{ padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: accentHex, padding: '10px 20px 6px',
        }}>
          Articles
        </div>
        {articles.map(a => {
          const active = location.pathname === a.to;
          return (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: 'block',
                padding: '5px 20px 5px 44px',
                fontSize: 12,
                lineHeight: 1.3,
                color: active ? '#fff' : '#94a3b8',
                background: active ? ('rgba(' + accentRgb + ',0.18)') : 'transparent',
                fontWeight: active ? 600 : 400,
                borderLeft: active ? ('3px solid ' + accentHex) : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
            >
              {a.label}
            </Link>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          to={isSG ? '/hong-kong' : '/singapore'}
          style={{ fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; }}
        >
          {isSG ? '🇭🇰' : '🇸🇬'}{' '}
          Switch to {isSG ? 'Hong Kong' : 'Singapore'} guides
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui,-apple-system,sans-serif' }}>

      {/* Desktop sidebar — fixed, full height */}
      <div
        className="sidebar-desktop"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: SIDEBAR_W, height: '100vh', overflowY: 'auto',
          background: SIDEBAR_BG,
          zIndex: 100,
        }}
      >
        <div style={{ padding: '20px 20px 8px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <BrandName size={18} />
          </Link>
        </div>
        {sidebarContent}
      </div>

      {/* Mobile top header — no city label, just brand + Guides toggle */}
      <div
        className="mobile-header"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          height: 56, background: SIDEBAR_BG,
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BrandName size={20} />
        </Link>
        <button
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open guides menu'}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6,
            cursor: 'pointer',
            color: '#e2e8f0',
            padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600,
          }}
        >
          {mobileOpen ? '\u2715' : '\u2630'}{' '}
          {mobileOpen ? 'Close' : 'Guides'}
        </button>
      </div>

      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 198,
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-in drawer */}
      <div
        style={{
          position: 'fixed', top: 56, left: 0, bottom: 0, zIndex: 199,
          width: SIDEBAR_W + 20,
          background: SIDEBAR_BG, overflowY: 'auto',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: mobileOpen ? '4px 0 24px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {sidebarContent}
      </div>

      {/* Page layout: spacer + content */}
      <div style={{ display: 'flex' }}>
        {/* Desktop spacer to offset fixed sidebar */}
        <div className="sidebar-spacer" style={{ width: SIDEBAR_W, flexShrink: 0 }} />

        {/* Main content */}
        <main
          className="main-content"
          style={{ flex: 1, minWidth: 0 }}
        >
          {children}

          {relatedLinks && relatedLinks.length > 0 && (
            <div style={{ marginTop: 40, borderTop: '2px solid #e5e7eb', paddingTop: 32 }}>
              <h2 style={{
                fontSize: 14, fontWeight: 700, marginBottom: 16,
                color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Related Guides
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {relatedLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      display: 'inline-block', padding: '10px 18px',
                      background: '#eef2ff', borderRadius: 8,
                      color: '#3730a3', textDecoration: 'none',
                      fontWeight: 600, fontSize: 14,
                      border: '1px solid #c7d2fe',
                    }}
                  >
                    {link.label}{' →'}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #e5e7eb', background: '#fff',
        padding: '32px 20px', textAlign: 'center',
      }}>
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}
        >
          <span style={{ fontSize: 18 }}>🚗</span>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16 }}>
            <span style={{ color: '#1a1a2e' }}>Expat</span>
            <span style={{ fontSize: 12, color: '#e63946' }}>Auto</span>
            <span style={{ color: '#1a1a2e' }}>Adviser</span>
          </span>
        </Link>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#9ca3af' }}>
          Independent car advice for expats in Singapore and Hong Kong.
        </p>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#d1d5db' }}>
          © 2026 ExpatAutoAdviser · Not financial advice · Partner links may earn commission
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
          <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</a>
          <a href="/cookies" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookies</a>
          <a href="/affiliate-disclosure" style={{ color: '#9ca3af', textDecoration: 'none' }}>Disclosure</a>
          <a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
