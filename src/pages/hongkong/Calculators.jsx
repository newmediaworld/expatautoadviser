import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import AffiliateBox from "../../components/AffiliateBox";
import EmailCapture from "../../components/EmailCapture";

/* ─── Hong Kong Calculators Page ────────────────────────────────────────── */

// ── FRT calculation helpers ──────────────────────────────────────────────
function calcFRT(taxableValue) {
  // FRT bands (HKD):
  // First $150,000 @ 46%
  // Next $150,000 @ 86%
  // Next $200,000 @ 115%
  // Remainder @ 132%
  if (taxableValue <= 0) return 0;
  let frt = 0;
  const t1 = Math.min(taxableValue, 150000);
  frt += t1 * 0.46;
  if (taxableValue > 150000) {
    const t2 = Math.min(taxableValue - 150000, 150000);
    frt += t2 * 0.86;
  }
  if (taxableValue > 300000) {
    const t3 = Math.min(taxableValue - 300000, 200000);
    frt += t3 * 1.15;
  }
  if (taxableValue > 500000) {
    frt += (taxableValue - 500000) * 1.32;
  }
  return Math.round(frt);
}

// FRT deregistration rebate (sliding scale)
// Full rebate for cars 0–3 years old, tapers to 0 at ~10 years
function calcFRTRebate(frt, yearsOld) {
  if (yearsOld <= 0 || frt <= 0) return 0;
  // Approximate rebate schedule (based on TD sliding scale)
  const rebateFactors = {
    0: 1.00, 1: 0.90, 2: 0.80, 3: 0.70,
    4: 0.55, 5: 0.40, 6: 0.30, 7: 0.20,
    8: 0.10, 9: 0.05, 10: 0.00
  };
  const factor = rebateFactors[Math.min(yearsOld, 10)] || 0;
  return Math.round(frt * factor);
}

