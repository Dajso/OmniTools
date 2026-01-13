import { Metadata } from 'next';
import { TipCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tip Calculator - Split Bill Calculator',
  description: 'Calculate tip amount and split the bill between multiple people. Free tip calculator with preset percentages.',
  keywords: ['tip calculator', 'split bill calculator', 'gratuity calculator', 'restaurant tip'],
  alternates: { canonical: '/calculators/finance/tip-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tip Calculator',
  description: 'Calculate tip amount and split the bill between multiple people',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter bill amount', text: 'Input the total bill amount before tip.' },
  { name: 'Select tip percentage', text: 'Choose from preset percentages or enter a custom amount.' },
  { name: 'Set number of people', text: 'Enter how many people are splitting the bill.' },
  { name: 'View results', text: 'See the tip amount, total, and per-person breakdown.' },
];

const faqs = [
  { question: 'What is a standard tip percentage?', answer: 'In the US, 15-20% is considered standard for good service. 18% is a common default for restaurant dining.' },
  { question: 'Should I tip on the pre-tax or post-tax amount?', answer: 'Traditionally, tips are calculated on the pre-tax amount, though many people tip on the total for simplicity.' },
  { question: 'How do I split a bill fairly?', answer: 'Divide the total (including tip) by the number of people. Our calculator does this automatically for you.' },
  { question: 'When should I tip more than 20%?', answer: 'Consider tipping more for exceptional service, large parties, or complex orders. Some people tip 25% or more for outstanding experiences.' },
];

const relatedTools = [
  { href: '/calculators/finance/discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices and savings.' },
  { href: '/calculators/finance/sales-tax-calculator', title: 'Sales Tax Calculator', description: 'Calculate tax on purchases.' },
];

export default function TipCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tip-calculator"
          title="Tip Calculator"
          description="Calculate tip amount and easily split the bill between multiple people. Perfect for dining out with friends."
          colorClass="bg-green-100 text-green-600"
          category="Finance"
        />

        <section aria-label="Tip Calculator">
          <TipCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
