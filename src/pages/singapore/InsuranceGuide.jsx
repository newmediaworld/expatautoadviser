import Layout from "../../components/Layout";
import AffiliateBox from "../../components/AffiliateBox";
import FAQ from "../../components/FAQ";

const insurancePartners = [
  {
    name: "DirectAsia",
    desc: "Singapore's most popular direct insurer. Quick online quotes, transparent pricing, strong expat take-up.",
    badge: "Popular",
    url: "#",
  },
  {
    name: "NTUC Income",
    desc: "Cooperative insurer with wide branch network. Good for NCD transfer from overseas. Competitive renewal rates.",
    badge: null,
    url: "#",
  },
  {
    name: "Tokio Marine",
    desc: "Strong reputation for claims handling. Worth comparing if you've had previous incidents — often more flexible on loading.",
    badge: null,
    url: "#",
  },
];

const insuranceFAQ = [
  {
    q: "Do I need to arrange my own insurance if I'm leasing?",
    a: "Almost certainly not. The vast majority of Singapore car leases include comprehensive insurance in the monthly fee. Before signing, confirm: (a) that insurance is included, (b) whether it's comprehensive or third-party only, and (c) what the excess is. Ask for the actual policy document — not just verbal confirmation.",
  },
  {
    q: "Can I transfer my No Claims Discount from the UK / Australia / US?",
    a: "Yes, most Singapore insurers will accept a foreign NCD letter. You'll need a letter from your previous insurer on headed paper, confirming the number of claim-free years and your policy details. Discounts in Singapore range from 10% (1 year) to 50% (5+ years).",
  },
  {
    q: "What happens to my insurance if I drive into Malaysia?",
    a: "Most comprehensive policies cover Malaysia, but coverage typically reduces to third-party-only once you cross the Causeway. Check your policy wording before you go. Some leasing companies require you to notify them before taking the car across — ask in writing.",
  },
  {
    q: "What's a typical excess on a Singapore lease policy?",
    a: "Excess on bundled lease insurance varies widely: SGD $1,000–$3,200 is typical for named drivers. Young or inexperienced drivers may face a higher excess of SGD $2,000–$5,000. This is the amount you pay out-of-pocket in the event of a claim — know this number before you sign.",
  },
  {
    q: "What if I need to arrange my own insurance (buying rather than leasing)?",
    a: "Get quotes from at least 3 insurers. DirectAsia, NTUC Income, Tokio Marine and AXA are the main players. With no SG NCD history, expect to pay roughly SGD $1,500–$3,000/year for comprehensive cover on an economy car. Present your overseas NCD letter to each insurer — it can knock 30–50% off the premium.",
  },
];

const HERO_IMG = "https://images.unsplash.com/photo-1600664356348-10686526af4f?w=1200&q=80";

export default function SGInsuranceGuide() {
  return (
    <Layout
      city="sg"
      title="Singapore Car Insurance Guide for Expats"
      description="Car insurance in Singapore explained for expats: what's bundled in leases, NCD transfers, third-party vs comprehensive, and what to do if you're buying."
     relatedLinks={[{ label: 'Leasing Guide', to: '/singapore/leasing-guide' }, { label: 'Buying Guide', to: '/singapore/buying-guide' }, { label: 'Cost Calculator', to: '/singapore/calculators' }, { label: 'SG vs HK Insurance', to: '/singapore/car-insurance-vs-hong-kong' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Red car Singapore" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{ maxWidth: 760 }}>
        <p style={{ color: "#e8341c", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Singapore</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, lineHeight: 1.2 }}>
          Car Insurance in Singapore: What Expats Need to Know
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 40 }}>
          The good news: if you're leasing, insurance is almost certainly already sorted. Here's what to check — and what to do if it isn't.
        </p>

        <h2 style={h2}>Insurance is normally bundled in leases</h2>
        <p style={body}>The vast majority of Singapore car leases include comprehensive insurance as part of the monthly fee. Before signing your lease, confirm: (a) that insurance is included, (b) whether it's comprehensive or only third-party, and (c) what the excess is. SGD $1,000–$3,200 is typical for standard policies — but some leases have higher excess for expats without a Singapore driving history.</p>
        <p style={body}>Ask for the actual policy document, not just verbal confirmation. You want to know the insurer's name, the policy number, and the excess figure before you drive off the forecourt.</p>

        <h2 style={h2}>No Claims Discount (NCD) — using your overseas history</h2>
        <p style={body}>Singapore insurance operates on a No Claims Discount system: discounts range from 10% (1 year) to 50% (5+ years). If you have a clean claims history from overseas (UK, Australia, US, etc.), many Singapore insurers will honour this. You'll need a letter from your previous insurer on headed paper, confirming your NCD status and the number of claim-free years.</p>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", margin: "16px 0 28px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ background: "#f9fafb" }}>
              <th style={th}>Claim-free years</th><th style={th}>NCD</th><th style={th}>Premium saving (example)</th>
            </tr></thead>
            <tbody>
              {[
                ["1 year", "10%", "~SGD $150–300"],
                ["2 years", "20%", "~SGD $300–600"],
                ["3 years", "30%", "~SGD $450–900"],
                ["4 years", "40%", "~SGD $600–1,200"],
                ["5+ years", "50%", "~SGD $750–1,500"],
              ].map(([years, ncd, saving]) => (
                <tr key={years} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={td}>{years}</td>
                  <td style={{ ...td, fontWeight: 700, color: "#1e3a5f" }}>{ncd}</td>
                  <td style={td}>{saving}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={h2}>If your lease doesn't include insurance</h2>
        <p style={body}>Major Singapore insurers include DirectAsia, NTUC Income, Tokio Marine, and AXA. Expect to pay roughly <strong>SGD $1,500–$3,000/year</strong> for comprehensive coverage on an economy car with no SG NCD history. Submit your overseas NCD letter to each insurer for an accurate quote — it can reduce the premium by 30–50%.</p>

        {/* TODO(affiliate): re-enable when partner URLs are live */}
        {/*
        <AffiliateBox
          city="sg"
          type="insurance"
          title="Insurers worth getting a quote from"
          partners={insurancePartners}
        />
        */}

        <h2 style={h2}>Third-party vs comprehensive: what's the difference?</h2>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, margin: "16px 0 28px" }}>
          {[
            ["Third-party only (TPO)", "Covers damage you cause to other vehicles and property. Does NOT cover your own car. The minimum legal requirement in Singapore."],
            ["Third-party, fire & theft", "Adds cover for your car being stolen or damaged by fire. Still doesn't cover accident damage to your own car."],
            ["Comprehensive", "Covers everything — your car, other vehicles, fire, theft, and usually windscreen. What you almost certainly have in a lease."],
          ].map(([type, desc]) => (
            <div key={type} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", margin: "0 0 4px" }}>{type}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <FAQ city="sg" items={insuranceFAQ} />
      </div>
    </Layout>
  );
}

const h2 = { fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: "36px 0 12px" };
const body = { fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 16 };
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13, color: "#374151" };
const td = { padding: "12px 16px", color: "#374151", fontSize: 14 };
