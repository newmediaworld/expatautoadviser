import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import SEOMeta from '../../components/SEOMeta';
import FAQSchema from '../../components/FAQSchema';
import CredibilityBar from '../../components/CredibilityBar';
import EmailCapture from '../../components/EmailCapture';
import {
  FRT_BANDS,
  calcFRT,
  frtBandBreakdown,
  taxableValueFromAllIn,
  calcOnRoadPrice,
  frtEffectiveRate,
  fmtHKD,
} from '../../lib/frt';

/* ─── Hong Kong First Registration Tax Calculator ───────────────────────────
   Dedicated tool page. The calculator leads; the explanation follows.
   All arithmetic comes from src/lib/frt.js — shared with /hong-kong/calculators.
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

// ── Worked examples ──────────────────────────────────────────────────────────
// Prices are the Hong Kong distributor's FRT-inclusive list price, sourced
// below. The taxable value is not published — it is recovered by reversing the
// gazetted band schedule. Each one lands on an exact round figure, which is the
// check that the decomposition is right.
const WORKED_EXAMPLES = [
  {
    car: 'Toyota RAV4 HEV Adventure',
    listPrice: 379890,
    taxableValue: 236500,
    note: 'Crown Motors HK launch price, May 2026',
  },
  {
    car: 'Toyota RAV4 HEV Limited',
    listPrice: 419880,
    taxableValue: 258000,
    note: 'Crown Motors HK launch price, May 2026',
  },
  {
    car: 'Mercedes-Benz GLC 250 (electric)',
    listPrice: 799000,
    taxableValue: 440000,
    note: 'Indicative HK order price, June 2026 — full FRT, no EV concession',
  },
];

const faqItems = [
  {
    q: 'How do you calculate first registration tax in Hong Kong?',
    a: 'FRT is charged on the vehicle’s taxable value in four marginal bands: 46% on the first HK$150,000, 86% on the next HK$150,000, 115% on the next HK$200,000, and 132% on anything above HK$500,000. Each rate applies only to the slice of value inside that band, so a car with a taxable value of HK$236,500 pays HK$69,000 on the first band plus HK$74,390 on the second — HK$143,390 in total.',
  },
  {
    q: 'Is the dealer’s price in Hong Kong before or after first registration tax?',
    a: 'Hong Kong distributors quote FRT-inclusive prices, so the figure on the price list is already taxable value plus FRT. That is why this calculator works in both directions: enter a taxable value to get the tax, or enter the dealer’s all-in price to see how much of it is tax.',
  },
  {
    q: 'Do electric cars still get an FRT concession in Hong Kong in 2026?',
    a: 'Not for private cars. The 2026-27 Budget, announced on 25 February 2026, confirmed the FRT concessions for electric private cars — including the One-for-One Replacement Scheme — would not be extended beyond their expiry on 31 March 2026. First-registration applications submitted on or after 1 April 2026 pay full FRT. Electric commercial vehicles, electric motorcycles and electric motor tricycles keep a full FRT waiver until 31 March 2028.',
  },
  {
    q: 'Do you pay first registration tax on a used car in Hong Kong?',
    a: 'No. FRT is a one-off charge levied at first registration. A car already registered in Hong Kong has had its FRT paid, and no further FRT is due when it changes hands. That is the main reason the Hong Kong used-car market is so active among expats on short postings.',
  },
  {
    q: 'What counts towards the taxable value of a car in Hong Kong?',
    a: 'For a car bought from a Hong Kong distributor, the taxable value is based on the published retail price, with the provisional taxable value assessed by the Customs and Excise Department. For a car you import yourself, Customs builds the value up from the purchase price plus insurance, freight, brokerage or agency fees and any repair charges. Accessories fitted within six months of first registration can also be taxed.',
  },
];

// ── The calculator ──────────────────────────────────────────────────────────
function FRTTool() {
  const [mode, setMode] = useState('taxable'); // 'taxable' | 'allin'
  const [amount, setAmount] = useState('');

  const input = parseFloat(amount) || 0;

  const result = useMemo(() => {
    if (input <= 0) return null;
    const taxableValue = mode === 'taxable' ? input : Math.round(taxableValueFromAllIn(input));
    const frt = calcFRT(taxableValue);
    return {
      taxableValue,
      frt,
      onRoad: mode === 'taxable' ? calcOnRoadPrice(taxableValue) : input,
      effectiveRate: frtEffectiveRate(taxableValue),
      shareOfPrice: Math.round((frt / (taxableValue + frt)) * 100),
      bands: frtBandBreakdown(taxableValue),
    };
  }, [input, mode]);

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
        <button type="button" style={tabStyle(mode === 'taxable')} onClick={() => setMode('taxable')}>
          I know the taxable value
        </button>
        <button type="button" style={tabStyle(mode === 'allin')} onClick={() => setMode('allin')}>
          I know the dealer&rsquo;s price
        </button>
      </div>

      <label htmlFor="frt-amount" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {mode === 'taxable'
          ? 'Vehicle taxable value (assessed by Customs & Excise)'
          : 'Dealer’s list price (FRT-inclusive, as quoted in Hong Kong)'}
      </label>
      <div style={{ position: 'relative', maxWidth: 420 }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: 15 }}>HK$</span>
        <input
          id="frt-amount"
          type="number"
          inputMode="numeric"
          min="0"
          placeholder={mode === 'taxable' ? 'e.g. 236500' : 'e.g. 379890'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: '100%', padding: '14px 14px 14px 52px', borderRadius: 8,
            border: '1px solid #d1d5db', fontSize: 18, fontWeight: 600,
            boxSizing: 'border-box', color: '#111827', background: '#fff',
          }}
        />
      </div>
      <p style={{ ...fine, margin: '8px 0 0' }}>
        Results update as you type. Nothing is sent anywhere &mdash; the sum runs in your browser.
      </p>

      {result && (
        <div style={{ marginTop: 22 }}>
          {/* Headline number */}
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 10, padding: 20, marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              First Registration Tax payable
            </div>
            <div style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, color: '#92400e', lineHeight: 1.1 }}>
              {fmtHKD(result.frt)}
            </div>
            <div style={{ fontSize: 13, color: '#92400e', marginTop: 6 }}>
              {result.effectiveRate}% of taxable value &mdash; {result.shareOfPrice}% of the all-in price you actually pay
            </div>
          </div>

          {/* Band breakdown */}
          <h3 style={{ ...h3, margin: '0 0 6px' }}>How that number is built</h3>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Band</th>
                <th style={{ ...th, textAlign: 'right' }}>Value in band</th>
                <th style={{ ...th, textAlign: 'right' }}>Rate</th>
                <th style={{ ...th, textAlign: 'right' }}>Tax</th>
              </tr>
            </thead>
            <tbody>
              {result.bands.map((b) => (
                <tr key={b.shortLabel}>
                  <td style={td}>{b.shortLabel}</td>
                  <td style={tdNum}>{fmtHKD(b.slice)}</td>
                  <td style={tdNum}>{b.ratePct}</td>
                  <td style={tdNum}>{fmtHKD(b.tax)}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...td, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>Total FRT</td>
                <td style={{ ...tdNum, borderTop: '2px solid #e5e7eb' }} />
                <td style={{ ...tdNum, borderTop: '2px solid #e5e7eb' }} />
                <td style={{ ...tdNum, fontWeight: 700, borderTop: '2px solid #e5e7eb' }}>{fmtHKD(result.frt)}</td>
              </tr>
            </tbody>
          </table>

          {/* Summary */}
          <table style={table}>
            <tbody>
              <tr>
                <td style={td}>Taxable value</td>
                <td style={{ ...tdNum, fontWeight: 600 }}>{fmtHKD(result.taxableValue)}</td>
              </tr>
              <tr>
                <td style={td}>First Registration Tax</td>
                <td style={{ ...tdNum, fontWeight: 600 }}>{fmtHKD(result.frt)}</td>
              </tr>
              <tr>
                <td style={{ ...td, fontWeight: 700 }}>Total, car plus FRT</td>
                <td style={{ ...tdNum, fontWeight: 800, fontSize: 16 }}>{fmtHKD(result.onRoad)}</td>
              </tr>
            </tbody>
          </table>

          {mode === 'allin' && (
            <p style={{ ...fine, margin: '0 0 12px' }}>
              The taxable value above is derived by reversing the gazetted band schedule from the price you entered.
              Hong Kong distributors quote FRT-inclusive prices, so this is the split behind the number on the price list.
              The Transport Department&rsquo;s assessed value is the one that binds.
            </p>
          )}

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 14, fontSize: 13, color: '#1e3a5f', lineHeight: 1.7 }}>
            <strong>Electric private car?</strong> The figure above is what you pay. The FRT concession for
            electric private cars, including the One-for-One Replacement Scheme, expired on 31&nbsp;March&nbsp;2026
            and was not extended. Applications for first registration submitted on or after 1&nbsp;April&nbsp;2026
            attract full FRT. See the <a href="#ev-2026" style={{ color: '#1d4ed8' }}>2026 Budget change</a> below
            for the one-off transitional arrangement.
          </div>

          <p style={{ ...fine, marginTop: 14 }}>
            <strong>What this excludes:</strong> vehicle registration fee, the annual vehicle licence fee, insurance,
            dealer delivery charges and parking. FRT is the largest single line, not the only one. Fees are published
            in the Transport Department&rsquo;s{' '}
            <a href="https://www.td.gov.hk/en/public_services/licences_and_permits/fees_and_charges/index.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              table of fees and charges
            </a>.
          </p>
        </div>
      )}

      {!result && (
        <p style={{ ...body, margin: '18px 0 0', color: '#6b7280' }}>
          Enter a figure above to see the tax, band by band. Try HK$236,500 &mdash; the taxable value behind a
          Toyota RAV4 HEV Adventure at its Hong Kong list price.
        </p>
      )}
    </div>
  );
}

