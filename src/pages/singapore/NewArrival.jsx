import Layout from '../../components/Layout';
import SEOMeta from '../../components/SEOMeta';
import FAQSchema from '../../components/FAQSchema';
import CredibilityBar from '../../components/CredibilityBar';

const h1 = { margin: "0 0 12px", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, color: "#1a1a2e", fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: "36px 0 12px", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a2e" };
const body = { margin: "0 0 16px", fontSize: 15, color: "#374151", lineHeight: 1.75 };
const good = { background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "14px 18px", margin: "16px 0", fontSize: 14, color: "#166534", lineHeight: 1.6 };

const HERO_IMG = "https://images.unsplash.com/photo-1628072380638-21b16e95c562?w=1200&q=80";

const faqItems = [
  { q: "Do I really need a car when I first arrive in Singapore?", a: "No \u2014 not immediately. Most new arrivals find that MRT, Grab, and taxis work fine for the first few months while you settle in and figure out where you'll live long-term." },
  { q: "When should a new expat buy or lease a car in Singapore?", a: "Once you've settled on a home location (usually after 1\u20133 months), you can assess whether a car helps your specific situation. If you're in the East, North, or West far from MRT lines, or if you have school-age kids, leasing becomes worth considering." },
  { q: "Is leasing better than buying when I first arrive?", a: "Absolutely. As a new arrival, you don't know if you'll stay 2 years or 5 years. Leasing lets you get a car without the COE risk and gives you the option to walk away when your contract ends." },
  { q: "What costs should I expect beyond the monthly lease or purchase payment?", a: "Insurance (bundled in most leases, SGD $200\u2013400/month if separate), road tax (SGD $600\u20131,200/year), fuel (SGD $200\u2013400/month), ERP tolls (SGD $0\u2013200/month), and parking (SGD $200\u2013800/month)." },
];

export default function SGNewArrival() {
  return (
    <Layout city="sg" active="New Arrival Guide" relatedLinks={[{ label: 'Should I Get a Car?', to: '/singapore/should-i-get-a-car' }, { label: 'Leasing Guide', to: '/singapore/leasing-guide' }, { label: 'On-Road Price Calculator', to: '/singapore/car-on-road-price-calculator' }, { label: 'Lease vs Buy Calculator', to: '/singapore/calculators' }]}>
      <SEOMeta title="Moving to Singapore: Your Expat Car Guide | ExpatAutoAdviser" description="New to Singapore? Your complete car guide. Do you need a car? Leasing vs buying, first steps, costs for new arrivals." />
      <FAQSchema faqs={faqItems} />

      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Singapore airport and city" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>New Arrival</span>
        </div>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#e63946", textTransform: "uppercase", letterSpacing: "0.1em" }}>New to Singapore?</p>
      <h1 style={h1}>Your First 3 Months: Do You Even Need a Car?</h1>
      <p style={{ ...body, fontSize: 17, color: "#6b7280" }}>Welcome to Singapore. Your first instinct might be to buy or lease a car immediately. Here's why you probably shouldn't &mdash; yet.</p>

      <CredibilityBar />

      <div style={good}><strong>The new arrival strategy:</strong> Spend your first 1&ndash;3 months using Grab and the MRT. Get to know your neighbourhood, your commute, and where your kids' school is. Then decide.</div>

      <h2 style={h2}>Your first month: use Grab and the MRT</h2>
      <p style={body}>Grab is everywhere in Singapore, reliable, and cheap. The MRT is air-conditioned, clean, and covers 97% of the island. MRT monthly pass: SGD $128. Grab for occasional trips: SGD $200&ndash;400. Total: SGD $330&ndash;530 vs SGD $3,500+ for a leased car.</p>

      <h2 style={h2}>Month 2&ndash;3: assess your real situation</h2>
      <p style={body}>By month 2, you'll know where you're living relative to the MRT, your commute pattern, and whether you have school-age kids. These are the three factors that determine whether you need a car.</p>

      <h2 style={h2}>When you should actually get a car</h2>
      <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
        <li style={{ marginBottom: 8, color: "#374151", lineHeight: 1.75 }}>You're more than 15 minutes walk from the nearest MRT</li>
        <li style={{ marginBottom: 8, color: "#374151", lineHeight: 1.75 }}>You're doing school runs to multiple locations</li>
        <li style={{ marginBottom: 8, color: "#374151", lineHeight: 1.75 }}>You're in Bukit Timah, the far West, or the North</li>
        <li style={{ marginBottom: 8, color: "#374151", lineHeight: 1.75 }}>You're spending more than SGD $800/month on Grab</li>
      </ul>

      <h2 style={h2}>Quick reading order for new arrivals</h2>
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px", margin: "24px 0" }}>
        <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong>This page</strong> &mdash; give Grab and MRT a month or two.</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/singapore/should-i-get-a-car" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>Should I Get a Car?</a></strong> &mdash; work through the decision framework once you've settled</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/singapore/leasing-guide" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>Leasing Guide</a></strong> &mdash; most new arrivals lease rather than buy</li>
          <li style={{ marginBottom: 12, color: "#374151", lineHeight: 1.75 }}><strong><a href="/singapore/car-on-road-price-calculator" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>On-Road Price Calculator</a></strong> &mdash; what a specific car actually costs to put on the road, and how much of that is tax</li>
          <li style={{ color: "#374151", lineHeight: 1.75 }}><strong><a href="/singapore/calculators" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>Lease vs Buy Calculator</a></strong> &mdash; plug in your numbers and see the real monthly cost</li>
        </ol>
      </div>

      <div style={good}><strong>The bottom line:</strong> You don't need to rush. Give yourself 2&ndash;3 months, live with Grab and MRT, then reassess.</div>
    </Layout>
  );
}
