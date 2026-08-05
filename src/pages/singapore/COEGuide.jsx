import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/how-the-coe-system-works-for-expats-in-singapore.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1594028411108-96a5b0302a4a?w=1200&q=80';

export default function SGCOEGuide() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="How the COE System Works for Expats in Singapore"
      description="Everything expats need to know about Singapore's Certificate of Entitlement system: how bidding works, current COE prices, categories, renewal rules, and strategies to manage the cost."
      heroImage={HERO_IMG}
      heroPosition="center 40%"
      relatedLinks={[
        { label: 'On-Road Price Calculator', to: '/singapore/car-on-road-price-calculator' },
        { label: 'Buying Guide', to: '/singapore/buying-guide' },
        { label: 'Cost of Driving (ERP)', to: '/singapore/cost-of-driving' },
        { label: 'Car Loans (MAS LTV)', to: '/singapore/car-loans' },
        { label: 'COE Bidding Strategy', to: '/singapore/coe-bidding-strategy' },
      ]}
      markdown={markdown}
    />
  );
}
