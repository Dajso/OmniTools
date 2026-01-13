import { Metadata } from 'next';
import { PoolVolumeCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pool Volume Calculator - How Many Gallons in My Pool?',
  description: 'Calculate swimming pool volume in gallons and liters. Free pool calculator for rectangle, round, oval, and kidney shaped pools.',
  keywords: ['pool volume calculator', 'pool gallon calculator', 'swimming pool calculator', 'pool water calculator'],
  alternates: { canonical: '/calculators/home/pool-volume-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Pool Volume Calculator', description: 'Calculate pool volume in gallons', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Select pool shape', text: 'Choose rectangle, round, oval, or kidney shape.' },
  { name: 'Enter dimensions', text: 'Enter length, width, and depths for shallow and deep ends.' },
  { name: 'Get volume', text: 'See pool volume in gallons, liters, and cubic feet.' },
];

const faqs = [
  { question: 'How do I calculate pool gallons?', answer: 'Multiply surface area × average depth × 7.48 (gallons per cubic foot).' },
  { question: 'How many gallons in an average pool?', answer: 'A typical 16×32 ft pool with 5 ft average depth holds about 19,000 gallons.' },
  { question: 'Why do I need to know pool volume?', answer: 'Pool volume is essential for calculating chemical dosages, heating costs, and pump sizing.' },
];

export default function PoolVolumeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pool-volume-calculator"
          title="Pool Volume Calculator"
          description="Calculate your swimming pool volume in gallons for chemical dosing and maintenance."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Pool Volume Calculator"><PoolVolumeCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
