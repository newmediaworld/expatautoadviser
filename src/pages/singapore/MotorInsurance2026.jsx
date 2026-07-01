import MarkdownArticlePage from '../../components/MarkdownArticlePage';
import markdown from '../../content/singapore-motor-insurance-2026-uk-expats.md?raw';

const HERO_IMG = 'https://images.unsplash.com/photo-1600664356348-10686526af4f?w=1200&q=80';

export default function SGMotorInsurance2026() {
  return (
    <MarkdownArticlePage
      city="sg"
      title="Singapore Motor Insurance 2026 for UK Expats: NCD Transfer, Insurers, Premiums"
      description="SG motor insurance 2026 for UK expats — NCD transfer 0-20%, comprehensive vs TPO, Income/MSIG/AIG/Tokio Marine premiums, Malaysia cover, MediSave, excess traps."
      heroImage={HERO_IMG}
      relatedLinks={[
        { label: 'Singapore Insurance Guide', to: '/singapore/insurance-guide' },
        { label: 'SG vs HK Insurance Comparison', to: '/singapore/car-insurance-vs-hong-kong' },
        { label: 'Singapore Leasing Guide', to: '/singapore/leasing-guide' },
        { label: 'Singapore Buying Guide', to: '/singapore/buying-guide' },
        { label: 'Singapore Cost of Driving', to: '/singapore/cost-of-driving' },
      ]}
      markdown={markdown}
    />
  );
}
