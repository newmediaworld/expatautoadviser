/**
 * Hong Kong First Registration Tax (FRT) — private cars.
 *
 * Single source of truth for the FRT arithmetic used by
 *   /hong-kong/first-registration-tax-calculator  (the dedicated tool page)
 *   /hong-kong/calculators                        (the lease-vs-buy tools page)
 *
 * Do NOT duplicate this maths anywhere else — import it. The two pages drifted
 * apart once already; this module exists so they can't.
 *
 * RATES — verified 5 August 2026 against:
 *   Gazette / press release "Immediate adjustment to first registration tax
 *   rates for private cars", 24 February 2021, effective 11am 24 Feb 2021:
 *   https://www.info.gov.hk/gia/general/202102/24/P2021022400249.htm
 *     first  HK$150,000  @  46%
 *     next   HK$150,000  @  86%
 *     next   HK$200,000  @ 115%
 *     remainder          @ 132%
 *   These are marginal bands. No change has been gazetted since.
 *
 * TAXABLE VALUE — "the taxable value is calculated on the basis of the
 * published retail price or provisional taxable value assessed by the Customs
 * and Excise Department" (GovHK, Become a Car Owner in Hong Kong).
 */

export const FRT_BANDS = [
  { label: 'First HK$150,000', from: 0, to: 150000, rate: 0.46 },
  { label: 'Next HK$150,000 (HK$150,001–HK$300,000)', from: 150000, to: 300000, rate: 0.86 },
  { label: 'Next HK$200,000 (HK$300,001–HK$500,000)', from: 300000, to: 500000, rate: 1.15 },
  { label: 'Remainder (above HK$500,000)', from: 500000, to: Infinity, rate: 1.32 },
];

/** Short band labels, for tight table cells. */
export const FRT_BAND_SHORT_LABELS = [
  'First HK$150,000',
  'Next HK$150,000',
  'Next HK$200,000',
  'Remainder',
];

/**
 * FRT payable on a given taxable value, in HKD (rounded to the nearest dollar).
 * Marginal — each band's rate applies only to the slice falling in that band.
 */
export function calcFRT(taxableValue) {
  const tv = Number(taxableValue) || 0;
  if (tv <= 0) return 0;
  let frt = 0;
  for (const band of FRT_BANDS) {
    if (tv <= band.from) break;
    const slice = Math.min(tv, band.to) - band.from;
    frt += slice * band.rate;
  }
  return Math.round(frt);
}

/**
 * Per-band breakdown for display. Returns only the bands that actually bite.
 * [{ label, shortLabel, rate, ratePct, slice, tax }]
 */
export function frtBandBreakdown(taxableValue) {
  const tv = Number(taxableValue) || 0;
  if (tv <= 0) return [];
  const rows = [];
  FRT_BANDS.forEach((band, i) => {
    if (tv <= band.from) return;
    const slice = Math.min(tv, band.to) - band.from;
    rows.push({
      label: band.label,
      shortLabel: FRT_BAND_SHORT_LABELS[i],
      rate: band.rate,
      ratePct: Math.round(band.rate * 100) + '%',
      slice,
      tax: Math.round(slice * band.rate),
    });
  });
  return rows;
}

/**
 * Inverse of calcFRT.
 *
 * Hong Kong dealers quote FRT-inclusive prices, so the number a buyer actually
 * has in front of them is (taxable value + FRT). This recovers the taxable
 * value from that all-in figure, which is what lets the calculator answer
 * "how much of this price is tax?".
 *
 * Boundaries: TV 150,000 → all-in 219,000; TV 300,000 → 498,000;
 *             TV 500,000 → 928,000.
 */
export function taxableValueFromAllIn(allInPrice) {
  const p = Number(allInPrice) || 0;
  if (p <= 0) return 0;
  if (p <= 219000) return p / 1.46;
  if (p <= 498000) return 150000 + (p - 219000) / 1.86;
  if (p <= 928000) return 300000 + (p - 498000) / 2.15;
  return 500000 + (p - 928000) / 2.32;
}

/** Total on-road price before insurance, registration fee and licence fee. */
export function calcOnRoadPrice(taxableValue) {
  const tv = Number(taxableValue) || 0;
  return tv + calcFRT(tv);
}

/** FRT as a percentage of taxable value (the "effective" rate). */
export function frtEffectiveRate(taxableValue) {
  const tv = Number(taxableValue) || 0;
  if (tv <= 0) return 0;
  return Math.round((calcFRT(tv) / tv) * 100);
}

/** HK$ formatter used across both calculator surfaces. */
export function fmtHKD(n) {
  return 'HK$' + Math.round(Number(n) || 0).toLocaleString('en-HK');
}
