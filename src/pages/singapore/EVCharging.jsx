import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/ev-charging-singapore-uk-expats.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&q=80';

export default function SGEVCharging() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="EV Charging in Singapore for UK Expats (2026): Networks, Home Setup & Real Costs"
      description="Real costs of EV charging in Singapore for UK expats 2026 — SP/Charge+/Shell Recharge tariffs, HDB vs condo vs landed home charging, EEAI S$7,500 rebate maths, and which EVs UK expats actually pick."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'Singapore EV Buying Guide', to: '/singapore/ev-guide' },
        { label: 'Singapore Road Tax & Vehicle Fees', to: '/singapore/road-tax-vehicle-fees' },
        { label: 'Singapore Cost of Driving', to: '/singapore/cost-of-driving' },
        { label: 'Singapore Buying Guide', to: '/singapore/buying-guide' },
        { label: 'Singapore Leasing Guide', to: '/singapore/leasing-guide' },
      ]}
      markdown={markdown}
    />
  );
}
