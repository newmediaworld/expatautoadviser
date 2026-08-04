import Layout from "../../components/Layout";
import EmailCapture from "../../components/EmailCapture";
import { Link } from "react-router-dom";

const AREAS = [
  {
    name: "Ubi / Macpherson",
    type: "Workshop Hub",
    desc: "Singapore's largest concentration of independent workshops and authorised service centres. If you're buying tyres, doing a major service, or getting bodywork done, this area has every type of workshop at competitive prices.",
    good_for: "Tyres, full servicing, bodywork, used parts",
  },
  {
    name: "Pandan Gardens / Jurong",
    type: "West-side hub",
    desc: "Excellent cluster of independent workshops in the west. Convenient if you live in Jurong, Clementi, or Buona Vista. Several well-established family-run workshops with English-speaking staff.",
    good_for: "General servicing, air-con, repairs",
  },
  {
    name: "Ang Mo Kio / Bishan",
    type: "North-central",
    desc: "Good selection of independent and branded workshops. More accessible for expats in the north and central areas. Several continental car specialists here.",
    good_for: "European cars, general servicing",
  },
  {
    name: "Bedok / Tampines",
    type: "East-side",
    desc: "Convenient for expats in the eastern districts. Mix of authorised service centres and independents. Several 24-hour tyre shops in the area.",
    good_for: "General servicing, tyres, east coast expats",
  },
];

const TYPES = [
  { type: "Authorised Dealer Workshop", pros: "Manufacturer-trained technicians, genuine parts, warranty preserved", cons: "2–3× more expensive than independents, upselling is common", best_for: "Cars under 3 years old or still under warranty" },
  { type: "Brand-Aligned Independent (e.g. Bosch Car Service)", pros: "Trained to brand standards, competitive pricing, genuine parts option", cons: "Less consistent across locations", best_for: "Cars 3–7 years old" },
  { type: "Independent Workshop", pros: "Significantly cheaper, often better relationship, negotiable", cons: "Quality varies — due diligence required", best_for: "Older cars, expats who've done their research" },
  { type: "Tyre Specialist (e.g. Esso, SPC, Goodyear outlets)", pros: "Fast, competitive on tyre pricing, often convenient", cons: "Scope limited to tyres and basic checks", best_for: "Tyre replacements and puncture repairs" },
];

const SERVICES = [
  ["Basic service (oil + filter)", "SGD $80–$150 (independent) / $150–$280 (dealer)"],
  ["Full service (incl. air filter, brake check)", "SGD $150–$300 (independent) / $300–$600 (dealer)"],
  ["Air-conditioning regas/service", "SGD $80–$180"],
  ["Tyre replacement (per tyre, mid-range)", "SGD $100–$180 fitted"],
  ["Brake pad replacement (axle)", "SGD $120–$250 (independent)"],
  ["Battery replacement", "SGD $120–$200 fitted"],
  ["Wheel alignment & balancing", "SGD $60–$120"],
  ["Major service (60k/90k km interval)", "SGD $400–$900 (independent)"],
  ["Accident repair (minor dent/scratch)", "SGD $300–$800+"],
  ["Pre-lease return inspection", "SGD $80–$150"],
];

const HERO_IMG = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80";

