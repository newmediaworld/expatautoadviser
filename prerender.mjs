import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'https://www.expatautoadviser.com';

/**
 * ROUTES is auto-derived from src/App.jsx at build time so the prerender
 * list cannot drift from the actual route table.
 *
 * Pattern: any <Route path="..." element={<X />} /> where the element is NOT
 * a <Navigate ...> redirect. Redirect routes are filtered because they 301
 * to a canonical URL and shouldn't be prerendered or sitemapped separately.
 *
 * If you add a new <Route> in App.jsx, also add a META entry below for the
 * page's title/description/schema. The validation step at the top of this
 * script will fail the build if a route exists without a META entry.
 *
 * (See SHARED/proposals/2026-04-26_seo_postmortem.md for context.)
 */
function deriveRoutesFromApp() {
  const appPath = path.join(__dirname, 'src', 'App.jsx');
  const src = fs.readFileSync(appPath, 'utf-8');

  // Match every <Route path="..." element={<X .../>} />
  // We need to capture both the path AND the element to filter out Navigate redirects.
  const routeRegex = /<Route\s+path="([^"]+)"\s+element=\{(<[^/>]+\/?>)/g;
  const routes = [];
  const seen = new Set();

  let m;
  while ((m = routeRegex.exec(src)) !== null) {
    const [, routePath, element] = m;

    // Skip dynamic segments (no /:slug routes here, but be defensive)
    if (routePath.includes(':')) continue;

    // Skip <Navigate ...> redirect routes
    if (/^<Navigate\b/.test(element)) continue;

    // De-dupe (paranoid)
    if (seen.has(routePath)) continue;
    seen.add(routePath);

    routes.push(routePath);
  }

  return routes;
}

const ROUTES = deriveRoutesFromApp();

