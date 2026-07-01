import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/true-cost-of-owning-a-car-singapore-2026.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80';

export default function SGTrueCostOwnership() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="The True Cost of Owning a Car in Singapore (2026)"
      description="The real all-in cost of car ownership in Singapore for UK expats in 2026: COE, depreciation, road tax, insurance, fuel, ERP and parking — with a worked three-year example."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'Road Tax & Vehicle Fees', to: '/singapore/road-tax-vehicle-fees' },
        { label: 'The Real Cost of Driving', to: '/singapore/cost-of-driving' },
        { label: 'Best Family Cars', to: '/singapore/best-family-cars' },
        { label: 'Subscription vs Ownership', to: '/singapore/subscription-vs-ownership' },
      ]}
      markdown={markdown}
    />
  );
}