export default function SGGarageFinder() {
  return (
    <Layout city="sg" title="Finding a Garage in Singapore: Expat Guide to Workshops" description="How to find a good, English-speaking car workshop in Singapore. Workshop areas, types, price guide for common services, and how to avoid the bad ones.">
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Car workshop Singapore" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <p style={{ color: "#e8341c", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Singapore</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, lineHeight: 1.2 }}>Finding a Garage in Singapore</h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 }}>Singapore has hundreds of car workshops, from authorised dealer centres to family-run independents. Here's how to find one you can trust — and what you should expect to pay.</p>

        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: 20, marginBottom: 40 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#0c4a6e" }}>If you're on a lease, check first</p>
          <p style={{ margin: 0, fontSize: 14, color: "#0c4a6e", lineHeight: 1.6 }}>Most Singapore leases bundle servicing with the leasing company's preferred workshop. Before booking anywhere independently, confirm with your lease company what's covered — using an unapproved workshop may void part of your lease agreement or result in charges on return.</p>
        </div>

        <h2 style={h2}>Types of workshop</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "16px 0 36px" }}>
          {TYPES.map(({ type, pros, cons, best_for }) => (
            <div key={type} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 22 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{type}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Pros</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{pros}</p>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Cons</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{cons}</p>
                </div>
              </div>
              <div style={{ background: "#f0f9ff", borderRadius: 6, padding: "8px 12px", fontSize: 13, color: "#0c4a6e" }}>
                <strong>Best for:</strong> {best_for}
              </div>
            </div>
          ))}
        </div>

        <h2 style={h2}>Where the workshops are</h2>
        <p style={body}>Singapore's workshops are concentrated in specific industrial estates. Knowing the key areas saves time and helps you compare quotes across multiple workshops.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 36px" }}>
          {AREAS.map(({ name, type, desc, good_for }) => (
            <div key={name} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 20, display: "flex", gap: 16 }}>
              <div style={{ flexShrink: 0, width: 8, borderRadius: 4, background: "#e8341c" }} />
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{name}</h3>
                  <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 12, padding: "2px 10px", borderRadius: 12, fontWeight: 600 }}>{type}</span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{desc}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}><strong>Good for:</strong> {good_for}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={h2}>Price guide for common services</h2>
        <p style={body}>Prices below are for the Singapore market as of 2025–26. Independent workshops are typically 40–60% cheaper than authorised dealer service centres for the same work.</p>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "16px 0 36px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Service</th>
                <th style={th}>Typical cost</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map(([service, cost]) => (
                <tr key={service} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", color: "#374151", fontSize: 14 }}>{service}</td>
                  <td style={{ padding: "12px 16px", color: "#1e3a5f", fontSize: 14, fontWeight: 600 }}>{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={h2}>How to find a good workshop</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "16px 0 36px" }}>
          {[
            ["Facebook groups", "The most reliable source. 'Expats in Singapore', 'Singapore Expats', and car-specific groups like 'Singapore Car Owners' have regular workshop recommendations from expats who've actually used them. Search before posting — most common recommendations come up repeatedly."],
            ["Google Maps reviews", "Filter for 4.5-star workshops with 50+ reviews. Read the 3-star reviews specifically — they reveal honest issues without the paid-review inflation. Look for reviews mentioning English-speaking staff if that matters to you."],
            ["Ask your lease company", "If you're leasing, your lease company has a preferred workshop list. Even if a service isn't included in your bundle, their approved workshops are vetted and won't create lease-return disputes."],
            ["Expat Forums (sgexpats.com, expatforum.com)", "Older but still useful. Search for workshop recommendations by area. Filter for posts from the last 2 years as workshops change ownership."],
            ["Word of mouth from colleagues", "Consistently the best source in Singapore. Corporate expat communities in the same housing development or office often share workshop contacts directly."],
          ].map(([title, detail]) => (
            <div key={title} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>📍 {title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>Red flags to avoid</h2>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 24, margin: "16px 0 36px" }}>
          {[
            ["Quoting over the phone without seeing the car", "Any reputable workshop will want to inspect before quoting for anything beyond a standard service."],
            ["Pressure to authorise additional work immediately", "Always ask for a written list of additional items, take a photo, and get a second opinion for anything over SGD $200."],
            ["No clear job card or invoice", "Insist on a written job card before work starts and a detailed invoice on collection. This is your only recourse if something goes wrong."],
            ["Keeping your old parts", "You're entitled to your old parts back (tyres, brake pads, filters). Ask for them — a reputable workshop won't object."],
            ["Cash only, no receipt", "Avoid workshops that won't issue a receipt. Most legitimate Singapore workshops have POS systems."],
          ].map(([flag, detail]) => (
            <div key={flag} style={{ marginBottom: 14 }}>
              <strong style={{ fontSize: 14, color: "#991b1b" }}>⚠️ {flag}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>Continental car owners</h2>
        <p style={body}>BMW, Mercedes-Benz, Audi, and Volvo all have authorised service networks in Singapore. For older continental cars (7+ years), independent specialists in Ubi and Pandan Gardens often know the cars better and charge significantly less than dealer workshops. Ask specifically for a mechanic with experience on your marque.</p>

        <div style={{ marginTop: 40, padding: 24, background: "#f9fafb", borderRadius: 10 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>Related guides</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["/singapore/leasing-guide", "Singapore Leasing Guide — what's included in a lease bundle"],
              ["/singapore/insurance-guide", "Singapore Insurance Guide — understanding excess and no-claims discount"],
              ["/singapore/should-i-get-a-car", "Should I Get a Car in Singapore?"],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: "#e8341c", fontSize: 14, textDecoration: "none" }}>→ {label}</Link>
            ))}
          </div>
        </div>
      </div>
      <EmailCapture
        city="sg"
        source="sg-garage-finder"
        guideTopic="garage"
        title="📋 Get the free Singapore Car Buyer Checklist"
        subtitle="Includes our vetted garage list, servicing price benchmarks, and what to watch out for at lease return. Free."
      />
    </Layout>
  );
}

const h2 = { fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: "36px 0 12px" };
const body = { fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 16 };
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#374151" };
