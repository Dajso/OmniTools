import { Metadata } from 'next';
import { DrywallCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Drywall Calculator - How Many Sheets Do I Need?',
  description: 'Calculate drywall sheets, joint compound, tape, and screws needed. Free drywall calculator for walls and ceilings.',
  keywords: ['drywall calculator', 'sheetrock calculator', 'drywall sheets calculator', 'gypsum board calculator'],
  alternates: { canonical: '/calculators/home/drywall-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Drywall Calculator', description: 'Calculate drywall requirements', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Enter room dimensions', text: 'Enter room length, width, and wall height.' },
  { name: 'Count openings', text: 'Enter number of doors and windows to subtract.' },
  { name: 'Choose sheet size', text: 'Select 4×8, 4×10, or 4×12 foot sheets.' },
];

const faqs = [
  { question: 'What size drywall sheets should I use?', answer: '4×8 is most common. Use 4×10 or 4×12 for taller walls to reduce seams.' },
  { question: 'How much joint compound do I need?', answer: 'Plan for about 0.05 gallons per square foot of drywall.' },
  { question: 'How many screws per sheet of drywall?', answer: 'Use about 32 screws per 4×8 sheet, spaced 12" apart on edges and 16" in the field.' },
];

export default function DrywallCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="drywall-calculator"
          title="Drywall Calculator"
          description="Calculate drywall sheets and supplies needed for your project."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Drywall Calculator"><DrywallCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
