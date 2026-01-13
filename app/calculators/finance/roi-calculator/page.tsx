import { Metadata } from 'next';
import { ROICalculator } from '@/components/calculators/finance';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'ROI Calculator - Return on Investment Calculator',
  description: 'Calculate return on investment (ROI) and annualized returns. Free investment ROI calculator.',
  keywords: ['roi calculator', 'return on investment', 'investment calculator', 'annualized return'],
  alternates: { canonical: '/calculators/finance/roi-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ROI Calculator',
  description: 'Calculate return on investment and annualized returns',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqs = [
  { question: 'What is ROI?', answer: 'ROI (Return on Investment) measures the gain or loss on an investment relative to its cost, expressed as a percentage.' },
  { question: 'What is annualized ROI?', answer: 'Annualized ROI converts your total return into an equivalent yearly rate, making it easier to compare investments of different durations.' },
  { question: 'What is a good ROI?', answer: 'A "good" ROI depends on the investment type. Stock market historically returns 7-10% annually. Real estate typically 8-12%.' },
];

export default function ROICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roi-calculator"
          title="ROI Calculator"
          description="Calculate your return on investment and see annualized returns."
          colorClass="bg-green-100 text-green-700"
        />
        <section aria-label="ROI Calculator"><ROICalculator /></section>
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
