import { Metadata } from 'next';
import { HedgingCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hedging Calculator - Lock In Profits',
  description: 'Calculate optimal hedge bets to lock in profits or minimize losses on your existing bets.',
  keywords: ['hedging calculator', 'hedge bet', 'lock in profit', 'sports betting', 'risk management'],
  alternates: { canonical: '/calculators/betting/hedging-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hedging Calculator',
  description: 'Calculate optimal hedge bets to lock in profits or minimize losses',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter original bet', text: 'Input your original stake and the odds you received.' },
  { name: 'Enter hedge odds', text: 'Input the current odds available for the opposite outcome.' },
  { name: 'Choose hedge type', text: 'Select whether you want guaranteed equal profit or equal stakes.' },
  { name: 'View recommendation', text: 'See the optimal hedge stake and guaranteed profit.' },
];

const faqs = [
  {
    question: 'What is hedging in sports betting?',
    answer: 'Hedging is a risk management strategy where you place a bet on the opposite outcome of your original bet to guarantee a profit or minimize potential losses, regardless of the final result.',
  },
  {
    question: 'When should I hedge a bet?',
    answer: 'Consider hedging when: your original bet is in a strong position to win, the potential profit is significant, you want to lock in guaranteed money, or you want to reduce risk on a large bet.',
  },
  {
    question: 'What is the difference between hedging and arbitrage?',
    answer: 'Arbitrage involves placing bets on all outcomes simultaneously to guarantee profit. Hedging is done after an original bet is placed, typically when circumstances have changed in your favor.',
  },
  {
    question: 'Does hedging always guarantee profit?',
    answer: 'Not always. If the hedge odds are unfavorable, hedging might lock in a smaller profit or even a loss. The calculator shows whether hedging is recommended based on current odds.',
  },
  {
    question: 'What is a middle opportunity?',
    answer: 'A middle occurs when you can hedge in a way that creates a range where both bets could win. For example, betting on a team -3 and later hedging with +5 creates a middle if the team wins by 4.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/arbitrage-calculator', title: 'Arbitrage Calculator', description: 'Find surebet opportunities.' },
  { href: '/calculators/betting/kelly-criterion-calculator', title: 'Kelly Criterion', description: 'Calculate optimal bet sizing.' },
  { href: '/calculators/betting/parlay-calculator', title: 'Parlay Calculator', description: 'Calculate parlay odds and payouts.' },
];

export default function HedgingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hedging-calculator"
          title="Hedging Calculator"
          description="Calculate optimal hedge bets to lock in profits or minimize losses on your existing bets."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Hedging Calculator">
          <HedgingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
