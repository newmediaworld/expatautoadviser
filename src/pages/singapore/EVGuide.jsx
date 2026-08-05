import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

const EV_MODELS = [
  { model: "Tesla Model 3", type: "Sedan", range: "~500 km", lease: "SGD $3,400–$4,200/mth", note: "Most common EV in Singapore lease fleets. Supercharger network is the best in Singapore." },
  { model: "Tesla Model Y", type: "SUV", range: "~530 km", lease: "SGD $3,800–$4,800/mth", note: "Family-sized, excellent cargo space. Increasingly common as an expat family lease." },
  { model: "BYD Atto 3", type: "SUV", range: "~420 km", lease: "SGD $2,400–$3,200/mth", note: "Strong value EV. Rising fast in Singapore lease fleets since 2023." },
  { model: "Hyundai Ioniq 6", type: "Sedan", range: "~520 km", lease: "SGD $3,200–$4,000/mth", note: "Elegant design, ultra-efficient. 800V architecture means faster charging." },
  { model: "Hyundai Ioniq 5", type: "SUV", range: "~480 km", lease: "SGD $3,400–$4,200/mth", note: "Practical family-sized EV with distinctive retro design." },
  { model: "BMW iX3", type: "SUV", range: "~440 km", lease: "SGD $4,200–$5,200/mth", note: "Premium EV lease. Familiar driving dynamics for existing BMW drivers." },
];

const CHARGING_NETWORKS = [
  { name: "SP Group (SP Mobility)", speed: "Level 2 (7–22 kW)", locations: "Largest network — HDB carparks, condos, commercial buildings", note: "Integrated with the SP Utilities app. Singapore had 30,500 charging points deployed nationally as at March 2026, roughly half of them publicly accessible." },
  { name: "Tesla Supercharger", speed: "V3: up to 250 kW", locations: "15 Supercharger stations; major malls, Changi, Marina Bay", note: "Tesla owners only. By far the most reliable and fastest for compatible vehicles." },
  { name: "ChargeEV", speed: "Level 2 to DC Fast (50 kW)", locations: "Commercial buildings, hotels, selected carparks", note: "Subscription or pay-per-use." },
  { name: "Greenlots / Shell Recharge", speed: "DC Fast (50–150 kW)", locations: "Shell stations and selected sites", note: "Good for top-ups on longer journeys. Pay-per-use via app." },
  { name: "Building chargers", speed: "Level 1–2 (3–22 kW)", locations: "Condos and landed properties (if retrofitted)", note: "Most convenient if available at home. Check before committing to an EV lease." },
];

const HERO_IMG = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80";

