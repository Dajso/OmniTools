import { Metadata } from 'next';
import { ConcreteCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Concrete Calculator - How Many Bags of Concrete Do I Need?',
  description: 'Calculate how many bags of concrete you need for your project. Free concrete calculator for slabs, footings, and posts.',
  keywords: ['concrete calculator', 'how many bags of concrete', 'concrete slab calculator', 'cubic yards concrete'],
  alternates: { canonical: '/calculators/home/concrete-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Concrete Calculator',
  description: 'Calculate how many bags of concrete you need for your project',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter dimensions', text: 'Enter the length, width, and thickness of your concrete project.' },
  { name: 'Review volume', text: 'See the total volume in cubic feet and cubic yards.' },
  { name: 'Choose bag size', text: 'The calculator shows bags needed for 40, 60, and 80 lb options.' },
];

const faqs = [
  { question: 'How thick should a concrete slab be?', answer: 'For patios and walkways, 4 inches is standard. Driveways typically need 5-6 inches. Always check local building codes.' },
  { question: 'How many bags of concrete in a cubic yard?', answer: 'Approximately 45 bags of 80 lb concrete, 60 bags of 60 lb, or 90 bags of 40 lb make one cubic yard.' },
  { question: 'Should I add extra concrete?', answer: 'Yes, this calculator includes 10% extra for waste. For uneven ground, consider adding more.' },
];

export default function ConcreteCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="concrete-calculator"
          title="Concrete Calculator"
          description="Calculate how many bags of concrete you need for slabs, footings, posts, and more."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Concrete Calculator"><ConcreteCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
          <ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol>
        </section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div>
        </section>
      </main>
    </>
  );
}
