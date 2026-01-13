import { Metadata } from 'next';
import { SalesTaxCalculator } from '@/components/calculators/finance';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sales Tax Calculator - US State Tax Calculator',
  description: 'Calculate sales tax for any US state. Find tax rates and calculate totals with our free sales tax calculator.',
  keywords: ['sales tax calculator', 'state tax calculator', 'tax calculator', 'US sales tax'],
  alternates: { canonical: '/calculators/finance/sales-tax-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sales Tax Calculator',
  description: 'Calculate sales tax for any US state',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqs = [
  { question: 'Which states have no sales tax?', answer: 'Alaska, Delaware, Montana, New Hampshire, and Oregon have no state sales tax.' },
  { question: 'What is the highest sales tax state?', answer: 'California has the highest state sales tax rate at 7.25%, though local taxes can make total rates higher in other states.' },
  { question: 'Are there local sales taxes too?', answer: 'Yes, many cities and counties add local sales tax on top of state rates. Our calculator shows state rates only.' },
];

export default function SalesTaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sales-tax-calculator"
          title="Sales Tax Calculator"
          description="Calculate sales tax for any US state with current tax rates."
          colorClass="bg-green-100 text-green-700"
        />
        <section aria-label="Sales Tax Calculator"><SalesTaxCalculator /></section>
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
