import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import SEOMeta from '../../components/SEOMeta';
import FAQSchema from '../../components/FAQSchema';
import CredibilityBar from '../../components/CredibilityBar';
import EmailCapture from '../../components/EmailCapture';
import {
  ARF_BANDS,
  VES_BANDS_2026,
  COE_REFERENCE,
  COE_CATEGORIES,
  PARF_CURRENT,
  PARF_PREVIOUS,
  EEAI_CAP_2026,
  REGISTRATION_FEE,
  MAX_LOAN_TENURE_YEARS,
  calcARF,
  arfBandBreakdown,
  calcOnRoadPrice,
  omvFromTotal,
  maxLTV,
  calcMonthlyPayment,
  arfEffectiveRate,
  fmtSGD,
} from '../../lib/coe';

/* ─── Singapore Car On-Road Price Calculator ────────────────────────────────
   Dedicated tool page. The calculator leads; the explanation follows.
   All arithmetic comes from src/lib/coe.js — shared with /singapore/calculators.
   ────────────────────────────────────────────────────────────────────────── */

const h1 = { margin: '0 0 10px', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 700, color: '#1a1a2e', fontFamily: "'Playfair Display',Georgia,serif", lineHeight: 1.2 };
const h2 = { margin: '40px 0 12px', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: '#1a1a2e' };
const h3 = { margin: '24px 0 8px', fontSize: 16, fontWeight: 700, color: '#1a1a2e' };
const body = { margin: '0 0 16px', fontSize: 15, color: '#374151', lineHeight: 1.75 };
const fine = { fontSize: 12, color: '#9ca3af', lineHeight: 1.6 };
const table = { width: '100%', borderCollapse: 'collapse', fontSize: 14, margin: '8px 0 16px' };
const th = { textAlign: 'left', padding: '10px 12px', background: '#f3f4f6', color: '#374151', fontWeight: 700, fontSize: 13, borderBottom: '1px solid #e5e7eb' };
const td = { padding: '10px 12px', borderBottom: '1px solid #f3f4f6', color: '#374151' };
const tdNum = { ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' };
const inputStyle = {
  width: '100%', padding: '11px 12px', borderRadius: 8,
  border: '1px solid #d1d5db', fontSize: 15, boxSizing: 'border-box',
  color: '#111827', background: '#fff',
};
const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 };

// ── Worked examples ──────────────────────────────────────────────────────────
// Every figure below is LTA's own, from the Car Cost Update for cars registered
// in June 2026 (M032-Car_Cost_Update.pdf). OMV, ARF, duties, VES, EEAI, the COE
// used and the price the authorised distributor actually quoted. Nothing here
// is estimated, and nothing is our arithmetic — it is LTA's, which is why it is
// worth publishing: it is the only place the dealer's margin is visible.
const WORKED_EXAMPLES = [
  {
    car: 'Toyota Vios Hybrid',
    cat: 'A',
    omv: 21505,
    ves: 0,
    isElectric: false,
    coe: 126009,
    quoted: 194888,
    note: 'Petrol-hybrid, VES Band B — no rebate, no surcharge',
  },
  {
    car: 'Honda Civic 2.0 e:HEV',
    cat: 'B',
    omv: 35555,
    ves: 0,
    isElectric: false,
    coe: 126989,
    quoted: 239999,
    note: 'Petrol-hybrid, VES Band B',
  },
  {
    car: 'BYD Atto 3 Extended Range',
    cat: 'A',
    omv: 27952,
    ves: -22500,
    isElectric: true,
    coe: 126009,
    quoted: 246888,
    note: 'Fully electric — VES Band A rebate plus the EEAI',
  },
];

