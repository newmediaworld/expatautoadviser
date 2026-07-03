import { useEffect, useRef } from 'react';
import Layout from './Layout';
import ArticleRenderer from './ArticleRenderer';

const HERO_STYLES = {
  wrap: { width: '100%', height: 'clamp(220px,35vw,520px)', overflow: 'hidden', borderRadius: 12, marginBottom: 32, position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 50%)' },
  badge: { position: 'absolute', bottom: 20, left: 24 },
  badgeText: { background: '#2a9d8f', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6 },
};

const CITY_LABELS = {
  sg: 'Singapore',
  hk: 'Hong Kong',
};

/**
 * Detect affiliate programme from a redirector URL.
 * Returns null if it's not a known affiliate redirector.
 */
function detectAffiliateProgramme(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url);
    const p = u.searchParams;
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'go.nordvpn.net') return { programme: 'nordvpn', clickref: p.get('aff_sub') };
    if (host === 'safetywing.com' && p.has('referenceID')) return { programme: 'safetywing', clickref: p.get('utm_campaign') };
    if (host === 'deal.incogni.io') return { programme: 'incogni', clickref: p.get('aff_sub') };
    if (host === 'clk.omgt6.com') {
      // Optimise redirector — many campaigns live on this host. Tag per-PID
      // so GA4 attribution captures which advertiser was clicked, not just
      // a generic 'optimise' bucket. See NWM_Affiliate_Status.md for PIDs.
      const pid = p.get('PID');
      if (pid === '56417') return { programme: 'worldfirst_apac', clickref: `PID=${pid}` };
      if (pid === '12745') return { programme: 'optimise_trip_flights', clickref: `PID=${pid}` };
      if (pid === '12746') return { programme: 'optimise_trip_hotels', clickref: `PID=${pid}` };
      if (pid === '56631') return { programme: 'optimise_gocity', clickref: `PID=${pid}` };
      if (pid === '56653') return { programme: 'optimise_fly_fairly', clickref: `PID=${pid}` };
      return { programme: 'optimise', clickref: `PID=${pid || p.get('MID')}` };
    }
    if (host === 'awin1.com') return { programme: 'awin', clickref: p.get('clickref') };
    if (host === 'apply.creatory.singsaver.com.sg') return { programme: 'creatory_singsaver', clickref: `o=${p.get('o')}` };

    return null;
  } catch {
    return null;
  }
}

export default function MarkdownArticlePage({ city, title, description, heroImage, heroPosition, relatedLinks, markdown }) {
  const articleRef = useRef(null);

  // Click delegator: catch clicks on affiliate redirector links inside the
  // rendered markdown and emit a GA4 affiliate_click event with the programme
  // + per-placement attribution slug. Bypassed entirely on environments
  // without window.gtag (e.g. SSR / prerender).
  useEffect(() => {
    const node = articleRef.current;
    if (!node || typeof window === 'undefined') return;

    function handleClick(e) {
      const anchor = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!anchor) return;
      const detected = detectAffiliateProgramme(anchor.href);
      if (!detected) return;
      // eslint-disable-next-line no-undef
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'affiliate_click', {
          event_category: 'affiliate',
          event_label: detected.programme,
          programme: detected.programme,
          clickref: detected.clickref,
          destination_host: (() => { try { return new URL(anchor.href).hostname; } catch { return null; } })(),
          page_path: window.location.pathname,
        });
      }
    }

    node.addEventListener('click', handleClick);
    return () => node.removeEventListener('click', handleClick);
  }, []);

  const imgStyle = heroPosition
    ? { ...HERO_STYLES.img, objectPosition: heroPosition }
    : HERO_STYLES.img;
  return (
    <Layout city={city} title={title} description={description} relatedLinks={relatedLinks}>
      <div style={HERO_STYLES.wrap}>
        <img src={heroImage} alt={title} style={imgStyle} />
        <div style={HERO_STYLES.overlay} />
        <div style={HERO_STYLES.badge}>
          <span style={HERO_STYLES.badgeText}>{CITY_LABELS[city]}</span>
        </div>
      </div>
      <div ref={articleRef} style={{ maxWidth: 760 }}>
        <p style={{ color: '#0d9488', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{CITY_LABELS[city]}</p>
        {/* Only inject an h1 when the markdown body doesn't already start with one — avoids the h1_multiple SEO warning. */}
        {!/^\s*#\s+/.test(markdown) && (
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', lineHeight: 1.2, fontWeight: 700, color: '#1a1a2e', marginTop: 0, marginBottom: 16 }}>{title}</h1>
        )}
        <ArticleRenderer markdown={markdown} />
      </div>
    </Layout>
  );
}
