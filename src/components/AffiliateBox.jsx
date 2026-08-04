// AffiliateBox — reusable affiliate partner recommendations block
// Place inside guide pages after relevant content sections.
//
// Only pass partners with a real, live affiliate URL. Entries without a
// working URL are filtered out rather than rendered as a dead "coming soon"
// row; if that leaves nothing, the whole box is omitted.
//
// Clicks fire the same GA4 affiliate_click event as links inside markdown
// articles (see src/lib/affiliateTracking.js).

import { trackAffiliateClick } from "../lib/affiliateTracking";

export default function AffiliateBox({ city, type, title, partners }) {
  const accent = city === "sg" ? "#e8341c" : "#0d9488";
  const lightBg = city === "sg" ? "#fff5f4" : "#f0fdfa";
  const borderCol = city === "sg" ? "#fca5a5" : "#99f6e4";

  const live = (partners || []).filter(
    (p) => p && typeof p.url === "string" && p.url !== "#" && /^https?:\/\//.test(p.url)
  );
  if (live.length === 0) return null;

  return (
    <div style={{
      background: lightBg,
      border: `1.5px solid ${borderCol}`,
      borderRadius: 12,
      padding: "24px 28px",
      margin: "32px 0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 18 }}>🤝</span>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: accent }}>
          Recommended Partners
        </span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 20px" }}>
        Affiliate disclosure: we may earn a small commission if you get a quote via these links — at no extra cost to you.
        We only list companies we'd recommend to a friend.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {live.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer nofollow sponsored"
            style={{ textDecoration: "none" }}
            onClick={() => trackAffiliateClick(p.url, { placement: `affiliate_box_${type || "generic"}` })}
          >
            <div style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.boxShadow = `0 2px 12px ${accent}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  {p.badge && (
                    <span style={{ background: accent, color: "white", fontSize: 10, fontWeight: 700,
                      padding: "2px 7px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {p.badge}
                    </span>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{p.name}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
              <div style={{ padding: "8px 18px", background: accent, color: "white",
                borderRadius: 6, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                {p.cta || "Get quote →"}
              </div>
            </div>
          </a>
        ))}
      </div>
      {type === "leasing" && (
        <p style={{ fontSize: 12, color: "#6b7280", margin: "16px 0 0", lineHeight: 1.6 }}>
          💡 <strong>Tip:</strong> Get quotes from at least 2–3 companies before committing. Prices vary more than you'd expect, even for the same model.
        </p>
      )}
      {type === "insurance" && (
        <p style={{ fontSize: 12, color: "#6b7280", margin: "16px 0 0", lineHeight: 1.6 }}>
          💡 <strong>Tip:</strong> If your lease already includes insurance, ask for the policy document — not just confirmation it's included. Check the excess amount before you drive off.
        </p>
      )}
    </div>
  );
}