const META = {
  '/': {
    title: `ExpatAutoAdviser — Singapore & Hong Kong Car Guides`,
    desc: `Free guides for expats on leasing or buying a car in Singapore and Hong Kong. Compare costs, understand rules, and make the right choice.`,
    type: `website`,
  },
  '/singapore': {
    title: `Singapore Expat Car Guide — Lease, Buy or Skip?`,
    desc: `Everything expats need to know about getting a car in Singapore. COE, leasing vs buying, insurance, and cost calculators.`,
    type: `website`,
  },
  '/singapore/should-i-get-a-car': {
    title: `Should I Get a Car in Singapore? Honest Expat Advice`,
    desc: `Weighing up a car in Singapore? This guide covers real costs, MRT vs driving trade-offs, and who actually benefits from owning a car as an expat.`,
    type: `article`,
    faq: [
      {
        q: `Do expats need a car in Singapore?`,
        a: `Most expats living in central Singapore do not need a car. The MRT and bus network is excellent and affordable. A car makes more sense if you have children doing school runs, live outside the central belt, or plan to stay 3 or more years.`,
      },
      {
        q: `How much does a car cost per month in Singapore?`,
        a: `Expect to pay SGD 1,500 to 2,500 per month all-in for a leased car including insurance and road tax. Buying costs more upfront due to COE prices which can exceed SGD 100,000.`,
      },
      {
        q: `Is leasing or buying better for expats in Singapore?`,
        a: `Leasing is almost always better for expats on a 1 to 3 year assignment. Buying only makes financial sense if you plan to stay 5 or more years and can recoup the COE cost.`,
      },
    ],
  },
  '/singapore/leasing-guide': {
    title: `Car Leasing Singapore 2026: SGD 1,200-1,800/mo Expat Guide`,
    desc: `Real cost of car leasing in Singapore as a UK expat 2026 — SGD 1,200-1,800/mo, expat-friendly lessors, 6 vs 36-month options, what to check.`,
    type: `article`,
    faq: [
      {
        q: `Can expats lease a car in Singapore without a Singapore licence?`,
        a: `Yes. Most leasing companies accept a valid foreign driving licence or an International Driving Permit for the duration of your lease.`,
      },
      {
        q: `What is a typical car lease cost in Singapore?`,
        a: `A standard sedan lease in Singapore typically costs SGD 1,200 to 1,800 per month including road tax. Insurance is usually extra.`,
      },
      {
        q: `How long are car leases in Singapore?`,
        a: `Most expat leases run from 6 months to 3 years. Short-term leases of 1 to 3 months are available but cost significantly more per month.`,
      },
    ],
  },
  '/singapore/buying-guide': {
    title: `Buying a Car in Singapore as an Expat — Full Guide`,
    desc: `Everything you need to know about buying a car in Singapore. COE explained, dealers, financing, and whether buying actually makes financial sense for expats.`,
    type: `article`,
    faq: [
      {
        q: `What is COE and how does it affect car prices in Singapore?`,
        a: `COE (Certificate of Entitlement) is a government quota licence required to own a car in Singapore. COE prices are set by auction and frequently exceed SGD 100,000, making Singapore one of the most expensive places in the world to buy a car.`,
      },
      {
        q: `Can foreigners buy a car in Singapore?`,
        a: `Yes. Foreigners with a valid Employment Pass or Dependent Pass can purchase a car in Singapore. You will need a Singapore driving licence or a converted foreign licence.`,
      },
    ],
  },
  '/singapore/insurance-guide': {
    title: `Singapore Car Insurance 2026: Expat Guide (S$1,200-2,800/yr)`,
    desc: `Singapore car insurance 2026 for expats — S$1,200-2,800/yr comprehensive, NCD transfer from UK, forced-comp cliff at year 7, cheapest expat insurers.`,
    type: `article`,
    faq: [
      {
        q: `Can I transfer my No Claim Discount to Singapore?`,
        a: `Some Singapore insurers accept NCD from overseas policies. You will need a letter from your previous insurer confirming your claims history and NCD level.`,
      },
      {
        q: `What type of car insurance do I need in Singapore?`,
        a: `Third-party insurance is the legal minimum in Singapore. Most expats opt for comprehensive coverage given the high cost of vehicles.`,
      },
    ],
  },
  '/singapore/licence-conversion': {
    title: `Convert UK Driving Licence to Singapore 2026 (No Retest)`,
    desc: `Convert your UK driving licence to a Singapore licence in 2026 — which licences qualify, the SGD cost, paperwork, and the no-retest pathway.`,
    type: `article`,
    faq: [
      {
        q: `Which countries have reciprocal licence agreements with Singapore?`,
        a: `Singapore has reciprocal agreements with Australia, New Zealand, the UK, Ireland, and several other countries, allowing direct conversion without a driving test.`,
      },
      {
        q: `How long does licence conversion take in Singapore?`,
        a: `The conversion process typically takes 1 to 3 weeks once you have gathered the required documents and passed any required tests.`,
      },
    ],
  },
  '/singapore/ev-charging': {
    title: `EV Charging Singapore 2026: UK Expat Networks + Cost Guide`,
    desc: `EV charging in Singapore 2026 for UK expats — SP/Charge+/Shell Recharge tariffs, HDB vs condo vs landed home charging, EEAI rebate, and which EVs expats pick.`,
    type: `article`,
  },
  '/singapore/ev-guide': {
    title: `Electric Cars Singapore 2026: EEAI S$7,500 + Charging Guide`,
    desc: `Buy an electric car in Singapore 2026 as a UK expat — EEAI S$7,500 rebate, VES bands, COE impact, public charging, and best expat EV picks.`,
    type: `article`,
    faq: [
      {
        q: `Are electric cars worth it in Singapore?`,
        a: `EVs can make sense in Singapore thanks to government grants like the EV Early Adoption Incentive. However, high COE costs still apply, and charging infrastructure in older condos can be limited.`,
      },
      {
        q: `Where can I charge an EV in Singapore?`,
        a: `Singapore has a growing public charging network including ChargePoint and SP Group chargers at shopping malls, car parks, and condos. Many newer residential buildings have dedicated EV charging points.`,
      },
    ],
  },
  '/singapore/calculators': {
    title: `Singapore Car Cost Calculator — Lease vs Buy`,
    desc: `Use our free calculator to compare the true monthly cost of leasing vs buying a car in Singapore. Includes COE, insurance, road tax, and running costs.`,
    type: `website`,
  },
  '/singapore/garage-finder': {
    title: `Expat-Friendly Garages in Singapore`,
    desc: `Find reliable, English-speaking garages and service centres in Singapore. Recommended by expats for fair pricing and quality work.`,
    type: `website`,
  },
  '/hong-kong': {
    title: `Hong Kong Expat Car Guide — Lease, Buy or Skip?`,
    desc: `Everything expats need to know about getting a car in Hong Kong. FRT tax, leasing vs buying, insurance, and practical advice for expatriates.`,
    type: `website`,
  },
  '/hong-kong/should-i-get-a-car': {
    title: `Should I Get a Car in Hong Kong? Honest Expat Advice`,
    desc: `Is a car worth it in Hong Kong? This guide covers real costs, the MTR vs driving trade-off, and who actually benefits from owning a car as an expat in HK.`,
    type: `article`,
    faq: [
      {
        q: `Do expats need a car in Hong Kong?`,
        a: `Most expats in Hong Kong Island or Kowloon do not need a car. The MTR and bus network is world-class. A car is more useful in the New Territories or if you have children doing school runs.`,
      },
      {
        q: `How much does a car cost per month in Hong Kong?`,
        a: `Expect to pay HKD 12,000 to 20,000 per month all-in for a leased car. Buying is also expensive due to the First Registration Tax which can add 40 to 100 percent to the vehicle price.`,
      },
      {
        q: `Is leasing or buying better for expats in Hong Kong?`,
        a: `Leasing is generally better for expats on short to medium assignments. Buying can make sense for long-term residents who plan to stay 4 or more years.`,
      },
    ],
  },
  '/hong-kong/buying-guide': {
    title: `Buying a Car in Hong Kong 2026 (UK Expat Guide)`,
    desc: `Real all-in cost of buying a car in Hong Kong 2026 — HKD 200k vs 800k stacks after FRT (46–132%), dealer vs private, financing, buy-vs-lease maths.`,
    type: `article`,
    faq: [
      {
        q: `What is First Registration Tax in Hong Kong?`,
        a: `First Registration Tax (FRT) is a tax levied on all newly registered vehicles in Hong Kong. It ranges from 40 to 115 percent of the taxable value of the vehicle, making new cars extremely expensive.`,
      },
      {
        q: `Can foreigners buy a car in Hong Kong?`,
        a: `Yes. Foreigners with a valid Hong Kong identity document can purchase a car. You will need a Hong Kong driving licence or a valid overseas licence plus an International Driving Permit.`,
      },
    ],
  },
  '/hong-kong/leasing-guide': {
    title: `Car Leasing Hong Kong 2026: HKD 10-16k/mo Expat Guide`,
    desc: `Real cost of leasing a car in Hong Kong 2026 as an expat — HKD 10,000-16,000/mo all-in, expat-friendly lessors, lease vs buy maths for short postings.`,
    type: `article`,
    faq: [
      {
        q: `Can expats lease a car in Hong Kong without a local licence?`,
        a: `Yes. Most leasing companies in Hong Kong accept valid overseas driving licences. If your licence is not in English or Chinese, you may need an International Driving Permit.`,
      },
      {
        q: `What is a typical car lease cost in Hong Kong?`,
        a: `A standard sedan lease in Hong Kong typically costs HKD 10,000 to 16,000 per month excluding insurance.`,
      },
    ],
  },
  '/hong-kong/frt-tax-explained': {
    title: `Hong Kong FRT 2026: Why a HK$300k Car Costs HK$550k`,
    desc: `Hong Kong First Registration Tax explained 2026 — 46-132% bands turn a HK$300k car into HK$550k. Taxable value formulas, EV concession closure, worked examples.`,
    type: `article`,
    faq: [
      {
        q: `What are the Hong Kong First Registration Tax rates for private cars in 2026?`,
        a: `FRT is charged on the taxable value in four progressive bands: 46% on the first HK$150,000, 86% on HK$150,001–HK$300,000, 115% on HK$300,001–HK$500,000, and 132% above HK$500,000.`,
      },
      {
        q: `Do electric private cars still get an FRT concession in Hong Kong?`,
        a: `No. The general FRT concession for private electric cars expired on 31 March 2026 and was not extended. Private EVs registered on or after 1 April 2026 pay full FRT. A transitional carve-out applies to orders placed on or before 25 February 2026 with FRT submission by 24 February 2027. Commercial EVs, electric motorcycles and motor tricycles retain FRT waivers until 31 March 2028.`,
      },
    ],
  },
  '/hong-kong/insurance-guide': {
    title: `Hong Kong Car Insurance 2026: Expat Guide (HKD 15-25k)`,
    desc: `Hong Kong car insurance 2026 for expats — HKD 15-25k/yr comprehensive, third-party minimums, NCD transfer from UK, 30-40% expat loading explained.`,
    type: `article`,
    faq: [
      {
        q: `What is the minimum car insurance required in Hong Kong?`,
        a: `Third-party liability insurance is the legal minimum in Hong Kong. It covers injury or death to third parties but not damage to your own vehicle.`,
      },
      {
        q: `Can I use my overseas No Claim Discount in Hong Kong?`,
        a: `Some Hong Kong insurers will recognise overseas NCD. You will need a letter from your previous insurer confirming your claims-free history.`,
      },
    ],
  },
  '/hong-kong/mot-maintenance': {
    title: `Car Maintenance and Inspection in Hong Kong — Expat Guide`,
    desc: `What expats need to know about car maintenance, roadworthiness testing, and finding reliable garages in Hong Kong.`,
    type: `article`,
    faq: [
      {
        q: `Is there a car inspection requirement in Hong Kong?`,
        a: `Yes. Vehicles in Hong Kong must pass periodic vehicle examination at government-authorised centres. The frequency depends on vehicle age, with older vehicles requiring more frequent checks.`,
      },
      {
        q: `How do I find a trustworthy garage in Hong Kong as an expat?`,
        a: `Look for garages recommended by other expats in online forums or expat groups. Many authorised dealers and larger chain service centres have English-speaking staff.`,
      },
    ],
  },
  '/hong-kong/licence-conversion': {
    title: `Convert UK Driving Licence to Hong Kong (No Test) 2026`,
    desc: `Hong Kong accepts UK + 30 foreign licences for direct conversion (no test). Full list, application steps, fees, and what to do if yours is not eligible.`,
    type: `article`,
    faq: [
      {
        q: `Which countries can convert their licence directly in Hong Kong?`,
        a: `Hong Kong has reciprocal licence agreements with many countries including the UK, Australia, and EU member states. Holders of qualifying licences can exchange without sitting a test.`,
      },
      {
        q: `How long can I drive in Hong Kong on a foreign licence?`,
        a: `Visitors can drive on a valid overseas licence for up to 12 months. After that, or once you become a Hong Kong resident, you will need a local licence.`,
      },
    ],
  },
  '/hong-kong/petrol-prices-2026-update': {
    title: `HK Petrol Prices 2026: HK$32+/L Sustained — Expat Guide`,
    desc: `HK petrol prices 2026 for UK expats — HK$32-33/L sustained through Q2, why HK govt won't subsidise, what it means for buy-vs-lease, EV switch, MTR-vs-drive.`,
    type: `article`,
  },
  '/hong-kong/ev-guide': {
    title: `Electric Cars in Hong Kong — Expat EV Guide`,
    desc: `Thinking about an electric car in Hong Kong? This guide covers FRT concessions, charging infrastructure, and which EVs suit expat life in HK.`,
    type: `article`,
    faq: [
      {
        q: `Are electric cars popular in Hong Kong?`,
        a: `Yes. Hong Kong has one of the highest EV adoption rates in Asia, driven by FRT concessions and a dense public charging network. Tesla is particularly popular among expats.`,
      },
      {
        q: `Where can I charge an EV in Hong Kong?`,
        a: `Hong Kong has an extensive charging network at car parks, shopping malls, and residential buildings. CLP and HK Electric also offer home charger installation for eligible customers.`,
      },
    ],
  },
  '/hong-kong/calculators': {
    title: `Hong Kong Car Cost Calculator — Lease vs Buy`,
    desc: `Use our free calculator to compare the true cost of leasing vs buying a car in Hong Kong. Includes FRT, insurance, and running costs.`,
    type: `website`,
  },
  '/hong-kong/garage-finder': {
    title: `Expat-Friendly Garages in Hong Kong`,
    desc: `Find reliable, English-speaking garages and service centres in Hong Kong. Recommended by expats for fair pricing and quality work.`,
    type: `website`,
  },
  '/singapore/lease-checker': {
    title: `Singapore Lease Checker — Is Your Car Lease a Fair Deal?`,
    desc: `Check if your Singapore car lease is fairly priced. Enter your terms and compare against real market data from expat lease submissions.`,
    type: `website`,
    faq: [
      {
        q: `What is a fair monthly price for a car lease in Singapore?`,
        a: `A mid-range sedan lease in Singapore typically costs SGD 1,650 to 2,300 per month. Economy cars range from SGD 1,150 to 1,580, while premium cars can cost SGD 2,150 to 3,050 per month. These figures are for 36-month leases — shorter terms cost more.`,
      },
      {
        q: `Does a Singapore car lease include insurance?`,
        a: `It depends on the lease. Many Singapore leases include comprehensive car insurance, road tax, and servicing in the monthly price. Always check what is included — a lease at SGD 2,500 with insurance included may be cheaper than one at SGD 2,000 without it.`,
      },
      {
        q: `How do I compare car lease prices in Singapore?`,
        a: `Get at least three quotes for the same car segment and lease term. Ask each company to quote with and without insurance and servicing so you can compare on a like-for-like basis. Use our Lease Checker to benchmark any quote against current market rates.`,
      },
    ],
  },
  '/hong-kong/lease-checker': {
    title: `Hong Kong Lease Checker — Is Your Car Lease a Fair Deal?`,
    desc: `Check if your Hong Kong car lease is fairly priced. Compare your lease terms against current HK market rates from real expat data.`,
    type: `website`,
    faq: [
      {
        q: `What is a fair monthly price for a car lease in Hong Kong?`,
        a: `A standard sedan lease in Hong Kong typically costs HKD 10,000 to 16,000 per month excluding insurance. Prices vary by car model, lease length, and what is included.`,
      },
      {
        q: `Should I lease or buy a car in Hong Kong as an expat?`,
        a: `Leasing is generally better for expats on 1 to 3 year assignments. Buying involves First Registration Tax of 40 to 115 percent on top of the vehicle price, making it only worthwhile for longer stays.`,
      },
    ],
  },
  '/singapore/cost-of-driving': {
    title: `ERP 2.0 and the Real Cost of Driving in Singapore`,
    desc: `How Singapore's ERP 2.0 system works in 2026: OBU rollout, distance-based charging intent, typical gantry rates, and what daily driving really costs an expat.`,
    type: `article`,
  },
  '/singapore/car-loans': {
    title: `Car Loans for Expats in Singapore: MAS LTV Rules Explained`,
    desc: `How car loans work for expats in Singapore: MAS LTV caps (70%/60%), typical lender practice, TDSR considerations, EP requirements, and indicative 2026 rate ranges.`,
    type: `article`,
  },
  '/singapore/child-car-seats': {
    title: `Child Car Seat Laws Singapore 2026: ISOFIX + S$150 Fine`,
    desc: `Singapore child car seat laws 2026 for expat families — 1.35m height rule, ISOFIX standards, S$150 fine, and the taxi/PHV exemption explained.`,
    type: `article`,
  },
  '/singapore/subscription-vs-ownership': {
    title: `Car Subscription vs Buying in Singapore 2026 (Real Cost)`,
    desc: `Car subscription vs buying in Singapore 2026 for expats — Carro Leap, Drive Lah, monthly all-in cost vs ownership maths, which fits your stay length.`,
    type: `article`,
  },
  '/hong-kong/parking-costs': {
    title: `HK Parking 2026: HK$3k Sai Kung vs HK$12k Mid-Levels`,
    desc: `Real Hong Kong parking costs 2026 for UK expats — HK$3,000 Sai Kung vs HK$12,000 Mid-Levels, office rates, where rents are softening, buy-vs-lease impact.`,
    type: `article`,
    faq: [
      {
        q: `How much does residential parking cost in Mid-Levels Hong Kong?`,
        a: `Typically HK$4,500-HK$7,500/month in 2026, depending on building class and whether the space is government-managed or private commercial. Some premium new developments include parking with the flat lease at no separate charge; older Mid-Levels buildings more often charge separately.`,
      },
      {
        q: `What's the cheapest way to keep a car in Hong Kong as an expat?`,
        a: `Location is the biggest lever. Moving from Mid-Levels (HK$5,500/month parking) to Sai Kung or Clearwater Bay (HK$1,800/month) saves about HK$45,000/year on parking alone before commute trade-offs. Second-biggest lever: secure parking via tenancy negotiation rather than separate monthly contract. Third: avoid office-parking by MTR-ing to work and using the car only at evenings and weekends.`,
      },
      {
        q: `Are there any free parking options in Hong Kong?`,
        a: `Free public parking in Hong Kong is rare and almost always restricted (60-90 minute limits with strict enforcement). Some shopping malls (Pacific Place, IFC, Festival Walk) offer 1-2 hours free with minimum spend at participating retailers. Free overnight street parking exists in a handful of less central districts but is not reliable for daily use.`,
      },
    ],
  },
  '/hong-kong/selling-guide': {
    title: `Selling Your Car in Hong Kong: 6-Week Exit Countdown`,
    desc: `Departing expats: maximise HK$ recovery selling a car in Hong Kong. 6-week plan, dealer vs private vs auction, TD forms, export route, insurance gap.`,
    type: `article`,
  },
  '/singapore/coe-bidding-strategy': {
    title: `Singapore COE Bidding 2026: 3 Strategies for UK Expats`,
    desc: `How Singapore's twice-monthly COE auction works, the 3 bidding strategies UK expats use, worked outcomes, when to bid vs wait, and the S$10-15k mistakes to avoid.`,
    type: `article`,
    faq: [
      {
        q: `How does COE bidding work in Singapore?`,
        a: `LTA runs a sealed-bid uniform-price auction twice a month (first and third Wednesday). Your dealer bids on your behalf. The lowest successful bid sets the cut-off price; everyone who won pays that price (not their actual bid). Bidding closes Wednesday 4pm; results published the same evening.`,
      },
      {
        q: `What's the difference between Cat A and Cat B COE in Singapore?`,
        a: `Cat A is for cars with engine ≤ 1,600cc AND power ≤ 130bhp (Corolla, Mazda 3, Vezel, Atto 3). Cat B is for everything else (BMW 3-Series, Mercedes C-Class, Tesla Model 3 Long Range). Historically Cat B traded at a S$10-25k premium over Cat A; in 2026 the categories have converged, occasionally with Cat A above Cat B.`,
      },
      {
        q: `Is 'guaranteed COE' worth paying extra for?`,
        a: `Sometimes. Dealers charging S$3-8k for 'guaranteed COE' are absorbing the bidding-cycle risk for you. If you have a hard timeline (e.g. car needed for school start in 2 weeks), the premium can be worth it for the certainty. If you have flexibility, it's pure dealer margin you don't need to pay.`,
      },
    ],
  },
  '/singapore/selling-guide': {
    title: `Selling Your Car Leaving Singapore: PARF + COE Rebates 2026`,
    desc: `Departing UK expats: claim PARF and COE rebates, pick dealer vs instant-offer vs private sale, and avoid the deadline traps that cost four-figure refunds.`,
    type: `article`,
    faq: [
      {
        q: `How is the PARF rebate calculated when selling a car in Singapore?`,
        a: `PARF rebate is a percentage of the original ARF (Additional Registration Fee) paid when the car was first registered, stepping down by age: 75% if deregistered up to 5 years, 70% (5-6yr), 65% (6-7yr), 60% (7-8yr), 55% (8-9yr), 50% (9-10yr), zero after 10 years. The age bands tip over on the registration date itself, not the calendar month — deregistering one day late can drop you a 5% tier and cost four figures.`,
      },
      {
        q: `What's the difference between PARF rebate and COE rebate?`,
        a: `PARF is calculated from the original ARF and only applies if you deregister before 10 years. COE rebate is the unused portion of the 10-year COE pro-rata, calculated on the original Quota Premium (QP) — not what you paid for the car or current COE prices. Both are paid by LTA directly to your bank account within 7-14 working days of deregistration, on top of whatever the buyer pays for the vehicle.`,
      },
      {
        q: `Should I sell to a dealer or privately when leaving Singapore?`,
        a: `Dealer or instant-offer (Carro/Motorist) is faster — 1-3 weeks turnaround — and they handle deregistration paperwork, but you take roughly 8-15% below private-sale value as their margin. Private sale via sgcarmart gets the highest gross but takes 4-8 weeks of viewings and negotiations. The LTA rebate is the same either way — only the cash from the buyer changes. For most departing expats with under six weeks before flying out, dealer routes win on a time-adjusted basis.`,
      },
    ],
  },
  '/hong-kong/tunnel-tolls-explained': {
    title: `HK Tunnel Tolls 2026: HK$60 Peak vs HK$8 Off-Peak`,
    desc: `Real Hong Kong tunnel toll cost 2026 for UK expats — TVT bands HK$8 off-peak to HK$60 peak, HKeToll setup, real monthly bills by route, off-peak savings up to 87%.`,
    type: `article`,
    faq: [
      {
        q: `How much do Hong Kong tunnel tolls cost in 2026?`,
        a: `Under the Time-Varying Tolls system that has been running since December 2023, private-car cross-harbour tolls vary by time of day. At peak (Mon-Fri morning ~7:30-10:15 and evening ~17:00-19:30), expect around HK$40 at the Cross-Harbour Tunnel and Eastern Harbour Crossing, and around HK$60 at the Western Harbour Crossing. Off-peak rates drop to around HK$20-25, and weekend/public-holiday rates are a flat HK$25 across all three. Always verify current rates via the HK Transport Department or HKeToll app.`,
      },
      {
        q: `What is HKeToll and how do I sign up as a new Hong Kong expat?`,
        a: `HKeToll is the government's licence-plate-recognition tolling system that has replaced toll booths at all government-operated tunnels including the three cross-harbour tunnels, Tate's Cairn, Lion Rock and Aberdeen. Sign up at hketoll.gov.hk using your HK ID and vehicle registration document, link a credit card or bank account for auto-top-up, and add your licence plate. The system then deducts tolls automatically as you drive through. Set this up before taking possession of a car — driving through a government tunnel without an active account triggers HK$50-100 administrative fees on top of the unpaid toll.`,
      },
      {
        q: `Which Hong Kong cross-harbour tunnel should I use for my commute?`,
        a: `Under Time-Varying Tolls, the Cross-Harbour Tunnel and Eastern Harbour Crossing are now priced identically at every band, and the Western Harbour Crossing carries roughly a HK$20 peak premium. The financial argument for choosing the cheapest tunnel is now weak; the time argument dominates. Most UK expats settle on: WHC for time-critical morning commutes (faster, less congested, worth the premium), CHT or EHC for evening returns (less time pressure), and shifting timing into off-peak windows where possible (a HK$80 round trip drops to ~HK$50). Check Google Maps in real time — the fastest tunnel varies across the four time-of-day bands.`,
      },
    ],
  },
  '/singapore/road-tax-vehicle-fees': {
    title: `Singapore Road Tax + Vehicle Fees 2026: UK Expat Guide`,
    desc: `Singapore road tax for UK expats — petrol vs diesel vs EV formulas, 6× diesel surcharge, inspection cycle, VES banding, worked annual cost for expat cars.`,
    type: `article`,
    faq: [
      {
        q: `How much is road tax for a typical car in Singapore?`,
        a: `For a typical UK expat car of 1.6L-2.5L petrol, road tax sits in the S$700-1,500/year range. A 1.6L compact saloon runs roughly S$740-760/year; a 2.0L mid-size saloon ~S$900-950; a 2.5L SUV ~S$1,400-1,500; a 3.0L executive ~S$2,100-2,200. The exact figure is engine-cc-precise — pull it from the LTA OneMotoring road tax calculator for your specific vehicle.`,
      },
      {
        q: `Why is diesel road tax so much higher in Singapore?`,
        a: `Diesel cars pay six times the standard cc-based road tax plus an additional Special Tax surcharge calculated per cc per year. A 2.0L diesel SUV that would cost ~S$925 as a petrol equivalent runs closer to S$5,500-6,000/year as a diesel — a ~S$50,000 swing over 10 years on tax alone, before VES banding penalties. Singapore's tax structure is designed to push owners toward petrol, hybrid and EV.`,
      },
      {
        q: `What happens to road tax when a Singapore COE is renewed at year 10?`,
        a: `Renewed-COE cars pay a 10% annual road-tax surcharge on top of the standard formula for years 11-20. Renewing the COE also forfeits the PARF rebate permanently — you can never claim it once you renew. For most UK expats this decision falls to the next owner because year 10 is past their typical departure date, but if you're considering a longer Singapore stay (8+ years), the year-10 fork is worth modelling at purchase.`,
      },
    ],
  },
  '/singapore/best-family-cars': {
    title: `Best Family Cars in Singapore for UK Expats 2026`,
    desc: `Realistic 2026 family-car options for UK expats — three budget tiers from S$160K to S$340K, top picks per band, used-car alternatives, and key trade-offs.`,
    type: `article`,
    faq: [
      {
        q: `What's a realistic budget for a family car in Singapore in 2026?`,
        a: `New family cars start at ~S$160K all-in for a small SUV or saloon (Honda HR-V, Toyota Corolla Cross), rise to S$200-260K for mid-size SUVs (Toyota RAV4, Honda CR-V, Mazda CX-5), and S$260-340K for premium or 7-seater (Volvo XC60, BMW X3, Toyota Alphard). The "under S$100K new car" search result you may have seen is from pre-COE-spike content and isn't achievable in 2026 — COE alone runs ~S$120-125K.`,
      },
      {
        q: `Should UK expat families buy new or used in Singapore?`,
        a: `For 3-year postings used is almost always the right call. New-car depreciation in years 1-3 is the steepest part of the curve; you won't extract that value before leaving. A 3-year-old Toyota RAV4 or Honda CR-V trades at S$130-148K with 7 years of COE remaining — meaningfully better cost-per-year-of-ownership than buying new and selling at year 3.`,
      },
      {
        q: `Which family car holds value best in Singapore?`,
        a: `Toyota RAV4 Hybrid leads on resale at year 5 in the mid-SUV segment. Honda CR-V is close behind. Toyota Alphard holds value brutally well across all segments because of strong demand from Japanese parallel-import buyers — a 2-year-old Alphard typically retains 75-85% of its all-in price. European premium SUVs (BMW X3, Mercedes GLC) depreciate faster than Japanese equivalents.`,
      },
      {
        q: `What should I avoid when buying a family car in Singapore?`,
        a: `Three traps: (1) "cheap" Chinese-brand new cars under S$140K — the new-car price is competitive but resale in SG is unproven and risks 2-3 year postings; (2) parallel-imported Honda Vezel (JDM HR-V) — saves S$15K up front but no SG dealer warranty and weaker resale; (3) Tesla in 2026 — competitive new-car price but high insurance premiums, thin SG service network, and weakening resale. Stick to Japanese-brand authorised dealers for the cleanest 3-year exit picture.`,
      },
    ],
  },
  '/singapore/true-cost-of-owning-a-car': {
    title: `True Cost of Owning a Car in Singapore 2026 (UK Expat)`,
    desc: `Real all-in cost of car ownership in Singapore 2026 for UK expats — S$30-42k/yr: COE, depreciation, road tax, insurance, fuel, ERP, parking, with a worked 3-year example.`,
    type: `article`,
    faq: [
      {
        q: `How much does it really cost to own a car in Singapore in 2026?`,
        a: `For a mainstream Cat A family car on a typical three-year posting, budget roughly S$30,000 to S$42,000 a year all-in — around S$2,800 a month, rising past S$3,500 a month for premium or European models. The largest single cost is depreciation (including COE decay), typically S$18,000 to S$28,000 a year, which dwarfs fuel, insurance and road tax combined.`,
      },
      {
        q: `Why is depreciation the biggest cost of car ownership in Singapore?`,
        a: `When you buy you pre-pay a 10-year Certificate of Entitlement (COE), which decays from the moment you register. When you sell, the buyer only pays for the remaining COE life, so the years you used up are gone. A new car also falls in value fastest in its first three years — exactly the length of a typical expat posting. PARF and COE rebates from LTA soften this but do not erase it.`,
      },
      {
        q: `Is it cheaper to buy or lease a car in Singapore for a short posting?`,
        a: `For a posting of three years or less, buying new is almost always the worst financial option because you absorb the steepest part of the depreciation curve and recover none of it. Buying a used car that is three or more years old, or leasing/subscribing, both give a far better cost-per-year-of-ownership. Buying new only makes sense for stays of five or more years.`,
      },
      {
        q: `Are electric cars cheaper to own in Singapore in 2026?`,
        a: `Running costs favour EVs — home charging runs roughly S$900 to S$1,500 a year versus S$2,800 to S$3,600 for petrol, and diesel is now dearer than petrol at the pump. The EV Early Adoption Incentive gives a S$7,500 rebate to 31 December 2026 and the S$0 minimum ARF floor for EVs holds to 31 December 2027. The main constraint is home charging access, which you should confirm before committing.`,
      },
    ],
  },
  '/singapore/motor-insurance-2026-uk-expats': {
    title: `Singapore Motor Insurance 2026: UK Expat NCD & Premiums`,
    desc: `SG motor insurance 2026 for UK expats — NCD transfer 0-20%, comprehensive vs TPO, Income/MSIG/AIG/Tokio Marine premiums, Malaysia cover, MediSave, excess traps.`,
    type: `article`,
    faq: [
      {
        q: `How much of my UK no-claims discount transfers to Singapore?`,
        a: `Best case in 2026 is 20% NCD credit for a documented UK 5+ year claim-free letter at Income Insurance and MSIG. Standard case is 10% credit at AIG, DirectAsia and Etiqa. Worst case is 0% credit — treated as a fresh Singapore driver. Get the letter from your UK insurer as PDF before you leave the UK; the maximum Singapore NCD is 50%, capped at 5 years of clean Singapore driving.`,
      },
      {
        q: `Do I need comprehensive insurance in Singapore or is third-party fine?`,
        a: `Only third-party is legally required, but the maths on TPO vs comprehensive rarely favours TPO for a UK expat. A minor bump on a Singapore expressway easily costs SGD 4,000-10,000 in own-car repairs, and the annual premium saving on TPO is only SGD 700-1,400. Comprehensive is the right call for any car worth more than SGD 15k, which describes almost all UK-expat vehicles in Singapore.`,
      },
      {
        q: `Which Singapore insurers are best for UK expats in 2026?`,
        a: `Income Insurance (largest local, strong claims network), MSIG (Japanese-owned, best for newer or premium cars), AIG (aggressive multi-car household pricing), and Tokio Marine (premium pricing but smooth claims) are the four to quote. DirectAsia is worth a shot for young low-risk drivers. Use a comparator like SingSaver for three quotes in 5 minutes then approach 1-2 direct for final negotiation.`,
      },
      {
        q: `Is my Singapore insurance valid in Malaysia?`,
        a: `Third-party cover extends automatically. Comprehensive typically drops to TPO across the Causeway unless you add "full Malaysia cover" for SGD 100-300/year. Add it before your first trip if you drive to Johor or KL more than 3-4 times a year. If you lease, check the lease agreement — some SG leases prohibit cross-border driving or charge per-trip admin fees.`,
      },
    ],
  },
  '/singapore/car-insurance-vs-hong-kong': {
    title: `Expat Car Insurance: Singapore vs Hong Kong 2026`,
    desc: `SG vs HK car insurance: compulsory cover, NCD transfer, premiums, the SG forced-comp cliff at year 7, year-1 and year-5 GBP costs, and HK loadings (30-40%).`,
    type: `article`,
    faq: [
      {
        q: `Is car insurance cheaper in Singapore or Hong Kong for UK expats?`,
        a: `In GBP terms the two markets are within striking distance of each other. Year-one comprehensive on a mid-tier saloon with UK NCD transferred runs roughly £1,180-1,770 in Singapore and £1,220-1,830 in Hong Kong. By year five with a clean record the gap narrows further (~£710-1,060 SG vs ~£760-1,020 HK). Hong Kong has a wider variance band because postcode and parking location matter much more — Mid-Levels with private parking versus Tai Po outdoors can be a 30-40% premium swing on the same driver.`,
      },
      {
        q: `Will my UK no-claims discount transfer to Singapore or Hong Kong?`,
        a: `Both markets accept UK NCD on transfer with a current certificate from your UK insurer (dated within 24 months). Singapore is more standardised — major insurers (NTUC Income, AIG, FWD, Direct Asia) accept up to 50% NCD. Hong Kong is more variable — AIG, AXA and Zurich generally accept it; smaller insurers may haircut or decline. HK has a higher NCD ceiling (60-65%) so a long-tenured expat can end up paying less in HK in real terms.`,
      },
      {
        q: `What's the difference between car insurance rules in Singapore and Hong Kong?`,
        a: `The biggest structural difference is Singapore's forced-comprehensive cliff at year 7 — most insurers won't quote third-party-only on cars older than 7 years. Hong Kong has no such cliff, so you can keep a 12-year-old car on TPL-only. Excess is also structured differently: SG typical excess is S$500-1,000, HK is HK$3,000-6,000 (roughly equivalent in GBP). HK also has typhoon-flood-landslide loadings and Mainland China driving exclusions that SG doesn't.`,
      },
    ],
  },
  '/singapore/wise-vs-bank-transfer-car-deposits': {
    title: `Wise vs Bank Transfer for Car Deposits: SG & HK 2026`,
    desc: `What UK banks really charge on £25-80k transfers to SG/HK (2-4% hidden FX margin) vs Wise (transparent 0.4-0.6% + fee). Worked examples + timing playbook.`,
    type: `article`,
    faq: [
      {
        q: `What's the cheapest way to send GBP to Singapore for a car deposit?`,
        a: `For amounts above £5,000, Wise typically beats UK high-street banks by £600-£1,400+ per transfer thanks to the mid-market exchange rate. UK banks bake a 2-4% margin into the rate they quote, which is invisible as a fee but real cash. Wise charges a transparent fee on top of the true mid-market rate.`,
      },
      {
        q: `How long does a UK to Singapore or Hong Kong transfer take via Wise?`,
        a: `Most large GBP-to-SGD or GBP-to-HKD transfers via Wise complete same-day, often within an hour for amounts under £100k initiated before mid-afternoon UK time. UK bank SWIFT transfers: 1-3 working days. Plan to initiate transfers at least 2-3 working days before the dealer's payment deadline to absorb any delays.`,
      },
      {
        q: `Will my UK bank flag a £40,000 outbound transfer?`,
        a: `Possibly. UK banks' AML monitoring routinely flags individual transfers above £25,000 for source-of-funds verification. This is paperwork not a blocker — provide payslip and a one-line explanation ('vehicle purchase deposit, dealer X in Singapore/Hong Kong'). The transfer proceeds normally once verified.`,
      },
    ],
  },
  '/singapore/parallel-import-cars': {
    title: `Parallel Import Cars in Singapore: AD vs PI for UK Expats`,
    desc: `When parallel imports save UK expats money in Singapore (7-12% on small cars, 8-12% on Continentals) — and when warranty, financing, and resale erase the gap.`,
    type: `article`,
    faq: [
      {
        q: `Are parallel imports legal in Singapore?`,
        a: `Yes. Parallel imports are fully legal and regulated by LTA. PIs must be CASE-Trust accredited to operate transparently. Most major parallel importers (Vincar, Republic Auto, Cars & Stars) have been in business for 15+ years.`,
      },
      {
        q: `What's the typical price saving on a parallel-imported car in Singapore?`,
        a: `7-12% on small cars (Corolla, Mazda 3, Vezel) and 8-12% on premium marques (BMW, Mercedes). On a S$160,000 Corolla that's roughly S$12,000-S$18,000; on a BMW 3-Series it's S$20,000-S$35,000. Resale-value erosion typically eats 25-40% of that saving over 5 years.`,
      },
      {
        q: `Will my Singapore bank finance a parallel-imported car?`,
        a: `Generally yes for new cars from major brands through major PIs. DBS, OCBC, UOB and Standard Chartered all finance PI cars at the same MAS LTV rates as AD cars (50-60% maximum loan-to-value). Niche brands or very small PIs may face stricter scrutiny.`,
      },
    ],
  },
  '/singapore/funding-car-purchase': {
    title: `Funding a Car in Singapore: UK Expat Transfer Guide 2026`,
    desc: `Singapore car cost stack for UK expats — COE, ARF tiers, GST, excise — plus how to move £35-80k from UK to SG without losing thousands to FX margins.`,
    type: `article`,
    faq: [
      {
        q: `What's the cheapest way to send GBP to Singapore for a car purchase?`,
        a: `For amounts above £5,000, Wise typically beats UK high-street banks by £600-1,400 per transfer thanks to the mid-market exchange rate. UK banks bake a 2-4% margin into the rate they quote, which is invisible as a fee but real cash. Wise charges a transparent fee on top of the true mid-market rate.`,
      },
      {
        q: `How long does a UK to Singapore transfer take?`,
        a: `Wise: typically same-day for amounts under £100k, often within an hour. UK bank SWIFT transfers: 1-3 working days. Plan to initiate transfers at least 2-3 working days before the dealer's payment deadline to absorb any delays.`,
      },
      {
        q: `Should I take a Singapore car loan instead of transferring all the cash?`,
        a: `Often yes for cash-flow reasons. UK expats with valid Employment Pass and a few months of Singapore salary history can typically borrow 50-60% LTV against the OMV + ARF + COE total via Singapore banks. Reduces upfront GBP transfer; you service the SGD loan from your Singapore salary going forward.`,
      },
    ],
  },
  '/singapore/coe-guide': {
    title: `How the COE System Works for Expats in Singapore`,
    desc: `Singapore's Certificate of Entitlement system for expats: how bidding works, current COE prices, categories, renewal rules, and cost-management strategies.`,
    type: `article`,
    faq: [
      {
        q: `What is COE in Singapore?`,
        a: `COE (Certificate of Entitlement) is a government quota licence that gives you the right to own and use a vehicle in Singapore for 10 years. Without one, you cannot register a car. COE prices are set by open bidding and currently run between S$80,000 and S$100,000 for a standard family car.`,
      },
      {
        q: `How does COE bidding work?`,
        a: `COE is awarded through a sealed-bid, uniform-price auction held twice a month by the Land Transport Authority. You submit the maximum price you are willing to pay. All successful bidders pay the same price — the lowest winning bid, known as the Quota Premium.`,
      },
      {
        q: `Can expats bid for COE in Singapore?`,
        a: `Yes. Any individual with a valid Singapore driving licence or converted foreign licence can bid for COE. Most expats let their car dealer handle the bidding process as part of the purchase.`,
      },
    ],
  },
  '/singapore/new-arrival': {
    title: `New Arrival in Singapore? Your First-90-Days Car Checklist`,
    desc: `What expats need to sort in their first 90 days in Singapore — driving licence, vehicle options, MRT vs car economics, and how to avoid expensive early mistakes.`,
    type: `article`,
    faq: [
      {
        q: `When should new arrivals decide whether to get a car in Singapore?`,
        a: `Most relocation experts recommend living in Singapore for at least 60-90 days before deciding on a car. Use that time to test your daily commute on MRT and bus, see whether your home is in a walkable area, and understand whether the cost-versus-convenience math actually works for your family.`,
      },
      {
        q: `Can I drive in Singapore on a foreign licence as a new arrival?`,
        a: `Yes — for the first 12 months. After that you must convert to a Singapore licence. Most UK, Australian, NZ, and EU licences qualify for direct conversion without sitting a test, but you do need to apply within 12 months of becoming a resident.`,
      },
      {
        q: `What's the cheapest way to get on the road as a new expat in Singapore?`,
        a: `Short-term leasing (1-3 months) gives you flexibility while you settle. Expect SGD 2,000-3,000 per month for a sedan. Once you've decided whether you actually need a car long-term, switch to a 12-36 month lease for SGD 1,200-1,800 per month or commit to a purchase.`,
      },
    ],
  },
  '/hong-kong/new-arrival': {
    title: `New Arrival in Hong Kong? Your First-90-Days Car Checklist`,
    desc: `What expats need to sort in their first 90 days in Hong Kong — driving licence, MTR vs car decision, Octopus card vs car economics, and the realities of HK parking.`,
    type: `article`,
    faq: [
      {
        q: `Do I need a car when I first arrive in Hong Kong?`,
        a: `Most newly arrived expats in Hong Kong Island or Kowloon don't need a car. The MTR, buses, trams, and taxis cover almost everything. A car becomes more useful if you're settling in the New Territories or have school-age kids.`,
      },
      {
        q: `Can I drive on a UK or Australian licence in Hong Kong?`,
        a: `Yes — for the first 12 months. The UK, Australia, and many other jurisdictions are on Hong Kong's Direct Issue List, so you can convert without sitting a test. Apply early — Transport Department processing takes 5-10 working days, longer if your documents need verification.`,
      },
      {
        q: `How quickly can I get a car in Hong Kong as a new arrival?`,
        a: `Short-term lease companies can put you in a car within a week. Buying takes longer — 2-4 weeks if you're buying used from a dealer, longer for a new car needing First Registration Tax processing. Most new expats lease for the first 6-12 months while they decide.`,
      },
    ],
  },
  '/contact': {
    title: `Contact ExpatAutoAdviser — Singapore & Hong Kong Car Help`,
    desc: `Get in touch with ExpatAutoAdviser. Questions about expat car ownership in Singapore or Hong Kong, content corrections, or partnerships — we read everything.`,
    type: `website`,
  },
  '/privacy': {
    title: `Privacy Policy — ExpatAutoAdviser`,
    desc: `Privacy policy for ExpatAutoAdviser: what data we collect, how we use it, third-party services (Vercel, Brevo, Google Analytics), and your rights as a user.`,
    type: `website`,
  },
  '/terms': {
    title: `Terms of Use — ExpatAutoAdviser`,
    desc: `Terms of use for ExpatAutoAdviser. Editorial independence, affiliate disclosure, accuracy, limitations of liability, and the legal basis for using our content.`,
    type: `website`,
  },
  '/cookies': {
    title: `Cookies Policy — ExpatAutoAdviser`,
    desc: `Cookies policy for ExpatAutoAdviser: which cookies we set, third-party cookies, and how to control them in your browser.`,
    type: `website`,
  },
  '/affiliate-disclosure': {
    title: `Affiliate Disclosure — ExpatAutoAdviser`,
    desc: `ExpatAutoAdviser's affiliate disclosure: which articles contain affiliate links, how we choose partners, and our editorial independence policy.`,
    type: `website`,
  },
};

