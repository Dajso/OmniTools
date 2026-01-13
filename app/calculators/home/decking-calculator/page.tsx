import { Metadata } from 'next';
import { DeckingCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Decking Calculator - How Many Deck Boards Do I Need?',
  description: 'Calculate deck boards, joists, and screws needed for your deck project. Free decking calculator with waste factor.',
  keywords: ['decking calculator', 'deck board calculator', 'deck material calculator', 'composite decking calculator'],
  alternates: { canonical: '/calculators/home/decking-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Decking Calculator', description: 'Calculate deck material requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Enter deck size', text: 'Enter the length and width of your deck.' },
  { name: 'Set board specs', text: 'Enter board width, length, and gap between boards.' },
  { name: 'Set joist spacing', text: 'Choose joist spacing (16" is standard for most decking).' },
];

const faqs = [
  { question: 'What is standard joist spacing for decking?', answer: '16 inches on center is standard. Use 12 inches for diagonal patterns or composite decking.' },
  { question: 'How much gap between deck boards?', answer: 'Leave 1/8" to 1/4" gap for drainage and expansion. Composite may need more.' },
  { question: 'How much extra decking should I buy?', answer: 'Plan for 10-15% extra for cuts, waste, and future repairs.' },
];

export default function DeckingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="decking-calculator"
          title="Decking Calculator"
          description="Calculate deck boards, joists, and hardware needed for your deck project."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Decking Calculator"><DeckingCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
