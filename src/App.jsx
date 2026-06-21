import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Singapore from './pages/Singapore';
import HongKong from './pages/HongKong';
import SGShouldIGetACar from './pages/singapore/ShouldIGetACar';
import SGLeasingGuide from './pages/singapore/LeasingGuide';
import SGInsuranceGuide from './pages/singapore/InsuranceGuide';
import SGLicenceConversion from './pages/singapore/LicenceConversion';
import SGEVGuide from './pages/singapore/EVGuide';
import SGEVCharging from './pages/singapore/EVCharging';
import SGCalculators from './pages/singapore/Calculators';
import SGGarageFinder from './pages/singapore/GarageFinder';
import SGBuyingGuide from './pages/singapore/BuyingGuide';
import HKShouldIGetACar from './pages/hongkong/ShouldIGetACar';
import HKBuyingGuide from './pages/hongkong/BuyingGuide';
import HKLeasingGuide from './pages/hongkong/LeasingGuide';
import HKFRTExplained from './pages/hongkong/FRTExplained';
import HKInsuranceGuide from './pages/hongkong/InsuranceGuide';
import HKMOTMaintenance from './pages/hongkong/MOTMaintenance';
import HKLicenceConversion from './pages/hongkong/LicenceConversion';
import HKEVGuide from './pages/hongkong/EVGuide';
import HKPetrolPrices2026 from './pages/hongkong/PetrolPrices2026';
import HKCalculators from './pages/hongkong/Calculators';
import HKGarageFinder from './pages/hongkong/GarageFinder';
import SGLeaseChecker from './pages/singapore/LeaseChecker';
import HKLeaseChecker from './pages/hongkong/LeaseChecker';
import SGNewArrival from './pages/singapore/NewArrival';
import HKNewArrival from './pages/hongkong/NewArrival';
import HKSellingGuide from './pages/hongkong/SellingGuide';
import SGCostOfDriving from './pages/singapore/CostOfDriving';
import SGCarLoans from './pages/singapore/CarLoans';
import SGChildCarSeats from './pages/singapore/ChildCarSeats';
import SGSubscriptionVsOwnership from './pages/singapore/SubscriptionVsOwnership';
import SGCOEGuide from './pages/singapore/COEGuide';
import SGFundingCarPurchase from './pages/singapore/FundingCarPurchase';
import SGParallelImport from './pages/singapore/ParallelImport';
import SGWiseVsBank from './pages/singapore/WiseVsBank';
import SGCOEBiddingStrategy from './pages/singapore/COEBiddingStrategy';
import HKParkingCosts from './pages/hongkong/ParkingCosts';
import SGSellingGuide from './pages/singapore/SellingGuide';
import SGInsuranceVsHongKong from './pages/singapore/InsuranceVsHongKong';
import SGRoadTaxAndFees from './pages/singapore/RoadTaxAndFees';
import SGBestFamilyCars from './pages/singapore/BestFamilyCars';
import HKTunnelTolls from './pages/hongkong/TunnelTolls';
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Cookies from './pages/legal/Cookies';
import AffiliateDisclosure from './pages/legal/AffiliateDisclosure';
import Contact from './pages/legal/Contact';
import CookieConsent from './components/CookieConsent';
import ScrollToTop from './components/ScrollToTop';

