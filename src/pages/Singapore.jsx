import { useState } from 'react';
import { Link } from 'react-router-dom';

const PATRICK_IMG = '/patrick.png';

// COE data — update after each bidding exercise (held twice monthly)
const COE_DATA = {
  updatedAt: 'Mar 2026',
  categories: [
    { cat: 'Cat A', label: 'Cars ≤1600cc & ≤130bhp', price: '$108,220', change: '+1.6%', up: true },
    { cat: 'Cat B', label: 'Cars >1600cc or >130bhp', price: '$114,002', change: '+8.6%', up: true },
    { cat: 'Cat C', label: 'Goods vehicles & buses', price: '$76,000', change: '+1.3%', up: true },
    { cat: 'Cat D', label: 'Motorcycles', price: '$8,602', change: '+7.7%', up: true },
    { cat: 'Cat E', label: 'Open (any vehicle)', price: '$114,890', change: '+1.8%', up: true },
  ],
};

/* Sidebar section definitions — controls heading labels and ordering */
const SG_SIDEBAR_SECTIONS = [
  { heading: 'Getting Started', keys: ['should-i-get-a-car', 'buying-guide', 'leasing-guide'] },
  { heading: 'Costs & Finance', keys: ['coe-guide', 'cost-of-driving', 'car-loans', 'insurance-guide'] },
  { heading: 'Ownership & Lifestyle', keys: ['ev-guide', 'ev-charging', 'licence-conversion', 'child-car-seats', 'subscription-vs-ownership'] },
  { heading: 'Tools & Services', keys: ['calculators', 'garage-finder'] },
];

/* Albert's long-form articles — shown separately with full titles */
const SG_ARTICLES = [
  { label: 'Buying a Used Car: COE, PARF & Paperwork', to: '/singapore/buying-guide' },
  { label: 'How the COE System Works for Expats', to: '/singapore/coe-guide' },
  { label: 'ERP 2.0: The Real Cost of Driving', to: '/singapore/cost-of-driving' },
  { label: 'Car Loans: MAS LTV Rules Explained', to: '/singapore/car-loans' },
  { label: 'Child Car Seats & ISOFIX Laws', to: '/singapore/child-car-seats' },
  { label: 'Subscription vs Ownership Compared', to: '/singapore/subscription-vs-ownership' },
];

const SG_GUIDES = [
  /* — Getting Started — */
  {
    n: '01',
    label: 'Should I Get a Car?',
    to: '/singapore/should-i-get-a-car',
    desc: 'Is owning a car in Singapore actually worth it? We crunch the real numbers.',
    img: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '02',
    label: 'Buying Guide',
    to: '/singapore/buying-guide',
    desc: 'COE, OMV, ARF — a plain-English walkthrough of buying a car in Singapore.',
    img: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '03',
    label: 'Leasing Guide',
    to: '/singapore/leasing-guide',
    desc: 'For most expats, leasing beats buying. Here\'s how to find a deal that won\'t sting.',
    img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=75&auto=format&fit=crop',
  },
  /* — Costs & Finance — */
  {
    n: '04',
    label: 'COE Explained',
    to: '/singapore/coe-guide',
    desc: 'How the Certificate of Entitlement system works — bidding, categories, and what it costs.',
    img: 'https://images.unsplash.com/photo-1594028411108-96a5b0302a4a?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '05',
    label: 'Cost of Driving (ERP)',
    to: '/singapore/cost-of-driving',
    desc: 'ERP 2.0, parking, petrol — the real monthly cost of driving in Singapore.',
    img: 'https://images.unsplash.com/photo-1583475020836-8048d7c92cc3?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '06',
    label: 'Car Loans',
    to: '/singapore/car-loans',
    desc: 'MAS LTV caps, TDSR rules, and what banks actually offer expat borrowers.',
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '07',
    label: 'Insurance Guide',
    to: '/singapore/insurance-guide',
    desc: 'What cover you actually need and how to stop overpaying on premiums.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=75&auto=format&fit=crop',
  },
  /* — Ownership & Lifestyle — */
  {
    n: '08',
    label: 'EV Guide',
    to: '/singapore/ev-guide',
    desc: 'Electric vehicles in Singapore — incentives, charging, and hidden costs.',
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '09',
    label: 'EV Charging',
    to: '/singapore/ev-charging',
    desc: 'Where to charge in Singapore — networks, home charging, costs and apps.',
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '10',
    label: 'Licence Conversion',
    to: '/singapore/licence-conversion',
    desc: 'Convert your foreign driving licence to a Singapore one — step by step.',
    img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '11',
    label: 'Child Car Seats',
    to: '/singapore/child-car-seats',
    desc: 'ISOFIX, the 1.35m rule, approved standards, and the taxi exemption.',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '12',
    label: 'Subscription vs Ownership',
    to: '/singapore/subscription-vs-ownership',
    desc: 'Car subscriptions like Carro Leap vs buying — which makes sense for expats?',
    img: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=400&q=75&auto=format&fit=crop',
  },
  /* — Tools & Services — */
  {
    n: '13',
    label: 'Calculators & Tools',
    to: '/singapore/calculators',
    desc: 'COE budget calculator, true-cost-of-ownership tool, and more.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=75&auto=format&fit=crop',
  },
  {
    n: '14',
    label: 'Garage Finder',
    to: '/singapore/garage-finder',
    desc: 'Find trusted workshops and service centres near you.',
    img: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&q=75&auto=format&fit=crop',
  },
];

