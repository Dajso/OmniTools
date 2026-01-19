import { Metadata } from 'next';
import { BettingRoiCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Betting ROI Calculator - Track Your Performance',
  description: 'Calculate your betting return on investment (ROI). Track wins, losses, and analyze your long-term betting performance.',
  keywords: ['betting ROI', 'sports betting tracker', 'betting performance', 'win rate calculator', 'betting profit'],
  alternates: { canonical: '/calculators/betting/betting-roi-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Betting ROI Calculator',
  description: 'Calculate your betting return on investment and track performance',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter totals', text: 'Input your total amount wagered and total amount returned.' },
  { name: 'Enter bet count', text: 'Input the total number of bets and how many you won.' },
  { name: 'Enter average odds', text: 'Input your average decimal odds across all bets.' },
  { name: 'Analyze results', text: 'Review your ROI, win rate, and performance analysis.' },
];

const faqs = [
  {
    question: 'What is a good betting ROI?',
    answer: 'Professional sports bettors typically achieve 2-10% ROI over the long term. Even 3-5% ROI is considered excellent. Anything consistently above 0% means you\'re beating the market.',
  },
  {
    question: 'How many bets do I need for meaningful ROI?',
    answer: 'At least 500-1000 bets are needed for statistically significant results. With fewer bets, variance can make even losing strategies appear profitable (or vice versa). Track your bets over months or years.',
  },
  {
    question: 'What is the break-even win rate?',
    answer: 'The break-even win rate is the percentage of bets you need to win to neither profit nor lose. At -110 odds (1.91 decimal), you need to win 52.4% of bets to break even.',
  },
  {
    question: 'What are units in betting?',
    answer: 'A unit is a standardized bet size, typically 1-2% of your bankroll. Tracking results in units allows comparison across different bet sizes and bankrolls. +10 units means you\'ve profited 10 times your standard bet size.',
  },
  {
    question: 'Why might my ROI be misleading?',
    answer: 'Short-term ROI can be heavily influenced by variance (luck). A small sample size, betting on heavy favorites, or a hot streak can all create misleading ROI figures. Always consider sample size when evaluating performance.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/kelly-criterion-calculator', title: 'Kelly Criterion', description: 'Calculate optimal bet sizing.' },
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/implied-probability-calculator', title: 'Implied Probability', description: 'Calculate probability from odds.' },
];

export default function BettingRoiCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="betting-roi-calculator"
          title="Betting ROI Calculator"
          description="Calculate your betting return on investment (ROI). Track wins, losses, and analyze your long-term betting performance."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Betting ROI Calculator">
          <BettingRoiCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
