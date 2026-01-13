import { Metadata } from 'next';
import { CompoundInterestCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator - Free Investment Growth Calculator',
  description: 'Calculate compound interest with regular contributions. See how your investments grow over time with our free calculator.',
  keywords: ['compound interest calculator', 'investment calculator', 'interest calculator', 'savings calculator'],
  alternates: { canonical: '/calculators/finance/compound-interest-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  description: 'Calculate compound interest with regular contributions and see how your investments grow',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter initial investment', text: 'Input the amount you\'re starting with.' },
  { name: 'Set interest rate', text: 'Enter the expected annual interest rate.' },
  { name: 'Choose investment period', text: 'Select how many years to invest.' },
  { name: 'Select compounding frequency', text: 'Choose how often interest compounds (monthly is common).' },
  { name: 'Add contributions (optional)', text: 'Enter regular contributions to your investment.' },
  { name: 'View results', text: 'See your projected balance and growth chart.' },
];

const faqs = [
  { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on both the initial principal and accumulated interest. Your money grows faster because you earn interest on your interest.' },
  { question: 'How does compounding frequency affect returns?', answer: 'More frequent compounding yields higher returns. Monthly compounding earns slightly more than annual compounding at the same rate.' },
  { question: 'What is the Rule of 72?', answer: 'Divide 72 by your interest rate to estimate doubling time. At 8% interest, money doubles in about 9 years (72 ÷ 8 = 9).' },
  { question: 'What is a realistic interest rate?', answer: 'Stock market averages 7-10% annually. High-yield savings offer 4-5%. CDs and bonds typically offer 3-6%.' },
];

const relatedTools = [
  { href: '/calculators/finance/mortgage-calculator', title: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments.' },
  { href: '/calculators/finance/401k-calculator', title: '401(k) Calculator', description: 'Plan retirement with employer matching.' },
];

export default function CompoundInterestCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="compound-interest-calculator"
          title="Compound Interest Calculator"
          description="Calculate how your investments grow over time with compound interest. Add regular contributions to see the power of consistent investing."
          colorClass="bg-green-100 text-green-600"
          category="Finance"
        />

        <section aria-label="Compound Interest Calculator">
          <CompoundInterestCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