const PATRICK_TIPS = [
  "Most expats on 2–3 year postings are better off leasing — the COE depreciation alone can cost you $40–60k on a purchase.",
  "Cat A COE is the one to watch. When it spikes above $100k, leasing economics look even better for smaller cars.",
  "Always budget a minimum of $250/month for parking if you're in the CBD. Some condos charge $200+ just for the season ticket.",
  "Third-party insurance is legally sufficient, but comprehensive cover is worth it — workshops here aren't cheap.",
];

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .sg-page { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #f0f2f8; background: #0a0c12; min-height: 100vh; }

  /* NAV */
  .sg-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 1.5rem; height: 52px;
    background: rgba(10,12,18,0.92); backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .sg-nav-left { display: flex; align-items: center; gap: 1.2rem; }
  .sg-logo { font-size: 0.9rem; font-weight: 700; color: #f0f2f8; text-decoration: none; letter-spacing: 0.03em; }
  .sg-logo span { color: #e8341c; }
  .sg-city-badge {
    background: rgba(232,52,28,0.15); color: #e8341c;
    border: 1px solid rgba(232,52,28,0.3); border-radius: 5px;
    padding: 0.2rem 0.6rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
  }
  .sg-switch-btn {
    display: flex; align-items: center; gap: 0.35rem;
    color: rgba(255,255,255,0.55); text-decoration: none;
    font-size: 0.78rem; font-weight: 500;
    border: 1px solid rgba(255,255,255,0.12); border-radius: 6px;
    padding: 0.28rem 0.7rem;
    transition: color 0.2s, border-color 0.2s;
  }
  .sg-switch-btn:hover { color: #2a9d8f; border-color: rgba(42,157,143,0.4); }

  /* MAIN LAYOUT */
  .sg-main { padding-top: 52px; max-width: 960px; margin: 0 auto; padding-left: 1.5rem; padding-right: 1.5rem; }

  /* HERO / CTA */
  .sg-hero {
    background: linear-gradient(135deg, rgba(232,52,28,0.12) 0%, rgba(10,12,18,0) 60%);
    border: 1px solid rgba(232,52,28,0.18); border-radius: 12px;
    padding: 1.6rem 2rem; margin: 1.4rem 0;
    display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
    flex-wrap: wrap;
  }
  .sg-hero-text h1 { font-size: clamp(1.2rem, 2.5vw, 1.6rem); font-weight: 800; color: #f0f2f8; letter-spacing: -0.02em; margin-bottom: 0.4rem; }
  .sg-hero-text p { font-size: 0.85rem; color: #8892a4; line-height: 1.5; max-width: 420px; }
  .sg-cta-form { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .sg-cta-input {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 7px; padding: 0.5rem 0.9rem; font-size: 0.82rem; color: #f0f2f8;
    width: 210px; outline: none;
  }
  .sg-cta-input::placeholder { color: #4a5568; }
  .sg-cta-btn {
    background: #e8341c; color: #fff; border: none; border-radius: 7px;
    padding: 0.5rem 1.1rem; font-size: 0.78rem; font-weight: 700;
    cursor: pointer; letter-spacing: 0.04em; white-space: nowrap;
    transition: background 0.2s;
  }
  .sg-cta-btn:hover { background: #c42a16; }

  /* COE WIDGET */
  .sg-coe-section { margin: 0 0 1.6rem; }
  .sg-section-title {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #4a5568; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;
  }
  .sg-section-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .sg-coe-grid {
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;
  }
  .sg-coe-card {
    background: #10131d; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px; padding: 0.7rem 0.75rem;
  }
  .sg-coe-cat { font-size: 0.65rem; font-weight: 700; color: #e8341c; letter-spacing: 0.06em; margin-bottom: 0.2rem; }
  .sg-coe-label { font-size: 0.6rem; color: #4a5568; margin-bottom: 0.4rem; line-height: 1.3; }
  .sg-coe-price { font-size: 0.95rem; font-weight: 800; color: #f0f2f8; margin-bottom: 0.15rem; }
  .sg-coe-change { font-size: 0.65rem; font-weight: 600; }
  .sg-coe-change.up { color: #f87171; }
  .sg-coe-change.down { color: #4ade80; }
  .sg-coe-footer { font-size: 0.65rem; color: #3a4155; margin-top: 0.5rem; }

  /* GUIDE CARDS */
  .sg-guides-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 2rem;
  }
  .sg-guides-grid > *:last-child:nth-child(odd) { grid-column: 1 / -1; }
  .sg-guide-card {
    display: block; text-decoration: none; border-radius: 10px;
    overflow: hidden; position: relative; height: 200px;
    transition: transform 0.2s, box-shadow 0.2s; background: #151820;
    /* Skip rendering + layout of off-screen cards until they scroll into view
       — cuts the initial paint burden dramatically on this 14-card grid.
       contain-intrinsic-size preserves scrollbar accuracy. Added 1 Jul 2026
       CWV fix pass. */
    content-visibility: auto;
    contain-intrinsic-size: 200px;
  }
  .sg-guide-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.5); }
  .sg-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.35s ease; }
  .sg-guide-card:hover .sg-card-bg { transform: scale(1.05); }
  .sg-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%); }
  .sg-card-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 0.9rem 1rem; }
  .sg-card-badge {
    display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px;
    font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 0.4rem;
    background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
    border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(4px);
  }
  .sg-card-title { font-size: 0.95rem; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 0.25rem; text-shadow: 0 1px 4px rgba(0,0,0,0.7); }
  .sg-card-desc { font-size: 0.7rem; color: rgba(255,255,255,0.6); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  /* PATRICK */
  .sg-patrick {
    background: #10131d; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;
    display: flex; gap: 1.4rem; align-items: flex-start;
  }
  .sg-patrick-img { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(232,52,28,0.3); flex-shrink: 0; }
  .sg-patrick-name { font-size: 0.95rem; font-weight: 700; color: #f0f2f8; margin-bottom: 0.15rem; }
  .sg-patrick-bio { font-size: 0.78rem; color: #6b7585; line-height: 1.5; margin-bottom: 1rem; }
  .sg-tips-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #e8341c; margin-bottom: 0.6rem; }
  .sg-tip {
    display: flex; gap: 0.6rem; align-items: flex-start;
    padding: 0.55rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .sg-tip:last-child { border-bottom: none; }
  .sg-tip-icon { color: #e8341c; font-size: 0.85rem; flex-shrink: 0; margin-top: 0.05rem; }
  .sg-tip-text { font-size: 0.78rem; color: #8892a4; line-height: 1.5; }


  /* MOBILE NAV DRAWER */
  .sg-aside-desktop { display: block; }
  .sg-guides-toggle { display: none; }
  .sg-mobile-drawer {
    display: none; position: fixed; top: 52px; left: 0; bottom: 0;
    width: 260px; background: #0a0c12;
    border-right: 1px solid rgba(232,52,28,0.18);
    z-index: 150; overflow-y: auto;
    transform: translateX(-110%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .sg-mobile-drawer.open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }
  .sg-mobile-backdrop {
    display: none; position: fixed; inset: 0; z-index: 140;
    background: rgba(0,0,0,0.5); opacity: 0;
    pointer-events: none; transition: opacity 0.3s ease;
  }
  .sg-mobile-backdrop.open { opacity: 1; pointer-events: auto; }

  @media (max-width: 640px) {
    .sg-guides-grid { grid-template-columns: 1fr; }
    .sg-coe-grid { grid-template-columns: repeat(2, 1fr); }
    .sg-aside-desktop { display: none !important; }
    .sg-switch-btn { display: none !important; }
      .sg-city-badge { display: none !important; }
      .sg-logo { font-size: 1.1rem !important; }
    .sg-guides-toggle { display: flex !important; }
    .sg-mobile-drawer { display: block; }
    .sg-mobile-backdrop { display: block; }
    .sg-cta-form { width: 100%; }
    .sg-cta-input { flex: 1; width: auto; }
    .sg-hero { padding: 1.2rem; }
    .sg-patrick { flex-direction: column; }
  }
`;

function GuideCard({ n, label, to, desc, img }) {
  return (
    <Link to={to} className="sg-guide-card">
      <div className="sg-card-bg" style={{ backgroundImage: `url(${img})` }} />
      <div className="sg-card-overlay" />
      <div className="sg-card-content">
        <span className="sg-card-badge">GUIDE {n}</span>
        <div className="sg-card-title">{label}</div>
        <div className="sg-card-desc">{desc}</div>
      </div>
    </Link>
  );
}

export default function Singapore() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sg-page">
      <style>{styles}</style>

      {/* Nav */}
      <nav className="sg-nav">
        <div className="sg-nav-left">
          <Link to="/" className="sg-logo">Expat<span>Auto</span>Adviser</Link>
          <span className="sg-city-badge">SINGAPORE</span>
        </div>
        <Link to="/hong-kong" className="sg-switch-btn">
          🇭🇰 Switch to Hong Kong →
        </Link>
        <button
          className="sg-guides-toggle"
          onClick={() => setMobileOpen(o => !o)}
          style={{
            background: 'rgba(232,52,28,0.15)',
            border: '1px solid rgba(232,52,28,0.3)',
            borderRadius: 6, color: '#e8341c',
            padding: '0.28rem 0.7rem', fontSize: '0.78rem',
            fontWeight: 700, cursor: 'pointer',
            alignItems: 'center', gap: 6, letterSpacing: '0.04em',
          }}
        >
          {mobileOpen ? '\u2715 Close' : '\u2630 Guides'}
        </button>
      </nav>

      {/* Mobile backdrop */}
      <div
        className={`sg-mobile-backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      {/* Mobile drawer */}
      <div className={`sg-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div style={{ fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', padding: '20px 14px 6px' }}>
          {'\ud83c\uddf8\ud83c\uddec'} Singapore Guides
        </div>
        {SG_SIDEBAR_SECTIONS.map(section => {
          const guides = section.keys.map(k => SG_GUIDES.find(g => g.to.endsWith('/' + k))).filter(Boolean);
          return (
            <div key={section.heading}>
              <div className="sg-sidebar-heading">{section.heading}</div>
              {guides.map(g => (
                <Link key={g.to} to={g.to} className="sg-nav-link" onClick={() => setMobileOpen(false)}>{g.label}</Link>
              ))}
            </div>
          );
        })}
        <div className="sg-sidebar-heading" style={{ color: '#e8341c' }}>Articles</div>
        {SG_ARTICLES.map(a => (
          <Link key={a.to} to={a.to} className="sg-nav-link" onClick={() => setMobileOpen(false)} style={{ fontSize: '0.72rem', lineHeight: 1.3, padding: '4px 14px' }}>{a.label}</Link>
        ))}
        <div style={{ borderTop: '1px solid rgba(239,68,68,0.12)', margin: '12px 14px' }}></div>
        <Link to="/hong-kong" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '7px 14px', fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none' }}>
          {'\ud83c\udded\ud83c\uddf0'} HK Guides {'\u2192'}
        </Link>
      </div>

      <div className="sg-main" style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
        <aside className="sg-aside-desktop" style={{ width: "195px", minWidth: "185px", flexShrink: 0, borderRight: "1px solid rgba(239,68,68,0.18)", background: "transparent", alignSelf: "flex-start", position: "sticky", top: "72px" }}>
          <style>{`.sg-nav-link { display:block; padding:5px 14px; font-size:0.8rem; color:#9ca3af; text-decoration:none; margin-bottom:1px; border-left:3px solid transparent; transition:color 0.15s,border-color 0.15s,background 0.15s; } .sg-nav-link:hover { color:#e5e7eb; border-left-color:#ef4444; background:rgba(239,68,68,0.06); } .sg-sidebar-heading { font-size:0.6rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#4a5568; padding:14px 14px 5px; }`}</style>
          <div style={{ fontWeight:700, fontSize:"0.62rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"#ef4444", padding:"20px 14px 6px" }}>Singapore Guides</div>
          {SG_SIDEBAR_SECTIONS.map(section => {
            const guides = section.keys.map(k => SG_GUIDES.find(g => g.to.endsWith('/' + k))).filter(Boolean);
            return (
              <div key={section.heading}>
                <div className="sg-sidebar-heading">{section.heading}</div>
                {guides.map(g => (
                  <Link key={g.to} to={g.to} className="sg-nav-link">{g.label}</Link>
                ))}
              </div>
            );
          })}
          <div className="sg-sidebar-heading" style={{ color: '#e8341c' }}>Articles</div>
          {SG_ARTICLES.map(a => (
            <Link key={a.to} to={a.to} className="sg-nav-link" style={{ fontSize: '0.72rem', lineHeight: 1.3, padding: '4px 14px' }}>{a.label}</Link>
          ))}
          <div style={{ borderTop:"1px solid rgba(239,68,68,0.12)", margin:"12px 14px" }}></div>
          <Link to="/hong-kong" style={{ display:"block", padding:"7px 14px", fontSize:"0.75rem", color:"#6b7280", textDecoration:"none" }}>🇭🇰 HK Guides →</Link>
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>

        {/* Hero CTA */}
        <div className="sg-hero">
          <div className="sg-hero-text">
            <h1>Singapore Car Guides for Expats</h1>
            <p>Plain-English guides to COE, leasing, insurance and more — written by expats who've done it. Get the free PDF guide sent to your inbox.</p>
          </div>
          {submitted ? (
            <div style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>✓ Guide on its way!</div>
          ) : (
            <form className="sg-cta-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
              <input
                type="email"
                placeholder="your@email.com"
                className="sg-cta-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="sg-cta-btn">GET FREE PDF</button>
            </form>
          )}
        </div>

        {/* COE Data Widget */}
        <div className="sg-coe-section">
          <div className="sg-section-title">Live COE Prices — {COE_DATA.updatedAt}</div>
          <div className="sg-coe-grid">
            {COE_DATA.categories.map(c => (
              <div key={c.cat} className="sg-coe-card">
                <div className="sg-coe-cat">{c.cat}</div>
                <div className="sg-coe-label">{c.label}</div>
                <div className="sg-coe-price">{c.price}</div>
                <div className={`sg-coe-change ${c.up ? 'up' : 'down'}`}>{c.up ? '▲' : '▼'} {c.change} vs prev</div>
              </div>
            ))}
          </div>
          <div className="sg-coe-footer">Source: LTA bidding results. Updated after each exercise (1st &amp; 3rd Wed of month).</div>
        </div>

        {/* Guide Cards — grouped by section */}
        {SG_SIDEBAR_SECTIONS.map(section => {
          const guides = section.keys.map(k => SG_GUIDES.find(g => g.to.endsWith('/' + k))).filter(Boolean);
          return (
            <div key={section.heading}>
              <div className="sg-section-title">{section.heading}</div>
              <div className="sg-guides-grid">
                {guides.map(g => <GuideCard key={g.to} {...g} />)}
              </div>
            </div>
          );
        })}

        {/* Articles Section */}
        <div className="sg-section-title">In-Depth Articles</div>
        <div style={{ display: 'grid', gap: 10, marginBottom: '2rem' }}>
          {SG_ARTICLES.map(a => (
            <Link
              key={a.to}
              to={a.to}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#10131d', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '0.75rem 1rem',
                textDecoration: 'none', transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,52,28,0.4)'; e.currentTarget.style.background = '#151820'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#10131d'; }}
            >
              <span style={{ color: '#e8341c', fontSize: '0.85rem', flexShrink: 0 }}>&#9656;</span>
              <span style={{ color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>{a.label}</span>
              <span style={{ marginLeft: 'auto', color: '#4a5568', fontSize: '0.7rem', flexShrink: 0 }}>Read &rarr;</span>
            </Link>
          ))}
        </div>

        {/* Patrick Section */}
        <div className="sg-section-title">Your Guide</div>
        <div className="sg-patrick">
          <img src={PATRICK_IMG} alt="Patrick" className="sg-patrick-img" />
          <div style={{ flex: 1 }}>
            <div className="sg-patrick-name">Patrick — Expat Car Adviser, Singapore</div>
            <p className="sg-patrick-bio">
              Patrick is the voice of the expat experience in Singapore — COE auctions, leasing decisions, insurance surprises and everything in between. His guides capture what expats wish they’d known before signing anything.</p>
            <div className="sg-tips-title">Patrick's Top Tips for Singapore</div>
            {PATRICK_TIPS.map((tip, i) => (
              <div key={i} className="sg-tip">
                <span className="sg-tip-icon">→</span>
                <span className="sg-tip-text">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