const faqItems = [
  {
    q: 'How do you calculate the on-road price of a car in Singapore?',
    a: 'Start with the Open Market Value assessed by Singapore Customs. Add excise duty at 20% of OMV, then GST at 9% of (OMV plus excise duty). Add the Additional Registration Fee, charged in marginal bands on the OMV: 100% of the first S$20,000, 140% of the next S$20,000, 190% of the next S$20,000, 250% of the next S$20,000 and 320% above S$80,000. Apply any VES rebate or surcharge and, for a fully electric car, the EEAI. Add the S$350 registration fee and the COE quota premium. That total is what LTA calls the basic cost — the dealer’s margin sits on top of it.',
  },
  {
    q: 'What are the current ARF rates in Singapore?',
    a: 'For cars registered with COEs obtained from the second February 2023 bidding exercise onwards, ARF is 100% of the first S$20,000 of OMV, 140% of S$20,001 to S$40,000, 190% of S$40,001 to S$60,000, 250% of S$60,001 to S$80,000 and 320% of anything above S$80,000. The older schedule that charged 140% on the next S$30,000 and 180% above S$50,000 no longer applies to any new registration.',
  },
  {
    q: 'What is OMV and why is it so much lower than the price I am quoted?',
    a: 'The Open Market Value is what the car cost to land in Singapore — purchase price, freight, insurance and delivery charges — as assessed by Singapore Customs. It is the base the taxes are charged on, not the price you pay. A car with an OMV of about S$21,500 can be advertised near S$195,000 once excise duty, GST, ARF, the registration fee, a COE of roughly S$126,000 and the dealer’s margin are stacked on top. LTA publishes the average OMV for every locally distributed model in its monthly Car Cost Update.',
  },
  {
    q: 'How much is COE in Singapore right now?',
    a: `COE premiums are set by open bidding twice a month, so there is no standing figure. In the ${COE_REFERENCE.exercise} (closed ${COE_REFERENCE.closed}) the quota premium was S$${COE_REFERENCE.premiums.A.toLocaleString('en-SG')} for Category A, S$${COE_REFERENCE.premiums.B.toLocaleString('en-SG')} for Category B and S$${COE_REFERENCE.premiums.E.toLocaleString('en-SG')} for Category E. Always price your car against the exercise your dealer will actually bid in, not against a figure you read somewhere — the calculator above lets you type in your own.`,
  },
  {
    q: 'Do I still get most of my ARF back when I sell before ten years?',
    a: 'Not any more. For cars registered with COEs obtained from the second February 2026 bidding exercise onwards, the PARF rebate is 30% of the ARF paid if you deregister within five years, capped at S$30,000, and it tapers to 5% in years nine to ten. The old schedule — 75% of ARF, capped at S$60,000 — still governs cars registered between 15 February 2023 and 12 February 2026. For an expat buying new on a three-year posting, this change materially worsens the buy-versus-lease sum.',
  },
];

