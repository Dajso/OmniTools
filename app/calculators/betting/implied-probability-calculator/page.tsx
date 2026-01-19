import { Metadata } from 'next';
import { ImpliedProbabilityCalculator } from '@/components/calculators/betting';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Implied Probability Calculator - Odds to Probability',
  description: 'Calculate the implied probability from betting odds. Understand what the odds suggest about the likelihood of an outcome.',
  keywords: ['implied probability', 'odds probability', 'betting odds', 'probability calculator', 'sports betting'],
  alternates: { canonical: '/calculators/betting/implied-probability-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Implied Probability Calculator',
  description: 'Calculate the implied probability from betting odds',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select format', text: 'Choose the odds format (American, Decimal, or Fractional).' },
  { name: 'Enter odds', text: 'Input the odds you want to analyze.' },
  { name: 'View probability', text: 'See the implied probability and compare to your own estimate.' },
  { name: 'Find value', text: 'If your estimated probability is higher, the bet may have value.' },
];

const faqs = [
  {
    question: 'What is implied probability?',
    answer: 'Implied probability is the probability of an outcome as suggested by the betting odds. It represents what the bookmaker believes (or wants you to believe) is the likelihood of that outcome occurring.',
  },
  {
    question: 'How do I find value bets?',
    answer: 'A value bet exists when your estimated probability of an outcome is higher than the implied probability from the odds. For example, if odds imply 40% but you believe it\'s 50%, that\'s a value bet.',
  },
  {
    question: 'Why do implied probabilities add up to more than 100%?',
    answer: 'Bookmakers include a margin (vig/juice) in their odds. For a two-outcome event, the implied probabilities might add up to 105-110%, with the excess being the bookmaker\'s profit margin.',
  },
  {
    question: 'What are "fair odds"?',
    answer: 'Fair odds are the odds that would exist without any bookmaker margin. They represent the true probability converted to odds. Fair odds = 1 / (probability / 100).',
  },
  {
    question: 'How accurate are implied probabilities?',
    answer: 'Implied probabilities from betting markets are often quite accurate, especially for major events with high liquidity. However, they include the bookmaker\'s margin and may not reflect true probabilities perfectly.',
  },
];

const relatedTools = [
  { href: '/calculators/betting/odds-converter', title: 'Odds Converter', description: 'Convert between odds formats.' },
  { href: '/calculators/betting/hold-vig-calculator', title: 'Hold/Vig Calculator', description: 'Calculate bookmaker margins.' },
  { href: '/calculators/betting/kelly-criterion-calculator', title: 'Kelly Criterion', description: 'Calculate optimal bet sizing.' },
];

export default function ImpliedProbabilityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="implied-probability-calculator"
          title="Implied Probability Calculator"
          description="Calculate the implied probability from betting odds. Understand what the odds suggest about the likelihood of an outcome."
          colorClass="bg-green-100 text-green-600"
          category="Betting"
        />

        <section aria-label="Implied Probability Calculator">
          <ImpliedProbabilityCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
