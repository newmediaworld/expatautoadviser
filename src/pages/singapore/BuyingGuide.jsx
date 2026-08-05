import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/buying-a-used-car-in-singapore-coe-parf-paperwork.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1595696389610-2d339d4573c7?w=1200&q=80';

export default function SGBuyingGuide() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="Buying a Used Car in Singapore: COE, PARF, and Paperwork Explained"
      description="A practical guide to buying a used car in Singapore as an expat — how COE and PARF affect price, dealer vs private, inspection, paperwork, and the 7-day transfer rule."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'On-Road Price Calculator', to: '/singapore/car-on-road-price-calculator' },
        { label: 'Car Loans (MAS LTV)', to: '/singapore/car-loans' },
        { label: 'Subscription vs Ownership', to: '/singapore/subscription-vs-ownership' },
        { label: 'Cost of Driving (ERP)', to: '/singapore/cost-of-driving' },
        { label: 'Parallel Import Cars', to: '/singapore/parallel-import-cars' },
        { label: 'Selling Guide', to: '/singapore/selling-guide' },
      ]}
      markdown={markdown}
    />
  );
}
