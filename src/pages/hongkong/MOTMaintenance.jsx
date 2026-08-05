import Layout from "../../components/Layout";

const HERO_IMG = "https://images.unsplash.com/photo-1731960389121-bc833c0b4f24?w=1200&q=80";

export default function HKMOTMaintenance() {
  return (
    <Layout city="hk" title="MOT & Car Maintenance in Hong Kong for Expats" description="Everything expats need to know about Hong Kong car MOT: when it's required, approved inspection centres, what gets checked, and how to find a trustworthy mechanic." relatedLinks={[{ label: 'Buying Guide', to: '/hong-kong/buying-guide' }, { label: 'Insurance Guide', to: '/hong-kong/insurance-guide' }, { label: 'Garage Finder', to: '/hong-kong/garage-finder' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Car maintenance HK" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>
      <div style={{maxWidth:760}}>
        <p style={{color:"#0d9488",fontWeight:600,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Hong Kong</p>
        <h1 style={{fontSize:36,fontWeight:800,color:"#1e3a5f",marginBottom:16,lineHeight:1.2}}>MOT &amp; Car Maintenance in Hong Kong</h1>
        <p style={{fontSize:17,color:"#6b7280",lineHeight:1.7,marginBottom:40}}>Cars aged 6 years or older need an annual inspection in Hong Kong. Here's what's involved — and how to find a mechanic you can actually trust.</p>

        <h2 style={h2}>When is an MOT (Annual Inspection) required?</h2>
        <p style={body}>In Hong Kong, private cars that are <strong>6 years old or older</strong> must pass an Annual Vehicle Inspection before their Vehicle Licence can be renewed. The inspection is typically due annually from the 6th year of registration. This is roughly equivalent to the UK MOT.</p>
        <div style={{background:"#f0fdfa",border:"1px solid #99f6e4",borderRadius:10,padding:20,margin:"16px 0 28px"}}>
          <p style={{margin:0,fontSize:14,color:"#134e4a"}}><strong>Practical tip:</strong> When buying a used car aged 6+, always check when the inspection is next due. If it's overdue or about to expire, factor the cost of a pass — or potential remediation work — into your purchase price negotiation.</p>
        </div>

        <h2 style={h2}>Approved inspection centres</h2>
        <p style={body}>Annual examinations for private cars are carried out at Transport Department designated car testing centres. There are centres across HK Island, Kowloon, and the New Territories. Book in advance — popular centres fill up weeks ahead.</p>
        <p style={body}>Find the current list of designated centres at <strong>td.gov.hk</strong> (search "designated car testing centre"). The prescribed examination fee for a private car is <strong>HKD $585</strong>, with a re-check within 14 calendar days charged at <strong>HKD $180</strong>. Allow 45–90 minutes.</p>

        <h2 style={h2}>What gets checked</h2>
        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:10,padding:24,margin:"16px 0 28px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {["Brakes (service and handbrake)","Steering and suspension","Tyres (condition and tread depth)","Lights (all — headlights, brake, indicators)","Exhaust emissions","Windscreen and wipers","Horn","Seat belts","Body condition (serious rust/damage)","Under-vehicle inspection"].map(item => (
              <div key={item} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{color:"#0d9488",fontSize:16,marginTop:1}}>✓</span>
                <span style={{fontSize:14,color:"#374151"}}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 style={h2}>Finding a trustworthy mechanic</h2>
        <p style={body}>This is genuinely one of the most valuable things you can sort early. A good, honest mechanic is worth their weight in gold in HK — and the best ones get passed around by expat word of mouth.</p>
        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:10,padding:24,margin:"16px 0 28px"}}>
          {[["Ask other expats first","The Facebook groups (Expats in HK, Sai Kung community groups, etc.) consistently recommend the same few trusted mechanics. This is by far the best way to find one."],
            ["English-speaking garages","Several garages in areas with high expat concentration (Sai Kung, Clearwater Bay, Discovery Bay) have English-speaking staff and experience dealing with foreign cars."],
            ["Main dealer vs independent","Main dealers (BMW, Mercedes, Toyota) are reliable but expensive. Good independent garages can cost 40–60% less for servicing with equivalent quality."],
            ["Questions to ask","How long have you been here? Do you keep a service record I can take away? Can I see the parts you're replacing? Any good mechanic will answer these without hesitation."],
          ].map(([heading, detail]) => (
            <div key={heading} style={{marginBottom:16}}><strong style={{fontSize:14,color:"#0d9488"}}>{heading}</strong><p style={{margin:"4px 0 0",fontSize:14,color:"#374151",lineHeight:1.6}}>{detail}</p></div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
const h2 = {fontSize:22,fontWeight:700,color:"#1e3a5f",margin:"36px 0 12px"};
const body = {fontSize:16,color:"#374151",lineHeight:1.8,marginBottom:16};