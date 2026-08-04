import Layout from "../../components/Layout";
import EmailCapture from "../../components/EmailCapture";
import { Link } from "react-router-dom";

const AREAS = [
  {
    name: "Hung Hom / To Kwa Wan",
    type: "Kowloon hub",
    desc: "One of Hong Kong's densest concentrations of independent workshops. Strong on European and Japanese cars. Several well-established workshops have English-speaking mechanics. Convenient from Kowloon and the MTR.",
    good_for: "European cars, major services, bodywork",
  },
  {
    name: "Kennedy Town / Aberdeen",
    type: "HK Island west",
    desc: "Good cluster of independent and specialist workshops on the western end of Hong Kong Island. Particularly useful for expats in Kennedy Town, Pok Fu Lam, and Aberdeen. Shorter wait times than the Hung Hom cluster.",
    good_for: "General servicing, Japanese and Korean cars",
  },
  {
    name: "Kwun Tong / Kowloon Bay",
    type: "East Kowloon",
    desc: "Industrial estate area with a range of independent workshops and tyre specialists. Larger floor space than island workshops. Good for owners of SUVs and larger vehicles.",
    good_for: "Tyres, SUVs, general repairs",
  },
  {
    name: "Yuen Long / Tuen Mun",
    type: "Western NT",
    desc: "Competitive pricing due to lower rents. Multiple large workshops catering to residents of the western New Territories. Some English spoken but varies — useful to bring translation support.",
    good_for: "Budget servicing, NT residents",
  },
  {
    name: "Sai Kung town",
    type: "Eastern NT",
    desc: "Limited options but a handful of reliable local workshops that serve the Sai Kung and Clear Water Bay expat community. Most expats in this area develop a long-term relationship with one trusted mechanic.",
    good_for: "Sai Kung & Clear Water Bay expats",
  },
];

const TYPES = [
  { type: "Authorised Dealer Workshop", pros: "Manufacturer-trained technicians, genuine parts, warranty maintained, detailed service records", cons: "2–3× more expensive, long waiting times at popular brands, upselling pressure", best_for: "Cars under 3 years old, vehicles still under manufacturer warranty" },
  { type: "Brand-Aligned Independent (e.g. Bosch Service, ACDelco)", pros: "Trained to brand standards, lower cost than dealers, genuine or OEM parts", cons: "Variable quality across locations", best_for: "Cars 3–8 years old, owners who want dealer-standard quality at lower cost" },
  { type: "Independent Workshop", pros: "Significantly cheaper, personal service, mechanics often know your car, negotiable", cons: "No standardised quality, some use non-genuine parts without telling you", best_for: "Older cars, expats with personal recommendation from someone they trust" },
  { type: "Tyre & Exhaust Specialist", pros: "Competitive tyre pricing, fast turnaround, convenient locations", cons: "Scope limited", best_for: "Tyre replacements, wheel alignment, battery replacement" },
];

const SERVICES = [
  ["Basic service (oil + filter + basic check)", "HKD $600–$1,200 (independent) / $1,500–$3,000 (dealer)"],
  ["Full service (all fluids, filters, brake inspection)", "HKD $1,200–$2,500 (independent) / $3,000–$6,000 (dealer)"],
  ["Air-conditioning regas", "HKD $500–$900"],
  ["Tyre replacement (per tyre, mid-range brand)", "HKD $600–$1,200 fitted"],
  ["Brake pad replacement (front axle)", "HKD $800–$1,800 (independent)"],
  ["Battery replacement", "HKD $600–$1,200 fitted"],
  ["Wheel alignment & balancing", "HKD $400–$700"],
  ["Annual inspection (TD examination, 7+ year cars)", "HKD $200–$300 (examination fee)"],
  ["Windscreen replacement", "HKD $2,500–$6,000"],
  ["Minor bodywork (small dent, single panel)", "HKD $1,500–$4,000"],
];

const HERO_IMG = "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&q=80";

