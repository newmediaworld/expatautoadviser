import Layout from '../../components/Layout';
import SEOMeta from '../../components/SEOMeta';
import FAQSchema from '../../components/FAQSchema';
import CredibilityBar from '../../components/CredibilityBar';

const h1 = { margin: "0 0 12px", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: "36px 0 12px", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a2e" };
const body = { margin: "0 0 16px", fontSize: 15, color: "#374151", lineHeight: 1.75 };
const good = { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#166534", lineHeight: 1.6 };

const HERO_IMG = "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=1200&q=80";

const faqItems = [
  { q: "Do I need a car when I first move to Hong Kong?", a: "Not immediately. Hong Kong's MTR, trams, buses, and minibuses are excellent in urban areas. Most new expats find public transport plus occasional taxis works fine for the first few months." },
  { q: "When should I consider getting a car in Hong Kong?", a: "Once you've settled where you'll live. If you end up in the New Territories, Sai Kung, or Clear Water Bay, a car becomes much more useful. If you're in Central, Wan Chai, or Causeway Bay, you probably won't need one." },
  { q: "Is leasing or buying better for new arrivals in Hong Kong?", a: "Leasing is almost always better. Hong Kong's First Registration Tax runs in marginal bands from 46% to 132% of a car's taxable value, which makes new cars extremely expensive. Leasing lets you avoid that risk and gives you flexibility." },
  { q: "How much will a lease cost me per month?", a: "Full-service operating leases typically range from HKD $7,000/month (economy) to HKD $18,000+ (mid-range). Add parking (HKD $3,000\u2013$8,000/month), fuel (~HKD $4,000), and tolls (~HKD $1,000)." },
];

export default function HKNewArrival() {
  return (
    <Layout city="hk" active="New Arrival Guide" relatedLinks={[{ label: 'Should I Get a Car?', to: '/hong-kong/should-i-get-a-car' }, { label: 'Leasing Guide', to: '/hong-kong/leasing-guide' }, { label: 'Cost Calculator', to: '/hong-kong/calculators' }]}>
      <SEOMeta title="Moving to Hong Kong: Your Expat Car Guide | ExpatAutoAdviser" description="New to Hong Kong? Your complete car guide. Do you need a car? FRT, leasing vs buying, first steps for new arrivals." />
      <FAQSchema faqs={faqItems} />

      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Hong Kong harbour and skyline" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>New Arrival</span>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#2a9d8f", textTransform: "uppercase", letterSpacing: "0.1em" }}>New to Hong Kong?</p>
      <h1 style={h1}>Your First 3 Months: Do You Need a Car in HK?</h1>
      <p style={{ ...body, fontSize: 17, color: "#6b7280" }}>Welcome to Hong Kong. The temptation is to lease a car immediately. Here's why you should wait.</p>

      <CredibilityBar />

      <div style={good}><strong>The new arrival strategy:</strong> Spend your first 1&ndash;3 months using the MTR, taxis, and minibuses. Figure out if you're on HK Island (likely no car needed) or in the NT/Sai Kung (where a car helps). Then decide.</div>

      <h2 style={h2}>Your first month: MTR, taxis, and buses</h2>
      <p style={body}>The MTR is one of the world's best metro systems. Hong Kong taxis are cheap by world standards. MTR monthly pass: ~HKD $300. Taxis for occasional trips: HKD $2,000&ndash;4,000. Total: HKD $2,300&ndash;4,300 per month &mdash; far cheaper than leasing.</p>

      <h2 style={h2}>Where do you actually need a car in HK?</h2>
      <p style={body}><strong>You probably need a car if:</strong> You're in Sai Kung, Discovery Bay, Clear Water Bay, the New Territories, or the South Side of Hong Kong Island.</p>
      <p style={body}><strong>You probably don't need a car if:</strong> You're in Central, Wan Chai, Causeway Bay, Admiralty, or any dense urban MTR-connected area.</p>

      <h2 style={h2}>The FRT trap: why leasing beats buying</h2>
      <p style={body}>Hong Kong's First Registration Tax (FRT) adds 46&ndash;132% to the taxable value of any new car, in marginal bands. A car with a taxable value of HKD $200,000 attracts HKD $112,000 of tax &mdash; HKD $312,000 all-in &mdash; and the effective rate climbs steeply from there. This is why almost no expats buy new cars &mdash; they lease. <a href="/hong-kong/first-registration-tax-calculator" style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>Run your own car through the FRT calculator &rarr;</a></p>

      <h2 style={h2}>Quick reading order for new arrivals</h2>
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px", margin: "24px 0" }}>
        <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong>This page</strong> &mdash; give yourself 2&ndash;3 months to settle before deciding.</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/hong-kong/should-i-get-a-car" style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>Should I Get a Car?</a></strong> &mdash; use this framework once you know your location</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/hong-kong/frt-tax-explained" style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>FRT &amp; Tax Explained</a></strong> &mdash; understand why FRT is such a big deal</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/hong-kong/first-registration-tax-calculator" style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>FRT Calculator</a></strong> &mdash; get the tax on a specific car, from its taxable value or the dealer's price</li>
          <li style={{ color: "#374151", lineHeight: 1.75 }}><strong><a href="/hong-kong/calculators" style={{ color: "#0d9488", textDecoration: "none", fontWeight: 600 }}>Lease vs Buy Calculator</a></strong> &mdash; plug in your numbers and see the real monthly cost</li>
        </ol>
      </div>

      <div style={good}><strong>The bottom line:</strong> Give yourself 2&ndash;3 months. Most people in Central, Wan Chai, and urban Kowloon find they don't need a car. People in the NT or Sai Kung find that they do.</div>
    </Layout>
  );
}
