import { Metadata } from 'next';
import { YouTubeMoneyCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'YouTube Money Calculator - Estimate Ad Revenue',
  description: 'Calculate how much money you can make on YouTube. Estimate ad revenue based on views and content category.',
  keywords: ['youtube money calculator', 'youtube earnings', 'youtube revenue calculator', 'youtube cpm', 'youtube income'],
  alternates: { canonical: '/calculators/creator/youtube-money-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube Money Calculator',
  description: 'Estimate YouTube ad revenue based on views',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your views', text: 'Input the total number of video views.' },
  { name: 'Select content category', text: 'Choose your content type for accurate CPM estimates.' },
  { name: 'Customize CPM', text: 'Optionally enter custom CPM values if you know your rates.' },
  { name: 'View estimates', text: 'See your estimated earnings range and projections.' },
];

const faqs = [
  {
    question: 'What is CPM?',
    answer: 'CPM (Cost Per Mille) is the amount advertisers pay per 1,000 ad impressions. YouTube pays creators about 55% of this amount.',
  },
  {
    question: 'Why is there a range in earnings?',
    answer: 'CPM varies based on factors like viewer location, time of year, ad inventory, and advertiser demand. The range shows typical low and high estimates.',
  },
  {
    question: 'Why do finance videos earn more?',
    answer: 'Advertisers in finance, insurance, and business pay higher CPMs because their customers have high lifetime value.',
  },
  {
    question: 'Are these estimates accurate?',
    answer: 'These are estimates based on industry averages. Actual earnings depend on many factors including audience demographics, watch time, and ad engagement.',
  },
  {
    question: 'How do I increase my YouTube earnings?',
    answer: 'Focus on longer videos (8+ minutes for mid-roll ads), high-value niches, US/UK audiences, and maximizing watch time.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/instagram-engagement-calculator', title: 'Instagram Engagement Calculator', description: 'Calculate your Instagram engagement rate.' },
  { href: '/calculators/creator/cpm-calculator', title: 'CPM Calculator', description: 'Calculate advertising costs.' },
  { href: '/calculators/creator/invoice-generator', title: 'Invoice Generator', description: 'Create invoices for sponsorships.' },
];

export default function YouTubeMoneyCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="youtube-money-calculator"
          title="YouTube Money Calculator"
          description="Estimate how much money you can make on YouTube based on views and content category."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="YouTube Money Calculator">
          <YouTubeMoneyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
