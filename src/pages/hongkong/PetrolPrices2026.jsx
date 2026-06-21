import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/hong-kong-petrol-prices-2026-update.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=1200&q=80';

export default function HKPetrolPrices2026() {
  return (
    <MarkdownArticlePage
      city="hk"
      title="Hong Kong Petrol Prices 2026 Update: HK$32+/L Sustained — UK Expat Cost Guide"
      description="HK petrol prices 2026 for UK expats — HK$32-33/L sustained through Q2, why the government won't subsidise, what it changes for buy-vs-lease, EV switch, and MTR-vs-drive maths."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'Hong Kong Buying Guide', to: '/hong-kong/buying-guide' },
        { label: 'Hong Kong Leasing Guide', to: '/hong-kong/leasing-guide' },
        { label: 'Hong Kong First Registration Tax', to: '/hong-kong/frt-tax-explained' },
        { label: 'Hong Kong Parking Costs', to: '/hong-kong/parking-costs' },
        { label: 'Hong Kong Tunnel Tolls', to: '/hong-kong/tunnel-tolls-explained' },
      ]}
      markdown={markdown}
    />
  );
}
