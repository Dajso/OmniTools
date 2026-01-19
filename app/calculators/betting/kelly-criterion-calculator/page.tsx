import { Metadata } from 'next';
import { KellyCriterionCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kelly Criterion Calculator - Optimal Bet Sizing',
  description: 'Calculate optimal bet sizing using the Kelly Criterion formula. Maximize long-term growth while managing risk.',
  keywords: ['Kelly Criterion', 'bet sizing', 'bankroll management', 'sports betting', 'optimal betting'],
  alternates: { canonical: '/calculators/betting/kelly-criterion-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kelly Criterion Calculator',
  description: 'Calculate optimal bet sizing using the Kelly Criterion formula',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter odds', text: 'Input the odds offered by the bookmaker in American or Decimal format.' },
  { name: 'Estimate probability', text: 'Enter your estimated probability of winning (this requires skill and research).' },
  { name: 'Enter bankroll', text: 'Input your total betting bankroll.' },
  { name: 'View recommendation', text: 'See the optimal bet size and consider using fractional Kelly for safety.' },
];

const faqs = [
  {
    question: 'What is the Kelly Criterion?',
    answer: 'The Kelly Criterion is a mathematical formula that determines the optimal size of a series of bets to maximize long-term growth of your bankroll. It was developed by John Kelly at Bell Labs in 1956.',
  },
  {
    question: 'Why use Half Kelly or Quarter Kelly?',
    answer: 'Full Kelly can be very aggressive and lead to large swings in your bankroll. Half Kelly provides about 75% of the growth rate with significantly less variance. Quarter Kelly is even more conservative. Most professional bettors use fractional Kelly.',
  },
  {
    question: 'What does "edge" mean in betting?',
    answer: 'Edge is the advantage you have over the bookmaker. If you estimate a 55% chance of winning but the odds imply only 50%, you have a 5% edge. Kelly only recommends betting when you have a positive edge.',
  },
  {
    question: 'How do I estimate win probability?',
    answer: 'Estimating true probabilities requires research, statistical analysis, and experience. You might use historical data, power ratings, situational factors, and other information to form your estimate.',
  },
  {
    question: 'What if Kelly suggests not betting?',
    answer: 'If Kelly returns 0%, it means you don\'t have an edge at the given odds. Either your probability estimate is too low, or the odds aren\'t favorable enough. Don\'t bet without an edge.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/implied-probability-calculator', title: 'Implied Probability', description: 'Calculate probability from odds.' },
  { href: '/calculators/betting/betting-roi-calculator', title: 'Betting ROI', description: 'Track your betting performance.' },
];

export default function KellyCriterionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="kelly-criterion-calculator"
          title="Kelly Criterion Calculator"
          description="Calculate optimal bet sizing using the Kelly Criterion formula. Maximize long-term bankroll growth while managing risk."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Kelly Criterion Calculator">
          <KellyCriterionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