export function ExitIntent() {
  // Start hidden — flip to visible after mount so SSR HTML and the initial
  // client render match. The previous default of `true` caused a React #418
  // hydration mismatch: SSR omitted ExitIntent entirely (entry-server.jsx
  // only rendered AppRoutes) while the hydrated client tree included it
  // rendered with show=true.
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const { pathname } = useLocation();

  async function subscribe(e) {
    e.preventDefault();
    if (!email) return;
    const path = pathname || '';
    const city = path.startsWith('/hong-kong') || path.startsWith('/hongkong') ? 'hk' : 'sg';
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sourcePage: path || '/',
          sourceType: 'exit-intent',
          firstMagnet: '',
          city,
          source: 'exit_intent',
          guideTopic: 'general',
        }),
      });
    } catch {}
    setDone(true);
    setTimeout(() => setShow(false), 2000);
  }

  if (!show) return null;
  const PATRICK_IMG = "/patrick.png";

  return (
    <>
      <style>{`@media (max-width: 768px) { .exit-intent-banner, .exit-intent-spacer { display: none !important; } }`}</style>
      <div className="exit-intent-spacer" style={{ height: 52 }} />
      <div className="exit-intent-banner" style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 99999, background: 'rgba(10,12,18,0.92)', backdropFilter: 'blur(8px)', color: '#fff', height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 640 }}>
      <img src={PATRICK_IMG} alt="Patrick" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      {done ? (
        <span style={{ fontSize: 14, fontWeight: 600 }}>{"✓ You're in! Check your inbox for your starter guide."}</span>
      ) : (
        <>
          <span style={{ fontSize: 13, flexShrink: 0 }}>New expat car guides and market updates — straight to your inbox</span>
          <form onSubmit={subscribe} style={{ display: 'flex', gap: 6, flex: 1, maxWidth: 300 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: 'none', fontSize: 13, minWidth: 0 }} />
            <button type="submit" style={{ background: '#e63946', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
          </form>
        </>
      )}
      <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', opacity: 0.7, marginLeft: 'auto', flexShrink: 0 }}>{'×'}</button>
      </div>
    </>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/singapore" element={<Singapore />} />
      <Route path="/singapore/should-i-get-a-car" element={<SGShouldIGetACar />} />
      <Route path="/singapore/buying-guide" element={<SGBuyingGuide />} />
      <Route path="/singapore/leasing-guide" element={<SGLeasingGuide />} />
      <Route path="/singapore/insurance-guide" element={<SGInsuranceGuide />} />
      <Route path="/singapore/licence-conversion" element={<SGLicenceConversion />} />
      <Route path="/singapore/ev-guide" element={<SGEVGuide />} />
      <Route path="/singapore/ev-charging" element={<SGEVCharging />} />
      <Route path="/singapore/calculators" element={<SGCalculators />} />
      <Route path="/singapore/garage-finder" element={<SGGarageFinder />} />
      <Route path="/singapore/lease-checker" element={<SGLeaseChecker />} />
      <Route path="/singapore/new-arrival" element={<SGNewArrival />} />
      <Route path="/singapore/cost-of-driving" element={<SGCostOfDriving />} />
      <Route path="/singapore/car-loans" element={<SGCarLoans />} />
      <Route path="/singapore/child-car-seats" element={<SGChildCarSeats />} />
      <Route path="/singapore/subscription-vs-ownership" element={<SGSubscriptionVsOwnership />} />
      <Route path="/singapore/coe-guide" element={<SGCOEGuide />} />
      <Route path="/singapore/funding-car-purchase" element={<SGFundingCarPurchase />} />
      <Route path="/singapore/parallel-import-cars" element={<SGParallelImport />} />
      <Route path="/singapore/wise-vs-bank-transfer-car-deposits" element={<SGWiseVsBank />} />
      <Route path="/singapore/coe-bidding-strategy" element={<SGCOEBiddingStrategy />} />
      <Route path="/singapore/selling-guide" element={<SGSellingGuide />} />
      <Route path="/singapore/car-insurance-vs-hong-kong" element={<SGInsuranceVsHongKong />} />
      <Route path="/singapore/road-tax-vehicle-fees" element={<SGRoadTaxAndFees />} />
      <Route path="/singapore/best-family-cars" element={<SGBestFamilyCars />} />
      <Route path="/hong-kong/tunnel-tolls-explained" element={<HKTunnelTolls />} />
      <Route path="/hong-kong" element={<HongKong />} />
      <Route path="/hong-kong/should-i-get-a-car" element={<HKShouldIGetACar />} />
      <Route path="/hong-kong/buying-guide" element={<HKBuyingGuide />} />
      <Route path="/hong-kong/leasing-guide" element={<HKLeasingGuide />} />
      <Route path="/hong-kong/frt-tax-explained" element={<HKFRTExplained />} />
      <Route path="/hong-kong/insurance-guide" element={<HKInsuranceGuide />} />
      <Route path="/hong-kong/mot-maintenance" element={<HKMOTMaintenance />} />
      <Route path="/hong-kong/licence-conversion" element={<HKLicenceConversion />} />
      <Route path="/hong-kong/ev-guide" element={<HKEVGuide />} />
      <Route path="/hong-kong/petrol-prices-2026-update" element={<HKPetrolPrices2026 />} />
      <Route path="/hong-kong/calculators" element={<HKCalculators />} />
      <Route path="/hong-kong/garage-finder" element={<HKGarageFinder />} />
      <Route path="/hong-kong/lease-checker" element={<HKLeaseChecker />} />
      <Route path="/hong-kong/new-arrival" element={<HKNewArrival />} />
      <Route path="/hong-kong/selling-guide" element={<HKSellingGuide />} />
      <Route path="/hong-kong/parking-costs" element={<HKParkingCosts />} />

      {/* Legal pages */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
      <Route path="/contact" element={<Contact />} />

      {/* Redirects from old /hongkong paths to /hong-kong */}
      <Route path="/hongkong" element={<Navigate to="/hong-kong" replace />} />
      <Route path="/hongkong/should-i-get-a-car" element={<Navigate to="/hong-kong/should-i-get-a-car" replace />} />
      <Route path="/hongkong/buying-guide" element={<Navigate to="/hong-kong/buying-guide" replace />} />
      <Route path="/hongkong/leasing-guide" element={<Navigate to="/hong-kong/leasing-guide" replace />} />
      <Route path="/hongkong/frt-tax-explained" element={<Navigate to="/hong-kong/frt-tax-explained" replace />} />
          <Route path="/hong-kong/frt-explained" element={<Navigate to="/hong-kong/frt-tax-explained" replace />} />
          <Route path="/hongkong/frt-explained" element={<Navigate to="/hong-kong/frt-tax-explained" replace />} />
      <Route path="/hongkong/insurance-guide" element={<Navigate to="/hong-kong/insurance-guide" replace />} />
      <Route path="/hongkong/mot-maintenance" element={<Navigate to="/hong-kong/mot-maintenance" replace />} />
      <Route path="/hongkong/licence-conversion" element={<Navigate to="/hong-kong/licence-conversion" replace />} />
      <Route path="/hongkong/ev-guide" element={<Navigate to="/hong-kong/ev-guide" replace />} />
      <Route path="/hongkong/calculators" element={<Navigate to="/hong-kong/calculators" replace />} />
      <Route path="/hongkong/garage-finder" element={<Navigate to="/hong-kong/garage-finder" replace />} />
      <Route path="/hongkong/lease-checker" element={<Navigate to="/hong-kong/lease-checker" replace />} />
    </Routes>
  );
}

// AppShell — the router-agnostic part of the tree. Used by App (with
// BrowserRouter for the client) and by entry-server.jsx (with StaticRouter
// for SSR). Keeping a single shell ensures the SSR HTML and the hydrated
// client tree match exactly — the cause of the May 2026 React #418
// hydration errors was that entry-server only rendered AppRoutes while the
// client added ScrollToTop, ExitIntent, and CookieConsent on top.
export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <ExitIntent />
      <AppRoutes />
      <CookieConsent />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
