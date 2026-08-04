import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import AffiliateBox from "../../components/AffiliateBox";
import EmailCapture from "../../components/EmailCapture";

/* ─── Singapore Calculators Page ─────────────────────────────────────────── */

// ── COE On-Road Price Calculator helpers ──────────────────────────────────
function calcARF(omv) {
  // ARF: 100% of first S$20k, 140% of next S$30k, 180% above S$50k
  if (omv <= 0) return 0;
  let arf = 0;
  const tier1 = Math.min(omv, 20000);
  arf += tier1 * 1.0;
  if (omv > 20000) {
    const tier2 = Math.min(omv - 20000, 30000);
    arf += tier2 * 1.4;
  }
  if (omv > 50000) {
    arf += (omv - 50000) * 1.8;
  }
  return Math.round(arf);
}

function calcMonthlyPayment(principal, annualRatePercent, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

function fmt(n) {
  return "S$" + Math.round(n).toLocaleString("en-SG");
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
          borderRadius: 6, whiteSpace: "nowrap", maxWidth: 240, lineHeight: 1.5,
          zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", textAlign: "left"
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

// ── Row component for results breakdown ─────────────────────────────────
function ResultRow({ label, value, tooltip, highlight }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid #f3f4f6",
      background: highlight ? "#fffbeb" : "transparent",
      borderRadius: highlight ? 6 : 0,
      paddingLeft: highlight ? 8 : 0, paddingRight: highlight ? 8 : 0,
    }}>
      <span style={{ fontSize: 14, color: highlight ? "#92400e" : "#374151", fontWeight: highlight ? 700 : 400 }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      <span style={{ fontSize: highlight ? 18 : 14, fontWeight: highlight ? 700 : 600, color: highlight ? "#92400e" : "#111827" }}>
        {value}
      </span>
    </div>
  );
}

