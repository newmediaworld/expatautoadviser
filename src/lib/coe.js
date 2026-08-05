/**
 * Singapore new-car on-road price arithmetic.
 *
 * Single source of truth for the sums used by
 *   /singapore/car-on-road-price-calculator  (the dedicated tool page)
 *   /singapore/calculators                   (the lease-vs-buy tools page)
 *
 * Do NOT duplicate this maths anywhere else — import it. The Hong Kong pair of
 * calculators drifted apart once already; this module exists so the Singapore
 * pair can't.
 *
 * ─── EVERY FIGURE BELOW WAS VERIFIED ON 5 AUGUST 2026 ──────────────────────
 *
 * ARF, excise duty, GST, registration fee, VES, EEAI and PARF:
 *   LTA / OneMotoring, "Vehicle Tax Structure"
 *   https://onemotoring.lta.gov.sg/content/onemotoring/home/buying/upfront-vehicle-costs/tax-structure.html
 *   (page last updated 30 January 2026)
 *
 * COE quota premiums:
 *   LTA, "COE Bidding Results 2026" (M11-COE_Results_2025_2026.pdf, generated 23/07/2026)
 *   https://www.lta.gov.sg/content/dam/ltagov/who_we_are/statistics_and_publications/statistics/pdf/M11-COE_Results_2025_2026.pdf
 *
 * Loan-to-value and tenure limits:
 *   MAS, "Rules for Motor Vehicle Loans"
 *   https://www.mas.gov.sg/regulation/explainers/motor-vehicle-loans
 *
 * The arithmetic here reproduces LTA's own published per-model figures exactly.
 * Cross-checked against the LTA Car Cost Update for cars registered June 2026
 * (M032-Car_Cost_Update.pdf) — see WORKED_EXAMPLES in
 * src/pages/singapore/OnRoadPriceCalculator.jsx.
 * ────────────────────────────────────────────────────────────────────────── */

/* ── ARF ──────────────────────────────────────────────────────────────────
   Tiered Additional Registration Fee, charged on the vehicle's Open Market
   Value. This schedule applies to all cars registered with COEs obtained from
   the SECOND bidding exercise of February 2023 onwards (and to COE-exempt cars
   registered on or after 15 February 2023). It is marginal: each rate bites
   only on the slice of OMV inside its band.

   The pre-2023 schedule (100% / 140% on the next $30,000 / 180% / 220%) is
   obsolete for anyone buying a car today. It should not appear anywhere on
   the site. */
export const ARF_BANDS = [
  { label: 'First S$20,000', from: 0, to: 20000, rate: 1.0 },
  { label: 'Next S$20,000 (S$20,001–S$40,000)', from: 20000, to: 40000, rate: 1.4 },
  { label: 'Next S$20,000 (S$40,001–S$60,000)', from: 40000, to: 60000, rate: 1.9 },
  { label: 'Next S$20,000 (S$60,001–S$80,000)', from: 60000, to: 80000, rate: 2.5 },
  { label: 'Above S$80,000', from: 80000, to: Infinity, rate: 3.2 },
];

/** Short band labels, for tight table cells. */
export const ARF_BAND_SHORT_LABELS = [
  'First S$20,000',
  'Next S$20,000',
  'Next S$20,000',
  'Next S$20,000',
  'Above S$80,000',
];

/* ── Flat rates and fees ─────────────────────────────────────────────────── */

/** Excise duty: 20% of OMV, on every car. */
export const EXCISE_DUTY_RATE = 0.2;

/** GST: 9% since 1 January 2024, charged on (OMV + excise duty). */
export const GST_RATE = 0.09;

/** Vehicle registration fee for a car. S$350 — not S$220, which is long stale. */
export const REGISTRATION_FEE = 350;

/** Surcharge on imported used cars (which must be under 3 years old). */
export const USED_IMPORT_SURCHARGE = 10000;

