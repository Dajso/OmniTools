import { Metadata } from 'next';
import { InflationCalculator } from '@/components/calculators/finance';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Inflation Calculator - Purchasing Power Calculator',
  description: 'Calculate how inflation affects purchasing power over time. See future value and historical comparisons.',
  keywords: ['inflation calculator', 'purchasing power calculator', 'cost of living calculator', 'inflation rate'],
  alternates: { canonical: '/calculators/finance/inflation-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Inflation Calculator',
  description: 'Calculate how inflation affects purchasing power over time',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqs = [
  { question: 'What is a typical inflation rate?', answer: 'The US Federal Reserve targets 2% annual inflation. Historical average is around 3%. Recent years have seen higher rates.' },
  { question: 'How does inflation affect savings?', answer: 'If your savings earn less than inflation, your purchasing power decreases. A 3% inflation rate means $100 today buys what $97 will buy next year.' },
  { question: 'How can I protect against inflation?', answer: 'Invest in assets that historically outpace inflation: stocks, real estate, I-bonds, or TIPS (Treasury Inflation-Protected Securities).' },
];

export default function InflationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="inflation-calculator"
          title="Inflation Calculator"
          description="See how inflation affects your money's purchasing power over time."
          colorClass="bg-green-100 text-green-700"
        />
        <section aria-label="Inflation Calculator"><InflationCalculator /></section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