// ── The calculator ──────────────────────────────────────────────────────────
function OnRoadTool() {
  const [mode, setMode] = useState('omv'); // 'omv' | 'price'
  const [omvInput, setOmvInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [coeCategory, setCoeCategory] = useState('A');
  const [coePremium, setCoePremium] = useState(COE_REFERENCE.premiums.A);
  const [vesBand, setVesBand] = useState('B');
  const [isElectric, setIsElectric] = useState(false);
  const [showLoan, setShowLoan] = useState(false);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(2.8);

  const handleCategoryChange = (cat) => {
    setCoeCategory(cat);
    setCoePremium(COE_REFERENCE.premiums[cat]);
  };

  const handleElectric = (checked) => {
    setIsElectric(checked);
    // A fully electric car is Band A in practice; nudge the band with the toggle.
    if (checked && vesBand !== 'A') setVesBand('A');
  };

  const coeNum = parseFloat(coePremium) || 0;
  const vesAmount = (VES_BANDS_2026.find((b) => b.band === vesBand) || {}).amount || 0;

  const result = useMemo(() => {
    if (mode === 'omv') {
      const omv = parseFloat(omvInput) || 0;
      if (omv <= 0) return null;
      const r = calcOnRoadPrice({ omv, coePremium: coeNum, vesAmount, isElectric });
      return { ...r, mode: 'omv', quoted: null, margin: null };
    }
    const quoted = parseFloat(priceInput) || 0;
    if (quoted <= 0) return null;
    const omv = omvFromTotal({ total: quoted, coePremium: coeNum, vesAmount, isElectric });
    const r = calcOnRoadPrice({ omv, coePremium: coeNum, vesAmount, isElectric });
    return { ...r, mode: 'price', quoted, margin: Math.max(0, quoted - r.total) };
  }, [mode, omvInput, priceInput, coeNum, vesAmount, isElectric]);

  const bands = useMemo(() => (result ? arfBandBreakdown(result.omv) : []), [result]);

  const loan = useMemo(() => {
    if (!result || !showLoan) return null;
    const price = result.mode === 'price' ? result.quoted : result.total;
    const ltv = maxLTV(result.omv);
    const maxBorrow = Math.round(price * ltv);
    const deposit = price - maxBorrow;
    const months = loanTenure * 12;
    return {
      price,
      ltv,
      maxBorrow,
      deposit,
      months,
      monthly: calcMonthlyPayment(maxBorrow, interestRate, months),
    };
  }, [result, showLoan, loanTenure, interestRate]);

  const tabStyle = (active) => ({
    flex: 1,
    padding: '10px 12px',
    border: 'none',
    background: active ? '#1a1a2e' : 'transparent',
    color: active ? '#fff' : '#4b5563',
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    borderRadius: 6,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 'clamp(16px,3vw,28px)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', padding: 4, borderRadius: 8, marginBottom: 18 }}>
        <button type="button" style={tabStyle(mode === 'omv')} onClick={() => setMode('omv')}>
          I know the OMV
        </button>
        <button type="button" style={tabStyle(mode === 'price')} onClick={() => setMode('price')}>
          I know the advertised price
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, marginBottom: 18 }}>
        {/* Primary input */}
        <div>
          <label htmlFor="orp-amount" style={labelStyle}>
            {mode === 'omv' ? 'Open Market Value (OMV)' : 'Advertised price, with COE'}
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 14 }}>S$</span>
            <input
              id="orp-amount"
              type="number"
              inputMode="numeric"
              min="0"
              placeholder={mode === 'omv' ? 'e.g. 21505' : 'e.g. 194888'}
              value={mode === 'omv' ? omvInput : priceInput}
              onChange={(e) => (mode === 'omv' ? setOmvInput(e.target.value) : setPriceInput(e.target.value))}
              style={{ ...inputStyle, paddingLeft: 34, fontSize: 17, fontWeight: 600 }}
            />
          </div>
        </div>

        {/* COE category */}
        <div>
          <label htmlFor="orp-cat" style={labelStyle}>COE category</label>
          <select id="orp-cat" value={coeCategory} onChange={(e) => handleCategoryChange(e.target.value)} style={inputStyle}>
            {COE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* COE premium */}
        <div>
          <label htmlFor="orp-coe" style={labelStyle}>COE quota premium</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 14 }}>S$</span>
            <input
              id="orp-coe"
              type="number"
              inputMode="numeric"
              min="0"
              value={coePremium}
              onChange={(e) => setCoePremium(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>
          <p style={{ ...fine, margin: '5px 0 0' }}>
            Pre-filled with the {COE_REFERENCE.exercise}, which closed {COE_REFERENCE.closed}. Premiums
            change every fortnight &mdash; replace this with the exercise your dealer will bid in.{' '}
            <a href="https://onemotoring.lta.gov.sg/content/onemotoring/home/buying/coe-open-bidding.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              Latest results
            </a>
          </p>
        </div>

        {/* VES band */}
        <div>
          <label htmlFor="orp-ves" style={labelStyle}>VES band (2026)</label>
          <select id="orp-ves" value={vesBand} onChange={(e) => setVesBand(e.target.value)} style={inputStyle}>
            {VES_BANDS_2026.map((b) => (
              <option key={b.band} value={b.band}>
                {`Band ${b.band} — ${b.amount === 0 ? 'no rebate or surcharge' : b.amount < 0 ? `${fmtSGD(-b.amount)} rebate` : `${fmtSGD(b.amount)} surcharge`}`}
              </option>
            ))}
          </select>
          <label style={{ ...fine, display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#4b5563', fontSize: 13 }}>
            <input type="checkbox" checked={isElectric} onChange={(e) => handleElectric(e.target.checked)} />
            Fully electric (adds the EEAI, and the S$0 minimum-ARF floor)
          </label>
        </div>
      </div>

      <p style={{ ...fine, margin: '0 0 4px' }}>
        Results update as you type. Nothing is sent anywhere &mdash; the sum runs in your browser.
      </p>

      {result && (
        <div style={{ marginTop: 20 }}>
          {/* Headline number */}
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: 20, marginBottom: 18 }}>
            {result.mode === 'omv' ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  On-road price before dealer margin
                </div>
                <div style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, color: '#92400e', lineHeight: 1.1 }}>
                  {fmtSGD(result.total)}
                </div>
                <div style={{ fontSize: 13, color: '#92400e', marginTop: 6 }}>
                  {fmtSGD(result.taxAndCOE)} of that &mdash; {Math.round((result.taxAndCOE / result.total) * 100)}% &mdash;
                  is tax and COE, not car.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Of the {fmtSGD(result.quoted)} you pay, at least
                </div>
                <div style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, color: '#92400e', lineHeight: 1.1 }}>
                  {fmtSGD(result.taxAndCOE)}
                </div>
                <div style={{ fontSize: 13, color: '#92400e', marginTop: 6 }}>
                  is tax and COE &mdash; {Math.round((result.taxAndCOE / result.quoted) * 100)}% of the advertised price.
                  The car itself is worth at most {fmtSGD(result.omv)} landed.
                </div>
              </>
            )}
          </div>

          {result.mode === 'price' && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 14, fontSize: 13, color: '#1e3a5f', lineHeight: 1.7, marginBottom: 18 }}>
              <strong>Read this before you quote the number back at a salesman.</strong> An advertised price contains
              the dealer&rsquo;s margin as well as the taxes, and the margin is not published. This mode therefore
              solves for the <em>largest</em> OMV consistent with the price you entered &mdash; the answer you would get
              if the margin were zero. The real OMV is lower, and the real tax share lower with it. To pin it down,
              ask the dealer for the OMV (they are required to know it) or look the model up in LTA&rsquo;s{' '}
              <a href="https://onemotoring.lta.gov.sg/content/onemotoring/home/buying/upfront-vehicle-costs/tax-structure.html" target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8' }}>
                monthly Car Cost Update
              </a>, then switch to the OMV tab. The gap between the two totals is the margin.
            </div>
          )}

          {/* ARF band breakdown */}
          <h3 style={{ ...h3, margin: '0 0 6px' }}>How the ARF is built</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Band of OMV</th>
                <th style={{ ...th, textAlign: 'right' }}>OMV in band</th>
                <th style={{ ...th, textAlign: 'right' }}>Rate</th>
                <th style={{ ...th, textAlign: 'right' }}>ARF</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr key={b.label}>
                  <td style={td}>{b.shortLabel}</td>
                  <td style={tdNum}>{fmtSGD(b.slice)}</td>
                  <td style={tdNum}>{b.ratePct}</td>
                  <td style={tdNum}>{fmtSGD(b.tax)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>Total ARF before rebates</td>
                <td style={{ ...tdNum, borderTop: '2px solid #e5e7eb' }} />
                <td style={{ ...tdNum, borderTop: '2px solid #e5e7eb' }}>{arfEffectiveRate(result.omv)}% of OMV</td>
                <td style={{ ...tdNum, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>{fmtSGD(result.arf)}</td>
              </tr>
            </tbody>
          </table>

          {/* Full stack */}
          <h3 style={h3}>The full stack</h3>
          <table style={table}>
            <tbody>
              <tr>
                <td style={td}>Open Market Value (the car itself, landed)</td>
                <td style={{ ...tdNum, fontWeight: 600 }}>{fmtSGD(result.omv)}</td>
              </tr>
              <tr>
                <td style={td}>Excise duty (20% of OMV)</td>
                <td style={tdNum}>{fmtSGD(result.excise)}</td>
              </tr>
              <tr>
                <td style={td}>GST (9% of OMV + excise duty)</td>
                <td style={tdNum}>{fmtSGD(result.gst)}</td>
              </tr>
              <tr>
                <td style={td}>Additional Registration Fee</td>
                <td style={tdNum}>{fmtSGD(result.arf)}</td>
              </tr>
              {result.ves !== 0 && (
                <tr>
                  <td style={td}>VES Band {vesBand} {result.ves < 0 ? 'rebate' : 'surcharge'}</td>
                  <td style={{ ...tdNum, color: result.ves < 0 ? '#15803d' : '#b91c1c' }}>{fmtSGD(result.ves)}</td>
                </tr>
              )}
              {result.eeai > 0 && (
                <tr>
                  <td style={td}>EV Early Adoption Incentive (45% of ARF, capped at {fmtSGD(EEAI_CAP_2026)})</td>
                  <td style={{ ...tdNum, color: '#15803d' }}>{fmtSGD(-result.eeai)}</td>
                </tr>
              )}
              {(result.ves !== 0 || result.eeai > 0) && (
                <tr>
                  <td style={{ ...td, fontStyle: 'italic', color: '#6b7280' }}>ARF actually payable after rebates</td>
                  <td style={{ ...tdNum, fontStyle: 'italic', color: '#6b7280' }}>{fmtSGD(result.arfAfterRebates)}</td>
                </tr>
              )}
              <tr>
                <td style={td}>Registration fee</td>
                <td style={tdNum}>{fmtSGD(result.registrationFee)}</td>
              </tr>
              <tr>
                <td style={td}>COE quota premium (Category {coeCategory})</td>
                <td style={tdNum}>{fmtSGD(result.coe)}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>
                  Regulated total &mdash; LTA&rsquo;s &ldquo;basic cost&rdquo;
                </td>
                <td style={{ ...tdNum, fontWeight: 800, fontSize: 16, borderTop: '2px solid #e5e7eb' }}>{fmtSGD(result.total)}</td>
              </tr>
              {result.mode === 'price' && (
                <>
                  <tr>
                    <td style={td}>Dealer margin implied by the price you entered</td>
                    <td style={tdNum}>{fmtSGD(result.margin)}</td>
                  </tr>
                  <tr>
                    <td style={{ ...td, fontWeight: 700 }}>Advertised price</td>
                    <td style={{ ...tdNum, fontWeight: 800, fontSize: 16 }}>{fmtSGD(result.quoted)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          {/* Loan */}
          <button
            type="button"
            onClick={() => setShowLoan((s) => !s)}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: 10 }}
          >
            {showLoan ? '− Hide' : '+ Show'} what this looks like on a loan
          </button>

          {loan && (
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 18, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
                <div>
                  <label htmlFor="orp-tenure" style={labelStyle}>Tenure</label>
                  <select id="orp-tenure" value={loanTenure} onChange={(e) => setLoanTenure(parseInt(e.target.value, 10))} style={inputStyle}>
                    {Array.from({ length: MAX_LOAN_TENURE_YEARS }, (_, i) => i + 1).map((y) => (
                      <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="orp-rate" style={labelStyle}>Interest rate (% p.a.)</label>
                  <input
                    id="orp-rate"
                    type="number"
                    step="0.1"
                    min="0"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
              <table style={{ ...table, margin: 0 }}>
                <tbody>
                  <tr>
                    <td style={td}>
                      Maximum you may borrow &mdash; MAS caps this at {Math.round(loan.ltv * 100)}% because the
                      OMV is {result.omv <= 20000 ? 'S$20,000 or less' : 'above S$20,000'}
                    </td>
                    <td style={{ ...tdNum, fontWeight: 600 }}>{fmtSGD(loan.maxBorrow)}</td>
                  </tr>
                  <tr>
                    <td style={td}>Minimum cash deposit</td>
                    <td style={{ ...tdNum, fontWeight: 600 }}>{fmtSGD(loan.deposit)}</td>
                  </tr>
                  <tr>
                    <td style={{ ...td, fontWeight: 700 }}>
                      Monthly repayment over {loan.months} months at {interestRate}%
                    </td>
                    <td style={{ ...tdNum, fontWeight: 800, fontSize: 16 }}>{fmtSGD(loan.monthly)}</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ ...fine, margin: '10px 0 0' }}>
                MAS caps motor vehicle loans at 70% of the purchase price where the OMV is S$20,000 or below and 60%
                where it is above, with a maximum tenure of seven years. Singapore dealers usually quote a flat rate
                rather than a reducing-balance rate; enter whichever you have been given and compare like with like.
              </p>
            </div>
          )}

          <p style={{ ...fine, marginTop: 4 }}>
            <strong>What this excludes:</strong> the dealer&rsquo;s margin (unless you are in advertised-price mode),
            insurance, road tax, number plates, the on-board unit, optional extras and any COE bidding deposit
            arrangement. It is the tax and COE stack, which is the part nobody can negotiate.
          </p>
        </div>
      )}

      {!result && (
        <p style={{ ...body, margin: '18px 0 0', color: '#6b7280' }}>
          Enter a figure above. Try an OMV of S$21,505 &mdash; LTA&rsquo;s average for a Toyota Vios Hybrid registered
          in June 2026 &mdash; or switch tabs and enter S$194,888, the price the distributor quoted for it.
        </p>
      )}
    </div>
  );
}

export default function SGOnRoadPriceCalculator() {
  return (
    <Layout
      city="sg"
      relatedLinks={[
        { label: 'How COE Works', to: '/singapore/coe-guide' },
        { label: 'COE Bidding Strategy', to: '/singapore/coe-bidding-strategy' },
        { label: 'Buying Guide', to: '/singapore/buying-guide' },
        { label: 'Lease vs Buy Calculator', to: '/singapore/calculators' },
      ]}
    >
      <SEOMeta
        title="Singapore Car On-Road Price Calculator (2026) | ExpatAutoAdviser"
        description="Work out the on-road price of any car in Singapore. Enter an OMV and COE premium, or an advertised price, and see ARF, excise duty, GST and VES."
        canonical="https://www.expatautoadviser.com/singapore/car-on-road-price-calculator"
      />
      <FAQSchema faqs={faqItems} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 40px' }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#2a9d8f', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Singapore &middot; Free tool
        </p>
        <h1 style={h1}>Singapore Car On-Road Price Calculator</h1>
        <p style={{ margin: '0 0 20px', fontSize: 16, color: '#6b7280', lineHeight: 1.6 }}>
          Enter a car&rsquo;s OMV and a COE premium to get the on-road price &mdash; or work backwards from an
          advertised price and see how much of it is tax. Rates in force in 2026.
        </p>

        <OnRoadTool />

        <CredibilityBar />

        {/* ── ARF bands ─────────────────────────────────────────────────── */}
        <h2 style={h2}>The 2026 ARF bands</h2>
        <p style={body}>
          The Additional Registration Fee is the largest tax on a Singapore car and the one most often quoted wrongly.
          The rates below apply to every car registered with a COE obtained from the <strong>second bidding exercise
          of February 2023</strong> onwards, which is to say every new car being sold today. They are{' '}
          <strong>marginal</strong>: each rate bites only on the slice of OMV inside its band, the way UK income tax
          works.
        </p>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Band of Open Market Value</th>
              <th style={{ ...th, textAlign: 'right' }}>ARF rate</th>
              <th style={{ ...th, textAlign: 'right' }}>ARF on a full band</th>
            </tr>
          </thead>
          <tbody>
            {ARF_BANDS.map((band) => (
              <tr key={band.label}>
                <td style={td}>{band.label}</td>
                <td style={tdNum}>{Math.round(band.rate * 100)}%</td>
                <td style={tdNum}>{band.to === Infinity ? '—' : fmtSGD((band.to - band.from) * band.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={body}>
          Filling all four finite bands &mdash; an OMV of S$80,000 &mdash; produces {fmtSGD(calcARF(80000))} of ARF, an
          effective rate of {arfEffectiveRate(80000)}%. Above that, every further dollar of OMV costs S$3.20 in ARF
          alone, before excise duty and GST.
        </p>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 14, fontSize: 13, color: '#7f1d1d', lineHeight: 1.7, margin: '0 0 16px' }}>
          <strong>If you see 180% quoted, the page is out of date.</strong> The pre-2023 schedule ran 100% on the first
          S$20,000, 140% on the <em>next S$30,000</em> and 180% above S$50,000. It was replaced in February 2023 by the
          five-band structure above and no longer applies to any new registration. A great many Singapore car-cost
          explainers, including some published this year, still carry the old numbers.
        </div>

        {/* ── VES ───────────────────────────────────────────────────────── */}
        <h2 style={h2}>VES rebates and surcharges for 2026</h2>
        <p style={body}>
          The Vehicular Emissions Scheme bands a car on the worst of five pollutants &mdash; CO₂, hydrocarbons, carbon
          monoxide, nitrogen oxides and particulate matter &mdash; and applies a rebate or surcharge against the ARF.
          On <strong>1 January 2026</strong> the old A1/A2/B/C1/C2 structure was replaced by A/B/C1/C2/C3, and the rules
          changed in one way that matters a great deal: <strong>only fully electric cars now receive a rebate</strong>.
          Hybrids, which used to earn one, no longer do.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Band</th>
                <th style={th}>CO₂ threshold</th>
                <th style={{ ...th, textAlign: 'right' }}>2026</th>
                <th style={{ ...th, textAlign: 'right' }}>2027</th>
              </tr>
            </thead>
            <tbody>
              {VES_BANDS_2026.map((b) => (
                <tr key={b.band}>
                  <td style={td}>
                    <strong>{b.band}</strong>
                    <div style={fine}>{b.note}</div>
                  </td>
                  <td style={td}>{b.co2}</td>
                  <td style={{ ...tdNum, color: b.amount < 0 ? '#15803d' : b.amount > 0 ? '#b91c1c' : '#374151' }}>
                    {b.amount === 0 ? '—' : fmtSGD(b.amount)}
                  </td>
                  <td style={{ ...tdNum, color: '#6b7280' }}>
                    {b.band === 'A' ? '−S$20,000' : b.band === 'B' ? '—' : b.band === 'C1' ? 'S$15,000' : b.band === 'C2' ? 'S$30,000' : 'S$45,000'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={body}>
          The CO₂ figures above are only the first of the five thresholds; a car can be pushed into a worse band by any
          one of the other four. Note also that the surcharges roughly double between 2026 and 2027, so a Band C2 SUV
          bought in January 2027 costs S$7,500 more in VES than the same car bought in December 2026.
        </p>
        <p style={body}>
          Separately, a fully electric car registered during 2026 gets the <strong>EV Early Adoption Incentive</strong>:
          45% off the ARF, capped at {fmtSGD(EEAI_CAP_2026)}. That cap was S$15,000 in 2024&ndash;25, and the scheme
          ends entirely on 1 January 2027. Combined with the Band A rebate, an EV registered in 2026 can take up to
          S$30,000 off its ARF, and there is a S$0 minimum-ARF floor for fully electric cars until 31 December 2027.
        </p>

        {/* ── Worked examples ───────────────────────────────────────────── */}
        <h2 style={h2}>Three real Singapore cars, priced out</h2>
        <p style={body}>
          Every figure in the table below is LTA&rsquo;s own, taken from its Car Cost Update for cars registered in{' '}
          <strong>June 2026</strong>: the average OMV, the ARF and duties payable, the COE used, and the price the
          authorised distributor actually quoted. That last column is the reason this table is worth publishing &mdash;
          it is the only place the dealer&rsquo;s margin is visible.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Car</th>
                <th style={{ ...th, textAlign: 'right' }}>OMV</th>
                <th style={{ ...th, textAlign: 'right' }}>Tax + COE</th>
                <th style={{ ...th, textAlign: 'right' }}>LTA basic cost</th>
                <th style={{ ...th, textAlign: 'right' }}>Quoted price</th>
                <th style={{ ...th, textAlign: 'right' }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {WORKED_EXAMPLES.map((ex) => {
                const r = calcOnRoadPrice({
                  omv: ex.omv,
                  coePremium: ex.coe,
                  vesAmount: ex.ves,
                  isElectric: ex.isElectric,
                });
                return (
                  <tr key={ex.car}>
                    <td style={td}>
                      <strong>{ex.car}</strong>
                      <div style={fine}>Cat {ex.cat} &middot; {ex.note}</div>
                    </td>
                    <td style={tdNum}>{fmtSGD(ex.omv)}</td>
                    <td style={tdNum}>{fmtSGD(r.taxAndCOE)}</td>
                    <td style={tdNum}>{fmtSGD(r.total)}</td>
                    <td style={tdNum}>{fmtSGD(ex.quoted)}</td>
                    <td style={tdNum}>{fmtSGD(ex.quoted - r.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={body}>
          Take the Vios. LTA assessed its average OMV at S$21,505. Excise duty and GST add S$6,624, ARF adds S$22,107,
          the registration fee S$350, and the Category A COE from the June 2026 first bidding exercise S$126,009 &mdash;
          a basic cost of S$176,595. Toyota&rsquo;s authorised distributor quoted S$194,888. So of the price on the
          windscreen, roughly S$21,500 is the car, S$155,000 is tax and COE, and S$18,300 is the dealer.
        </p>
        <p style={body}>
          The Atto 3 is the more instructive one. Its OMV is <em>higher</em> than the Vios&rsquo;s and its rebates are
          worth S$30,000, yet it was quoted S$52,000 dearer. Rebates do not set retail prices; dealers do. This is
          exactly the gap the calculator above is designed to expose &mdash; and the reason it is worth asking a
          salesman for the OMV before you negotiate rather than after.
        </p>

        {/* ── What OMV is ───────────────────────────────────────────────── */}
        <h2 style={h2}>What OMV actually is, versus what a dealer quotes</h2>
        <p style={body}>
          This is the number expats most often misunderstand, because the two figures differ by a factor of eight or
          nine and nobody explains why.
        </p>
        <ul style={{ ...body, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>OMV is an import value, assessed by Singapore Customs.</strong> It is what the car cost to land
            here: the purchase price, plus freight, insurance and all other sale and delivery charges for bringing it
            to Singapore. It is not a valuation, not a market price and not negotiable. It is simply the base the taxes
            are charged on.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>The advertised price is OMV plus five taxes, a COE and a margin.</strong> Excise duty, GST, ARF, any
            VES surcharge, the S${REGISTRATION_FEE} registration fee and the quota premium are all fixed by the state.
            Only the margin is the dealer&rsquo;s, and only the margin is negotiable.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Discounting the car does not reduce the tax.</strong> ARF, excise duty and GST are all charged on
            the OMV. A dealer cutting S$5,000 off the price is cutting S$5,000 off their own margin, not off the
            government&rsquo;s take. This is why headline discounts in Singapore are so much smaller than in the UK.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>You can look the OMV up.</strong> LTA publishes the average OMV for every locally distributed model
            each month in its Car Cost Update, alongside the ARF, duties, VES banding and the distributor&rsquo;s quoted
            price. If a salesman will not tell you the OMV, LTA will.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Parallel imports can differ.</strong> LTA notes that the OMV for cars sold by parallel importers may
            differ from the authorised distributor&rsquo;s, because the car was sourced differently. See our{' '}
            <Link to="/singapore/parallel-import-cars" style={{ color: '#dc2626', fontWeight: 600 }}>parallel import guide</Link>.
          </li>
        </ul>

        {/* ── PARF ──────────────────────────────────────────────────────── */}
        <h2 style={h2}>The February 2026 PARF change, and why it matters to expats</h2>
        <p style={body}>
          If you deregister a car before it turns ten, you get part of the ARF back as a{' '}
          <strong>PARF rebate</strong>. For most of the last decade this softened the cost of buying new considerably,
          and much of the advice written about Singapore car ownership still assumes it. In February 2026 it was cut
          sharply, and the change is not yet reflected in most of what you will read.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Age at deregistration</th>
                <th style={{ ...th, textAlign: 'right' }}>{PARF_PREVIOUS.label}</th>
                <th style={{ ...th, textAlign: 'right' }}>{PARF_CURRENT.label}</th>
              </tr>
            </thead>
            <tbody>
              {PARF_CURRENT.schedule.map((row, i) => (
                <tr key={row.age}>
                  <td style={td}>{row.age}</td>
                  <td style={{ ...tdNum, color: '#6b7280' }}>
                    {PARF_PREVIOUS.schedule[i].pct === 0 ? 'Nil' : `${Math.round(PARF_PREVIOUS.schedule[i].pct * 100)}% of ARF`}
                  </td>
                  <td style={{ ...tdNum, fontWeight: row.pct > 0 ? 700 : 400 }}>
                    {row.pct === 0 ? 'Nil' : `${Math.round(row.pct * 100)}% of ARF`}
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>Cap</td>
                <td style={{ ...tdNum, color: '#6b7280', borderTop: '2px solid #e5e7eb' }}>{fmtSGD(PARF_PREVIOUS.cap)}</td>
                <td style={{ ...tdNum, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>{fmtSGD(PARF_CURRENT.cap)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={body}>
          The right-hand column applies to cars registered with COEs obtained from the second February 2026 bidding
          exercise onwards, and to COE-exempt cars registered on or after 13 February 2026. The left-hand column still
          governs cars registered between 15 February 2023 and 12 February 2026 &mdash; which is worth knowing when you
          are valuing a two-year-old used car, because its rebate entitlement is materially better than a new one&rsquo;s.
        </p>
        <p style={body}>
          For a three-year expat posting the arithmetic has genuinely moved. On the Civic above, ARF is S$41,777: the
          old schedule would have returned S$31,333 on deregistration inside five years, the new one returns S$12,533.
          That is roughly S$19,000 of extra cost on a three-year ownership, which is the sort of number that decides a
          buy-versus-lease question on its own. Run it both ways in the{' '}
          <Link to="/singapore/calculators" style={{ color: '#dc2626', fontWeight: 600 }}>lease-versus-buy calculator</Link>{' '}
          before committing.
        </p>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <h2 style={h2}>Frequently asked questions</h2>
        {faqItems.map((f) => (
          <div key={f.q} style={{ marginBottom: 18 }}>
            <h3 style={{ ...h3, margin: '0 0 6px' }}>{f.q}</h3>
            <p style={{ ...body, margin: 0 }}>{f.a}</p>
          </div>
        ))}

        <EmailCapture
          city="sg"
          source="sg-on-road-price-calculator"
          guideTopic="calculator"
          title="📋 Get the free Singapore Car Buyer Checklist"
          subtitle="COE bidding explained, the 10-year ownership cost framework, insurance must-haves, and a 10-item pre-purchase checklist — everything in one PDF."
          buttonText="Send me the checklist →"
        />

        {/* ── Sources ───────────────────────────────────────────────────── */}
        <h2 style={h2}>Sources</h2>
        <ul style={{ ...fine, paddingLeft: 20, fontSize: 13 }}>
          <li style={{ marginBottom: 6 }}>
            ARF bands, excise duty, GST, registration fee, VES, EEAI and PARF &mdash;{' '}
            <a href="https://onemotoring.lta.gov.sg/content/onemotoring/home/buying/upfront-vehicle-costs/tax-structure.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              LTA / OneMotoring, Vehicle Tax Structure
            </a> (page last updated 30 January 2026).
          </li>
          <li style={{ marginBottom: 6 }}>
            Per-model OMVs, taxes and distributor prices &mdash;{' '}
            <a href="https://onemotoring.lta.gov.sg/content/dam/onemotoring/Buying/Car_Cost_Update/M032-Car_Cost_Update.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              LTA Car Cost Update
            </a>, cars registered June 2026.
          </li>
          <li style={{ marginBottom: 6 }}>
            COE quota premiums &mdash;{' '}
            <a href={COE_REFERENCE.source} target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              LTA COE Bidding Results 2026
            </a>. Figures quoted are the {COE_REFERENCE.exercise}, closed {COE_REFERENCE.closed}.
          </li>
          <li style={{ marginBottom: 6 }}>
            VES extension and revised bands &mdash;{' '}
            <a href="https://www.lta.gov.sg/content/ltagov/en/newsroom/2025/9/news-releases/extension_of_ves_and_eeai_to_support_vehicle_electrification.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              Joint LTA / NEA news release, 8 September 2025
            </a>.
          </li>
          <li style={{ marginBottom: 6 }}>
            Loan-to-value and tenure limits &mdash;{' '}
            <a href="https://www.mas.gov.sg/regulation/explainers/motor-vehicle-loans" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              MAS, Rules for Motor Vehicle Loans
            </a>.
          </li>
        </ul>
        <p style={{ ...fine, marginTop: 12 }}>
          Rates checked 5 August 2026. COE premiums change every fortnight and the figure pre-filled above is a single
          dated bidding exercise, not a current price. OMV is assessed by Singapore Customs, not by the dealer&rsquo;s
          asking price. Treat this calculator as a planning tool and confirm the OMV and the applicable quota premium
          before committing to a purchase.
        </p>

        <div style={{ marginTop: 24, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link to="/singapore/coe-guide" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            How the COE system works &rarr;
          </Link>
          <Link to="/singapore/coe-bidding-strategy" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            COE bidding strategy &rarr;
          </Link>
          <Link to="/singapore/calculators" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            Lease vs buy calculator &rarr;
          </Link>
        </div>
      </div>
    </Layout>
  );
}