/* ── VES ──────────────────────────────────────────────────────────────────
   Vehicular Emissions Scheme, 1 January 2026 to 31 December 2027. From
   1 January 2026 the old A1/A2/B/C1/C2 structure was replaced by A/B/C1/C2/C3,
   and only fully electric cars receive a rebate — hybrids no longer do.
   Amounts are applied against the ARF. Negative = rebate. */
export const VES_BANDS_2026 = [
  { band: 'A', amount: -22500, co2: 'CO₂ ≤ 90 g/km', note: 'In practice, fully electric cars only' },
  { band: 'B', amount: 0, co2: '90 < CO₂ ≤ 120 g/km', note: 'Neutral — no rebate, no surcharge' },
  { band: 'C1', amount: 7500, co2: '120 < CO₂ ≤ 159 g/km', note: 'Most efficient petrol and petrol-hybrid' },
  { band: 'C2', amount: 22500, co2: '159 < CO₂ ≤ 182 g/km', note: 'Larger petrol SUVs and saloons' },
  { band: 'C3', amount: 35000, co2: 'CO₂ > 182 g/km', note: 'Most pollutive — large-engine petrol' },
];

/** The same bands as they will stand in 2027, for anyone planning ahead. */
export const VES_BANDS_2027 = { A: -20000, B: 0, C1: 15000, C2: 30000, C3: 45000 };

/** Minimum ARF after VES/EEAI rebates. S$0 for fully electric cars to 31 Dec 2027. */
export const MIN_ARF_STANDARD = 5000;
export const MIN_ARF_ELECTRIC = 0;

/* ── EEAI ─────────────────────────────────────────────────────────────────
   EV Early Adoption Incentive. 45% off the ARF, capped. The cap fell to
   S$7,500 for cars registered during 2026 (it was S$15,000 in 2024–25), and
   the scheme ceases entirely on 1 January 2027. */
export const EEAI_RATE = 0.45;
export const EEAI_CAP_2026 = 7500;

/* ── PARF ─────────────────────────────────────────────────────────────────
   Preferential Additional Registration Fee — the slice of ARF you get back if
   you deregister the car before it turns 10.

   This was cut hard in February 2026. Cars registered with COEs from the
   SECOND February 2026 bidding exercise onwards get 30% of ARF at best,
   capped at S$30,000. The old 75%/S$60,000 schedule still governs cars
   registered between 15 February 2023 and 12 February 2026 — which matters
   when valuing a used car, but not when pricing a new one. */
export const PARF_CURRENT = {
  label: 'Cars registered with COEs from the 2nd February 2026 bidding onwards',
  cap: 30000,
  schedule: [
    { age: 'Not more than 5 years', pct: 0.3 },
    { age: 'Above 5 but not more than 6 years', pct: 0.25 },
    { age: 'Above 6 but not more than 7 years', pct: 0.2 },
    { age: 'Above 7 but not more than 8 years', pct: 0.15 },
    { age: 'Above 8 but not more than 9 years', pct: 0.1 },
    { age: 'Above 9 but not more than 10 years', pct: 0.05 },
    { age: 'More than 10 years', pct: 0 },
  ],
};

export const PARF_PREVIOUS = {
  label: 'Cars registered 15 February 2023 to 12 February 2026',
  cap: 60000,
  schedule: [
    { age: 'Not more than 5 years', pct: 0.75 },
    { age: 'Above 5 but not more than 6 years', pct: 0.7 },
    { age: 'Above 6 but not more than 7 years', pct: 0.65 },
    { age: 'Above 7 but not more than 8 years', pct: 0.6 },
    { age: 'Above 8 but not more than 9 years', pct: 0.55 },
    { age: 'Above 9 but not more than 10 years', pct: 0.5 },
    { age: 'More than 10 years', pct: 0 },
  ],
};

/* ── COE ──────────────────────────────────────────────────────────────────
   Premiums move every fortnight, so nothing here is presented as "the current
   price". The figures below are a single, dated bidding exercise, used only as
   the starting value in the calculator's input box. The user is expected to
   replace them with the exercise that actually applies to their purchase. */
