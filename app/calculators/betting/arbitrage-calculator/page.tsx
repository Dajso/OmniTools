import { Metadata } from 'next';
import { ArbitrageCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Arbitrage Calculator - Surebet Finder',
  description: 'Detect arbitrage betting opportunities and calculate optimal stake distribution for guaranteed profits.',
  keywords: ['arbitrage calculator', 'surebet', 'arbitrage betting', 'sports betting', 'guaranteed profit'],
  alternates: { canonical: '/calculators/betting/arbitrage-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Arbitrage Calculator',
  description: 'Detect arbitrage betting opportunities and calculate optimal stake distribution',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter total stake', text: 'Input the total amount you want to bet across all outcomes.' },
  { name: 'Add outcomes', text: 'Enter the odds for each outcome from different bookmakers.' },
  { name: 'Check for arbitrage', text: 'The calculator will detect if an arbitrage opportunity exists.' },
  { name: 'View stake distribution', text: 'See exactly how much to bet on each outcome for guaranteed profit.' },
];

const faqs = [
  {
    question: 'What is arbitrage betting?',
    answer: 'Arbitrage betting (or "arbing") is a strategy where you bet on all possible outcomes of an event using different bookmakers, guaranteeing a profit regardless of the result. This is possible when bookmakers have different opinions on the odds.',
  },
  {
    question: 'How do I find arbitrage opportunities?',
    answer: 'Compare odds across multiple bookmakers for the same event. When the sum of implied probabilities (1/decimal odds) is less than 1 (or 100%), an arbitrage opportunity exists.',
  },
  {
    question: 'Is arbitrage betting legal?',
    answer: 'Arbitrage betting is legal in most jurisdictions. However, bookmakers may limit or close accounts of bettors they suspect of arbing, as it reduces their profits.',
  },
  {
    question: 'What are the risks of arbitrage betting?',
    answer: 'Risks include: odds changing before you place all bets, account limitations, human error in calculations, and the need for significant capital across multiple bookmaker accounts.',
  },
  {
    question: 'What profit margins are typical for arbitrage?',
    answer: 'Typical arbitrage margins range from 1-5%. While small, these are guaranteed profits. Higher margins are rare and may indicate an error or a very short-lived opportunity.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/hedging-calculator', title: 'Hedging Calculator', description: 'Calculate hedge bets for risk management.' },
  { href: '/calculators/betting/hold-vig-calculator', title: 'Hold/Vig Calculator', description: 'Calculate bookmaker margins.' },
];

export default function ArbitrageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="arbitrage-calculator"
          title="Arbitrage Calculator"
          description="Detect arbitrage betting opportunities (surebets) and calculate optimal stake distribution for guaranteed profits."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Arbitrage Calculator">
          <ArbitrageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
