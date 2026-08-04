import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailCapture from '../../components/EmailCapture';

const HERO_IMG = "https://images.unsplash.com/photo-1729355275094-3d0ec2cd7b6c?w=1200&q=80";

const SUPABASE_URL = 'https://lywjdihnnajvhfcpmxnw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d2pkaWhubmFqdmhmY3BteG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzA4MjEsImV4cCI6MjA4ODgwNjgyMX0.x6A081ICya-DOqW6eeyZnDICltJTroEFSoYONH4WZAk';

const SEGMENTS = [
  { value: 'economy', label: 'Economy', examples: 'Toyota Axio / Vios, Honda Jazz, Suzuki Swift' },
  { value: 'midrange', label: 'Mid-range', examples: 'Toyota Camry, Honda Accord, Mazda 6' },
  { value: 'premium', label: 'Premium', examples: 'BMW 3 Series, Audi A4, Mercedes C-Class' },
  { value: 'luxury', label: 'Luxury', examples: 'BMW 5 Series, Mercedes E-Class, Audi A6' },
  { value: 'suv_mid', label: 'SUV â Mid', examples: 'Honda CR-V, Mazda CX-5, Toyota RAV4' },
  { value: 'suv_premium', label: 'SUV â Premium', examples: 'BMW X3, Mercedes GLC, Audi Q5' },
];

const BENCHMARKS_HK = {
  economy:     { min: 5200,  median: 6400,  max: 7600  },
  midrange:    { min: 7200,  median: 8800,  max: 10500 },
  premium:     { min: 9500,  median: 12000, max: 14500 },
  luxury:      { min: 14000, median: 18000, max: 23000 },
  suv_mid:     { min: 7800,  median: 10000, max: 12500 },
  suv_premium: { min: 11500, median: 14500, max: 18000 },
};

const INCLUSION_VALUES_HK = {
  insurance: { economy: 1900, midrange: 2200, premium: 2600, luxury: 3000, suv_mid: 2300, suv_premium: 2700 },
  road_tax:  { economy: 620,  midrange: 680,  premium: 760,  luxury: 850,  suv_mid: 700,  suv_premium: 800  },
  servicing: { economy: 700,  midrange: 850,  premium: 1000, luxury: 1200, suv_mid: 900,  suv_premium: 1100 },
  tyres:     { economy: 350,  midrange: 420,  premium: 500,  luxury: 600,  suv_mid: 460,  suv_premium: 560  },
  breakdown: { economy: 250,  midrange: 280,  premium: 320,  luxury: 380,  suv_mid: 300,  suv_premium: 350  },
};

const LENGTH_MULT = { 12: 1.18, 24: 1.06, 36: 1.0, 48: 0.95, 60: 0.91 };

function computeReport(form) {
  const seg = form.segment;
  const bench = BENCHMARKS_HK[seg];
  const lenMult = LENGTH_MULT[parseInt(form.months)] || 1.0;
  const adjBench = { min: Math.round(bench.min * lenMult), median: Math.round(bench.median * lenMult), max: Math.round(bench.max * lenMult) };

  const incVals = INCLUSION_VALUES_HK;
  const inclusions = [
    { key: 'insurance', label: 'Insurance',      included: form.insurance, value: incVals.insurance[seg] },
    { key: 'road_tax',  label: 'Road tax',        included: form.roadTax,   value: incVals.road_tax[seg]  },
    { key: 'servicing', label: 'Servicing',       included: form.servicing, value: incVals.servicing[seg] },
    { key: 'tyres',     label: 'Tyres',           included: form.tyres,     value: incVals.tyres[seg]     },
    { key: 'breakdown', label: 'Breakdown cover', included: form.breakdown, value: incVals.breakdown[seg] },
  ];

  const totalIncValue = inclusions.filter(i => i.included).reduce((s, i) => s + i.value, 0);
  const adjustedCost = Math.round(parseFloat(form.cost) - totalIncValue);
  const effectiveCost = parseFloat(form.cost);

  let verdict, color, icon;
  if (effectiveCost <= adjBench.min) { verdict = 'Excellent deal'; color = '#059669'; icon = '\u{1F3AF}'; }
  else if (effectiveCost <= adjBench.median) { verdict = 'Good value'; color = '#16a34a'; icon = '\u2705'; }
  else if (effectiveCost <= adjBench.max) { verdict = 'Market standard'; color = '#2563eb'; icon = '\u{1F4CA}'; }
  else if (effectiveCost <= adjBench.max * 1.18) { verdict = 'Slightly above market'; color = '#d97706'; icon = '\u26A0\uFE0F'; }
  else { verdict = 'Overpriced'; color = '#dc2626'; icon = '\u{1F6A8}'; }

  const pctVsMedian = Math.round(((effectiveCost - adjBench.median) / adjBench.median) * 100);
  return { adjBench, inclusions, totalIncValue, adjustedCost, effectiveCost, verdict, color, icon, pctVsMedian };
}