export const COE_REFERENCE = {
  exercise: 'July 2026, 2nd bidding exercise',
  closed: '22 July 2026',
  source: 'https://www.lta.gov.sg/content/dam/ltagov/who_we_are/statistics_and_publications/statistics/pdf/M11-COE_Results_2025_2026.pdf',
  premiums: { A: 126000, B: 129890, E: 129971 },
};

export const COE_CATEGORIES = [
  {
    id: 'A',
    label: 'Category A',
    definition: 'Cars up to 1,600cc and 97kW (130bhp). Fully electric cars up to 110kW (147bhp).',
  },
  {
    id: 'B',
    label: 'Category B',
    definition: 'Cars above 1,600cc or above 97kW. Fully electric cars above 110kW.',
  },
  {
    id: 'E',
    label: 'Category E (Open)',
    definition: 'Open category — bid for any vehicle type except motorcycles. In practice used for cars, and usually the dearest.',
  },
];

/* ── Loan rules ───────────────────────────────────────────────────────────
   MAS caps the loan-to-value ratio on a motor vehicle loan by the car's OMV,
   and the tenure at 7 years. */
export const MAX_LOAN_TENURE_YEARS = 7;
export const LTV_OMV_THRESHOLD = 20000;
export const LTV_LOW_OMV = 0.7; // OMV ≤ S$20,000
export const LTV_HIGH_OMV = 0.6; // OMV  > S$20,000

/* ═══ Functions ═══════════════════════════════════════════════════════════ */

/**
 * ARF payable on a given OMV, in SGD (rounded to the nearest dollar).
 * Marginal — each band's rate applies only to the slice inside that band.
 */
export function calcARF(omv) {
  const v = Number(omv) || 0;
  if (v <= 0) return 0;
  let arf = 0;
  for (const band of ARF_BANDS) {
    if (v <= band.from) break;
    arf += (Math.min(v, band.to) - band.from) * band.rate;
  }
  return Math.round(arf);
}

/** Per-band ARF breakdown for display. Returns only the bands that bite. */
export function arfBandBreakdown(omv) {
  const v = Number(omv) || 0;
  if (v <= 0) return [];
  const rows = [];
  ARF_BANDS.forEach((band, i) => {
    if (v <= band.from) return;
    const slice = Math.min(v, band.to) - band.from;
    rows.push({
      label: band.label,
      shortLabel: ARF_BAND_SHORT_LABELS[i],
      rate: band.rate,
      ratePct: Math.round(band.rate * 100) + '%',
      slice,
      tax: Math.round(slice * band.rate),
    });
  });
  return rows;
}

/** Excise duty: 20% of OMV. */
export function calcExciseDuty(omv) {
  return Math.round((Number(omv) || 0) * EXCISE_DUTY_RATE);
}

/**
 * GST: 9% of (OMV + excise duty).
 * Note the unrounded excise base — this is what reproduces LTA's own figures.
 */
export function calcGST(omv) {
  const v = Number(omv) || 0;
  return Math.round((v + v * EXCISE_DUTY_RATE) * GST_RATE);
}

/** EEAI rebate for a fully electric car registered in 2026: 45% of ARF, capped. */
export function calcEEAI(arf, isElectric) {
  if (!isElectric) return 0;
  return Math.min(Math.round((Number(arf) || 0) * EEAI_RATE), EEAI_CAP_2026);
}

/** Maximum loan-to-value ratio permitted by MAS for a car of this OMV. */
export function maxLTV(omv) {
  return (Number(omv) || 0) <= LTV_OMV_THRESHOLD ? LTV_LOW_OMV : LTV_HIGH_OMV;
}

