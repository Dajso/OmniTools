import { Metadata } from 'next';
import { ParlayCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Parlay Calculator - Multi-Bet Odds Calculator',
  description: 'Calculate combined odds and potential payouts for parlay bets. See how multiple selections combine into one bet.',
  keywords: ['parlay calculator', 'accumulator', 'multi-bet', 'combined odds', 'sports betting'],
  alternates: { canonical: '/calculators/betting/parlay-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Parlay Calculator',
  description: 'Calculate combined odds and potential payouts for parlay bets',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter stake', text: 'Input the amount you want to bet on the parlay.' },
  { name: 'Add legs', text: 'Enter the odds for each selection in your parlay.' },
  { name: 'Add more legs', text: 'Click "Add Leg" to include additional selections.' },
  { name: 'View results', text: 'See combined odds, potential payout, and implied probability.' },
];

const faqs = [
  {
    question: 'What is a parlay bet?',
    answer: 'A parlay (also called an accumulator or multi-bet) combines multiple selections into one bet. All selections must win for the parlay to pay out, but the odds multiply together for potentially large payouts.',
  },
  {
    question: 'How are parlay odds calculated?',
    answer: 'Parlay odds are calculated by multiplying the decimal odds of each leg together. For example, two -110 bets (1.91 decimal each) combine to 1.91 × 1.91 = 3.65 decimal odds.',
  },
  {
    question: 'Are parlays a good bet?',
    answer: 'Parlays have a higher house edge than straight bets because the bookmaker\'s margin compounds with each leg. They\'re best used for entertainment or when you have strong conviction on multiple outcomes.',
  },
  {
    question: 'What happens if one leg pushes?',
    answer: 'Most sportsbooks remove the pushed leg from the parlay and recalculate the payout based on the remaining legs. A 4-leg parlay with one push becomes a 3-leg parlay.',
  },
  {
    question: 'What is a same-game parlay?',
    answer: 'A same-game parlay (SGP) combines multiple bets from the same game. These have correlated outcomes, so bookmakers adjust the odds accordingly (usually offering worse value than traditional parlays).',
  },
];

const relatedTools = [
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/implied-probability-calculator', title: 'Implied Probability', description: 'Calculate probability from odds.' },
  { href: '/calculators/betting/kelly-criterion-calculator', title: 'Kelly Criterion', description: 'Calculate optimal bet sizing.' },
];

export default function ParlayCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="parlay-calculator"
          title="Parlay Calculator"
          description="Calculate combined odds and potential payouts for parlay bets. See how multiple selections combine into one high-payout bet."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Parlay Calculator">
          <ParlayCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
