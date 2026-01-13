import { Metadata } from 'next';
import { RoofPitchCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Roof Pitch Calculator - Calculate Roof Angle and Slope',
  description: 'Calculate roof pitch, angle, and rafter length multiplier. Free roof pitch calculator for roofing projects.',
  keywords: ['roof pitch calculator', 'roof angle calculator', 'roof slope calculator', 'rafter calculator'],
  alternates: { canonical: '/calculators/home/roof-pitch-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Roof Pitch Calculator', description: 'Calculate roof pitch and angle', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure rise', text: 'Measure the vertical rise of your roof in inches.' },
  { name: 'Measure run', text: 'Measure the horizontal run (typically 12 inches for standard pitch notation).' },
  { name: 'Get results', text: 'See pitch ratio, angle in degrees, and rafter multiplier.' },
];

const faqs = [
  { question: 'What does 6/12 roof pitch mean?', answer: 'A 6/12 pitch means the roof rises 6 inches for every 12 inches of horizontal run, or about 26.5 degrees.' },
  { question: 'What is a good roof pitch?', answer: 'Most residential roofs are 4/12 to 9/12. Steeper pitches shed water better but cost more.' },
  { question: 'How do I use the rafter multiplier?', answer: 'Multiply your horizontal run by the rafter multiplier to get the rafter length.' },
];

export default function RoofPitchCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roof-pitch-calculator"
          title="Roof Pitch Calculator"
          description="Calculate roof pitch, angle, and rafter length for your roofing project."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Roof Pitch Calculator"><RoofPitchCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