// ---- Build-time validation: every ROUTE must have a META entry ----
// Catches the drift bug from 2026-04-26 (new-arrival pages were in App.jsx but
// missing from META, which meant they prerendered with default placeholder
// titles). Now: missing META = build fails immediately, surfaced in CI logs.
const missingMeta = ROUTES.filter((route) => !META[route]);
if (missingMeta.length > 0) {
  console.error(`\n❌ prerender.mjs: ${missingMeta.length} route(s) in App.jsx have no META entry:`);
  missingMeta.forEach((r) => console.error(`   - ${r}`));
  console.error(`\nAdd a META entry for each, then re-run the build.\n`);
  process.exit(1);
}
console.log(`✅ prerender.mjs: ${ROUTES.length} routes, all have META entries`);

function buildSchema(route, meta) {
  const schemas = [];
  const url = BASE + (route === '/' ? '' : route);

  if (meta.type === 'article') {
    schemas.push(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title,
      description: meta.desc,
      url,
      publisher: {
        '@type': 'Organization',
        name: 'ExpatAutoAdviser',
        url: BASE,
      },
      dateModified: new Date().toISOString().split('T')[0],
    }));
  } else {
    schemas.push(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: meta.title,
      description: meta.desc,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: 'ExpatAutoAdviser',
        url: BASE,
      },
    }));
  }

  if (meta.faq && meta.faq.length > 0) {
    schemas.push(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    }));
  }

  // BreadcrumbList — derived from the route path. Helps Google show breadcrumb-trail
  // SERP rich results instead of bare URLs. Added 2026-04-26 for parity with DX schema.
  // 2026-05-25: also emit for homepage (single-item Home) to close the
  // schema_breadcrumb_missing audit warning on /.
  {
    const segments = route.split('/').filter(Boolean);
    const items = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
    ];
    let cumulativePath = '';
    segments.forEach((seg, i) => {
      cumulativePath += '/' + seg;
      const name = seg
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/Hong Kong/gi, 'Hong Kong')
        .replace(/^Frt /, 'FRT ')
        .replace(/Coe /, 'COE ')
        .replace(/Ev /, 'EV ')
        .replace(/Mot /, 'MOT ');
      items.push({
        '@type': 'ListItem',
        position: i + 2,
        name,
        item: BASE + cumulativePath,
      });
    });
    schemas.push(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    }));
  }

  return schemas
    .map(s => `  <script type="application/ld+json">${s}</script>`)
    .join('\n');
}

