import { useEffect, useRef } from 'react';
import Layout from './Layout';
import ArticleRenderer from './ArticleRenderer';
import { trackAffiliateClick } from '../lib/affiliateTracking';

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
      trackAffiliateClick(anchor.href, { placement: 'article_body' });
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
