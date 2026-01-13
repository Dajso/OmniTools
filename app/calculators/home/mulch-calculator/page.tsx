import { Metadata } from 'next';
import { MulchCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Mulch Calculator - How Much Mulch Do I Need?',
  description: 'Calculate how much mulch you need for your garden or landscaping project. Free mulch calculator estimates cubic yards and bags needed.',
  keywords: ['mulch calculator', 'how much mulch', 'garden mulch calculator', 'landscaping calculator', 'cubic yards mulch'],
  alternates: { canonical: '/calculators/home/mulch-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mulch Calculator',
  description: 'Calculate how much mulch you need for your garden or landscaping project',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure your area', text: 'Measure the length and width of the area you want to cover with mulch.' },
  { name: 'Choose mulch depth', text: 'Select your desired mulch depth. 2-4 inches is typical for most applications.' },
  { name: 'Get your results', text: 'The calculator shows cubic yards needed and number of bags to purchase.' },
];

const faqs = [
  { question: 'How deep should mulch be?', answer: 'For most landscaping, 2-4 inches of mulch is ideal. Use 2 inches around plants and up to 4 inches in pathways.' },
  { question: 'How many cubic feet in a cubic yard?', answer: 'There are 27 cubic feet in one cubic yard. Most bulk mulch is sold by the cubic yard.' },
  { question: 'How much does a cubic yard of mulch cover?', answer: 'One cubic yard covers about 162 square feet at 2 inches deep, or 108 square feet at 3 inches deep.' },
];

export default function MulchCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mulch-calculator"
          title="Mulch Calculator"
          description="Calculate how much mulch you need for your garden beds, landscaping, or pathways."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Mulch Calculator"><MulchCalculator /></section>
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
