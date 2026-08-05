import Layout from '../../components/Layout';
import CredibilityBar from '../../components/CredibilityBar';
import FAQ from '../../components/FAQ';

const h1 = { margin: "0 0 12px", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: "36px 0 12px", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a2e" };
const body = { margin: "0 0 16px", fontSize: 15, color: "#374151", lineHeight: 1.75 };
const note = { background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#134e4a", lineHeight: 1.6 };
const warn = { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#991b1b", lineHeight: 1.6 };
const good = { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#166534", lineHeight: 1.6 };

const HERO_IMG = "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1200&q=80";

const faqItems = [
  { q: "Is Hong Kong's public transport good enough to go car-free?", a: "For most urban areas — absolutely yes. The MTR is one of the best metro systems in the world: fast, punctual, and cheap. Add the Star Ferry, trams, and minibuses, and central HK is genuinely easier without a car." },
  { q: "How much does car ownership actually cost per month in Hong Kong?", a: "A rough all-in figure for a mid-range petrol car: loan repayment HKD $10,000, insurance $2,500, fuel $4,000, parking $5,000–$8,000, tunnel tolls $1,000. That's HKD $22,500–$25,500/month. Urban parking alone often costs more than a lease payment." },
  { q: "Are there areas in HK where a car is basically essential?", a: "Yes — Sai Kung, Clear Water Bay, Clearwater Bay, Discovery Bay (no cars allowed, but ferries), the New Territories, and the southern side of Hong Kong Island. If you're in these areas and have family, a car makes a genuine quality-of-life difference." },
  { q: "Can I lease a car in Hong Kong?", a: "Yes, though leasing is less common than in Singapore. Operating leases (full-service including insurance and maintenance) are available from several providers for 1–3 year terms. Monthly costs typically range from HKD $7,000 for economy to HKD $22,000+ for premium models." },
  { q: "What about Uber and taxis? Can I rely on those?", a: "HK taxis are plentiful and cheap by international standards, but there are colour zones and they can be hard to hail on rainy days. Uber operates in HK. For urban dwellers, taxis plus MTR often works out cheaper than owning a car — especially factoring in parking." },
];

export default function HKShouldIGetACar() {
  return (
    <Layout city="hk" active="Should I Get a Car?" relatedLinks={[{ label: 'Leasing Guide', to: '/hong-kong/leasing-guide' }, { label: 'Buying Guide', to: '/hong-kong/buying-guide' }, { label: 'FRT Tax Explained', to: '/hong-kong/frt-tax-explained' }, { label: 'Cost Calculator', to: '/hong-kong/calculators' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Hong Kong streets" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#2a9d8f", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hong Kong</p>
      <h1 style={h1}>Should I Get a Car in Hong Kong?</h1>
      <p style={{ ...body, fontSize: 17, color: "#6b7280" }}>HK's public transport is exceptional — but so are its hills, its sprawl, and its school run logistics. Here's how to decide.</p>

      <CredibilityBar />

      <div style={warn}>
        <strong>The honest answer:</strong> Most expats in Central, Wan Chai, or Causeway Bay genuinely do not need a car. The MTR is world-class. But Sai Kung, Discovery Bay, the New Territories, and the Peak are different stories entirely.
      </div>

      <h2 style={h2}>The real cost of owning a car in Hong Kong</h2>
      <p style={body}>Hong Kong applies a First Registration Tax (FRT) in marginal bands: 46% on the first HKD $150,000 of taxable value, 86% on the next HKD $150,000, 115% on the next HKD $200,000, and 132% above HKD $500,000. A HKD $200,000 car attracts HKD $112,000 in FRT — a total cost of HKD $312,000 all-in. For a HKD $500,000 car the FRT is HKD $428,000, taking it to HKD $928,000 — see the FRT Explained guide for the full breakdown. Add parking (HKD $4,000–$8,000/month in urban areas), fuel (around HKD $32–$33/litre in mid-2026), insurance, and tunnel tolls, and the monthly cost of car ownership regularly exceeds HKD $20,000.</p>
      <p style={body}>For expats on 2–3 year assignments, leasing is almost always a better financial decision than buying. You avoid the FRT exposure and the hassle of selling before you leave.</p>

      <h2 style={h2}>When a car makes sense in Hong Kong</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, margin: "16px 0 28px" }}>
        {[
          { icon: "🏘ï¸", title: "New Territories / Sai Kung", desc: "Public transport is patchy in many NT areas. A car changes your access to beaches, hiking, and weekend life." },
          { icon: "🏫", title: "School runs", desc: "Multiple children at different international schools on different schedules — a car becomes almost essential." },
          { icon: "🐕", title: "Pets or large families", desc: "Dogs can't take the MTR. Large families with kit need the boot space." },
          { icon: "🌙", title: "Late-night work", desc: "Taxis can be scarce late at night and surge-priced. A car removes that stress." },
          { icon: "⛰ï¸", title: "The Peak / Mid-Levels", desc: "The escalator helps, but for families with young children, a car gives real freedom on the island." },
          { icon: "🏖ï¸", title: "Weekend lifestyle", desc: "Sai Kung beaches, Clearwater Bay, Shek O — you need a car to unlock Hong Kong's outdoor lifestyle." },
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
        <strong>Consider skipping if:</strong> you live in Central, Wan Chai, Causeway Bay, or any walkable urban area; your office is MTR-accessible; you're here for under 2 years; or you don't have children on school runs. HK taxis are cheap by world standards and Uber also operates here.
      </div>
      <p style={body}>Hong Kong's taxi system is still among the cheapest in any world-class city. A cross-harbour taxi rarely exceeds HKD $200. For occasional use — evenings, weekends, rain days — taxis plus MTR is a perfectly viable strategy.</p>

      <h2 style={h2}>Leasing vs buying vs taxis: a rough comparison</h2>
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
              ["Buy (mid-range)", "HKD $20,000–$26,000", "Long stay (5+ yrs), NT families, heavy users"],
              ["Lease (full-service)", "HKD $10,000–$18,000", "2–4 yr stays, avoid FRT risk, flexibility"],
              ["Taxis + MTR", "HKD $3,000–$8,000", "Urban dwellers, occasional use, short stays"],
              ["MTR pass only", "HKD ~$500", "Central/urban, solo or couple, no school runs"],
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
        <strong>Leasing tip:</strong> If you're new to HK and unsure whether you need a car, start with a 12-month lease. You get the flexibility to test whether a car improves your daily life — and you avoid committing capital to a car that might not work for your lifestyle.
      </div>

      <h2 style={h2}>Our verdict</h2>
      <p style={body}>Urban expats in Central, Sheung Wan, or Wan Chai: you almost certainly don't need a car. The MTR is fast, clean, and omnipresent. Save the money.</p>
      <p style={body}>Families in Sai Kung, the NT, or with complex school run arrangements: a car will meaningfully improve your quality of life. Lease rather than buy if your assignment is under 4 years — the FRT economics rarely work in your favour on short stays.</p>
      <p style={body}>Mid-levels, the Peak, or southern HK Island: it depends heavily on your specific street and situation. Leasing for 12 months to test is the sensible approach.</p>

      <FAQ items={faqItems} city="hk" />
    </Layout>
  );
}
