/**
 * Shared affiliate-click tracking helpers.
 *
 * Previously this logic lived only inside MarkdownArticlePage.jsx, which meant
 * affiliate links rendered by JSX pages (AffiliateBox etc.) fired no GA4 event
 * and were therefore invisible in attribution reporting. Both surfaces now
 * import from here.
 */

/**
 * Detect affiliate programme from a redirector URL.
 * Returns null if it's not a known affiliate redirector.
 */
export function detectAffiliateProgramme(url) {
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
      // UID is Optimise's sub-ID slot. Links previously used MID, which is
      // the MERCHANT id in Optimise's schema, not a publisher sub-ID — so
      // Optimise recorded no per-site attribution at all (websiteId came
      // back as -1 on every reporting row). Corrected 5 Aug 2026; MID is
      // still read as a fallback so historical links keep reporting.
      const mid = p.get('UID') || p.get('MID');
      if (pid === '56417') return { programme: 'worldfirst_apac', clickref: mid || `PID=${pid}` };
      if (pid === '12745') return { programme: 'optimise_trip_flights', clickref: mid || `PID=${pid}` };
      if (pid === '12746') return { programme: 'optimise_trip_hotels', clickref: mid || `PID=${pid}` };
      if (pid === '56631') return { programme: 'optimise_gocity', clickref: mid || `PID=${pid}` };
      if (pid === '56653') return { programme: 'optimise_fly_fairly', clickref: mid || `PID=${pid}` };
      return { programme: 'optimise', clickref: mid || `PID=${pid}` };
    }
    if (host === 'awin1.com') return { programme: 'awin', clickref: p.get('clickref') };
    if (host === 'apply.creatory.singsaver.com.sg') return { programme: 'creatory_singsaver', clickref: p.get('s2') || `o=${p.get('o')}` };

    return null;
  } catch {
    return null;
  }
}

/**
 * Emit a GA4 affiliate_click event for a given href. No-ops safely when the
 * URL isn't a known affiliate redirector, or when gtag isn't present
 * (SSR / prerender / consent not granted).
 */
export function trackAffiliateClick(href, extra = {}) {
  if (typeof window === 'undefined') return;
  const detected = detectAffiliateProgramme(href);
  if (!detected) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'affiliate_click', {
    event_category: 'affiliate',
    event_label: detected.programme,
    programme: detected.programme,
    clickref: detected.clickref,
    destination_host: (() => { try { return new URL(href).hostname; } catch { return null; } })(),
    page_path: window.location.pathname,
    ...extra,
  });
}
