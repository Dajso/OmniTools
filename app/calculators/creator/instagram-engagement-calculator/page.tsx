import { Metadata } from 'next';
import { InstagramEngagementCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Instagram Engagement Rate Calculator - Free Tool',
  description: 'Calculate your Instagram engagement rate and compare to industry benchmarks. Free engagement calculator for influencers and brands.',
  keywords: ['instagram engagement calculator', 'engagement rate', 'instagram analytics', 'influencer calculator', 'social media metrics'],
  alternates: { canonical: '/calculators/creator/instagram-engagement-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Instagram Engagement Rate Calculator',
  description: 'Calculate Instagram engagement rate and compare to benchmarks',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter followers', text: 'Input your total Instagram follower count.' },
  { name: 'Add post metrics', text: 'Enter likes, comments, shares, and saves from recent posts.' },
  { name: 'Add more posts', text: 'For accuracy, add metrics from multiple recent posts.' },
  { name: 'Calculate', text: 'Click Calculate to see your engagement rate.' },
  { name: 'Compare', text: 'See how you compare to industry benchmarks for your follower tier.' },
];

const faqs = [
  {
    question: 'What is a good Instagram engagement rate?',
    answer: 'Generally, 1-3% is average, 3-6% is good, and above 6% is excellent. However, smaller accounts typically have higher engagement rates.',
  },
  {
    question: 'Why do smaller accounts have higher engagement?',
    answer: 'Smaller accounts often have more personal connections with followers. As accounts grow, engagement rates naturally decrease due to algorithm limitations and less personal content.',
  },
  {
    question: 'What metrics are included in engagement?',
    answer: 'Engagement includes likes, comments, shares, and saves. Some calculations also include story interactions and DMs.',
  },
  {
    question: 'How many posts should I analyze?',
    answer: 'For accurate results, analyze at least 10-12 recent posts. This accounts for variation in content performance.',
  },
  {
    question: 'How can I improve my engagement rate?',
    answer: 'Post consistently, use relevant hashtags, engage with your audience, post at optimal times, and create content that encourages interaction.',
  },
];

const relatedTools = [
  { href: '/calculators/creator/youtube-money-calculator', title: 'YouTube Money Calculator', description: 'Estimate YouTube ad revenue.' },
  { href: '/calculators/creator/cpm-calculator', title: 'CPM Calculator', description: 'Calculate advertising costs.' },
];

export default function InstagramEngagementCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="instagram-engagement-calculator"
          title="Instagram Engagement Calculator"
          description="Calculate your Instagram engagement rate and see how you compare to industry benchmarks."
          colorClass="bg-pink-100 text-pink-600"
        />

        <section aria-label="Instagram Engagement Calculator">
          <InstagramEngagementCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
