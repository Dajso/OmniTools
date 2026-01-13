import { Metadata } from 'next';
import { StairCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Stair Calculator - Calculate Rise, Run, and Stringer Length',
  description: 'Calculate stair dimensions including riser height, tread depth, and stringer length. Free stair calculator with building code compliance.',
  keywords: ['stair calculator', 'stair rise calculator', 'stringer calculator', 'step calculator'],
  alternates: { canonical: '/calculators/home/stair-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Stair Calculator', description: 'Calculate stair dimensions', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure total rise', text: 'Measure the total vertical distance from floor to floor.' },
  { name: 'Measure available run', text: 'Measure the horizontal space available for the stairs.' },
  { name: 'Check code compliance', text: 'Review the results to ensure they meet building codes.' },
];

const faqs = [
  { question: 'What is the ideal riser height?', answer: 'Building codes typically require 7-7.75 inches. 7.5 inches is considered ideal for comfort.' },
  { question: 'What is the minimum tread depth?', answer: 'IRC building code requires a minimum 10-inch tread depth for residential stairs.' },
  { question: 'What is the 2R + T rule?', answer: 'The sum of twice the riser height plus tread depth should equal 24-25 inches for comfortable stairs.' },
];

export default function StairCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="stair-calculator"
          title="Stair Calculator"
          description="Calculate stair dimensions and check building code compliance."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Stair Calculator"><StairCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