export default function HKGarageFinder() {
  return (
    <Layout city="hk" title="Finding a Garage in Hong Kong: Expat Guide to Car Workshops" description="How to find a good, English-speaking car workshop in Hong Kong. Workshop areas, types, price guide for common services, and what to avoid.">
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Car workshop Hong Kong" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <p style={{ color: "#0d9488", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Hong Kong</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, lineHeight: 1.2 }}>Finding a Garage in Hong Kong</h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 }}>Hong Kong has hundreds of car workshops, concentrated in specific industrial areas. Finding a good English-speaking mechanic takes some effort — but expats who find one tend to stick with them for years. Here's how to do it.</p>

        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: 20, marginBottom: 40 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#166534" }}>Space is a real constraint in HK</p>
          <p style={{ margin: 0, fontSize: 14, color: "#166534", lineHeight: 1.6 }}>Hong Kong workshops are often tiny and work on multiple cars simultaneously in cramped conditions. This isn't a quality indicator — the best independent mechanics in HK work in tiny spaces. What matters is the person, not the premises.</p>
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
              <div style={{ background: "#f0fdf4", borderRadius: 6, padding: "8px 12px", fontSize: 13, color: "#166534" }}>
                <strong>Best for:</strong> {best_for}
              </div>
            </div>
          ))}
        </div>

        <h2 style={h2}>Where the workshops are</h2>
        <p style={body}>Unlike Singapore's concentrated industrial estate model, Hong Kong workshops are spread across the territory in smaller clusters within industrial buildings. Below are the main areas to know.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 36px" }}>
          {AREAS.map(({ name, type, desc, good_for }) => (
            <div key={name} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 20, display: "flex", gap: 16 }}>
              <div style={{ flexShrink: 0, width: 8, borderRadius: 4, background: "#0d9488" }} />
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
        <p style={body}>Independent workshops in Hong Kong are typically 40–60% cheaper than authorised dealer service centres. Prices below are 2025–26 estimates.</p>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "16px 0 36px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Service</th>
                <th style={th}>Typical cost (HKD)</th>
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
            ["Facebook Groups (most reliable)", "Search 'Expats in Hong Kong', 'Hong Kong Expats', and car-specific groups like 'Hong Kong Car Owners Club'. Asking for mechanic recommendations generates good responses, especially if you specify your car model and location. Filter for posts under 2 years old."],
            ["GeoExpat & Expat Forums", "geoexpat.com has long-running threads on recommended mechanics. Older posts may have outdated information but the names that come up repeatedly over many years are usually reliable."],
            ["Your building management", "Many expat residential buildings in Sai Kung, Discovery Bay, and the South Side have notice boards or WhatsApp groups where mechanics are recommended. The mechanic who's already servicing 10 cars in your building has a strong incentive to do good work."],
            ["Google Maps reviews (with caution)", "Useful for finding candidates but apply more caution than in Singapore — reviews can be gamed. Look for reviewers who have reviewed other local businesses and who mention specific mechanics by name."],
            ["Toyota / Honda / Land Rover dealer networks", "For authorised workshops, all major brands have dealer networks in HK. For European marques: BMW (Performance Motors), Mercedes-Benz (Zung Fu), Audi (Keen Sight Car) — all have known authorised service centres."],
          ].map(([title, detail]) => (
            <div key={title} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>📍 {title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>The TD Annual Inspection (for cars 6+ years old)</h2>
        <p style={body}>Hong Kong requires cars aged 6 years or older to pass an annual inspection at a Transport Department-approved examination centre. This is not a full workshop service — it's a roadworthiness check covering brakes, steering, tyres, lights, emissions, and body condition.</p>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 20, margin: "0 0 20px" }}>
          {[
            ["Book early", "Centres get busy toward licence renewal deadlines. Book 4–6 weeks in advance."],
            ["Pre-inspection prep pays off", "Minor issues (bulbs, tyre pressure, wiper blades) cause failures. A good independent workshop will do a pre-inspection check for HKD $300–$500 and fix anything minor before the official test."],
            ["Failed items can be re-tested", "If you fail on specific items, many centres allow a re-test within a short window after repairs are completed without re-paying the full inspection fee."],
          ].map(([h, d]) => (
            <div key={h} style={{ marginBottom: 12 }}>
              <strong style={{ fontSize: 14, color: "#991b1b" }}>→ {h}</strong>
              <p style={{ margin: "3px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{d}</p>
            </div>
          ))}
        </div>
        <p style={body}>See the <Link to="/hong-kong/mot-maintenance" style={{ color: "#0d9488" }}>HK MOT & Maintenance guide</Link> for the full inspection process, approved centre list, and what to expect.</p>

        <h2 style={h2}>Watch-outs</h2>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 24, margin: "16px 0 36px" }}>
          {[
            ["Non-genuine parts without disclosure", "Some independents substitute OEM or generic parts for genuine manufacturer parts without telling you. Ask specifically: 'Are you using genuine [brand] parts for this?' and get it confirmed in writing."],
            ["Quoting for work before seeing the car", "Any reputable workshop will inspect before quoting for anything beyond a standard service. Phone quotes for mechanical work are unreliable."],
            ["Cash only, no documentation", "Insist on a written job card and invoice. Most reputable workshops now have POS systems. A workshop that won't give you paperwork is a workshop to avoid."],
            ["Pressure to leave the car for days for simple work", "Standard services and minor repairs should be completable in a day. Multi-day waits for straightforward jobs often mean the workshop is overbooked and your car will sit unattended."],
          ].map(([flag, detail]) => (
            <div key={flag} style={{ marginBottom: 14 }}>
              <strong style={{ fontSize: 14, color: "#991b1b" }}>⚠️ {flag}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: 24, background: "#f9fafb", borderRadius: 10 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>Related guides</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["/hong-kong/mot-maintenance", "MOT & Maintenance — full TD inspection guide"],
              ["/hong-kong/buying-guide", "Hong Kong Buying Guide — how to buy a used car"],
              ["/hong-kong/insurance-guide", "Hong Kong Insurance Guide — getting covered"],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: "#0d9488", fontSize: 14, textDecoration: "none" }}>→ {label}</Link>
            ))}
          </div>
        </div>
      </div>
      <EmailCapture
        city="hk"
        source="hk-garage-finder"
        guideTopic="garage"
        title="📋 Get the free Hong Kong Car Buyer Guide"
        subtitle="Includes our vetted garage list, FRT calculator walkthrough, and the HK expat car checklist. Free."
      />
    </Layout>
  );
}

const h2 = { fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: "36px 0 12px" };
const body = { fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 16 };
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#374151" };
