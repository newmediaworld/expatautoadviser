import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

const HERO_IMG = "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80";

export default function HKEVGuide() {
  return (
    <Layout city="hk" title="Electric Vehicles in Hong Kong: Expat Guide" description="EV buying and ownership in Hong Kong for expats: the FRT concession that ended on 31 March 2026, charging infrastructure, popular EV models, and whether an EV still makes sense for you." relatedLinks={[{ label: 'Buying Guide', to: '/hong-kong/buying-guide' }, { label: 'Leasing Guide', to: '/hong-kong/leasing-guide' }, { label: 'FRT Tax Explained', to: '/hong-kong/frt-tax-explained' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="EV Hong Kong" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>
      <div style={{maxWidth:760}}>
        <p style={{color:"#0d9488",fontWeight:600,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Hong Kong</p>
        <h1 style={{fontSize:36,fontWeight:800,color:"#1e3a5f",marginBottom:16,lineHeight:1.2}}>Electric Vehicles in Hong Kong: What Expats Should Know</h1>
        <p style={{fontSize:17,color:"#6b7280",lineHeight:1.7,marginBottom:40}}>Hong Kong’s compact geography suits EVs well — but the first registration tax concession for private electric cars ended on 31 March 2026. Here’s what you need to know before buying.</p>

        <h2 style={h2}>Why EVs make sense in Hong Kong</h2>
        <p style={body}>With petrol running at <strong>around HKD $32–33/litre</strong> in mid-2026 — among the world’s highest — the running-cost savings of an EV in Hong Kong are substantial. The purchase incentives, however, have now gone for private cars (see below). And given that most HK driving is urban or suburban (distances are short), range anxiety is rarely an issue.</p>

        <h2 style={h2}>FRT concessions for EVs: what changed on 1 April 2026</h2>
        <p style={body}>The 2026-27 Budget, announced on 25 February 2026, confirmed that the First Registration Tax concessions for <strong>electric private cars</strong> — including the One-for-One Replacement Scheme — would not be extended beyond their expiry on <strong>31 March 2026</strong>. Applications for first registration submitted on or after 1 April 2026 pay the full standard FRT bands, exactly as a petrol car does.</p>
        <p style={body}>Until 31 March 2026 the concession was capped at <strong>HKD $58,500</strong> for a general purchase, rising to <strong>HKD $172,500</strong> under the One-for-One Replacement Scheme (which required de-registering a qualifying older vehicle). That is the size of the step-up a private EV buyer now absorbs.</p>
        <p style={body}>One transitional carve-out survives: electric private cars <strong>ordered on or before 25 February 2026</strong>, or already arranged for shipment to Hong Kong for the owner’s own use, can still be taxed at the pre-adjustment concession if the supporting documents and application reach the Transport Department by <strong>24 February 2027</strong> and are approved.</p>
        <p style={body}>Electric <strong>commercial</strong> vehicles, electric motorcycles and electric motor tricycles keep a full FRT waiver until <strong>31 March 2028</strong>. See the <Link to="/hong-kong/frt-tax-explained" style={{color:"#0d9488"}}>FRT Explainer</Link> for how FRT is calculated, and confirm the position with the Transport Department before committing.</p>

        <h2 style={h2}>Charging infrastructure</h2>
        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:10,padding:24,margin:"16px 0 28px"}}>
          {[["🏠 Home charging","Landed properties: straightforward to install a home charger. High-rise buildings: increasingly installing EV chargers in car parks, but coverage is still patchy — check before you buy."],
            ["🔌 Tesla Superchargers","Multiple Supercharger sites across HK Island, Kowloon, and NT. Coverage is strong for Tesla owners."],
            ["⚡ CLP and HKE chargers","Both main utilities (CLP and HK Electric) operate public charging networks. Download their apps (CLP EV Charging, HKE GO) for locations."],
            ["🏢 Car park charging","Many commercial buildings and shopping centres (IFC, Pacific Place, MegaBox) have EV bays. Availability is growing fast."],
          ].map(([type, detail]) => (
            <div key={type} style={{marginBottom:16}}><strong style={{fontSize:14,color:"#1e3a5f"}}>{type}</strong><p style={{margin:"4px 0 0",fontSize:14,color:"#374151",lineHeight:1.6}}>{detail}</p></div>
          ))}
        </div>

        <h2 style={h2}>Popular EV models among Hong Kong expats</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"16px 0 28px"}}>
          {[["Tesla Model 3","Most popular EV in HK; excellent Supercharger network makes ownership easy"],["Tesla Model Y","Family SUV; growing fast in popularity, especially in NT and Sai Kung"],["BYD Han / Atto 3","Strong value proposition; BYD has become a serious player in HK"],["Porsche Taycan","Premium choice; with the private-EV FRT concession gone, expect the full 46–132% band schedule on the taxable value"],["BMW iX3 / i4","Popular among expats upgrading from petrol BMWs — familiar brand, electric drivetrain"]].map(([model, note]) => (
            <div key={model} style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:8,padding:"14px 16px"}}>
              <strong style={{fontSize:14,color:"#0d9488"}}>{model}</strong>
              <p style={{margin:"4px 0 0",fontSize:13,color:"#374151"}}>{note}</p>
            </div>
          ))}
        </div>

        <h2 style={h2}>Is an EV right for you?</h2>
        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:10,padding:24,margin:"16px 0 28px"}}>
          {[["✅ Good fit for EV","You have home charging or secure EV access in your building. You drive primarily in urban HK or NT. You plan to stay 2+ years. You can absorb the full FRT now that the private-EV concession has ended, or you are buying used."],
            ["⚠ï¸ Consider carefully","You live in a high-rise without EV charging provision. You drive long distances frequently. You need a used car and the used EV market is thinner than petrol equivalents."],
          ].map(([label, detail]) => (
            <div key={label} style={{marginBottom:16}}><strong style={{fontSize:14,color:"#1e3a5f"}}>{label}</strong><p style={{margin:"4px 0 0",fontSize:14,color:"#374151",lineHeight:1.6}}>{detail}</p></div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
const h2 = {fontSize:22,fontWeight:700,color:"#1e3a5f",margin:"36px 0 12px"};
const body = {fontSize:16,color:"#374151",lineHeight:1.8,marginBottom:16};