import { Metadata } from 'next';
import { TileCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tile Calculator - How Many Tiles Do I Need?',
  description: 'Calculate how many tiles you need for your floor or wall project. Free tile calculator with waste factor.',
  keywords: ['tile calculator', 'how many tiles', 'floor tile calculator', 'wall tile calculator', 'tile estimator'],
  alternates: { canonical: '/calculators/home/tile-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tile Calculator',
  description: 'Calculate how many tiles you need for your floor or wall project',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure your room', text: 'Measure the length and width of the area you want to tile.' },
  { name: 'Enter tile size', text: 'Enter the dimensions of your tiles in inches.' },
  { name: 'Add waste factor', text: 'Include 10-15% extra for cuts and breakage.' },
];

const faqs = [
  { question: 'How much extra tile should I buy?', answer: '10% extra is standard for simple layouts. Add 15-20% for diagonal patterns or complex rooms.' },
  { question: 'What is the most common tile size?', answer: '12x12 inches is most common for floors. 12x24 and 6x6 are also popular choices.' },
  { question: 'How many tiles come in a box?', answer: 'Most boxes contain 10-15 tiles, but this varies by manufacturer and tile size.' },
];

export default function TileCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tile-calculator"
          title="Tile Calculator"
          description="Calculate how many tiles you need for your flooring or wall project."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Tile Calculator"><TileCalculator /></section>
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
