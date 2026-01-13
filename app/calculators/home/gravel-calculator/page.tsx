import { Metadata } from 'next';
import { GravelCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gravel Calculator - How Much Gravel Do I Need?',
  description: 'Calculate how much gravel you need in tons or cubic yards. Free gravel calculator for driveways, pathways, and landscaping.',
  keywords: ['gravel calculator', 'how much gravel', 'gravel tons calculator', 'driveway gravel calculator'],
  alternates: { canonical: '/calculators/home/gravel-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Gravel Calculator', description: 'Calculate gravel requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure area', text: 'Measure the length and width of the area to cover.' },
  { name: 'Choose depth', text: 'Select your desired gravel depth (2-4 inches is typical).' },
  { name: 'Get results', text: 'See tons and cubic yards needed for your project.' },
];

const faqs = [
  { question: 'How deep should gravel be for a driveway?', answer: 'Driveways typically need 4-6 inches of gravel. Use 2-3 inches for pathways.' },
  { question: 'How much does a ton of gravel cover?', answer: 'One ton covers about 100 square feet at 2 inches deep, or 50 square feet at 4 inches deep.' },
  { question: 'How much does gravel weigh?', answer: 'Gravel weighs about 2,800 pounds (1.4 tons) per cubic yard, or about 100 lbs per cubic foot.' },
];

export default function GravelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gravel-calculator"
          title="Gravel Calculator"
          description="Calculate how much gravel you need for driveways, pathways, and landscaping."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Gravel Calculator"><GravelCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
