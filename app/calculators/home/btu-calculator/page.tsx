import { Metadata } from 'next';
import { BTUCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BTU Calculator - What Size Air Conditioner Do I Need?',
  description: 'Calculate the BTU capacity needed for your air conditioner. Free AC BTU calculator based on room size and conditions.',
  keywords: ['BTU calculator', 'air conditioner size calculator', 'AC BTU calculator', 'cooling capacity calculator'],
  alternates: { canonical: '/calculators/home/btu-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'BTU Calculator', description: 'Calculate air conditioner BTU requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure your room', text: 'Measure the length, width, and ceiling height of your room.' },
  { name: 'Assess conditions', text: 'Consider sun exposure, number of occupants, and if it is a kitchen.' },
  { name: 'Get BTU recommendation', text: 'The calculator provides the recommended BTU capacity and AC tonnage.' },
];

const faqs = [
  { question: 'How many BTU per square foot?', answer: 'The general rule is 20 BTU per square foot, but this varies based on ceiling height, sun exposure, and other factors.' },
  { question: 'What size AC do I need for a 12x12 room?', answer: 'A 12x12 room (144 sq ft) typically needs about 5,000-6,000 BTU, depending on conditions.' },
  { question: 'What is AC tonnage?', answer: 'One ton of cooling equals 12,000 BTU. A 2-ton AC provides 24,000 BTU of cooling capacity.' },
];

export default function BTUCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ac-btu-calculator"
          title="Air Conditioner BTU Calculator"
          description="Calculate the BTU capacity needed to cool your room effectively."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="BTU Calculator"><BTUCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
