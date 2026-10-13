import { Metadata } from 'next';
import { CPMCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'CPM Calculator - Cost Per Thousand Impressions',
  description: 'Calculate CPM (Cost Per Mille) for your advertising campaigns. Free CPM calculator with platform comparisons.',
  keywords: ['cpm calculator', 'cost per mille', 'advertising calculator', 'ad cost calculator', 'impressions calculator'],
  alternates: { canonical: '/calculators/creator/cpm-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CPM Calculator',
  description: 'Calculate Cost Per Mille for advertising campaigns',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select calculation mode', text: 'Choose what you want to calculate: CPM, cost, or impressions.' },
  { name: 'Enter your data', text: 'Input your ad spend, impressions, or CPM rate.' },
  { name: 'Add clicks (optional)', text: 'For full analysis, include click data for CPC and CTR.' },
  { name: 'Compare to platforms', text: 'Select a platform to compare your CPM to industry averages.' },
  { name: 'View results', text: 'See your calculated metrics and comparisons.' },
];

const faqs = [
  {
    question: 'What is CPM?',
    answer: 'CPM stands for Cost Per Mille (thousand). It\'s the cost an advertiser pays for 1,000 ad impressions.',
  },
  {
    question: 'What is a good CPM?',
    answer: 'A "good" CPM varies by platform and industry. Social media typically ranges from $5-15, while premium placements can be $20+.',
  },
  {
    question: 'What\'s the difference between CPM and CPC?',
    answer: 'CPM is cost per 1,000 impressions (views). CPC is cost per click. CPM is better for brand awareness; CPC for direct response.',
  },
  {
    question: 'How do I lower my CPM?',
    answer: 'Improve ad relevance, target more specific audiences, test different placements, and optimize ad creative for engagement.',
  },
  {
    question: 'What is CTR?',
    answer: 'CTR (Click-Through Rate) is the percentage of impressions that result in clicks. Higher CTR usually means more relevant ads.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/youtube-money-calculator', title: 'YouTube Money Calculator', description: 'Estimate YouTube ad revenue.' },
  { href: '/calculators/creator/instagram-engagement-calculator', title: 'Instagram Engagement Calculator', description: 'Calculate engagement rate.' },
  { href: '/calculators/finance/roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment.' },
];

export default function CPMCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cpm-calculator"
          title="CPM Calculator"
          description="Calculate Cost Per Mille (cost per thousand impressions) for your advertising campaigns."
          colorClass="bg-orange-100 text-orange-600"
        />

        <section aria-label="CPM Calculator">
          <CPMCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