export default function HKFRTCalculator() {
  return (
    <Layout
      city="hk"
      relatedLinks={[
        { label: 'FRT Explained in Full', to: '/hong-kong/frt-tax-explained' },
        { label: 'Buying Guide', to: '/hong-kong/buying-guide' },
        { label: 'Lease vs Buy Calculator', to: '/hong-kong/calculators' },
        { label: 'EV Guide', to: '/hong-kong/ev-guide' },
      ]}
    >
      <SEOMeta
        title="Hong Kong First Registration Tax Calculator (2026) | ExpatAutoAdviser"
        description="Work out Hong Kong first registration tax on any car. Enter the taxable value or the dealer's price and see the 46/86/115/132% bands, tax and total."
        canonical="https://www.expatautoadviser.com/hong-kong/first-registration-tax-calculator"
      />
      <FAQSchema faqs={faqItems} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px 40px' }}>
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#2a9d8f', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Hong Kong &middot; Free tool
        </p>
        <h1 style={h1}>Hong Kong First Registration Tax Calculator</h1>
        <p style={{ margin: '0 0 20px', fontSize: 16, color: '#6b7280', lineHeight: 1.6 }}>
          Enter a car&rsquo;s taxable value &mdash; or the dealer&rsquo;s Hong Kong price &mdash; and see the FRT,
          band by band, on the rates in force in 2026.
        </p>

        <FRTTool />

        <CredibilityBar />

        {/* ── Bands ─────────────────────────────────────────────────────── */}
        <h2 style={h2}>The 2026 FRT bands for private cars</h2>
        <p style={body}>
          The rates below took effect at 11am on 24 February 2021 and have not been changed since. They are
          <strong> marginal</strong>: each rate applies only to the slice of taxable value that falls inside its band,
          in the same way UK income tax works. A great many Hong Kong price explainers get this wrong and apply a
          single headline rate to the whole value.
        </p>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Taxable value band</th>
              <th style={{ ...th, textAlign: 'right' }}>Tax rate</th>
              <th style={{ ...th, textAlign: 'right' }}>Tax on a full band</th>
            </tr>
          </thead>
          <tbody>
            {FRT_BANDS.map((band) => (
              <tr key={band.label}>
                <td style={td}>{band.label}</td>
                <td style={tdNum}>{Math.round(band.rate * 100)}%</td>
                <td style={tdNum}>
                  {band.to === Infinity ? '—' : fmtHKD((band.to - band.from) * band.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={body}>
          Filling all three finite bands &mdash; a taxable value of HK$500,000 &mdash; produces HK$428,000 of tax,
          an effective rate of 86%. Above that, every further dollar of value costs HK$2.32 all in.
        </p>

        {/* ── Worked examples ───────────────────────────────────────────── */}
        <h2 style={h2}>Three real Hong Kong cars, priced out</h2>
        <p style={body}>
          Hong Kong distributors quote FRT-inclusive prices, so the number on the price list already contains the tax.
          Reversing the band schedule recovers the taxable value behind it &mdash; and in each case below it lands on
          an exact round figure, which is the check that the split is right.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Car</th>
                <th style={{ ...th, textAlign: 'right' }}>HK list price</th>
                <th style={{ ...th, textAlign: 'right' }}>Taxable value</th>
                <th style={{ ...th, textAlign: 'right' }}>FRT</th>
                <th style={{ ...th, textAlign: 'right' }}>Tax share</th>
              </tr>
            </thead>
            <tbody>
              {WORKED_EXAMPLES.map((ex) => {
                const frt = calcFRT(ex.taxableValue);
                return (
                  <tr key={ex.car}>
                    <td style={td}>
                      <strong>{ex.car}</strong>
                      <div style={fine}>{ex.note}</div>
                    </td>
                    <td style={tdNum}>{fmtHKD(ex.listPrice)}</td>
                    <td style={tdNum}>{fmtHKD(ex.taxableValue)}</td>
                    <td style={tdNum}>{fmtHKD(frt)}</td>
                    <td style={tdNum}>{Math.round((frt / ex.listPrice) * 100)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={body}>
          Take the RAV4 Adventure. Its taxable value of HK$236,500 fills the first band completely
          (HK$150,000 &times; 46% = HK$69,000) and pushes HK$86,500 into the second
          (&times; 86% = HK$74,390). Total FRT HK$143,390, which added back to the taxable value gives exactly the
          HK$379,890 on the price list. Nearly two of every five dollars go to the government.
        </p>
        <p style={body}>
          The electric GLC is the more instructive one. Registered before April 2026 it would have qualified for an
          FRT concession worth up to HK$58,500, or up to HK$172,500 under the One-for-One Replacement Scheme.
          Registered now, it pays the full HK$359,000.
        </p>

        {/* ── Taxable value ─────────────────────────────────────────────── */}
        <h2 style={h2}>What counts towards the taxable value</h2>
        <p style={body}>
          This is the number expats most often get wrong, because it is not the price you negotiated and not the price
          you paid abroad. It is a value assessed by the Customs and Excise Department, which the Transport Department
          then taxes.
        </p>
        <ul style={{ ...body, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Buying from a Hong Kong distributor.</strong> The taxable value is based on the published retail
            price the distributor is required to file with Customs before offering the car for sale. Customs assesses a
            provisional taxable value from it and issues a notification, which the Transport Department uses to
            calculate and collect the tax. Discounting the car does not reduce the tax.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Importing a car yourself.</strong> Customs builds the provisional taxable value up from the
            purchase price plus insurance, freight, brokerage or agency fees, and any repair charges connected to the
            purchase and importation. If the declared value does not reflect the Hong Kong market value, Customs may
            substitute its own figure, taking account of the vehicle&rsquo;s age and the retail price in the country
            of origin.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Depreciation on a car you already owned.</strong> Where the car was registered in your name
            outside Hong Kong before importation and you can produce the overseas registration document, Customs may
            allow depreciation from the date of overseas registration to the date of importation &mdash; 25% a year
            for petrol vehicles, 20% a year for non-petrol vehicles.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Accessories.</strong> Extras fitted within six months of first registration can themselves be
            taxed. Loading up a new car with dealer-fitted options is not a way around the band structure.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Used cars already registered in Hong Kong.</strong> No FRT at all. The tax is charged once, at
            first registration. This is the single biggest reason an expat on a two- or three-year posting should look
            hard at the used market before ordering new.
          </li>
        </ul>

        {/* ── EV 2026 ───────────────────────────────────────────────────── */}
        <h2 style={h2} id="ev-2026">What the February 2026 Budget changed for electric cars</h2>
        <p style={body}>
          The 2026-27 Budget, delivered on 25 February 2026, confirmed that the FRT concessions for electric private
          cars &mdash; including the One-for-One Replacement Scheme &mdash; would not be extended beyond their expiry
          on 31 March 2026. This is the change that reset the sum for anyone budgeting an EV in Hong Kong.
        </p>
        <ul style={{ ...body, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Private electric cars.</strong> Applications for first registration submitted on or after
            1&nbsp;April&nbsp;2026 get no FRT concession. Full standard bands apply, exactly as the calculator above
            computes them.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>The one-off transitional arrangement.</strong> Electric private cars ordered on or before
            25&nbsp;February&nbsp;2026, or already arranged by the owner to be shipped to Hong Kong for their own use,
            can still be taxed at the pre-adjustment concession &mdash; provided the supporting documents and
            application reach the Transport Department by <strong>24&nbsp;February&nbsp;2027</strong> and are approved.
            If you ordered before the Budget and have not yet registered, this deadline is the one to diarise.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Commercial EVs are unaffected.</strong> FRT for electric commercial vehicles, electric motorcycles
            and electric motor tricycles remains fully waived until 31&nbsp;March&nbsp;2028.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>What it was worth.</strong> Between 1&nbsp;April&nbsp;2024 and 31&nbsp;March&nbsp;2026 the general
            concession for electric private cars was capped at HK$58,500, rising to HK$172,500 for owners qualifying
            under the One-for-One Replacement Scheme. That is the size of the step-up a private EV buyer now absorbs.
          </li>
        </ul>
        <p style={body}>
          Practical consequence: the EV-versus-petrol price gap that the concession used to close has reopened, while
          Hong Kong petrol prices have stayed high. The running-cost case for an EV survives; the up-front case is
          weaker than it was in 2025. Run both numbers before committing &mdash; and if you are comparing against
          leasing instead, the{' '}
          <Link to="/hong-kong/calculators" style={{ color: '#dc2626', fontWeight: 600 }}>lease-versus-buy calculator</Link>{' '}
          does that side of the sum.
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
          city="hk"
          source="hk-frt-calculator"
          guideTopic="calculator"
          title="📋 Get the free Hong Kong Car Buyer Guide"
          subtitle="First Registration Tax explained, the post-concession EV reality, parking truths, and a 10-item pre-purchase checklist — everything in one PDF."
          buttonText="Send me the guide →"
        />

        {/* ── Sources ───────────────────────────────────────────────────── */}
        <h2 style={h2}>Sources</h2>
        <ul style={{ ...fine, paddingLeft: 20, fontSize: 13 }}>
          <li style={{ marginBottom: 6 }}>
            FRT rates for private cars &mdash;{' '}
            <a href="https://www.info.gov.hk/gia/general/202102/24/P2021022400249.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              Immediate adjustment to first registration tax rates for private cars
            </a>, HKSAR Government, 24 February 2021.
          </li>
          <li style={{ marginBottom: 6 }}>
            EV concession position &mdash;{' '}
            <a href="https://www.info.gov.hk/gia/general/202602/25/P2026022500288.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              First registration tax concession arrangement for electric vehicles
            </a>, HKSAR Government, 25 February 2026 (2026-27 Budget).
          </li>
          <li style={{ marginBottom: 6 }}>
            Taxable value and vehicle valuation &mdash;{' '}
            <a href="https://www.customs.gov.hk/en/service-enforcement-information/trade-facilitation/motor-vehicles/index.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              Hong Kong Customs and Excise Department, Motor Vehicles
            </a>, and{' '}
            <a href="https://www.gov.hk/en/residents/transport/vehicle/carowner.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              GovHK, Become a Car Owner in Hong Kong
            </a>.
          </li>
          <li style={{ marginBottom: 6 }}>
            Vehicle registration and licence fees &mdash;{' '}
            <a href="https://www.td.gov.hk/en/public_services/licences_and_permits/fees_and_charges/index.html" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626' }}>
              Transport Department, Fees and Charges
            </a>.
          </li>
          <li style={{ marginBottom: 6 }}>
            Toyota RAV4 HEV Hong Kong launch prices, 21 May 2026, and Mercedes-Benz GLC 250 electric indicative
            Hong Kong price, 11 June 2026 &mdash; Car1.hk.
          </li>
        </ul>
        <p style={{ ...fine, marginTop: 12 }}>
          Rates checked 5 August 2026. FRT is a statutory tax and the taxable value is determined by the Customs and
          Excise Department, not by the dealer&rsquo;s asking price. Treat this calculator as a planning tool and
          confirm the assessed value with the Transport Department before committing to a purchase.
        </p>

        <div style={{ marginTop: 24, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link to="/hong-kong/frt-tax-explained" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            The full FRT explainer &rarr;
          </Link>
          <Link to="/hong-kong/buying-guide" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            Buying a car in Hong Kong &rarr;
          </Link>
          <Link to="/hong-kong/calculators" style={{ fontSize: 14, color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>
            Lease vs buy calculator &rarr;
          </Link>
        </div>
      </div>
    </Layout>
  );
}
