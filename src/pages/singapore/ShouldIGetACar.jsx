import Layout from '../../components/Layout';
import CredibilityBar from '../../components/CredibilityBar';
import FAQ from '../../components/FAQ';

const h1 = { margin: "0 0 12px", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: "36px 0 12px", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a2e" };
const body = { margin: "0 0 16px", fontSize: 15, color: "#374151", lineHeight: 1.75 };
const note = { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#92400e", lineHeight: 1.6 };
const warn = { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#991b1b", lineHeight: 1.6 };
const good = { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#166534", lineHeight: 1.6 };

const HERO_IMG = "https://images.unsplash.com/photo-1496939376851-89342e90adcd?w=1200&q=80";

const faqItems = [
  { q: "Is Singapore's public transport good enough to go car-free?", a: "For most urban locations — yes. The MRT and bus network covers the island well and is clean, air-conditioned and affordable. Most expats living in Orchard, Tanjong Pagar, Novena, or the CBD manage easily without a car." },
  { q: "How much does car ownership actually cost per month in Singapore?", a: "A rough all-in figure for a mid-range car (Toyota Camry, 2.5L): loan repayment SGD $2,500, insurance $250, road tax $150 (about SGD $1,792/year on 2,494cc), fuel $350, ERP $100, parking $400. That's around SGD $3,750–$4,600/month. Compare that to a monthly MRT pass at SGD $128." },
  { q: "Are there areas where a car is basically essential in Singapore?", a: "Yes — Sentosa, the western industrial areas (Jurong, Tuas), parts of the East Coast far from MRT, Bukit Timah, and most of the northern areas near the causeway. If your workplace or home is more than 10 minutes walk from an MRT, a car becomes much more useful." },
  { q: "Can I lease instead of buy if I'm not sure?", a: "Absolutely — leasing is often the smart choice for expats who aren't sure how long they'll stay. No COE risk, no resale hassle. A full-service lease for a mid-range car runs SGD $2,200–$3,000/month including insurance and maintenance." },
  { q: "What about Grab and taxis? Can I rely on those instead?", a: "Grab is excellent in Singapore and very reliable. If your car use is mostly occasional — nights out, family trips, weekend errands — Grab plus public transport often works out cheaper than owning a car, particularly when you factor in ERP, parking, and COE." },
];

export default function SGShouldIGetACar() {
  return (
    <Layout city="sg" active="Should I Get a Car?" relatedLinks={[{ label: 'Leasing Guide', to: '/singapore/leasing-guide' }, { label: 'Buying Guide', to: '/singapore/buying-guide' }, { label: 'Insurance Guide', to: '/singapore/insurance-guide' }, { label: 'Cost Calculator', to: '/singapore/calculators' }, { label: 'New Arrival Checklist', to: '/singapore/new-arrival' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Singapore MRT and city" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#e63946", textTransform: "uppercase", letterSpacing: "0.1em" }}>Singapore</p>
      <h1 style={h1}>Should I Get a Car in Singapore?</h1>
      <p style={{ ...body, fontSize: 17, color: "#6b7280" }}>Cars in Singapore are expensive — but so is your time. Here's how to decide honestly.</p>

      <CredibilityBar />

      <div style={warn}>
        <strong>The honest answer:</strong> Most expats in central Singapore don't need a car. Public transport is world-class. But if you have kids doing school runs, live in the West or North, or value flexibility, a car can genuinely transform your quality of life.
      </div>

      <h2 style={h2}>The real cost of owning a car in Singapore</h2>
      <p style={body}>Singapore has some of the most expensive car ownership costs in the world. A mid-range car (Toyota Camry equivalent) will cost you around SGD $180,000–$220,000 all-in, including the Certificate of Entitlement (COE). Monthly outgoings typically run to SGD $3,500–$4,500 when you add up loan repayment, insurance, road tax, fuel, ERP charges, and parking.</p>
      <p style={body}>That figure dwarfs what you'd spend in London, Sydney, or New York. Before committing, run the numbers for your specific situation — the calculator below can help.</p>

      <h2 style={h2}>When a car makes sense in Singapore</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, margin: "16px 0 28px" }}>
        {[
          { icon: "🏫", title: "School runs", desc: "Multiple children at different schools, especially if MRT access is limited or hours are awkward." },
          { icon: "🏠", title: "Suburban location", desc: "If you live in Bukit Timah, the West, or North, distances to MRT make a car genuinely useful." },
          { icon: "🌙", title: "Late-night work", desc: "If you regularly work past midnight, Grab surcharges add up. A car pays for itself quickly." },
          { icon: "👶", title: "Young children", desc: "Car seats, prams, and tired toddlers on public transport is a specific kind of challenge." },
          { icon: "🐕", title: "Pets", desc: "Pets can't travel on MRT. If you have a dog, a car becomes almost essential for vets and parks." },
          { icon: "📦", title: "Frequent bulk shopping", desc: "Costco, IKEA, and wet market runs are genuinely much easier with a car." },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 20 }}>{icon}</p>
            <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{title}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>When you probably don't need a car</h2>
      <div style={good}>
        <strong>Consider skipping the car if:</strong> you live within 10 minutes of an MRT; you work in the CBD; your kids school is on an MRT line; you're here for under 3 years; or your employer provides transport. Singapore's Grab is reliable, fast, and often faster than driving during peak hours.
      </div>
      <p style={body}>Grab's base fare is reasonable and surge pricing, while annoying, is rare outside peak hours and rain. Many expats find a combination of MRT for daily commutes and Grab for evenings and weekends works extremely well — and is significantly cheaper than car ownership.</p>

      <h2 style={h2}>Leasing vs buying vs Grab: a rough comparison</h2>
      <div style={{ overflowX: "auto", margin: "16px 0 28px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Option</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Monthly Cost</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Best For</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Buy (mid-range)", "SGD $3,500–$4,500", "Long stay (5+ yrs), families, frequent use"],
              ["Lease (full-service)", "SGD $2,200–$3,200", "2–4 yr stays, flexibility, hassle-free"],
              ["Grab + MRT", "SGD $400–$900", "City dwellers, under 2 yr stays, light users"],
              ["MRT pass only", "SGD $128", "Central locations, solo or couple, no kids"],
            ].map(([option, cost, best], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ padding: "11px 16px", fontWeight: 600, color: "#374151" }}>{option}</td>
                <td style={{ padding: "11px 16px", fontWeight: 700, color: "#1a1a2e" }}>{cost}</td>
                <td style={{ padding: "11px 16px", color: "#6b7280" }}>{best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={note}>
        <strong>Leasing tip:</strong> If you're on the fence, leasing is almost always the right choice for expats. You get the flexibility of a car without the COE risk or the stress of selling when you leave. Monthly costs are predictable and usually include insurance and maintenance.
      </div>

      <h2 style={h2}>Our verdict</h2>
      <p style={body}>If you're a couple or single, living centrally, and here for under 3 years — skip the car. The maths almost never works out in your favour, and Singapore's public transport will serve you well.</p>
      <p style={body}>If you have children doing school runs, live outside the central belt, plan to stay 3+ years, or simply value having a car available — leasing is the smart first move. It gives you the benefits of a car without locking in capital on a depreciating COE.</p>
      <p style={body}>Buying makes sense only for longer-term residents (5+ years) who want to build equity in a vehicle, or who use a car heavily enough to justify the higher upfront outlay.</p>

      <FAQ items={faqItems} city="sg" />
    </Layout>
  );
}
