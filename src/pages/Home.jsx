import { useState } from "react";
import { Link } from "react-router-dom";

const SG_MAP =
  "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=75&auto=format";
const HK_MAP =
  "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800&q=75&auto=format";
const PATRICK_IMG = '/patrick.png';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .eaa-home { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #f0f2f8; }
  .eaa-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2rem; height: 56px;
    background: rgba(10,12,18,0.85); backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .eaa-logo { font-size: 1rem; font-weight: 700; letter-spacing: 0.04em; color: #f0f2f8; text-decoration: none; }
  .eaa-logo span { color: #e8341c; }
    .home-brand-hero {
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #f0f2f8;
      text-align: center;
      display: block;
      margin-bottom: 0.25rem;
      line-height: 1.1;
    }
    .home-brand-hero span { color: #e8341c; }
  .eaa-tagline-wrap {
    padding-top: 56px;
    text-align: center;
    padding-bottom: 0.5rem;
    background: #0a0c12;
  }
  .eaa-tagline-wrap h1 {
    font-size: clamp(1.6rem, 4vw, 2.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    padding: 0.8rem 1rem 0.2rem;
    color: #f0f2f8;
  }
  .eaa-tagline-wrap p {
    font-size: 1rem;
    color: #8892a4;
    padding-bottom: 0.2rem;
  }
  .city-panels {
    display: flex;
    height: 300px;
    min-height: 240px;
  }
  .city-panel {
    flex: 1;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: flex 0.4s ease;
  }
  .city-panel:hover { flex: 1.18; }
  .city-panel-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transition: transform 0.5s ease;
  }
  .city-panel:hover .city-panel-bg { transform: scale(1.04); }
  .city-panel-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.18) 100%);
  }
  .city-panel-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1.6rem 1.8rem 2rem;
    display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
  }
  .city-flag { font-size: 2.2rem; line-height: 1; }
  .city-name {
    font-size: clamp(1.4rem, 2.8vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
  .city-tagline {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.72);
    font-weight: 400;
    max-width: 260px;
    line-height: 1.4;
  }
  .city-btn {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.55rem 1.2rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-decoration: none;
    text-transform: uppercase;
    transition: background 0.2s, transform 0.15s;
  }
  .city-btn:hover { transform: translateY(-1px); }
  .city-panel-divider {
    width: 2px;
    background: rgba(255,255,255,0.12);
    flex-shrink: 0;
    align-self: stretch;
  }
  
      .seo-about{max-width:900px;margin:0 auto;padding:24px 24px;color:#ccc;text-align:center}
      .seo-about h2{color:#fff;font-size:clamp(1.3rem,3vw,1.8rem);font-weight:700;margin-bottom:16px}
      .seo-about p{font-size:1rem;line-height:1.7;margin-bottom:14px;color:#aaa}
      .seo-about a{color:#e8341c;text-decoration:none}
      .seo-about a:hover{text-decoration:underline}
      .guide-links{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:24px}
      .guide-links a{background:rgba(255,255,255,0.07);padding:8px 18px;border-radius:20px;font-size:0.9rem;color:#ddd;text-decoration:none;transition:background 0.2s}
      .guide-links a:hover{background:rgba(232,52,28,0.25);color:#fff}
      .patrick-strip {
    background: #10131d;
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    gap: 1.4rem;
    padding: 1.1rem 2rem;
  }
  .patrick-img {
    width: 52px; height: 52px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.12);
    flex-shrink: 0;
  }
  .patrick-text { flex: 1; }
  .patrick-text strong { font-size: 0.85rem; color: #f0f2f8; display: block; margin-bottom: 0.15rem; }
  .patrick-text span { font-size: 0.78rem; color: #6b7585; line-height: 1.4; }
  .nl-form { display: flex; gap: 0.5rem; flex-shrink: 0; }
  .nl-input {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
    color: #f0f2f8;
    width: 200px;
    outline: none;
  }
  .nl-input::placeholder { color: #4a5568; }
  .nl-btn {
    background: #e8341c;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.45rem 1rem;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.2s;
  }
  .nl-btn:hover { background: #c42a16; }
  @media (max-width: 640px) {
    .city-panels { flex-direction: column; height: auto; min-height: unset; }
    .city-panel { min-height: 200px; height: 200px; }
    .city-panel-divider { width: 100%; height: 2px; }
    .city-name { font-size: 1.6rem; }
    .city-tagline { font-size: 0.8rem; max-width: 100%; }
    .city-panel-content { padding: 1.2rem 1.4rem 1.4rem; }
    
      .seo-about{max-width:900px;margin:0 auto;padding:24px 24px;color:#ccc;text-align:center}
      .seo-about h2{color:#fff;font-size:clamp(1.3rem,3vw,1.8rem);font-weight:700;margin-bottom:16px}
      .seo-about p{font-size:1rem;line-height:1.7;margin-bottom:14px;color:#aaa}
      .seo-about a{color:#e8341c;text-decoration:none}
      .seo-about a:hover{text-decoration:underline}
      .guide-links{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:24px}
      .guide-links a{background:rgba(255,255,255,0.07);padding:8px 18px;border-radius:20px;font-size:0.9rem;color:#ddd;text-decoration:none;transition:background 0.2s}
      .guide-links a:hover{background:rgba(232,52,28,0.25);color:#fff}
      .patrick-strip { flex-wrap: wrap; }
    .nl-form { width: 100%; }
    .nl-input { flex: 1; width: auto; }
  }
`;

function CityPanel({ city, flag, mapUrl, tagline, accent, to }) {
  return (
    <div className="city-panel">
      <div
        className="city-panel-bg"
        style={{ backgroundImage: `url(${mapUrl})` }}
      />
      <div className="city-panel-overlay" />
      <div className="city-panel-content">
        <span className="city-flag">{flag}</span>
        <span className="city-name">{city}</span>
        <span className="city-tagline">{tagline}</span>
        <Link
          to={to}
          className="city-btn"
          style={{ background: accent, color: "#fff" }}
        >
          Explore guides →
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [nlCity, setNlCity] = useState("sg");
  const [nlSubmitted, setNlSubmitted] = useState(false);

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sourcePage: "/",
          sourceType: "homepage-newsletter",
          firstMagnet: "",
          city: nlCity,
          source: "homepage_newsletter",
          guideTopic: "newsletter",
        }),
      });
    } catch {}
    setNlSubmitted(true);
    setTimeout(() => setNlSubmitted(false), 3000);
    setEmail("");
  }

  return (
    <div className="eaa-home" style={{ minHeight: "auto", background: "#0a0c12" }}>
      <style>{styles}</style>


      {/* Tagline */}
      <div className="eaa-tagline-wrap">
          <div className="home-brand-hero">Expat<span>Auto</span>Adviser</div>
        <h1>Your Car Guide for Expat Life</h1>
        <p>Singapore · Hong Kong</p>
      </div>

      {/* City panels */}
      <div className="city-panels">
        <CityPanel
          city="Singapore"
          flag="🇸🇬"
          mapUrl={SG_MAP}
          tagline="COE, insurance, EVs, buying vs leasing — everything you need to know."
          accent="#e8341c"
          to="/singapore"
        />
        <div className="city-panel-divider" />
        <CityPanel
          city="Hong Kong"
          flag="🇭🇰"
          mapUrl={HK_MAP}
          tagline="FRT, tunnel tolls, licence conversion — no fluff, just clarity."
          accent="#2a9d8f"
          to="/hong-kong"
        />
      </div>

      
        {/* SEO content section */}
        <div className="seo-about">
          <h2>Free Car Guides for Expats in Singapore and Hong Kong</h2>
          <p>Moving to a new country is complicated enough without trying to figure out whether to lease or buy a car, what insurance you actually need, or how the local tax system works. ExpatAutoAdviser was built by expats who have been through it, and every guide is written to give you clear, practical answers without the jargon.</p>
          <p>In Singapore, we cover everything from the COE bidding system and leasing costs to EV incentives and licence conversion. In Hong Kong, our guides walk you through first registration tax, tunnel tolls, maintenance requirements, and how to find an expat-friendly garage. Whether you are weighing up the cost of car ownership or just need to know if you can drive on your current licence, there is a guide for that.</p>
          <div className="guide-links">
            <Link to="/singapore/leasing-guide">SG Leasing Guide</Link>
            <Link to="/singapore/buying-guide">SG Buying Guide</Link>
            <Link to="/singapore/insurance-guide">SG Insurance</Link>
            <Link to="/singapore/should-i-get-a-car">Do I Need a Car in SG?</Link>
            <Link to="/hong-kong/buying-guide">HK Buying Guide</Link>
            <Link to="/hong-kong/leasing-guide">HK Leasing Guide</Link>
            <Link to="/hong-kong/frt-tax-explained">HK First Reg Tax</Link>
            <Link to="/hong-kong/should-i-get-a-car">Do I Need a Car in HK?</Link>
          </div>
        </div>
        {/* Patrick strip */}
      <div className="patrick-strip">
        <img src={PATRICK_IMG} alt="Patrick" className="patrick-img" />
        <div className="patrick-text">
          <strong>Stay in the loop</strong>
          <span>
            New guides, market updates and expat car tips — pick your city and we'll keep you posted.
          </span>
        </div>
        <form
          className="nl-form"
          onSubmit={handleNewsletterSubmit}
          style={{ alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <button type="button" onClick={() => setNlCity('sg')} style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: nlCity === 'sg' ? '#e8341c' : 'transparent', color: nlCity === 'sg' ? '#fff' : '#8892a4', transition: 'background 0.2s' }}>SG</button>
            <button type="button" onClick={() => setNlCity('hk')} style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', background: nlCity === 'hk' ? '#2a9d8f' : 'transparent', color: nlCity === 'hk' ? '#fff' : '#8892a4', transition: 'background 0.2s' }}>HK</button>
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            className="nl-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="nl-btn">
            {nlSubmitted ? "✓ CHECK YOUR INBOX" : "SUBSCRIBE"}
          </button>
        </form>
      </div>
      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', background: '#fff', padding: '32px 20px', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🚗</span>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16 }}>
            <span style={{ color: '#1a1a2e' }}>Expat</span>
            <span style={{ fontSize: 12, color: '#e63946' }}>Auto</span>
            <span style={{ color: '#1a1a2e' }}>Adviser</span>
          </span>
        </Link>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#9ca3af' }}>Independent car advice for expats in Singapore and Hong Kong.</p>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#d1d5db' }}>© 2026 ExpatAutoAdviser · Not financial advice · Partner links may earn commission</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12 }}>
          <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms</Link>
          <Link to="/cookies" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookies</Link>
          <Link to="/affiliate-disclosure" style={{ color: '#9ca3af', textDecoration: 'none' }}>Disclosure</Link>
        </div>
      </footer>
    </div>
  );
}
