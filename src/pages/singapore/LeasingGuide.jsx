import Layout from "../../components/Layout";
import FAQ from "../../components/FAQ";
import { Link } from "react-router-dom";

const leasingFAQ = [
  {
    q: "Do I need a Singapore driving licence to lease a car?",
    a: "You can drive on a valid foreign licence for up to 12 months from your arrival date. After that, you need a Singapore licence. Most leasing companies will sign a lease with a foreign licence, but check with them first — some require conversion before handing over keys.",
  },
  {
    q: "What happens if my assignment ends early?",
    a: "Most leases carry an early termination fee of 2–3 months' rental. Some companies, particularly those with experience dealing with expats, offer more flexible terms — worth asking explicitly before you sign. Get the early termination clause in writing.",
  },
  {
    q: "Can I take a leased Singapore car into Malaysia?",
    a: "Yes, but you must inform your leasing company and check your insurance policy. Most comprehensive policies cover Malaysia, but coverage often reduces to third-party-only once you cross the Causeway. Ask for this in writing.",
  },
  {
    q: "How much deposit is typically required?",
    a: "Usually 1–2 months' rental upfront as a security deposit. This is refunded at the end of the lease if the car is returned in acceptable condition (fair wear and tear).",
  },
  {
    q: "Is it worth leasing an EV in Singapore?",
    a: "Increasingly yes. EV lease prices have come down significantly as supply has increased. The main consideration is charging — if you don't have overnight charging at home, factor in the cost and hassle of public charging. See our EV Guide for a full breakdown.",
  },
];

const HERO_IMG = "https://images.unsplash.com/photo-1722607508544-3810372171fc?w=1200&q=80";

export default function SGLeasingGuide() {
  return (
    <Layout
      city="sg"
      title="Singapore Car Leasing Guide for Expats"
      description="Everything expats need to know about leasing a car in Singapore: costs, what's bundled, COE explained, how to choose a lease company, and what to watch out for."
     relatedLinks={[{ label: 'Should I Get a Car?', to: '/singapore/should-i-get-a-car' }, { label: 'Insurance Guide', to: '/singapore/insurance-guide' }, { label: 'EV Guide', to: '/singapore/ev-guide' }, { label: 'Cost Calculator', to: '/singapore/calculators' }, { label: 'Lease Checker', to: '/singapore/lease-checker' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Car on Singapore expressway" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <p style={{ color: "#e8341c", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Singapore</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, lineHeight: 1.2 }}>
          Singapore Car Leasing Guide for Expats
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 }}>
          Leasing is by far the most sensible option for expats in Singapore. Here's exactly how it works, what you should expect to pay, and the pitfalls to avoid.
        </p>

        <h2 style={h2}>Why lease rather than buy?</h2>
        <p style={body}>Buying a car in Singapore requires a Certificate of Entitlement (COE) — a government-issued permit that lets you own a car for 10 years. The price is set by open bidding and moves every fortnight — in the July 2026 second bidding exercise it closed at <strong>SGD $126,000 for Category A and SGD $129,890 for Category B</strong>. That's before you've paid for the car itself.</p>
        <p style={body}>For a typical expat on a 2–3 year assignment, buying exposes you to significant COE resale risk: if COE prices fall before you leave, your car's value drops sharply. Leasing sidesteps this entirely. You pay a fixed monthly rate, hand the car back, and walk away.</p>

        <h2 style={h2}>What's typically bundled in a Singapore lease?</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, margin: "16px 0 28px" }}>
          {[
            ["✅ Comprehensive insurance", "Included in almost all leases"],
            ["✅ Annual road tax", "Paid by the leasing company"],
            ["✅ Scheduled servicing", "Manufacturer intervals covered"],
            ["✅ 24/7 roadside assistance", "Breakdown cover included"],
            ["✅ Accident support", "Admin and repair coordination"],
            ["❌ ERP charges", "You pay at the gantry"],
            ["❌ Petrol", "Your cost"],
            ["❌ Parking", "Your cost (unless specifically agreed)"],
          ].map(([item, note]) => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6", gap: 16 }}>
              <span style={{ fontSize: 15, color: "#374151" }}>{item}</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{note}</span>
            </div>
          ))}
        </div>

        <h2 style={h2}>Typical monthly lease costs (2025–26)</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "16px 0 28px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ background: "#f9fafb" }}>
              <th style={th}>Category</th><th style={th}>Example Models</th><th style={th}>Monthly Cost</th>
            </tr></thead>
            <tbody>
              {[
                ["Economy", "Toyota Vios, Honda Jazz", "SGD $1,400–$1,800"],
                ["Mid-range", "Toyota Camry, Mazda CX-5", "SGD $2,200–$2,800"],
                ["Premium", "BMW 3 Series, Mercedes C-Class", "SGD $3,200–$4,500"],
                ["Luxury", "BMW 5 Series, Mercedes E-Class", "SGD $4,500–$6,500+"],
              ].map(([cat, models, cost]) => (
                <tr key={cat} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={td}><strong>{cat}</strong></td>
                  <td style={td}>{models}</td>
                  <td style={{ ...td, fontWeight: 600, color: "#1e3a5f" }}>{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={h2}>How to choose a leasing company</h2>
        <ul style={{ ...body, paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}><strong>Fleet age</strong> — ask the average age of cars in the category.</li>
          <li style={{ marginBottom: 8 }}><strong>Replacement car policy</strong> — what happens if your car is in for repair?</li>
          <li style={{ marginBottom: 8 }}><strong>24/7 contact</strong> — test it. Send a WhatsApp at 9pm.</li>
          <li style={{ marginBottom: 8 }}><strong>Expat-friendly contracts</strong> — some companies are experienced with early termination, others aren't.</li>
        </ul>

        <h2 style={h2}>Watch-outs in a lease contract</h2>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 24, margin: "16px 0 28px" }}>
          {[
            ["Mileage limits", "Most economy leases cap at 15,000–20,000 km/year. Excess mileage charges add up fast if you're doing Malaysia trips."],
            ["Early termination fees", "Typically 2–3 months' rental. Factor this in if your assignment might end early."],
            ["Damage assessment on return", "Clarify what constitutes fair wear and tear vs chargeable damage before you sign."],
            ["Insurance excess", "Some leases have a high excess (e.g. SGD $3,000). Know this number."],
          ].map(([heading, detail]) => (
            <div key={heading} style={{ marginBottom: 16 }}>
              <strong style={{ fontSize: 14, color: "#991b1b" }}>⚠ï¸ {heading}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>COE explained</h2>
        <p style={body}>The Certificate of Entitlement is a 10-year permit to own a vehicle in Singapore. When you lease, the leasing company holds the COE risk — not you. This is one of the strongest arguments for leasing over buying as an expat.</p>
        <p style={body}>Use our <Link to="/singapore/calculators" style={{ color: "#e8341c" }}>COE Buy vs Lease Calculator</Link> to see what a car would actually cost you to own vs lease over a typical 3-year expat stint.</p>

        {/* FAQ section */}
        <FAQ city="sg" items={leasingFAQ} />
      </div>
    </Layout>
  );
}

const h2 = { fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: "36px 0 12px" };
const body = { fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 16 };
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#374151" };
const td = { padding: "12px 16px", color: "#374151", fontSize: 14 };
