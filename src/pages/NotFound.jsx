import { Link } from 'react-router-dom';

/**
 * Client-side 404.
 *
 * The authoritative 404 is the static `dist/404.html` written by
 * prerender.mjs — that is what Vercel serves, with a real HTTP 404 status,
 * for any URL with no matching file. This component covers the other case:
 * a user already inside the SPA who follows a broken in-app <Link>. Without
 * a `*` route, React Router would match nothing and render a blank page.
 *
 * It is intentionally NOT prerendered and NOT in the sitemap
 * (scripts/routes.mjs filters the `*` path out of the route table).
 */
export default function NotFound() {
  return (
    <div
      style={{
        background: '#0a0c12',
        color: '#f8fafc',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#e8341c',
            margin: '0 0 10px',
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 32,
            lineHeight: 1.2,
            margin: '0 0 14px',
          }}
        >
          That page doesn&apos;t exist
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: '#9aa5b8', margin: '0 0 28px' }}>
          The link may be mistyped, or the guide may have moved. Everything we
          publish for Singapore and Hong Kong is one click away below.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '11px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              background: '#e8341c',
              border: '1.5px solid #e8341c',
              color: '#fff',
            }}
          >
            Home
          </Link>
          <Link
            to="/singapore"
            style={{
              display: 'inline-block',
              padding: '11px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.16)',
              color: '#f8fafc',
            }}
          >
            Singapore guides
          </Link>
          <Link
            to="/hong-kong"
            style={{
              display: 'inline-block',
              padding: '11px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.16)',
              color: '#f8fafc',
            }}
          >
            Hong Kong guides
          </Link>
        </div>
      </div>
    </div>
  );
}