function fmt(n) {
  return "HK$" + Math.round(n).toLocaleString("en-HK");
}

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
  const [regYear, setRegYear] = useState("");

  const currentYear = new Date().getFullYear();
  const tvNum = parseFloat(taxableValue) || 0;
  const yearsOld = regYear ? currentYear - parseInt(regYear) : null;

  const results = useMemo(() => {
    if (tvNum <= 0) return null;
    if (vehicleType === "ev") {
      // EV: potentially full FRT exemption under One-for-One scheme
      const frtIfNoExemption = calcFRT(tvNum);
      const totalWithoutExemption = tvNum + frtIfNoExemption;
      return { isEV: true, frtIfNoExemption, totalWithoutExemption, taxableValue: tvNum };
    }
    const frt = calcFRT(tvNum);
    const totalOnRoad = tvNum + frt;
    const frtRate = tvNum > 0 ? Math.round((frt / tvNum) * 100) : 0;
    const rebate = yearsOld !== null ? calcFRTRebate(frt, yearsOld) : null;
    return { isEV: false, frt, totalOnRoad, frtRate, rebate, yearsOld, taxableValue: tvNum };
  }, [tvNum, vehicleType, yearsOld]);

  // Show FRT band breakdown
  const bandBreakdown = useMemo(() => {
    if (tvNum <= 0) return [];
    const bands = [];
    const t1 = Math.min(tvNum, 150000);
    bands.push({ range: "First HK$150,000", rate: "46%", tax: Math.round(t1 * 0.46), applicable: tvNum > 0 });
    if (tvNum > 150000) {
      const t2 = Math.min(tvNum - 150000, 150000);
      bands.push({ range: "Next HK$150,000", rate: "86%", tax: Math.round(t2 * 0.86), applicable: true });
    }
    if (tvNum > 300000) {
      const t3 = Math.min(tvNum - 300000, 200000);
      bands.push({ range: "Next HK$200,000", rate: "115%", tax: Math.round(t3 * 1.15), applicable: true });
    }
    if (tvNum > 500000) {
      bands.push({ range: "Remainder", rate: "132%", tax: Math.round((tvNum - 500000) * 1.32), applicable: true });
    }
    return bands;
  }, [tvNum]);

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
        FRT On-Road Price Calculator
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Enter a vehicle's taxable value to see how much First Registration Tax applies and what the total on-road price will be. Results update as you type.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* Taxable value */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Vehicle Taxable Value
            <Tooltip text="This is the Open Market Value as assessed by the Transport Department — not necessarily the purchase price or the sticker price at the dealer." />
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
            <Tooltip text="Electric vehicles may qualify for full FRT exemption under the One-for-One Replacement Scheme. Eligibility conditions apply — check the EMSD website." />
          </label>
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} style={inputStyle}>
            <option value="ice">Petrol / Diesel (ICE)</option>
            <option value="ev">Electric Vehicle (EV)</option>
          </select>
        </div>

        {/* Year of first registration (used cars) */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Year of First Registration (optional)
            <Tooltip text="For used vehicles — enter the original registration year to estimate the FRT deregistration rebate you'd receive when you eventually sell or scrap the car." />
          </label>
          <select value={regYear} onChange={e => setRegYear(e.target.value)} style={inputStyle}>
            <option value="">Not applicable / New car</option>
            {Array.from({ length: 15 }, (_, i) => currentYear - i).map(yr => (
              <option key={yr} value={yr}>{yr} ({currentYear - yr} yr old)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {results && (
        results.isEV ? (
          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 24, border: "1px solid #86efac" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#15803d", marginBottom: 12 }}>
              Electric Vehicle — FRT Exemption May Apply
            </h3>
            <p style={{ fontSize: 14, color: "#374151", marginBottom: 16, lineHeight: 1.6 }}>
              Under the <strong>One-for-One Replacement Scheme</strong>, electric vehicles can qualify for a <strong>full FRT exemption</strong>, which would reduce the on-road price from {fmt(results.totalWithoutExemption)} to {fmt(results.taxableValue)} — a saving of <strong>{fmt(results.frtIfNoExemption)}</strong>.
            </p>
            <div style={{ background: "#fff", borderRadius: 8, padding: 16, border: "1px solid #d1fae5", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#374151" }}>FRT if no exemption</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#dc2626" }}>{fmt(results.frtIfNoExemption)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#374151" }}>FRT with full exemption</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#15803d" }}>HK$0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#374151" }}>Total on-road (with exemption)</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#15803d" }}>{fmt(results.taxableValue)}</span>
              </div>
            </div>
            <div style={{ background: "#fffbeb", borderRadius: 8, padding: 12, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Important:</strong> Eligibility requires scrapping an existing registered vehicle. The scheme has been adjusted multiple times by the government — always verify current rules at the{" "}
              <a href="https://www.emsd.gov.hk" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>EMSD website</a> before purchasing.
            </div>
            <div style={{ marginTop: 16 }}>
              <Link to="/hong-kong/ev-guide" style={{ fontSize: 13, color: "#15803d", textDecoration: "none", fontWeight: 600 }}>
                Full EV guide for Hong Kong — One-for-One explained →
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
              tooltip="The Open Market Value as assessed by the Transport Department."
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

            {/* Rebate if registration year provided */}
            {results.rebate !== null && (
              <div style={{ marginTop: 20, background: "#eff6ff", borderRadius: 8, padding: 16, border: "1px solid #bfdbfe" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 8 }}>
                  Estimated Deregistration FRT Rebate
                </h4>
                <p style={{ fontSize: 13, color: "#374151", marginBottom: 8, lineHeight: 1.6 }}>
                  If this car was first registered in <strong>{regYear}</strong> ({results.yearsOld} years ago), you'd receive an estimated <strong>{fmt(results.rebate)}</strong> FRT rebate when deregistering — based on the Transport Department's sliding scale.
                </p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>
                  Rebate reduces to zero at approximately 10 years old. Actual amount confirmed by TD at deregistration.
                </p>
              </div>
            )}

            <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, marginTop: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> These estimates are based on the published FRT band schedule. The actual taxable value is determined by the Transport Department and may differ from the dealer's asking price. Verify with the <a href="https://www.td.gov.hk" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>Transport Department</a> before purchasing.
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
  IN: { country: "India", result: "test", note: "Must pass Hong Kong driving test. Theory and practical required at a TD licensing office." },
  CN: { country: "China (Mainland)", result: "test", note: "Mainland China driving licence does not convert directly — must sit HK driving test. Theory and practical tests required." },
  PH: { country: "Philippines", result: "test", note: "Must pass HK driving test. Theory and practical tests required." },
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
        Most Western nationalities can convert directly — no driving test required. A vision test is required at the Transport Department for all conversions. Check your country below.
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
                <strong>What to bring:</strong> HKID card, original foreign licence (valid), proof of HK address, 2 passport photos. Visit a TD licensing office — no appointment needed for conversion.
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#92400e", background: "#fffbeb", borderRadius: 6, padding: "8px 12px" }}>
                <strong>Note:</strong> A vision test is required at the Transport Department licensing office for all licence conversions — bring glasses or contacts if you wear them.
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
  { id: "frt", label: "FRT Calculator" },
  { id: "lease", label: "Lease Estimator" },
  { id: "buyvslease", label: "Buy vs Lease" },
  { id: "licence", label: "Licence Eligibility" },
];

const relatedLinks = [
  { to: "/hong-kong/frt-tax-explained", label: "FRT Explained" },
  { to: "/hong-kong/leasing-guide", label: "Leasing Guide" },
  { to: "/hong-kong/buying-guide", label: "Buying Guide" },
  { to: "/hong-kong/should-i-get-a-car", label: "Should I Get a Car?" },
];

const HERO_IMG = "https://images.unsplash.com/photo-1542189412744-bfabf27522ee?w=1200&q=80";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("frt");

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
          Hong Kong Car Calculators &amp; Tools
        </h1>
        <p style={{ color: "#4b5563", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
          Four tools to work out the full FRT cost, compare leasing vs buying, estimate lease costs, and check if your foreign licence converts directly in Hong Kong.
        </p>

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

        {/* Affiliate Box */}
        {/* TODO(affiliate): re-enable when partner URLs are live */}
        {/*
        <AffiliateBox
          city="hk"
          type="insurance"
          title="Ready to get insured? Compare Hong Kong car insurance"
          partners={[
            { name: 'AXA Hong Kong', badge: 'Popular with expats', desc: 'English-language service, easy overseas NCD recognition, flexible workshop choice.', url: '#' },
            { name: 'Zurich Insurance HK', desc: 'Strong expat reputation. Competitive premiums. Trusted claims process.', url: '#' },
            { name: 'Compare.com.hk', desc: 'Compare multiple HK car insurers in one place. Free, instant quotes.', url: '#' },
          ]}
        />
        */}

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
