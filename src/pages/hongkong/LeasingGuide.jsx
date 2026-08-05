import Layout from '../../components/Layout';
import FAQ from '../../components/FAQ';

const h1 = { margin: "0 0 12px", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: "36px 0 12px", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a2e" };
const body = { margin: "0 0 16px", fontSize: 15, color: "#374151", lineHeight: 1.75 };
const note = { background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#134e4a", lineHeight: 1.6 };

// Hong Kong street — Moke or similar car on HK roads
const HERO_IMG = "https://images.unsplash.com/photo-1449280429541-0214e229317b?w=1200&q=80";

const faqItems = [
  { q: "Can you lease a car in Hong Kong?", a: "Yes, though it's less common than in Singapore. Operating leases (full-service) are offered by several providers, typically for 1–3 year terms. Monthly rates are generally higher than Singapore but you avoid the large upfront costs of buying." },
  { q: "What's included in a typical HK lease?", a: "Most HK operating leases include the car, maintenance, insurance, and road tax. You pay for fuel and tolls. Mileage limits typically range from 2,000–3,000 km/month." },
  { q: "Do I need a Hong Kong driving licence to lease?", a: "You can drive on a valid overseas licence for 12 months after arrival. After that you must convert. Licences issued by the countries and places listed in Schedule 4 of Cap. 374B — which includes the UK, the United States, Canada, Australia and many (but not all) EU states — can be directly issued without a test, provided you also meet one of the Transport Department eligibility limbs: the licence was issued during a period of at least 6 months residence there, or you have held it for at least 5 years, or you hold a passport from that country." },
  { q: "Is leasing or buying cheaper in HK?", a: "For most expats (2–4 year assignments), leasing is cheaper once you account for the First Registration Tax (FRT) on purchase and the hassle of selling before you leave. For stays over 5 years, buying can make more sense." },
  { q: "What happens at the end of the lease?", a: "You simply return the car. There are no FRT or resale complexities. Most providers allow early termination with 1–2 months' notice, though penalties may apply." },
];

export default function HKLeasingGuide() {
  return (
    <Layout city="hk" active="Leasing Guide" relatedLinks={[{ label: 'Should I Get a Car?', to: '/hong-kong/should-i-get-a-car' }, { label: 'Insurance Guide', to: '/hong-kong/insurance-guide' }, { label: 'EV Guide', to: '/hong-kong/ev-guide' }, { label: 'Cost Calculator', to: '/hong-kong/calculators' }, { label: 'Lease Checker', to: '/hong-kong/lease-checker' }]}>
      {/* Hero */}
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Car on Hong Kong road" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#2a9d8f", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hong Kong</p>
      <h1 style={h1}>Leasing a Car in Hong Kong as an Expat</h1>
      <p style={{ ...body, fontSize: 17, color: "#6b7280" }}>Buying is the norm in HK — but for shorter assignments or those who want simplicity, leasing is a legitimate and increasingly popular option.</p>

      <div style={note}>
        <strong>Good to know:</strong> HK's public transport is excellent. Many expats in urban areas (Central, Wan Chai, Causeway Bay) manage without a car entirely. But if you're in Sai Kung, Clear Water Bay, the New Territories, or have school-run duties, a car makes a real difference.
      </div>

      <h2 style={h2}>Leasing vs buying in Hong Kong</h2>
      <div style={{ overflowX: "auto", margin: "16px 0 28px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Factor</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#e63946", borderBottom: "1px solid #e5e7eb" }}>Leasing</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#2a9d8f", borderBottom: "1px solid #e5e7eb" }}>Buying</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Upfront cost", "Low (1–2 months deposit)", "High (FRT + purchase price)"],
              ["Monthly cost", "Higher (all-in)", "Lower if car is paid off"],
              ["Flexibility", "Easy to end or swap", "Complex to sell quickly"],
              ["Maintenance", "Usually included", "Your responsibility"],
              ["Best for", "Assignments under 4 years", "Long stays, families"],
              ["FRT (First Reg Tax)", "Not applicable", "46–132% in marginal bands"],
            ].map(([factor, lease, buy], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ padding: "11px 16px", fontWeight: 600, color: "#374151" }}>{factor}</td>
                <td style={{ padding: "11px 16px", textAlign: "center", color: "#374151" }}>{lease}</td>
                <td style={{ padding: "11px 16px", textAlign: "center", color: "#374151" }}>{buy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2}>Typical lease costs in Hong Kong (2025–26)</h2>
      <div style={{ overflowX: "auto", margin: "16px 0 28px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Category</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Example Models</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>Monthly Cost</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Economy", "Toyota Vios, Honda Jazz", "HKD $7,000–$10,000"],
              ["Mid-range", "Toyota Camry, Mazda CX-5", "HKD $10,000–$15,000"],
              ["Premium", "BMW 3 Series, Mercedes C-Class", "HKD $15,000–$22,000"],
              ["Luxury / SUV", "BMW X5, Mercedes GLE", "HKD $22,000–$35,000"],
            ].map(([cat, models, cost], i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                <td style={{ padding: "11px 16px", fontWeight: 600, color: "#374151" }}>{cat}</td>
                <td style={{ padding: "11px 16px", color: "#374151" }}>{models}</td>
                <td style={{ padding: "11px 16px", fontWeight: 700, color: "#1a1a2e" }}>{cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ ...body, fontSize: 13, color: "#9ca3af" }}>Costs are indicative for 2-year full-service leases including insurance and maintenance. Fuel, tolls, and parking extra.</p>

      <h2 style={h2}>What's typically included in an HK lease</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, margin: "16px 0 28px" }}>
        {[
          ["✅", "Comprehensive insurance", "Included in most leases"],
          ["✅", "Annual road tax (vehicle licence)", "Included"],
          ["✅", "Scheduled servicing", "At authorised dealer"],
          ["✅", "Replacement vehicle", "If car is in for repairs"],
          ["❌", "Fuel", "Your cost"],
          ["❌", "Tunnel tolls & parking", "Your cost"],
          ["❌", "Excess kilometres", "Charged at end of term"],
        ].map(([icon, item, detail]) => (
          <div key={item} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
            <div>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{item}</p>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={h2}>Driving in Hong Kong: what expats need to know</h2>
      <p style={body}>Hong Kong drives on the left (same as the UK and Australia). Roads are generally well-maintained but can be narrow and steep in residential areas, particularly on the Peak and in Sai Kung. Traffic in the Cross-Harbour Tunnel and during rush hours can be severe — factor this into your commute calculations.</p>
      <p style={body}>Parking is expensive and scarce in urban areas. Monthly parking in Central or Wan Chai can cost HKD $4,000–$8,000 per month. If you live in a building with allocated parking this is less of an issue, but it's worth checking before you commit to a car.</p>

      <h2 style={h2}>Fuel costs</h2>
      <p style={body}>Petrol in Hong Kong is among the most expensive in the world — around HKD $32–$33 per litre at mid-2026 pump prices. A typical 2,000 km/month driver will spend HKD $4,500–$6,000/month on fuel. Electric vehicles are gaining traction; home charger installation is possible in most private buildings with management approval.</p>

      <FAQ items={faqItems} city="hk" />
    </Layout>
  );
}
