import { Metadata } from 'next';
import { CarpetCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Carpet Calculator - How Much Carpet Do I Need?',
  description: 'Calculate how much carpet you need and estimate costs. Free carpet calculator for square footage and pricing.',
  keywords: ['carpet calculator', 'how much carpet', 'carpet cost calculator', 'flooring calculator'],
  alternates: { canonical: '/calculators/home/carpet-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Carpet Calculator', description: 'Calculate carpet requirements and cost', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Measure your room', text: 'Measure the length and width of your room in feet.' },
  { name: 'Select carpet width', text: 'Choose your carpet roll width (typically 12 or 15 feet).' },
  { name: 'Enter price', text: 'Enter the price per square yard to estimate total cost.' },
];

const faqs = [
  { question: 'Is carpet sold by square foot or square yard?', answer: 'Carpet is typically priced per square yard. Divide square feet by 9 to get square yards.' },
  { question: 'How much extra carpet should I buy?', answer: 'Plan for 10% extra for seams, waste, and pattern matching.' },
  { question: 'What is the standard carpet roll width?', answer: 'Most carpet comes in 12-foot or 15-foot widths. Choose based on your room dimensions to minimize seams.' },
];

export default function CarpetCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="carpet-calculator"
          title="Carpet Calculator"
          description="Calculate how much carpet you need and estimate the total cost."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Carpet Calculator"><CarpetCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