/** Monthly repayment on an amortising loan. */
export function calcMonthlyPayment(principal, annualRatePercent, months) {
  const p = Number(principal) || 0;
  const m = Number(months) || 0;
  if (p <= 0 || m <= 0) return 0;
  const r = (Number(annualRatePercent) || 0) / 100 / 12;
  if (r === 0) return Math.round(p / m);
  return Math.round((p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1));
}

/**
 * Full regulated cost of putting a new car on the road — everything LTA and
 * Singapore Customs charge, plus the COE. Excludes the dealer's margin,
 * insurance, road tax, number plates and the IU/OBU.
 *
 * This is LTA's own "Total Basic Cost" line, and it reproduces the published
 * per-model figures to the dollar.
 *
 *   omv          Open Market Value, assessed by Singapore Customs
 *   coePremium   Quota Premium for the bidding exercise that applies
 *   vesAmount    VES rebate (negative) or surcharge (positive)
 *   isElectric   Fully electric? Governs EEAI and the S$0 minimum-ARF floor
 */
export function calcOnRoadPrice({ omv, coePremium = 0, vesAmount = 0, isElectric = false }) {
  const v = Number(omv) || 0;
  const coe = Number(coePremium) || 0;
  const ves = Number(vesAmount) || 0;

  const arf = calcARF(v);
  const excise = calcExciseDuty(v);
  const gst = calcGST(v);
  const eeai = calcEEAI(arf, isElectric);

  // VES and EEAI offset the ARF, subject to a minimum ARF floor.
  const minARF = isElectric ? MIN_ARF_ELECTRIC : MIN_ARF_STANDARD;
  const arfAfterRebates = Math.max(minARF, arf + ves - eeai);
  const rebateApplied = arfAfterRebates - arf; // negative when rebates bite

  const total = v + excise + gst + arfAfterRebates + REGISTRATION_FEE + coe;

  return {
    omv: v,
    excise,
    gst,
    dutiesTotal: excise + gst,
    arf,
    ves,
    eeai,
    arfAfterRebates,
    rebateApplied,
    registrationFee: REGISTRATION_FEE,
    coe,
    /** Everything before the COE — LTA's "Total Basic Cost (without COE)". */
    totalWithoutCOE: v + excise + gst + arfAfterRebates + REGISTRATION_FEE,
    total,
    /** The share of the regulated total that is tax plus COE, not car. */
    taxAndCOE: total - v,
  };
}

/**
 * Inverse of calcOnRoadPrice: the OMV implied by a given regulated total.
 *
 * Used by the "I know the advertised price" mode. Because a dealer's quoted
 * price also contains their margin, solving with the advertised price gives
 * the LARGEST OMV consistent with that price — i.e. the answer you get if the
 * dealer's margin were zero. Any real margin makes the true OMV smaller and
 * the tax share smaller with it, so this is an upper bound, and the page says so.
 *
 * Solved by bisection rather than algebra: the ARF floor and the EEAI cap make
 * the forward function piecewise, and bisection is immune to getting the
 * breakpoints wrong. The function is monotonic increasing in OMV, so it
 * converges.
 */
export function omvFromTotal({ total, coePremium = 0, vesAmount = 0, isElectric = false }) {
  const target = Number(total) || 0;
  const fixed = (Number(coePremium) || 0) + REGISTRATION_FEE;
  if (target <= fixed) return 0;

  let lo = 0;
  let hi = 5000000;
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    const got = calcOnRoadPrice({ omv: mid, coePremium, vesAmount, isElectric }).total;
    if (got < target) lo = mid;
    else hi = mid;
  }
  return Math.round((lo + hi) / 2);
}

/** ARF as a percentage of OMV — the "effective" rate. */
export function arfEffectiveRate(omv) {
  const v = Number(omv) || 0;
  if (v <= 0) return 0;
  return Math.round((calcARF(v) / v) * 100);
}

/** S$ formatter used across both calculator surfaces. */
export function fmtSGD(n) {
  const v = Math.round(Number(n) || 0);
  return (v < 0 ? '−S$' : 'S$') + Math.abs(v).toLocaleString('en-SG');
}