export default function SGEVGuide() {
  return (
    <Layout city="sg" title="Electric Vehicles in Singapore: Complete Expat Guide (2025–26)" description="Should you lease an EV in Singapore? EV incentives, charging infrastructure, model comparison, real costs, and practical advice for expats." relatedLinks={[{ label: 'Leasing Guide', to: '/singapore/leasing-guide' }, { label: 'Buying Guide', to: '/singapore/buying-guide' }, { label: 'Insurance Guide', to: '/singapore/insurance-guide' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="EV Singapore" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <p style={{ color: "#e8341c", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Singapore</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, lineHeight: 1.2 }}>Electric Vehicles in Singapore: What Expats Need to Know</h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 }}>EVs are increasingly common in Singapore lease fleets and the infrastructure has improved dramatically since 2022. Here's whether an EV makes sense for your situation — including the real costs, charging realities, and which models to consider.</p>

        <h2 style={h2}>Why EVs make particular sense in Singapore</h2>
        <p style={body}>Singapore is one of the most EV-friendly countries in the world for practical use. The island is small (roughly 50km end-to-end), so range anxiety is almost non-existent — even a 300 km EV will handle a full week of driving comfortably. Petrol costs around <strong>SGD $3.20–$3.50/litre</strong>, making charging significantly cheaper per kilometre.</p>
        <p style={body}>For expats on a lease, the economics are increasingly compelling: EV leases are priced more competitively than you'd expect given the underlying car cost, partly because leasing companies benefit from government incentives. Insurance and road tax are also bundled in most leases, removing the usual EV cost premium from your monthly calculation.</p>

        <h2 style={h2}>Singapore's EV policy and incentives</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, margin: "16px 0 28px" }}>
          {[
            ["2030 cleaner-energy target", "From 2030, only cleaner-energy vehicles (including hybrids) can be newly registered. New diesel registrations already stopped in 2025. The full ICE phase-out target is 2040."],
            ["EV Early Adoption Incentive (EEAI)", "The EV Early Adoption Incentive (EEAI) provides a 45% rebate on the Additional Registration Fee (ARF), capped at SGD $15,000 for 2025 registrations (cap reduces to $7,500 in 2026). The scheme has been extended to 31 December 2026 and will not be renewed thereafter. This significantly reduces upfront EV purchase costs. Leasing companies benefit from related schemes that flow through to competitive lease pricing."],
            ["VES (Vehicle Emissions Scheme)", "From January 2026, only battery electric vehicles qualify for VES rebates — hybrids no longer receive rebates. The top-tier VES rebate for EVs is up to SGD $22,500 on registration. Combined incentives make EV total costs of ownership increasingly competitive with petrol equivalents."],
            ["EV road tax", "EV road tax in Singapore is calculated on the car's peak motor power output (kW), and every fully electric car also pays an Additional Flat Component of SGD $350 every six months \u2014 SGD $700 a year \u2014 which stands in for the fuel excise duty an EV never pays. Including the AFC, a 100 kW EV (e.g. the Singapore-market BYD Atto 3) pays roughly SGD $1,550/year and a 150 kW model around SGD $1,795/year; a Tesla Model 3 Long Range at ~324 kW pays roughly SGD $4,555/year, because the formula steps up sharply above 230 kW. EV road tax is therefore not automatically cheaper than petrol. Use the LTA road tax calculator for your specific model. Leases bundle road tax, so the rate is less relevant for lessees."],
          ].map(([heading, detail]) => (
            <div key={heading} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #f3f4f6" }}>
              <strong style={{ fontSize: 14, color: "#1e3a5f" }}>{heading}</strong>
              <p style={{ margin: "5px 0 0", fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{detail}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>EV vs petrol lease: real cost comparison</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "16px 0 28px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Cost item</th>
                <th style={th}>Petrol (mid-range)</th>
                <th style={th}>EV (equivalent)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Monthly lease rate", "SGD $2,200–$2,800", "SGD $2,400–$3,200"],
                ["Petrol / charging (est.)", "SGD $250–$400/mth", "SGD $60–$120/mth"],
                ["Insurance", "Bundled in lease", "Bundled in lease"],
                ["Road tax", "Bundled in lease", "Bundled in lease"],
                ["Servicing", "Bundled in lease", "Bundled in lease"],
                ["Total monthly est.", "SGD $2,450–$3,200", "SGD $2,460–$3,320"],
              ].map(([item, petrol, ev]) => (
                <tr key={item} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", color: "#374151" }}>{item}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>{petrol}</td>
                  <td style={{ padding: "12px 16px", color: item === "Petrol / charging (est.)" ? "#16a34a" : "#374151", fontWeight: item === "Petrol / charging (est.)" ? 700 : 400 }}>{ev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={body}>The monthly difference is smaller than many expect. EV leases are priced slightly higher, but the charging saving is significant. Over a 36-month lease, the fuel saving on an EV vs petrol can offset most or all of the lease price premium.</p>

        <h2 style={h2}>Charging in Singapore: the practical reality</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "16px 0 36px" }}>
          {CHARGING_NETWORKS.map(({ name, speed, locations, note }) => (
            <div key={name} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>{name}</h3>
                <span style={{ background: "#f0f9ff", color: "#0c4a6e", fontSize: 12, padding: "3px 10px", borderRadius: 12, fontWeight: 600 }}>{speed}</span>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6b7280" }}>📍 {locations}</p>
              <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>{note}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 20, margin: "0 0 36px" }}>
          <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#92400e" }}>Check your building before committing</p>
          <p style={{ margin: 0, fontSize: 14, color: "#92400e", lineHeight: 1.6 }}>Home charging is the biggest practical variable. Before signing an EV lease, ask your building management: (1) Does the car park have EV chargers installed? (2) If not, are there plans to install them? (3) Is there a dedicated circuit or shared load capacity? An overnight home charge is the most convenient and cheapest charging option — losing it means relying entirely on public infrastructure.</p>
        </div>

        <h2 style={h2}>EV models in Singapore lease fleets</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 36px" }}>
          {EV_MODELS.map(({ model, type, range, lease, note }) => (
            <div key={model} style={{ background: "white", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: 20, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>{model}</h3>
                  <span style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 12, padding: "2px 10px", borderRadius: 12 }}>{type}</span>
                  <span style={{ background: "#ecfdf5", color: "#166534", fontSize: 12, padding: "2px 10px", borderRadius: 12 }}>Range: {range}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{note}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 2 }}>Lease est.</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f" }}>{lease}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "#9ca3af" }}>Lease estimates are indicative for 2025–26 and vary by company, duration, and mileage allowance. Request quotes from at least two leasing companies to compare.</p>

        <h2 style={h2}>Is an EV lease right for you?</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, margin: "16px 0 28px" }}>
          {[
            { label: "Your building has EV chargers (or will soon)", good: true },
            { label: "You drive primarily within Singapore (no frequent Malaysia trips)", good: true },
            { label: "You want lower monthly fuel costs", good: true },
            { label: "You're comfortable with app-based charging and network infrastructure", good: true },
            { label: "You do frequent cross-border drives to Johor / Malaysia", good: false },
            { label: "Your building has no EV charging and the management isn't planning any", good: false },
            { label: "You're on a short (under 18 month) assignment with uncertain extension", good: false },
          ].map(({ label, good }) => (
            <div key={label} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6", alignItems: "flex-start" }}>
              <span style={{ color: good ? "#16a34a" : "#dc2626", fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{good ? "✓" : "✗"}</span>
              <span style={{ fontSize: 15, color: "#374151" }}>{label}</span>
            </div>
          ))}
        </div>

        <h2 style={h2}>Malaysia trips: the one practical limitation</h2>
        <p style={body}>Singapore's EV charging network does not extend into Malaysia. If you regularly drive to Johor Bahru or take longer Malaysian road trips, a petrol or hybrid lease is more practical. EV range is sufficient for the JB crossing, but public charging in southern Johor is sparse and unreliable.</p>
        <p style={body}>If Malaysia trips are occasional (once or twice a year), an EV lease is still very practical — top up to 100% before crossing and plan charging stops if going further north.</p>

        <div style={{ marginTop: 40, padding: 24, background: "#f9fafb", borderRadius: 10 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15, color: "#1e3a5f" }}>Related guides</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              ["/singapore/leasing-guide", "Singapore Leasing Guide — how leasing works, what's bundled"],
              ["/singapore/calculators", "Calculators — lease cost estimator and COE comparison"],
              ["/singapore/should-i-get-a-car", "Should I Get a Car in Singapore?"],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={{ color: "#e8341c", fontSize: 14, textDecoration: "none" }}>→ {label}</Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const h2 = { fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: "36px 0 12px" };
const body = { fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 16 };
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#374151" };
