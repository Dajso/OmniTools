import { Metadata } from 'next';
import { DiscountCalculator } from '@/components/calculators/finance';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Discount Calculator - Sale Price Calculator',
  description: 'Calculate sale prices with discounts and sales tax. See how much you save with our free discount calculator.',
  keywords: ['discount calculator', 'sale price calculator', 'percent off calculator', 'savings calculator'],
  alternates: { canonical: '/calculators/finance/discount-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Discount Calculator',
  description: 'Calculate sale prices with discounts and sales tax',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqs = [
  { question: 'How do I calculate a percentage discount?', answer: 'Multiply the original price by the discount percentage, then subtract from the original price. Our calculator does this automatically.' },
  { question: 'Is sales tax calculated before or after the discount?', answer: 'Sales tax is calculated on the discounted price, not the original price. This means you save on tax too!' },
  { question: 'How do I calculate the original price from a sale price?', answer: 'Divide the sale price by (1 - discount percentage). For example, if something is $80 after 20% off, the original was $80 / 0.8 = $100.' },
];

export default function DiscountCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="discount-calculator"
          title="Discount Calculator"
          description="Calculate sale prices with discounts and see your total savings including tax."
          colorClass="bg-green-100 text-green-700"
        />
        <section aria-label="Discount Calculator"><DiscountCalculator /></section>
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
