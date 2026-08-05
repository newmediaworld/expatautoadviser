import Layout from "../../components/Layout";

const HERO_IMG = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80";

export default function SGLicenceConversion() {
  return (
    <Layout city="sg" title="Driving Licence Conversion in Singapore for Expats" description="Step-by-step guide to converting your foreign driving licence in Singapore. All foreign licence holders must pass the Basic Theory Test (BTT). Learn the process, costs and timing." relatedLinks={[{ label: 'Should I Get a Car?', to: '/singapore/should-i-get-a-car' }, { label: 'Leasing Guide', to: '/singapore/leasing-guide' }, { label: 'Buying Guide', to: '/singapore/buying-guide' }]}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Singapore roads and traffic" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{maxWidth:760}}>
        <p style={{color:"#e8341c",fontWeight:600,fontSize:13,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Singapore</p>
        <h1 style={{fontSize:36,fontWeight:800,color:"#1e3a5f",marginBottom:16,lineHeight:1.2}}>Converting Your Driving Licence in Singapore</h1>
        <p style={{fontSize:17,color:"#6b7280",lineHeight:1.7,marginBottom:28}}>All foreign driving licence holders — regardless of country — must pass Singapore's Basic Theory Test (BTT) before converting. There is no "direct conversion without a test" category in Singapore. After passing the BTT, Traffic Police will assess whether a practical driving test is also required.</p>

        <div style={{background:"#fff7ed",border:"1px solid #fed7aa",borderRadius:8,padding:"14px 18px",margin:"0 0 32px",fontSize:14,color:"#9a3412",lineHeight:1.6}}>
          <strong>Important:</strong> Singapore does not offer test-free licence conversion for any nationality. The Basic Theory Test (BTT) is mandatory for everyone — including holders of UK, Australian, US, and EU licences. Do not rely on outdated information suggesting otherwise.
        </div>

        <h2 style={h2}>What tests are required?</h2>
        <p style={body}>The Traffic Police uses a two-stage process for all foreign licence holders:</p>
        <div style={{margin:"16px 0 28px"}}>
          {[
            {title:"Basic Theory Test (BTT) — mandatory for all",desc:"50 multiple-choice questions, 50 minutes, 90% pass mark required (45/50). Covers Singapore road rules, signs, and safe driving behaviour. You must pass this before you can submit a conversion application."},
            {title:"Practical Driving Test (PDT) — assessed case-by-case",desc:"After your BTT, Traffic Police reviews your foreign licence and driving history. Depending on your licence origin and experience, you may or may not need a PDT. Note: Work Permit and S Pass holders are issued a Class 3C (automatic-only) licence on conversion — a practical driving test is required if you want full Class 3."},
          ].map(({title,desc}) => (
            <div key={title} style={{display:"flex",gap:16,marginBottom:20}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:"#e8341c",marginTop:6,flexShrink:0}}></div>
              <div><strong style={{fontSize:15,color:"#1e3a5f",display:"block",marginBottom:4}}>{title}</strong><p style={{margin:0,fontSize:14,color:"#374151",lineHeight:1.6}}>{desc}</p></div>
            </div>
          ))}
        </div>

        <h2 style={h2}>Step-by-step process</h2>
        <div style={{margin:"16px 0 28px"}}>
          {[
            {n:"1",t:"Book and pass the Basic Theory Test (BTT)",d:"Register via the Traffic Police e-Services portal at police.gov.sg. The BTT is held at approved driving centres such as Bukit Batok Driving Centre (BBDC) and ComfortDelGro Driving Centre (CDC). The fee rose to SGD $7.20 on 13 March 2026 and rises again to SGD $8.00 on 13 March 2027. You need 45 out of 50 (90%) to pass."},
            {n:"2",t:"Prepare your documents",d:"Valid foreign driving licence (with certified English translation if the licence is not in English), valid passport, Singapore immigration pass (Employment Pass, Dependant's Pass, Long Term Visit Pass, etc.), and a recent passport-sized photo."},
            {n:"3",t:"Submit your conversion application",d:"Apply online via the Traffic Police e-Services portal after passing the BTT. Traffic Police will review your foreign licence and driving history to determine whether a Practical Driving Test (PDT) is also required."},
            {n:"4",t:"Complete Practical Driving Test if required",d:"If TP determines a PDT is needed, you will be directed to book this at an approved driving centre. The test assesses your competency on Singapore roads under local conditions."},
            {n:"5",t:"Receive your Singapore driving licence",d:"Once all requirements are met, your Singapore driving licence will be issued. The conversion fee is SGD $50."},
          ].map(({n,t,d}) => (
            <div key={n} style={{display:"flex",gap:16,marginBottom:20}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"#e8341c",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{n}</div>
              <div><strong style={{fontSize:15,color:"#1e3a5f",display:"block",marginBottom:4}}>{t}</strong><p style={{margin:0,fontSize:14,color:"#374151",lineHeight:1.6}}>{d}</p></div>
            </div>
          ))}
        </div>

        <h2 style={h2}>Cost and timing</h2>
        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:10,padding:24,margin:"16px 0 28px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            {[["BTT fee","SGD $7.20"],["Conversion fee","SGD $50"],["BTT pass mark","45/50 (90%)"],["BTT format","50 questions, 50 minutes"]].map(([l,v]) => (
              <div key={l}><p style={{margin:0,fontSize:13,color:"#6b7280"}}>{l}</p><p style={{margin:"4px 0 0",fontSize:18,fontWeight:700,color:"#1e3a5f"}}>{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const h2 = {fontSize:22,fontWeight:700,color:"#1e3a5f",margin:"36px 0 12px"};
const body = {fontSize:16,color:"#374151",lineHeight:1.8,marginBottom:16};