const template = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
const { render } = await import('./.ssr/entry-server.js');

for (const route of ROUTES) {
  const meta = META[route] || {
    title: 'ExpatAutoAdviser',
    desc: 'Free car guides for expats in Singapore and Hong Kong.',
    type: 'website',
  };

  const appHtml = render(route);
  const canonicalUrl = BASE + (route === '/' ? '' : route);

  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace(/<!--META_TITLE-->/g, meta.title)
    .replace('PAGE_TITLE_HERE', meta.title)
    .replace(/<!--META_DESC-->/g, meta.desc)
    .replace('<!--OG_URL-->', canonicalUrl)
    .replace('<!--CANONICAL-->', `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace('<!--PAGE_SCHEMA-->', buildSchema(route, meta));

  const outDir =
    route === '/'
      ? path.join(__dirname, 'dist')
      : path.join(__dirname, 'dist' + route);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log('Pre-rendered:', route);
}

const today = new Date().toISOString().split('T')[0];
const urlEntries = ROUTES.map(route => {
  const loc = BASE + (route === '/' ? '' : route);
  const priority = route === '/' ? '1.0' : route.split('/').length === 2 ? '0.8' : '0.7';
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>monthly</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
});

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urlEntries,
  '</urlset>',
].join('\n');

fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), sitemapXml);
console.log(`Sitemap generated: ${ROUTES.length} URLs`);
console.log('Pre-rendering complete!');