// ── COE On-Road Price Calculator ─────────────────────────────────────────
function COECalculator() {
  const [omv, setOmv] = useState("");
  const [coeCategory, setCoeCategory] = useState("A");
  const [coePremium, setCoePremium] = useState(108000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(2.5);
  const [downPctInput, setDownPctInput] = useState(30);

  const COE_DEFAULTS = { A: 108000, B: 114000, E: 115000 };

  const handleCategoryChange = (cat) => {
    setCoeCategory(cat);
    setCoePremium(COE_DEFAULTS[cat]);
  };

  const omvNum = parseFloat(omv) || 0;
  const coeNum = parseFloat(coePremium) || 0;
  const tenureMonths = parseInt(loanTenure) * 12;
  const rateNum = parseFloat(interestRate) || 2.5;
  const downPct = parseFloat(downPctInput) || 30;

  const results = useMemo(() => {
    if (omvNum <= 0) return null;
    const arf = calcARF(omvNum);
    const exciseDuty = Math.round(omvNum * 0.20);
    const gst = Math.round((omvNum + exciseDuty) * 0.09);
    const regFee = 220;
    const total = omvNum + coeNum + arf + exciseDuty + gst + regFee;
    // LTV rules: max 70% if OMV ≤ 20k, max 60% if OMV > 20k
    const maxLtv = omvNum <= 20000 ? 0.70 : 0.60;
    const minDown = total * (1 - maxLtv);
    const actualDownPct = Math.max(downPct / 100, 1 - maxLtv);
    const loanAmount = total * (1 - actualDownPct);
    const monthlyPayment = calcMonthlyPayment(loanAmount, rateNum, tenureMonths);
    const downPayment = total * actualDownPct;
    return { arf, exciseDuty, gst, regFee, total, loanAmount, monthlyPayment, downPayment, maxLtv, minDown };
  }, [omvNum, coeNum, tenureMonths, rateNum, downPct]);

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
        COE On-Road Price Calculator
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        Enter your car's OMV and the current COE premium to see the full breakdown of what you'll actually pay. Results update as you type.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* OMV */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Car Open Market Value (OMV)
            <Tooltip text="OMV is set by Singapore Customs — usually much lower than the purchase price. Your dealer can confirm it." />
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>S$</span>
            <input
              type="number"
              placeholder="e.g. 18000"
              value={omv}
              onChange={e => setOmv(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>
        </div>

        {/* COE Category */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            COE Category
            <Tooltip text="Cat A: cars ≤1,600cc or ≤130bhp. Cat B: cars >1,600cc or >130bhp. Cat E: open category (any vehicle, typically more expensive)." />
          </label>
          <select value={coeCategory} onChange={e => handleCategoryChange(e.target.value)} style={inputStyle}>
            <option value="A">Category A (≤1,600cc / ≤130bhp)</option>
            <option value="B">Category B (&gt;1,600cc / &gt;130bhp)</option>
            <option value="E">Category E (Open)</option>
          </select>
        </div>

        {/* COE Premium */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Current COE Premium
            <Tooltip text="Pre-filled with approximate current figures. Update to the latest from the LTA website for accuracy — it changes fortnightly." />
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>S$</span>
            <input
              type="number"
              value={coePremium}
              onChange={e => setCoePremium(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
            ⚡ Update from <a href="https://www.lta.gov.sg/content/ltagov/en/motoring/owning_a_vehicle/coe_open_bidding.html" target="_blank" rel="noopener noreferrer" style={{ color: "#dc2626" }}>LTA website</a> for latest figures
          </p>
        </div>

        {/* Loan Tenure */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Loan Tenure
            <Tooltip text="Maximum loan tenure in Singapore is 7 years. Shorter tenure = higher monthly payment but less total interest." />
          </label>
          <select value={loanTenure} onChange={e => setLoanTenure(e.target.value)} style={inputStyle}>
            {[1,2,3,4,5,6,7].map(y => (
              <option key={y} value={y}>{y} {y === 1 ? "year" : "years"}</option>
            ))}
          </select>
        </div>

        {/* Interest Rate */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Interest Rate (% p.a.)
            <Tooltip text="Typical Singapore car loan rates range from 2.28% to 3.5% per annum. Check with your bank or dealer for current rates." />
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              style={{ ...inputStyle, paddingRight: 32 }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>%</span>
          </div>
        </div>

        {/* Down Payment */}
        <div style={groupStyle}>
          <label style={labelStyle}>
            Down Payment
            <Tooltip text="Minimum down payment is 30% if OMV ≤ S$20,000, or 40% if OMV > S$20,000 — Singapore's LTV rules. You can pay more upfront." />
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              step="5"
              min={omvNum > 20000 ? 40 : 30}
              max={100}
              value={downPctInput}
              onChange={e => setDownPctInput(e.target.value)}
              style={{ ...inputStyle, paddingRight: 32 }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 14 }}>%</span>
          </div>
          {omvNum > 20000 && (
            <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
              Minimum 40% for cars with OMV &gt; S$20,000
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div style={{ background: "#f9fafb", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 16 }}>
            Cost Breakdown
          </h3>
          <ResultRow label="Open Market Value (OMV)" value={fmt(omvNum)} tooltip="The base value as assessed by Singapore Customs." />
          <ResultRow label="COE Premium" value={fmt(coeNum)} tooltip={`Current Cat ${coeCategory} COE premium — changes every fortnight.`} />
          <ResultRow label="Additional Registration Fee (ARF)" value={fmt(results.arf)} tooltip="A tiered tax on the OMV: 100% of first S$20k, 140% of next S$30k, 180% above S$50k." />
          <ResultRow label="Excise Duty" value={fmt(results.exciseDuty)} tooltip="20% of OMV. Applied to all cars regardless of category." />
          <ResultRow label="GST (9%)" value={fmt(results.gst)} tooltip="Goods and Services Tax applied to OMV + excise duty." />
          <ResultRow label="Registration Fee" value={fmt(results.regFee)} tooltip="Flat administrative fee of S$220 for all new vehicle registrations." />

          <div style={{ borderTop: "2px solid #e5e7eb", marginTop: 8, paddingTop: 8 }}>
            <ResultRow
              label="Total On-Road Price"
              value={fmt(results.total)}
              highlight={true}
              tooltip="Everything you pay to put the car on the road — before any optional extras or dealer margins."
            />
          </div>

          <div style={{ marginTop: 20, background: "#eff6ff", borderRadius: 8, padding: 16, border: "1px solid #bfdbfe" }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 12 }}>
              If You Finance This Car
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Down Payment ({Math.round(Math.max(downPct, omvNum > 20000 ? 40 : 30))}%)</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e40af" }}>{fmt(results.downPayment)}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Monthly Payment ({loanTenure} yr @ {interestRate}%)</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e40af" }}>{fmt(results.monthlyPayment)}/mo</div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#6b7280", marginTop: 12, textAlign: "center" }}>
              Loan amount: {fmt(results.loanAmount)} over {loanTenure * 12} months
            </p>
          </div>

          <div style={{ background: "#fef3c7", borderRadius: 8, padding: 12, marginTop: 16, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> These are estimates only. Final costs depend on the actual COE premium at your bidding exercise and your specific vehicle's OMV. Dealer margins, optional extras, and insurance are not included. Always verify with your dealer and the <a href="https://www.lta.gov.sg" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>LTA</a>.
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/singapore/leasing-guide" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
              Not sure whether to buy or lease? → Leasing Guide
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Lease Cost Estimator ──────────────────────────────────────────────────
const LEASE_DATA = {
  economy: { min: 1400, max: 1800, examples: "Toyota Vios, Honda Jazz, Mitsubishi Attrage", included: ["Comprehensive insurance","Road tax","Routine servicing","24/7 roadside assist"] },
  midrange: { min: 2000, max: 3000, examples: "Toyota Camry, Mazda CX-5, Honda CR-V", included: ["Comprehensive insurance","Road tax","Routine servicing","Tyres","24/7 roadside assist"] },
  premium: { min: 3200, max: 5000, examples: "BMW 3-Series, Mercedes C-Class, Audi A4", included: ["Comprehensive insurance","Road tax","Full servicing","Tyres","Loan car","24/7 roadside assist"] },
};

function LeaseCostEstimator() {
  const [category, setCategory] = useState("midrange");
  const [duration, setDuration] = useState("36");

  const data = LEASE_DATA[category];
  const durationNum = parseInt(duration);
  const discount = durationNum >= 36 ? 0.95 : durationNum >= 24 ? 0.97 : 1.0;
  const minCost = Math.round(data.min * discount);
  const maxCost = Math.round(data.max * discount);

  const labels = { economy: "Economy", midrange: "Mid-range", premium: "Premium/Luxury" };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Lease Cost Estimator</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Select a car category and lease duration to see typical monthly costs for a full-service lease in Singapore.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Car Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            <option value="economy">Economy</option>
            <option value="midrange">Mid-range</option>
            <option value="premium">Premium / Luxury</option>
          </select>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>e.g. {data.examples}</p>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Lease Duration</label>
          <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
          </select>
        </div>
      </div>

      <div style={{ background: "#f9fafb", borderRadius: 12, padding: 24, border: "1px solid #e5e7eb" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Typical monthly cost — {labels[category]}, {duration}-month lease</p>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e" }}>
            S${minCost.toLocaleString()} – S${maxCost.toLocaleString()}
            <span style={{ fontSize: 14, fontWeight: 400, color: "#6b7280" }}>/month</span>
          </div>
          {durationNum >= 36 && <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✓ Longer-term discount applied</p>}
        </div>

        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Typically included in a full-service lease:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.included.map(item => (
              <li key={item} style={{ fontSize: 13, color: "#374151", padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 12 }}>
            Typically <em>not</em> included: excess mileage charges, accident damage excess, additional drivers, ERP/parking.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/singapore/leasing-guide" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
          Read the full leasing guide — what to negotiate, which companies to use →
        </Link>
      </div>
    </div>
  );
}

// ── COE Buy vs Lease Comparison ──────────────────────────────────────────
function COEBuyVsLease() {
  const [omv, setOmv] = useState("");
  const [coePremium, setCoePremium] = useState(108000);
  const [leaseMonthly, setLeaseMonthly] = useState(2500);
  const [years, setYears] = useState(3);

  const omvNum = parseFloat(omv) || 0;
  const coeNum = parseFloat(coePremium) || 0;

  const results = useMemo(() => {
    if (omvNum <= 0) return null;
    const arf = calcARF(omvNum);
    const exciseDuty = Math.round(omvNum * 0.20);
    const gst = Math.round((omvNum + exciseDuty) * 0.09);
    const totalOnRoad = omvNum + coeNum + arf + exciseDuty + gst + 220;

    // Assume resale at (total - 10-year depreciation proportional to years driven)
    // Simple straight-line depreciation over 10 years (COE life)
    const yearlyDepreciation = totalOnRoad / 10;
    const resaleValue = Math.max(0, totalOnRoad - (yearlyDepreciation * years));
    const netCostBuy = totalOnRoad - resaleValue;

    // Add insurance (~S$2,000/yr) + road tax (~S$742/yr) + maintenance (~S$1,500/yr)
    const annualRunning = 2000 + 742 + 1500;
    const totalCostBuy = netCostBuy + (annualRunning * years);
    const totalCostLease = leaseMonthly * 12 * years;

    return { totalOnRoad, resaleValue, netCostBuy, totalCostBuy, totalCostLease, monthlyBuyEquiv: Math.round(totalCostBuy / (years * 12)) };
  }, [omvNum, coeNum, leaseMonthly, years]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Buy vs Lease Comparison</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Compare the total cost of buying and selling vs leasing over your expected time in Singapore. Buying rarely wins on a short posting.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Car OMV (S$)</label>
          <input type="number" placeholder="e.g. 18000" value={omv} onChange={e => setOmv(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>COE Premium (S$)</label>
          <input type="number" value={coePremium} onChange={e => setCoePremium(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Lease Monthly (S$)</label>
          <input type="number" value={leaseMonthly} onChange={e => setLeaseMonthly(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, boxSizing: "border-box" }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Years in Singapore</label>
          <select value={years} onChange={e => setYears(parseInt(e.target.value))}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(y => <option key={y} value={y}>{y} {y===1?"year":"years"}</option>)}
          </select>
        </div>
      </div>

      {results && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 20, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 16 }}>🚗 Buying</h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Total on-road price</span>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(results.totalOnRoad)}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Estimated resale after {years} yr</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>+{fmt(results.resaleValue)}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Running costs ({years} yr)</span>
              <div style={{ fontSize: 14, color: "#374151" }}>ins + road tax + servicing</div>
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
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>No COE risk</span>
              <div style={{ fontSize: 13, color: "#16a34a" }}>✓ Fixed cost, walk away at end</div>
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 12, paddingTop: 12 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Total cost over {years} yr</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>{fmt(results.totalCostLease)}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{fmt(leaseMonthly)}/month all-in</div>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            {results.totalCostBuy < results.totalCostLease ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: 14, fontSize: 13, color: "#15803d" }}>
                <strong>Buying is cheaper</strong> by {fmt(results.totalCostLease - results.totalCostBuy)} over {years} years — but carries COE resale risk if prices drop before you sell.
              </div>
            ) : (
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 14, fontSize: 13, color: "#9a3412" }}>
                <strong>Leasing is cheaper</strong> by {fmt(results.totalCostBuy - results.totalCostLease)} over {years} years — and you carry no COE or resale risk.
              </div>
            )}
          </div>
        </div>
      )}
      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, lineHeight: 1.6 }}>
        Estimates only. Resale value uses straight-line depreciation over 10-year COE life. Actual resale depends on COE prices at time of sale. Running costs are illustrative averages.
      </p>
    </div>
  );
}

// ── Licence Eligibility Checker ──────────────────────────────────────────
const LICENCE_DATA = {
  UK: { country: "United Kingdom", result: "direct", note: "Convert directly at Traffic Police — no test required. Book via OneMotoring." },
  AU: { country: "Australia", result: "direct", note: "Convert directly. Bring original licence, passport, pass, and 2 photos." },
  NZ: { country: "New Zealand", result: "direct", note: "Convert directly. Same process as Australian licence." },
  US: { country: "United States", result: "direct", note: "Convert directly. State licence accepted — international driving permit not required." },
  CA: { country: "Canada", result: "direct", note: "Convert directly. Provincial licence accepted." },
  IE: { country: "Ireland", result: "direct", note: "Convert directly. EU licences accepted." },
  DE: { country: "Germany", result: "direct", note: "Convert directly — EU licence." },
  FR: { country: "France", result: "direct", note: "Convert directly — EU licence." },
  NL: { country: "Netherlands", result: "direct", note: "Convert directly — EU licence." },
  SE: { country: "Sweden", result: "direct", note: "Convert directly — EU licence." },
  JP: { country: "Japan", result: "direct", note: "Convert directly. Must include official translation if not in English." },
  IN: { country: "India", result: "test", note: "Must pass Singapore driving test. Theory and practical required." },
  CN: { country: "China", result: "test", note: "Must pass Singapore driving test. Theory and practical required." },
  PH: { country: "Philippines", result: "test", note: "Must pass Singapore driving test. Theory and practical required." },
  ID: { country: "Indonesia", result: "test", note: "Must pass Singapore driving test. Theory and practical required." },
};

function LicenceChecker() {
  const [country, setCountry] = useState("");
  const selected = LICENCE_DATA[country];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>Licence Eligibility Checker</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
        Direct conversion without any test is only available for specific approved countries. Select yours below — if it's not listed, Singapore's full driving test applies.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Your current licence country</label>
        <select value={country} onChange={e => setCountry(e.target.value)}
          style={{ width: "100%", maxWidth: 360, padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}>
          <option value="">Select a country...</option>
          {Object.entries(LICENCE_DATA).map(([code, d]) => (
            <option key={code} value={code}>{d.country}</option>
          ))}
          <option value="OTHER">Other country</option>
        </select>
      </div>

      {country === "OTHER" ? (
        <div style={{ background: "#fef3c7", borderRadius: 12, padding: 20, border: "1px solid #fcd34d" }}>
          <p style={{ fontSize: 14, color: "#92400e", margin: 0 }}>
            Your country isn't in our list. Check the <a href="https://onemotoring.lta.gov.sg" target="_blank" rel="noopener noreferrer" style={{ color: "#92400e" }}>LTA's OneMotoring website</a> for the full current list of recognised countries. If your country isn't listed, you'll need to sit the Singapore driving test.
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
                <strong>What to bring:</strong> Passport, valid work/dependent pass, original foreign licence, 2 passport photos, ~S$50 fee. Book at <a href="https://onemotoring.lta.gov.sg" target="_blank" rel="noopener noreferrer" style={{ color: "#15803d" }}>OneMotoring</a>.
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#92400e", background: "#fffbeb", borderRadius: 6, padding: "8px 12px" }}>
                <strong>Note:</strong> A basic vision test is conducted at the Traffic Police counter during conversion. Bring glasses or contacts if you wear them.
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <Link to="/singapore/licence-conversion" style={{ fontSize: 13, color: "#dc2626", textDecoration: "none", fontWeight: 600 }}>
          Full guide to licence conversion in Singapore →
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "onroad", label: "On-Road Price" },
  { id: "lease", label: "Lease Estimator" },
  { id: "buyvslease", label: "Buy vs Lease" },
  { id: "licence", label: "Licence Eligibility" },
];

const relatedLinks = [
  { to: "/singapore/leasing-guide", label: "Leasing Guide" },
  { to: "/singapore/buying-guide", label: "Buying Guide" },
  { to: "/singapore/insurance-guide", label: "Insurance" },
  { to: "/singapore/should-i-get-a-car", label: "Should I Get a Car?" },
];

const HERO_IMG = "https://images.unsplash.com/photo-1697438167040-ccfd469c40f2?w=1200&q=80";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("onroad");

  return (
    <Layout city="singapore" relatedLinks={relatedLinks}>
      <div style={{ width: "100%", height: "clamp(220px,35vw,520px)", overflow: "hidden", borderRadius: 12, marginBottom: 32, position: "relative" }}>
        <img src={HERO_IMG} alt="Cost calculator Singapore" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.35) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 24 }}>
          <span style={{ background: "#e63946", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 6 }}>Singapore</span>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Singapore
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>
          Singapore Car Calculators &amp; Tools
        </h1>
        <p style={{ color: "#4b5563", fontSize: 16, marginBottom: 32, lineHeight: 1.7 }}>
          Four tools to work out the full on-road price, compare leasing vs buying, estimate lease costs, and check if your foreign licence converts directly.
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
          {activeTab === "onroad" && <COECalculator />}
          {activeTab === "lease" && <LeaseCostEstimator />}
          {activeTab === "buyvslease" && <COEBuyVsLease />}
          {activeTab === "licence" && <LicenceChecker />}
        </div>

        {/* Affiliate Box */}
        <AffiliateBox
          city="sg"
          type="insurance"
          title="Ready to get insured? Compare Singapore car insurance"
          partners={[
            { name: 'SingSaver — Compare All Insurers', badge: 'Compare', desc: 'Quotes from the main expat-friendly Singapore insurers (NTUC Income, AIG, FWD, Direct Asia) side-by-side. Free, takes 2 minutes.', url: 'https://apply.creatory.singsaver.com.sg/click?o=680&a=3247&s2=eaa-sg-calculators' },
          ]}
        />

        {/* Email CTA */}
        <EmailCapture
          city="sg"
          source="sg-calculators"
          guideTopic="calculator"
          title="📋 Get the free Singapore Car Buyer Checklist"
          subtitle="COE bidding explained, the 10-year ownership cost framework, insurance must-haves, and a 10-item pre-purchase checklist — everything in one PDF."
          buttonText="Send me the checklist →"
        />
      </div>
    </Layout>
  );
}
