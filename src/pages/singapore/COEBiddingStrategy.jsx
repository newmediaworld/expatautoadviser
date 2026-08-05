import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/coe-bidding-strategy-singapore-uk-expats.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80';

export default function SGCOEBiddingStrategy() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="COE Bidding Strategy for UK Expats in Singapore: 3 Approaches Compared"
      description="Singapore's COE auction sets the price you pay; your strategy sets how long you wait and how much you over-pay. The 3 strategies UK expats use (Top of Market / Recent Cut-off / Patient Below), with worked outcomes."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'On-Road Price Calculator', to: '/singapore/car-on-road-price-calculator' },
        { label: 'COE System Explained', to: '/singapore/coe-guide' },
        { label: 'Singapore Buying Guide', to: '/singapore/buying-guide' },
        { label: 'Funding a Car Purchase', to: '/singapore/funding-car-purchase' },
        { label: 'Car Loans (MAS LTV)', to: '/singapore/car-loans' },
      ]}
      markdown={markdown}
    />
  );
}
