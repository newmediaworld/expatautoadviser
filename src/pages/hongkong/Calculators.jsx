import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import EmailCapture from "../../components/EmailCapture";
// FRT arithmetic lives in one place — src/lib/frt.js — and is shared with the
// dedicated /hong-kong/first-registration-tax-calculator page so the two can
// never drift apart. Do not re-implement the bands here.
import { calcFRT, frtBandBreakdown, fmtHKD } from "../../lib/frt";

/* ─── Hong Kong Calculators Page ────────────────────────────────────────── */

// NOTE — a calcFRTRebate() helper used to live here, producing an "estimated
// FRT deregistration rebate" from a sliding scale its own comment described as
// "approximate". That schedule was not sourced from anywhere: Hong Kong has no
// published FRT deregistration rebate for private cars analogous to Singapore's
// PARF, so the numbers it printed were invented. It has been removed rather
// than corrected. Where a reader needs a figure, link them to the Transport
// Department's own fees and charges instead.
const TD_FEES_URL =
  'https://www.td.gov.hk/en/public_services/licences_and_permits/fees_and_charges/index.html';

const fmt = fmtHKD;

// ── Tooltip component ────────────────────────────────────────────────────
function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 4 }}>
      <button
        onClick={() => setShow(!show)}
        style={{
          width: 16, height: 16, borderRadius: "50%", border: "1px solid #9ca3af",
          background: "#f3f4f6", fontSize: 10, cursor: "pointer", color: "#6b7280",
          lineHeight: "14px", padding: 0, fontWeight: 700, display: "inline-flex",
          alignItems: "center", justifyContent: "center"
        }}
        aria-label="More info"
      >?</button>
      {show && (
        <span style={{
          position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
          background: "#1f2937", color: "#fff", fontSize: 11, padding: "6px 10px",
          borderRadius: 6, whiteSpace: "nowrap", maxWidth: 260, lineHeight: 1.5,
          zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", textAlign: "left"
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

function ResultRow({ label, value, tooltip, highlight, sub }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid #f3f4f6",
      background: highlight ? "#fffbeb" : "transparent",
      borderRadius: highlight ? 6 : 0,
      paddingLeft: highlight ? 8 : 0, paddingRight: highlight ? 8 : 0,
    }}>
      <span style={{ fontSize: sub ? 12 : 14, color: highlight ? "#92400e" : sub ? "#9ca3af" : "#374151", fontWeight: highlight ? 700 : 400, fontStyle: sub ? "italic" : "normal" }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      <span style={{ fontSize: highlight ? 18 : 14, fontWeight: highlight ? 700 : 600, color: highlight ? "#92400e" : "#111827" }}>
        {value}
      </span>
    </div>
  );
}

// ── FRT On-Road Calculator ───────────────────────────────────────────────
function FRTCalculator() {
  const [taxableValue, setTaxableValue] = useState("");
  const [vehicleType, setVehicleType] = useState("ice");

  const tvNum = parseFloat(taxableValue) || 0;

  const results = useMemo(() => {
    if (tvNum <= 0) return null;
    if (vehicleType === "ev") {
      // EV: private-car FRT concession ended 1 Apr 2026 — full bands now apply
      const frtIfNoExemption = calcFRT(tvNum);
      const totalWithoutExemption = tvNum + frtIfNoExemption;
      return { isEV: true, frtIfNoExemption, totalWithoutExemption, taxableValue: tvNum };
    }
    const frt = calcFRT(tvNum);
    const totalOnRoad = tvNum + frt;
    const frtRate = tvNum > 0 ? Math.round((frt / tvNum) * 100) : 0;
    return { isEV: false, frt, totalOnRoad, frtRate, taxableValue: tvNum };
  }, [tvNum, vehicleType]);

  // Show FRT band breakdown (shared helper — see src/lib/frt.js)
  const bandBreakdown = useMemo(
    () =>
      frtBandBreakdown(tvNum).map((b) => ({
        range: b.shortLabel,
        rate: b.ratePct,
        tax: b.tax,
      })),
    [tvNum]
  );

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box",
    color: "#111827", background: "#fff"
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 };
  const groupStyle = { marginBottom: 16 };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        FRT Quick Check
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>
        Enter a vehicle's taxable value to see how much First Registration Tax applies and what the total on-road price will be. Results update as you type.
      </p>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link to="/hong-kong/first-registration-tax-calculator" style={{ color: "#dc2626", fontWeight: 600, textDecoration: "none" }}>
          Full First Registration Tax calculator — reverse from a dealer price, worked examples, 2026 EV rules →
        </Link>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Taxable value */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Vehicle Taxable Value
            <Tooltip text="The taxable value assessed by the Customs and Excise Department — not necessarily the purchase price or the sticker price at the dealer." />
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>HK$</span>
            <input
              type="number"
              placeholder="e.g. 200000"
              value={taxableValue}
              onChange={e => setTaxableValue(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 44 }}
            />
             </div>
        </div>

        {/* Vehicle type */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Vehicle Type
            <Tooltip text="The FRT concession for electric private cars ended on 31 March 2026. Commercial EVs, e-motorcycles and e-tricycles keep a full waiver until 31 March 2028." />
          </label>
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} style={inputStyle}>
            <option value="ice">Petrol / Diesel (ICE)</option>
            <option value="ev">Electric Vehicle (EV)</option>
          </select>
        </div>

      </div>

      {/* Results */}
      {results && (
        results.isEV ? (
          <div style={{ background: "#fffbeb", borderRadius: 12, padding: 24, border: "1px solid #fcd34d" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#92400e", marginBottom: 12 }}>
              Electric private car — full FRT applies from 1 April 2026
            </h3>
            <p style={{ fontSize: 14, color: "#374151", marginBottom: 16, lineHeight: 1.6 }}>
              The FRT concession for electric <strong>private cars</strong>, including the One-for-One Replacement
              Scheme, expired on 31 March 2026 and was not extended. First-registration applications submitted on or
              after 1 April 2026 pay the full band schedule — {fmt(results.frtIfNoExemption)} on this taxable value,
              taking the on-road price to {fmt(results.totalWithoutExemption)}.
            </p>
            <div style={{ background: "#fff", borderRadius: 8, padding: 16, border: "1px solid #fde68a", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#374151" }}>Taxable value</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{fmt(results.taxableValue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#374151" }}>First Registration Tax payable</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#dc2626" }}>{fmt(results.frtIfNoExemption)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Total on-road price</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#92400e" }}>{fmt(results.totalWithoutExemption)}</span>
              </div>
            </div>
            <div style={{ background: "#eff6ff", borderRadius: 8, padding: 12, fontSize: 13, color: "#1e3a5f", lineHeight: 1.6 }}>
              <strong>Two exceptions.</strong> Electric private cars ordered on or before 25 February 2026 (or already
              arranged for shipment to Hong Kong for the owner&rsquo;s own use) can still be taxed at the pre-adjustment
              concession if the application reaches the Transport Department by 24 February 2027 and is approved. And
              electric <em>commercial</em> vehicles, electric motorcycles and electric motor tricycles keep a full FRT
              waiver until 31 March 2028. Confirm the position with the{" "}
              <a href="https://www.td.gov.hk" target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8" }}>Transport Department</a> before purchasing.
            </div>
            <div style={{ marginTop: 16 }}>
              <Link to="/hong-kong/ev-guide" style={{ fontSize: 13, color: "#15803d", textDecoration: "none", fontWeight: 600 }}>
                Full EV guide for Hong Kong — the post-concession position →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>
              FRT Cost Breakdown
            </h3>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>
              Taxable value: {fmt(tvNum)} — FRT effective rate: ~{results.frtRate}% of taxable value
            </p>

            {/* Band breakdown */}
            <div style={{ marginBottom: 20 }}>
              {bandBreakdown.map((b, i) => (
                <ResultRow
                  key={i}
                  label={`${b.range} @ ${b.rate}`}
                  value={fmt(b.tax)}
                  sub={true}
                />
              ))}
            </div>

            <ResultRow
              label="Taxable Value"
              value={fmt(tvNum)}
              tooltip="The taxable value assessed by the Customs and Excise Department."
            />
            <ResultRow
              label="Total FRT Payable"
              value={fmt(results.frt)}
              tooltip="Sum of all FRT bands above."
            />

            <div style={{ borderTop: "2px solid #e5e7eb", marginTop: 8, paddingTop: 8 }}>
              <ResultRow
                label="Total On-Road Price"
                value={fmt(results.totalOnRoad)}
                highlight={true}
                tooltip="Taxable value plus FRT. Does not include dealer margin, insurance, or registration admin fees."
              />
            </div>

            <div style={{ marginTop: 20, background: "#eff6ff", borderRadius: 8, padding: 16, border: "1px solid #bfdbfe", fontSize: 13, color: "#1e3a5f", lineHeight: 1.7 }}>
              <strong>Buying used?</strong> FRT is a one-off charge levied at first registration, so a car already
              registered in Hong Kong has had its FRT paid and none is due again when it changes hands. There is no
              Hong Kong equivalent of Singapore&rsquo;s PARF rebate for private cars &mdash; deregistering does not
              return a share of the FRT. For the fees that do apply on registration, transfer and licensing, see the
              Transport Department&rsquo;s{' '}
              <a href={TD_FEES_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8" }}>
                table of fees and charges
              </a>.
            </div>

            <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, marginTop: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> These estimates are based on the published FRT band schedule. The actual taxable value is assessed by the Customs and Excise Department and may differ from the dealer's asking price. Verify with the <a href="https://www.td.gov.hk" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>Transport Department</a> before purchasing.
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to="/hong-kong/frt-tax-explained" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
                How does FRT work in detail? →
              </Link>
              <Link to="/hong-kong/buying-guide" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
                Buying guide for HK expats →
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ── Lease Cost Estimator (HK) ─────────────────────────────────────────────
const HK_LEASE_DATA = {
  economy: { min: 5500, max: 7500, examples: "Toyota Vios, Honda City, Nissan Almera", included: ["Comprehensive insurance", "Road tax / licence fees", "Routine servicing", "24/7 roadside assist"] },
  midrange: { min: 8000, max: 14000, examples: "Toyota RAV4, Honda CR-V, Mazda CX-5", included: ["Comprehensive insurance", "Road tax / licence fees", "Routine servicing", "Tyres", "24/7 roadside assist"] },
  premium: { min: 15000, max: 28000, examples: "BMW 3-Series, Mercedes C-Class, Range Rover Sport", included: ["Comprehensive insurance", "Road tax / licence fees", "Full servicing", "Tyres", "Loan car", "24/7 roadside assist"] },
};

function HKLeaseCostEstimator() {
  const [category, setCategory] = useState("midrange");
  const [duration, setDuration] = useState("24");

  const data = HK_LEASE_DATA[category];
  const durationNum = parseInt(duration);
  const discount = durationNum >= 36 ? 0.95 : durationNum >= 24 ? 0.97 : 1.0;
  const minCost = Math.round(data.min * discount);
  const maxCost = Math.round(data.max * discount);
  const labels = { economy: "Economy", midrange: "Mid-range / SUV", premium: "Premium / Luxury" };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        Lease Cost Estimator
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Typical monthly costs for a full-service lease in Hong Kong. Corporate leasing is common for expat packages.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Car Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            <option value="economy">Economy / Compact</option>
            <option value="midrange">Mid-range / SUV</option>
            <option value="premium">Premium / Luxury</option>
          </select>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>e.g. {data.examples}</p>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Lease Duration</label>
          <select value={duration} onChange={e => setDuration(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
          </select>
        </div>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
            Typical monthly cost — {labels[category]}, {duration}-month lease
          </p>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e" }}>
            HK${minCost.toLocaleString()} – HK${maxCost.toLocaleString()}
            <span style={{ fontSize: 14, fontWeight: 400, color: "#6b7280" }}>/month</span>
          </div>
          {durationNum >= 36 && <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✓ Longer-term discount applied</p>}
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Typically included:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.included.map(item => (
              <li key={item} style={{ fontSize: 13, color: "#374151", padding: "4px 0", display: "flex", gap: 8 }}>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
            Typically <em>not</em> included: excess mileage charges, accident damage excess, tunnel tolls, parking.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/hong-kong/leasing-guide" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
          Read the full HK leasing guide →
        </Link>
      </div>
    </div>
  );
}

// ── Licence Eligibility Checker (HK) ────────────────────────────────────
const HK_LICENCE_DATA = {
  UK: { country: "United Kingdom", result: "direct", note: "Convert directly at a Transport Department licensing office — no test required. Bring original licence, HKID, and proof of address." },
  AU: { country: "Australia", result: "direct", note: "Convert directly. Valid foreign licence + HKID + photos required." },
  NZ: { country: "New Zealand", result: "direct", note: "Convert directly. Same process as Australian licence." },
  US: { country: "United States", result: "direct", note: "Convert directly. State driving licence accepted — no test required." },
  CA: { country: "Canada", result: "direct", note: "Convert directly. Provincial licence accepted." },
  IE: { country: "Ireland", result: "direct", note: "Convert directly." },
  DE: { country: "Germany", result: "direct", note: "Convert directly." },
  FR: { country: "France", result: "direct", note: "Convert directly." },
  NL: { country: "Netherlands", result: "direct", note: "Convert directly." },
  SE: { country: "Sweden", result: "direct", note: "Convert directly." },
  JP: { country: "Japan", result: "direct", note: "Convert directly. Bring official English translation if your licence is not in English." },
  SG: { country: "Singapore", result: "direct", note: "Singapore driving licence converts directly to HK licence." },
  IN: { country: "India", result: "direct", note: "India is listed in Schedule 4 of Cap. 374B, so direct issue is available if you meet one of the eligibility limbs." },
  CN: { country: "China (Mainland)", result: "direct", note: "Mainland licences are listed in Schedule 4 and can be directly issued. Mainland applications are handled at the Hong Kong, Kowloon, Kwun Tong and Sha Tin licensing offices." },
  PH: { country: "Philippines", result: "test", note: "The Philippines is not listed in Schedule 4 of Cap. 374B — you must pass the Hong Kong driving test. Theory and practical tests required." },
};

function HKLicenceChecker() {
  const [country, setCountry] = useState("");
  const selected = HK_LICENCE_DATA[country];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>
        Licence Eligibility Checker
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Licences from the countries and places listed in Schedule 4 of the Road Traffic (Driving Licences) Regulations (Cap. 374B) can be directly issued without a driving test. You must also satisfy one of three limbs: the licence was issued during a period of at least six months residence in that country, or you have held it for at least five years, or you hold that country&rsquo;s passport. Check your country below.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Your current licence country</label>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ width: "100%", maxWidth: 360, padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
          <option value="">Select a country...</option>
          {Object.entries(HK_LICENCE_DATA).map(([code, d]) => (
            <option key={code} value={code}>{d.country}</option>
          ))}
          <option value="OTHER">Other country</option>
        </select>
      </div>

      {country === "OTHER" ? (
        <div style={{ background: "#fef3c7", borderRadius: 12, padding: 20, border: "1px solid #fcd34d" }}>
          <p style={{ fontSize: 14, color: "#92400e", margin: 0 }}>
            Check the <a href="https://www.td.gov.hk" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>Transport Department website</a> for the current full list. If your country isn't listed as a recognised jurisdiction, you'll need to sit the HK driving test.
          </p>
        </div>
      ) : selected ? (
        <div style={{ background: selected.result === "direct" ? "#f0fdf4" : "#fef2f2", borderRadius: 12, padding: 24, border: `1px solid ${selected.result === "direct" ? "#86efac" : "#fca5a5"}` }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{selected.result === "direct" ? "✅" : "⚠️"}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: selected.result === "direct" ? "#15803d" : "#dc2626", marginBottom: 8 }}>
            {selected.result === "direct" ? "Direct licence exchange — no driving test required" : "Driving test required"}
          </h3>
          <p style={{ fontSize: 14, color: "#374151", marginBottom: 0 }}>{selected.note}</p>
          {selected.result === "direct" && (
            <div>
              <div style={{ marginTop: 16, fontSize: 13, color: "#374151" }}>
<strong>What to bring:</strong> completed form TD63A, HKID card or passport, your original foreign licence (valid, or expired by no more than three years), supporting documents for the eligibility limb you rely on, and proof of address issued within the last three months.
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#92400e", background: "#fffbeb", borderRadius: 6, padding: "8px 12px" }}>
<strong>Note:</strong> since 16 March 2026 you <strong>must</strong> book a &ldquo;direct issue&rdquo; appointment online before attending — there is no walk-in or queue-ticket route. A medical examination certificate (TD256) is required only if you are aged 70 or over.
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Link to="/hong-kong/licence-conversion" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
          Full licence conversion guide for Hong Kong →
        </Link>
      </div>
    </div>
  );
}

// ── Buy vs Lease (HK) ────────────────────────────────────────────────────
function HKBuyVsLease() {
  const [taxableValue, setTaxableValue] = useState("");
  const [leaseMonthly, setLeaseMonthly] = useState(10000);
  const [years, setYears] = useState(3);
  const [regYear, setRegYear] = useState("");

  const currentYear = new Date().getFullYear();
  const tvNum = parseFloat(taxableValue) || 0;
  const yearsOld = regYear ? currentYear - parseInt(regYear) : 0;

  const results = useMemo(() => {
    if (tvNum <= 0) return null;
    const frt = yearsOld > 0 ? 0 : calcFRT(tvNum); // used cars: FRT already paid, reflected in price
    const purchasePrice = tvNum + frt;

    // Rough depreciation: ~8-10% per year for typical HK used cars
    const depreciation = purchasePrice * 0.09 * years;
    const resaleValue = Math.max(0, purchasePrice - depreciation);
    const netCostBuy = purchasePrice - resaleValue;

    // Running costs: insurance ~HK$12k/yr, road tax ~HK$3k/yr, servicing ~HK$8k/yr
    const annualRunning = 12000 + 3000 + 8000;
    const totalCostBuy = netCostBuy + (annualRunning * years);
    const totalCostLease = leaseMonthly * 12 * years;

    return {
      purchasePrice, resaleValue, netCostBuy, totalCostBuy,
      totalCostLease, monthlyBuyEquiv: Math.round(totalCostBuy / (years * 12)),
      isUsed: yearsOld > 0
    };
  }, [tvNum, leaseMonthly, years, yearsOld]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Buy vs Lease Comparison</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Compare total cost of ownership vs leasing for your HK posting length.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Car Taxable Value (HK$)</label>
          <input type="number" placeholder="e.g. 200000" value={taxableValue} onChange={e => setTaxableValue(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Year Registered (if used)</label>
          <select value={regYear} onChange={e => setRegYear(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            <option value="">New car</option>
            {Array.from({ length: 10 }, (_, i) => currentYear - i).map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Monthly Lease (HK$)</label>
          <input type="number" value={leaseMonthly} onChange={e => setLeaseMonthly(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Years in Hong Kong</label>
          <select value={years} onChange={e => setYears(parseInt(e.target.value))}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            {[1,2,3,4,5,6,7].map(y => <option key={y} value={y}>{y} {y===1?"year":"years"}</option>)}
          </select>
        </div>
      </div>

      {results && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 16 }}>🚗 Buying</h3>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{results.isUsed ? "Purchase price (used)" : "Total on-road price (new)"}</span>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(results.purchasePrice)}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Estimated resale after {years} yr</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>+{fmt(results.resaleValue)}</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Running costs ({years} yr)</span>
                <div style={{ fontSize: 13, color: "#374151" }}>ins + road tax + servicing</div>
              </div>
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Total net cost over {years} yr</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{fmt(results.totalCostBuy)}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>≈ {fmt(results.monthlyBuyEquiv)}/month</div>
              </div>
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 16 }}>📋 Leasing</h3>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Monthly payment</span>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(leaseMonthly)}/mo</div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Includes</span>
                <div style={{ fontSize: 13, color: "#374151" }}>insurance, road tax, servicing</div>
              </div>
              <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12 }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Total cost over {years} yr</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{fmt(results.totalCostLease)}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{fmt(leaseMonthly)}/month all-in</div>
              </div>
            </div>
          </div>

          <div>
            {results.totalCostBuy < results.totalCostLease ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: 14, fontSize: 13, color: "#15803d" }}>
                <strong>Buying appears cheaper</strong> by {fmt(results.totalCostLease - results.totalCostBuy)} over {years} years — though actual resale value is uncertain.
              </div>
            ) : (
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 14, fontSize: 13, color: "#9a3412" }}>
                <strong>Leasing is cheaper</strong> by {fmt(results.totalCostBuy - results.totalCostLease)} over {years} years — and no resale or depreciation risk.
              </div>
            )}
          </div>
        </div>
      )}
      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, lineHeight: 1.6 }}>
        Estimates only. Depreciation based on ~9%/year — actual varies by make, age, and market conditions. Running costs are illustrative averages.
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "buyvslease", label: "Buy vs Lease" },
  { id: "lease", label: "Lease Estimator" },
  { id: "licence", label: "Licence Eligibility" },
  { id: "frt", label: "FRT Quick Check" },
];

const relatedLinks = [
  { to: "/hong-kong/first-registration-tax-calculator", label: "FRT Calculator" },
  { to: "/hong-kong/frt-tax-explained", label: "FRT Explained" },
  { to: "/hong-kong/leasing-guide", label: "Leasing Guide" },
  { to: "/hong-kong/buying-guide", label: "Buying Guide" },
  { to: "/hong-kong/should-i-get-a-car", label: "Should I Get a Car?" },
];

const HERO_IMG = "https://images.unsplash.com/photo-1542189412744-bfabf27522ee?w=1200&q=80";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("buyvslease");

  return (
    <Layout city="hongkong" relatedLinks={relatedLinks}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Cost calculator HK" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#2a9d8f", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Hong Kong</span>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Hong Kong
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>
          Hong Kong Lease vs Buy Calculator &amp; Running Costs
        </h1>
        <p style={{ color: "#4b5563", fontSize: 16, marginBottom: 24, lineHeight: 1.7 }}>
          Work out whether leasing or buying is cheaper over your Hong Kong posting, estimate a monthly full-service
          lease, and check whether your foreign licence converts without a test.
        </p>

        {/* Pointer to the dedicated FRT tool */}
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "16px 20px", marginBottom: 32 }}>
          <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#92400e" }}>
            Just want the First Registration Tax on a specific car?
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#78350f", lineHeight: 1.6 }}>
            Use the dedicated tool. It works in both directions &mdash; enter a taxable value, or enter the
            dealer&rsquo;s Hong Kong price and see how much of it is tax &mdash; with the full band breakdown, worked
            examples and the 2026 EV position.
          </p>
          <Link
            to="/hong-kong/first-registration-tax-calculator"
            style={{ display: "inline-block", background: "#92400e", color: "#fff", padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
          >
            Hong Kong First Registration Tax Calculator →
          </Link>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 32, overflowX: "auto" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #dc2626" : "2px solid transparent",
                marginBottom: -2,
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#dc2626" : "#6b7280",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "frt" && <FRTCalculator />}
          {activeTab === "lease" && <HKLeaseCostEstimator />}
          {activeTab === "buyvslease" && <HKBuyVsLease />}
          {activeTab === "licence" && <HKLicenceChecker />}
        </div>

        {/* Email CTA */}
        <EmailCapture
          city="hk"
          source="hk-calculators"
          guideTopic="calculator"
          title="📋 Get the free Hong Kong Car Buyer Guide"
          subtitle="First Registration Tax explained, the post-concession EV reality, parking truths, and a 10-item pre-purchase checklist — everything in one PDF."
          buttonText="Send me the guide →"
        />
      </div>
    </Layout>
  );
}
