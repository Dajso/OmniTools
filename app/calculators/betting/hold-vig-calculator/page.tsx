import { Metadata } from 'next';
import { HoldVigCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hold/Vig Calculator - Bookmaker Margin Calculator',
  description: 'Calculate the bookmaker\'s margin (hold/vig/juice) on betting markets. Find the best value odds.',
  keywords: ['vig calculator', 'hold calculator', 'juice calculator', 'bookmaker margin', 'sports betting'],
  alternates: { canonical: '/calculators/betting/hold-vig-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hold/Vig Calculator',
  description: 'Calculate the bookmaker\'s margin on betting markets',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select format', text: 'Choose American or Decimal odds format.' },
  { name: 'Enter odds', text: 'Input the odds for both outcomes of a two-way market.' },
  { name: 'View hold', text: 'See the bookmaker\'s margin and no-vig fair odds.' },
  { name: 'Compare', text: 'Use the examples to compare different vig levels.' },
];

const faqs = [
  {
    question: 'What is the vig (vigorish)?',
    answer: 'The vig (also called juice, hold, or margin) is the bookmaker\'s built-in profit on a betting market. It\'s the difference between the true odds and the odds offered. Standard vig on a -110/-110 market is about 4.55%.',
  },
  {
    question: 'How does vig affect my bets?',
    answer: 'The vig reduces your expected return on every bet. On a -110/-110 market, you need to win 52.4% of your bets just to break even. Lower vig means you need to win less often to be profitable.',
  },
  {
    question: 'What is a good vig percentage?',
    answer: 'Standard vig is around 4-5% (-110/-110). Reduced juice books offer 2-3% (-105/-105). Betting exchanges can have vig under 2%. Lower is always better for bettors.',
  },
  {
    question: 'What are no-vig odds?',
    answer: 'No-vig (or fair) odds are what the odds would be without any bookmaker margin. They represent the true implied probability of each outcome. Comparing actual odds to no-vig odds shows how much value you\'re giving up.',
  },
  {
    question: 'Why do different sportsbooks have different vig?',
    answer: 'Sportsbooks compete on vig to attract bettors. Some offer reduced juice as a marketing strategy, while others maintain higher margins. Shopping for the best odds across multiple books can significantly improve your long-term results.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/implied-probability-calculator', title: 'Implied Probability', description: 'Calculate probability from odds.' },
  { href: '/calculators/betting/arbitrage-calculator', title: 'Arbitrage Calculator', description: 'Find surebet opportunities.' },
];

export default function HoldVigCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hold-vig-calculator"
          title="Hold/Vig Calculator"
          description="Calculate the bookmaker's margin (hold/vig/juice) on betting markets. Find the best value odds and understand what you're paying in fees."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Hold/Vig Calculator">
          <HoldVigCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
