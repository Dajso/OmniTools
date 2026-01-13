import { Metadata } from 'next';
import { FenceCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fence Calculator - How Much Fencing Material Do I Need?',
  description: 'Calculate fence materials including posts, rails, pickets, and concrete. Free fence calculator for wood and vinyl fences.',
  keywords: ['fence calculator', 'fencing material calculator', 'fence post calculator', 'picket fence calculator'],
  alternates: { canonical: '/calculators/home/fence-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Fence Calculator', description: 'Calculate fence material requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure fence line', text: 'Measure the total length of fence you need.' },
  { name: 'Set specifications', text: 'Enter fence height, post spacing, and picket dimensions.' },
  { name: 'Add gates', text: 'Include the number of gates for accurate post count.' },
];

const faqs = [
  { question: 'How far apart should fence posts be?', answer: 'Posts are typically spaced 6-8 feet apart. Use 6 feet for taller or heavier fences.' },
  { question: 'How deep should fence posts be?', answer: 'Posts should be buried 1/3 of their total length, typically 2-3 feet deep.' },
  { question: 'How many rails per fence section?', answer: 'Use 2 rails for fences under 5 feet, 3 rails for taller fences.' },
];

export default function FenceCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fence-calculator"
          title="Fence Calculator"
          description="Calculate materials needed for your fence project including posts, rails, and pickets."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Fence Calculator"><FenceCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
