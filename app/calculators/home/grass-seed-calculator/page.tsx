import { Metadata } from 'next';
import { GrassSeedCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Grass Seed Calculator - How Much Grass Seed Do I Need?',
  description: 'Calculate how much grass seed you need for your lawn. Free grass seed calculator for new lawns and overseeding.',
  keywords: ['grass seed calculator', 'how much grass seed', 'lawn seed calculator', 'overseeding calculator'],
  alternates: { canonical: '/calculators/home/grass-seed-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Grass Seed Calculator', description: 'Calculate grass seed requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure lawn', text: 'Measure the length and width of your lawn area.' },
  { name: 'Select application', text: 'Choose new lawn, overseeding, or thickening.' },
  { name: 'Choose grass type', text: 'Select your grass variety for accurate seed rates.' },
];

const faqs = [
  { question: 'How much grass seed per 1000 sq ft?', answer: 'New lawns need 3-8 lbs per 1000 sq ft depending on grass type. Overseeding uses about half that amount.' },
  { question: 'When is the best time to seed?', answer: 'Fall is ideal for cool-season grasses. Late spring is best for warm-season grasses like Bermuda.' },
  { question: 'How long does grass seed take to grow?', answer: 'Most grass seed germinates in 7-21 days. Full establishment takes 6-8 weeks.' },
];

export default function GrassSeedCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="grass-seed-calculator"
          title="Grass Seed Calculator"
          description="Calculate how much grass seed you need for new lawns or overseeding."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Grass Seed Calculator"><GrassSeedCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
