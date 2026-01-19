import { Metadata } from 'next';
import { OddsConverter } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Odds Converter - American, Decimal, Fractional',
  description: 'Convert betting odds between American, Decimal, and Fractional formats. Calculate implied probability and potential payouts.',
  keywords: ['odds converter', 'betting odds', 'American odds', 'decimal odds', 'fractional odds', 'implied probability'],
  alternates: { canonical: '/calculators/betting/odds-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Odds Converter',
  description: 'Convert betting odds between American, Decimal, and Fractional formats',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select format', text: 'Choose the odds format you want to convert from (American, Decimal, or Fractional).' },
  { name: 'Enter odds', text: 'Input the odds value in your selected format.' },
  { name: 'Enter stake', text: 'Optionally enter your stake amount to see potential payouts.' },
  { name: 'View results', text: 'See the odds converted to all formats plus implied probability.' },
];

const faqs = [
  {
    question: 'What are American odds?',
    answer: 'American odds show how much you win on a $100 bet (positive odds like +150) or how much you need to bet to win $100 (negative odds like -110). Positive odds indicate the underdog, negative odds indicate the favorite.',
  },
  {
    question: 'What are Decimal odds?',
    answer: 'Decimal odds represent the total payout per unit staked, including your original stake. For example, 2.50 means you get $2.50 back for every $1 bet (including your $1 stake, so $1.50 profit).',
  },
  {
    question: 'What are Fractional odds?',
    answer: 'Fractional odds (like 3/2) show the profit relative to your stake. 3/2 means you win $3 for every $2 bet. They are commonly used in UK and Irish betting.',
  },
  {
    question: 'What is implied probability?',
    answer: 'Implied probability is the likelihood of an outcome as suggested by the odds. It is calculated as 1/decimal odds × 100%. For example, 2.00 decimal odds imply a 50% probability.',
  },
  {
    question: 'Why do bookmaker probabilities add up to more than 100%?',
    answer: 'Bookmakers build in a margin (vig/juice) to ensure profit. The total implied probability of all outcomes typically exceeds 100%, with the excess being the bookmaker\'s edge.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/parlay-calculator', title: 'Parlay Calculator', description: 'Calculate combined odds for multi-bet parlays.' },
  { href: '/calculators/betting/implied-probability-calculator', title: 'Implied Probability', description: 'Calculate probability from odds.' },
  { href: '/calculators/betting/arbitrage-calculator', title: 'Arbitrage Calculator', description: 'Find surebet opportunities.' },
];

export default function OddsConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="odds-converter"
          title="Odds Converter"
          description="Convert betting odds between American, Decimal, and Fractional formats. Calculate implied probability and potential payouts instantly."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Odds Converter">
          <OddsConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
