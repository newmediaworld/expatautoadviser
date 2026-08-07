import { useRef, useState } from 'react';

/**
 * Unified Brevo email capture for ExpatAutoAdviser.
 *
 * Replaces the previous Supabase direct-write approach. This component
 * POSTs to /api/subscribe (Vercel serverless function in /api/subscribe.js)
 * which adds the contact to the EAA PENDING list in Brevo. Brevo's
 * "Confirmation Opt-In" automation then handles the DOI email and magnet
 * delivery on click-through.
 *
 * Existing callsites pass `city`, `source`, `title`, `subtitle`, `buttonText`.
 * Those props are preserved for backward compatibility. New callsites can
 * additionally pass `sourceType` ("inline-cta" | "footer" | "exit-intent" |
 * "magnet-cta") and `firstMagnet` ("eaa-sg-car-buyer-checklist" |
 * "eaa-hk-car-buyer-guide" | "dx-relocation-checklist").
 */
export default function EmailCapture({
  city = 'sg',
  source = 'general',
  sourceType = 'inline-cta',
  firstMagnet,
  guideTopic = 'buying',
  title,
  subtitle,
  buttonText,
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const accent = city === 'sg' ? '#e8341c' : '#0d9488';
  const lightBg = city === 'sg' ? '#fff8f7' : '#f0fdfa';
  const borderCol = city === 'sg' ? '#fecaca' : '#99f6e4';

  const defaultTitle =
    city === 'sg'
      ? '📋 Get the free Singapore Car Buyer Checklist'
      : '📋 Get the free Hong Kong Car Buyer Guide';
  const defaultSubtitle =
    city === 'sg'
      ? 'COE bidding, the 10-year cost framework, and the 10-item pre-purchase checklist — plus monthly COE price updates direct to your inbox.'
      : 'First Registration Tax explained, the post-concession EV reality, parking truths, and the 10-item pre-purchase checklist.';

  // Derive firstMagnet from city if not explicitly set
  const resolvedMagnet =
    firstMagnet ||
    (city === 'sg' ? 'eaa-sg-car-buyer-checklist' : 'eaa-hk-car-buyer-guide');

  // Re-entry guard: useRef sets synchronously, so a fast double-click or
  // mobile double-tap can't race past the button-disabled state before
  // React commits it. Without this, the same /api/subscribe call fires
  // twice → two identical magnet emails delivered. (28 Apr 2026.)
  const submittingRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!email || !email.includes('@')) return;
    submittingRef.current = true;
    setStatus('loading');

    // The response is now inspected. Until 2026-08-06 this was a bare
    // `await fetch(...)` followed by setStatus('done'), so the form showed
    // "You're in!" even when the API returned 500 (Brevo env missing) or 502
    // (Brevo rejected the request) and nothing had been stored.
    // (Plumbing audit 2026-08-06, finding A3.)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sourcePage: typeof window !== 'undefined' ? window.location.pathname : source,
          sourceType,
          firstMagnet: resolvedMagnet,
          city,
          source, // legacy label for attribution
          guideTopic,
        }),
      });

      // A non-2xx that still carries contactCreated means the subscriber IS
      // stored and only the magnet email failed — the API retries that, so
      // showing success is honest. Anything else is a real failure.
      const data = await res.json().catch(() => ({}));
      if (!res.ok && data.contactCreated !== true) {
        setStatus('error');
        submittingRef.current = false;
        return;
      }
    } catch {
      setStatus('error');
      submittingRef.current = false;
      return;
    }

    setStatus('done');
  };

  if (status === 'error') {
    return (
      <div
        style={{
          background: '#fef2f2',
          border: '1.5px solid #fca5a5',
          borderRadius: 12,
          padding: '24px 28px',
          margin: '28px 0',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#991b1b', margin: '0 0 4px' }}>
          Something went wrong
        </p>
        <p style={{ fontSize: 13, color: '#991b1b', margin: '0 0 14px' }}>
          We could not sign you up just then. Please try again.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            background: '#991b1b',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div
        style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: 12,
          padding: '24px 28px',
          margin: '28px 0',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#166534', margin: '0 0 4px' }}>
          {"You're in!"}
        </p>
        <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>
          Check your inbox — your guide is on its way.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: lightBg,
        border: `1.5px solid ${borderCol}`,
        borderRadius: 12,
        padding: '24px 28px',
        margin: '28px 0',
      }}
    >
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#1e3a5f',
          margin: '0 0 6px',
          lineHeight: 1.35,
        }}
      >
        {title || defaultTitle}
      </p>
      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
        {subtitle || defaultSubtitle}
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '11px 14px',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: accent,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '11px 22px',
            fontSize: 14,
            fontWeight: 700,
            cursor: status === 'loading' ? 'default' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.7 : 1,
          }}
        >
          {status === 'loading' ? 'Sending…' : buttonText || 'Send me the guide →'}
        </button>
      </form>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0' }}>
        Free. Double opt-in. No spam. Unsubscribe any time.
      </p>
    </div>
  );
}
