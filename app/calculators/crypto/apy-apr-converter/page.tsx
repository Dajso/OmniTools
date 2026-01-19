import { Metadata } from 'next';
import { APYAPRConverter } from '@/components/calculators/crypto';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'APY to APR Converter - DeFi Yield Calculator',
  description: 'Convert between APY and APR for DeFi yield calculations. Understand compound interest and compare yields across different compounding frequencies.',
  keywords: ['apy calculator', 'apr converter', 'defi yield', 'compound interest', 'crypto yield', 'staking calculator'],
  alternates: { canonical: '/calculators/crypto/apy-apr-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'APY/APR Converter',
  description: 'Convert between APY and APR for DeFi yield calculations',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select direction', text: 'Choose whether to convert APR to APY or APY to APR.' },
  { name: 'Enter rate', text: 'Input the interest rate as a percentage.' },
  { name: 'Select compounding', text: 'Choose how often interest compounds (daily, monthly, etc.).' },
  { name: 'View results', text: 'See the converted rate and compare across compounding frequencies.' },
];

const faqs = [
  {
    question: 'What is the difference between APY and APR?',
    answer: 'APR (Annual Percentage Rate) is the simple interest rate without compounding. APY (Annual Percentage Yield) includes the effect of compound interest, making it higher than APR for the same nominal rate.',
  },
  {
    question: 'Why do DeFi protocols show APY?',
    answer: 'DeFi protocols typically show APY because it represents the actual return you would earn if you reinvest your rewards. Since most DeFi yields compound frequently (often daily), APY gives a more accurate picture.',
  },
  {
    question: 'How does compounding frequency affect returns?',
    answer: 'More frequent compounding results in higher effective returns. Daily compounding yields more than monthly, which yields more than annual compounding for the same APR.',
  },
  {
    question: 'What is continuous compounding?',
    answer: 'Continuous compounding is the mathematical limit of compounding frequency approaching infinity. It uses the formula APY = e^APR - 1 and represents the maximum possible yield for a given APR.',
  },
  {
    question: 'Are high APY rates sustainable?',
    answer: 'Very high APY rates (100%+) are often unsustainable and may indicate high risk. They can come from token emissions that dilute value, or from protocols that may not last. Always research the source of yield.',
  },
];

const relatedTools = [
  { href: '/calculators/crypto/impermanent-loss-calculator', title: 'Impermanent Loss Calculator', description: 'Calculate DeFi liquidity pool losses.' },
  { href: '/calculators/finance/compound-interest-calculator', title: 'Compound Interest Calculator', description: 'Calculate investment growth over time.' },
  { href: '/calculators/finance/crypto-profit-loss', title: 'Crypto Profit/Loss', description: 'Calculate cryptocurrency gains.' },
];

export default function APYAPRConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="apy-apr-converter"
          title="APY/APR Converter"
          description="Convert between Annual Percentage Yield (APY) and Annual Percentage Rate (APR). Essential for understanding DeFi yields and staking rewards."
          colorClass="bg-emerald-100 text-emerald-600"
          category="Crypto"
        />

        <section aria-label="APY/APR Converter">
          <APYAPRConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