async function saveToSupabase(form) {
  try {
    await fetch(SUPABASE_URL + '/rest/v1/lease_submissions', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        market: 'hk',
        email: form.email,
        car_segment: form.segment,
        monthly_cost: parseFloat(form.cost),
        lease_months: parseInt(form.months),
        includes_insurance: form.insurance,
        includes_road_tax: form.roadTax,
        includes_servicing: form.servicing,
        includes_tyres: form.tyres,
        includes_breakdown: form.breakdown,
        monthly_mileage_km: form.mileage ? parseInt(form.mileage) : null,
        excess_per_km: form.excess ? parseFloat(form.excess) : null,
        deposit_months: form.deposit ? parseInt(form.deposit) : null,
        car_make: form.make || null,
        consent_benchmark: form.consent,
      }),
    });
  } catch(e) { /* silent fail */ }
}

const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: 16, fontFamily: 'Inter, sans-serif', color: '#1f2937', background: 'white', boxSizing: 'border-box', outline: 'none' };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const hintStyle = { fontSize: 12, color: '#9ca3af', marginTop: 4 };
const cardStyle = { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '24px 28px', marginBottom: 20 };

export default function HKLeaseChecker() {
  const [form, setForm] = useState({
    email: '', segment: '', cost: '', months: '36',
    insurance: false, roadTax: false, servicing: false, tyres: false, breakdown: false,
    mileage: '', excess: '', deposit: '', make: '', consent: false,
  });
  const [report, setReport] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = k => setForm(f => ({ ...f, [k]: !f[k] }));

  const validate = () => {
    const e = {};
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
    if (!form.segment) e.segment = 'Select a car segment';
    if (!form.cost || isNaN(parseFloat(form.cost)) || parseFloat(form.cost) < 1000) e.cost = 'Enter a valid monthly cost';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const r = computeReport(form);
    setReport(r);
    setSaving(true);
    await saveToSupabase(form);
    setSaving(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: '#1e3a5f', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 50 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>ExpatAutoAdviser</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/singapore" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>ð¸ð¬ Singapore</Link>
          <Link to="/hong-kong" style={{ background: '#0d9488', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>ð­ð° Hong Kong</Link>
        </div>
      </nav>

      <div style={{ backgroundImage: "linear-gradient(rgba(10,20,40,0.82),rgba(10,20,40,0.82)),url("+HERO_IMG+")", backgroundSize: "cover", backgroundPosition: "center", padding: '48px 32px 40px', textAlign: 'center' }}>
        <p style={{ color: '#5eead4', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>Hong Kong â¢ Free Tool</p>
        <h1 style={{ color: 'white', fontSize: 38, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.1 }}>Is your lease a fair deal?</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>Enter your lease terms and weâll compare them against current Hong Kong market rates.</p>
      </div>

      <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px 60px' }}>
        {!report ? (
          <>
            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a5f', margin: '0 0 20px' }}>Your details</h2>
              <div>
                <label style={labelStyle}>Email address <span style={{ color: '#0d9488' }}>*</span></label>
                <input style={{ ...inputStyle, borderColor: errors.email ? '#0d9488' : '#d1d5db' }} type="email" placeholder="you@example.com" value={form.email} style={{ ...inputStyle, fontSize: 16, borderColor: errors.email ? '#e8341c' : '#d1d5db' }} onChange={e => set('email', e.target.value)} />
                {errors.email && <p style={{ ...hintStyle, color: '#dc2626' }}>{errors.email}</p>}
                <p style={hintStyle}>Your report will also be emailed to you.</p>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a5f', margin: '0 0 20px' }}>Lease terms</h2>
              <div style={{ display: 'grid', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Car segment <span style={{ color: '#0d9488' }}>*</span></label>
                  <select style={{ ...inputStyle, borderColor: errors.segment ? '#dc2626' : '#d1d5db' }} value={form.segment} onChange={e => set('segment', e.target.value)}>
                    <option value="">Select segmentâ¦</option>
                    {SEGMENTS.map(s => <option key={s.value} value={s.value}>{s.label} â {s.examples}</option>)}
                  </select>
                  {errors.segment && <p style={{ ...hintStyle, color: '#dc2626' }}>{errors.segment}</p>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Monthly cost (HKD) <span style={{ color: '#0d9488' }}>*</span></label>
                    <input style={{ ...inputStyle, borderColor: errors.cost ? '#dc2626' : '#d1d5db' }} type="number" placeholder="e.g. 9500" value={form.cost} onChange={e => set('cost', e.target.value)} />
                    {errors.cost && <p style={{ ...hintStyle, color: '#dc2626' }}>{errors.cost}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Lease length</label>
                    <select style={inputStyle} value={form.months} onChange={e => set('months', e.target.value)}>
                      {[12,24,36,48,60].map(m => <option key={m} value={m}>{m} months</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Monthly mileage (km)</label>
                    <input style={inputStyle} type="number" placeholder="e.g. 1500" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Excess charge (HKD/km)</label>
                    <input style={inputStyle} type="number" step="0.10" placeholder="e.g. 2.50" value={form.excess} onChange={e => set('excess', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Car make (optional)</label>
                    <input style={inputStyle} type="text" placeholder="e.g. BMW" value={form.make} onChange={e => set('make', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Deposit (months)</label>
                    <select style={inputStyle} value={form.deposit} onChange={e => set('deposit', e.target.value)}>
                      <option value="">Not sure</option>
                      {[0,1,2,3,4,6].map(m => <option key={m} value={m}>{m} month{m !== 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e3a5f', margin: '0 0 6px' }}>Whatâs included?</h2>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 18px', lineHeight: 1.55 }}>Tick everything your lease covers. This significantly affects the market comparison.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'insurance', label: 'Insurance',      hint: 'Comprehensive car insurance' },
                  { key: 'roadTax',   label: 'Road tax',       hint: 'Annual vehicle licence' },
                  { key: 'servicing', label: 'Servicing',      hint: 'Scheduled maintenance' },
                  { key: 'tyres',     label: 'Tyres',          hint: 'Tyre replacement' },
                  { key: 'breakdown', label: 'Breakdown cover', hint: '24/7 roadside assistance' },
                ].map(({ key, label, hint }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '10px 14px', border: `1.5px solid ${form[key] ? '#0d9488' : '#e5e7eb'}`, borderRadius: 8, background: form[key] ? '#f0fdfa' : 'white' }} onClick={() => toggle(key)}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${form[key] ? '#0d9488' : '#d1d5db'}`, background: form[key] ? '#0d9488' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {form[key] && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>â</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{hint}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ ...cardStyle, background: '#f9fafb' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }} onClick={() => toggle('consent')}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${form.consent ? '#0d9488' : '#d1d5db'}`, background: form.consent ? '#0d9488' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {form.consent && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>â</span>}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Share anonymously to improve benchmarks</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 1.55 }}>Help other expats by contributing your lease data to our anonymous market database. Your email is never shared.</div>
                </div>
              </label>
            </div>

            <button onClick={handleSubmit} style={{ width: '100%', background: '#0d9488', color: 'white', border: 'none', borderRadius: 10, padding: '15px 24px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Check my lease â
            </button>

            {Object.keys(errors).length > 0 && (
              <p style={{ textAlign: 'center', color: '#dc2626', fontSize: 13, marginTop: 12 }}>Please fix the fields highlighted above.</p>
            )}
          </>
        ) : (
          <>
            <div style={{ ...cardStyle, borderColor: report.color, borderWidth: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>{report.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verdict</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: report.color, lineHeight: 1.1 }}>{report.verdict}</div>
                  <div style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                    {report.pctVsMedian > 0 ? `${report.pctVsMedian}% above market median` : report.pctVsMedian < 0 ? `${Math.abs(report.pctVsMedian)}% below market median` : 'Exactly at market median'}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f9fafb', borderRadius: 8, padding: '16px 20px', marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Market range for your segment ({form.months}-month lease)</div>
                <div style={{ display: 'flex', gap: 0, height: 32, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ background: '#d1fae5', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#065f46' }}>HKD {report.adjBench.min.toLocaleString()}</div>
                  <div style={{ background: '#bfdbfe', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#1e40af' }}>Median {report.adjBench.median.toLocaleString()}</div>
                  <div style={{ background: '#fee2e2', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#991b1b' }}>Max {report.adjBench.max.toLocaleString()}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1f2937' }}>Your lease: HKD {parseFloat(form.cost).toLocaleString()}/mo â <span style={{ color: report.color }}>{report.verdict}</span></div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Inclusions breakdown</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {report.inclusions.map(inc => (
                    <div key={inc.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: inc.included ? '#f0fdf4' : '#fef2f2', borderRadius: 6 }}>
                      <span style={{ fontSize: 14, color: '#1f2937' }}>{inc.included ? 'â' : 'â'} {inc.label}</span>
                      <span style={{ fontSize: 13, color: inc.included ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        {inc.included ? `Included (~HKD ${inc.value.toLocaleString()}/mo value)` : `Not included â budget ~HKD ${inc.value.toLocaleString()}/mo extra`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {report.totalIncValue > 0 && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#1e40af' }}>
                  <strong>Effective cost without inclusions:</strong> HKD {report.adjustedCost.toLocaleString()}/mo (your lease includes ~HKD {report.totalIncValue.toLocaleString()}/mo of additional services)
                </div>
              )}

              {form.mileage && form.excess && (
                <div style={{ marginTop: 14, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#92400e' }}>
                  <strong>Mileage note:</strong> At {parseInt(form.mileage).toLocaleString()} km/mo, if you exceed by 500 km youâll pay ~HKD {Math.round(parseFloat(form.excess) * 500).toLocaleString()} extra that month.
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              {saving ? (
                <p style={{ fontSize: 13, color: '#6b7280' }}>Saving your dataâ¦</p>
              ) : (
                <p style={{ fontSize: 13, color: '#6b7280' }}>â {form.consent ? 'Your data has been saved anonymously to our benchmarks. Thank you!' : 'Report ready. Your email has been noted for future updates.'}</p>
              )}
            </div>

            {/* ── Email capture ── */}
            <EmailCapture
              city="hk"
              source="hk-lease-checker-result"
              guideTopic="leasing"
              title="📋 Get your free Hong Kong Car Buyer Guide"
              subtitle="First Registration Tax explained, how to negotiate a lease, insurance tips, and everything else the HK expat car market throws at you."
            />

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
              <Link to="/hong-kong/leasing-guide" style={{ background: '#1e3a5f', color: 'white', padding: '12px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Read our leasing guide →</Link>
              <Link to="/hong-kong/insurance-guide" style={{ background: 'white', color: '#1e3a5f', border: '1.5px solid #1e3a5f', padding: '12px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>Insurance guide →</Link>
              <button onClick={() => { setReport(null); setForm(f => ({ ...f, cost: '', segment: '', insurance: false, roadTax: false, servicing: false, tyres: false, breakdown: false })); }} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px 22px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Check another lease</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
