import { Metadata } from 'next';
import { LumberCalculator } from '@/components/calculators/home';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lumber Calculator - Calculate Board Feet',
  description: 'Calculate board feet for lumber purchases. Free lumber calculator with cost estimation for woodworking projects.',
  keywords: ['lumber calculator', 'board feet calculator', 'wood calculator', 'lumber cost calculator'],
  alternates: { canonical: '/calculators/home/lumber-calculator' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Lumber Calculator', description: 'Calculate board feet for lumber', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };

const howToSteps = [
  { name: 'Enter dimensions', text: 'Enter the nominal thickness, width, and length of your lumber.' },
  { name: 'Set quantity', text: 'Enter how many pieces you need.' },
  { name: 'Add price', text: 'Enter price per board foot to calculate total cost.' },
];

const faqs = [
  { question: 'What is a board foot?', answer: 'A board foot is 144 cubic inches of wood, or a piece 1" thick × 12" wide × 12" long.' },
  { question: 'What is nominal vs actual lumber size?', answer: 'Nominal is the name (2×4), actual is the real size (1.5" × 3.5"). Lumber shrinks when dried.' },
  { question: 'How do I calculate board feet?', answer: 'Board Feet = (Thickness × Width × Length) ÷ 12, where thickness and width are in inches, length in feet.' },
];

export default function LumberCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="lumber-calculator"
          title="Lumber Calculator (Board Feet)"
          description="Calculate board feet and estimate costs for your lumber purchases."
          colorClass="bg-amber-100 text-amber-700"
        />
        <section aria-label="Lumber Calculator"><LumberCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading"><h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2><ol className="space-y-4">{howToSteps.map((step, i) => (<li key={i} className="flex gap-4"><span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span><div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div></li>))}</ol></section>
        <section className="mt-12" aria-labelledby="faq-heading"><h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2><div className="space-y-6">{faqs.map((faq, i) => (<div key={i} className="border-b pb-6 last:border-b-0"><h3 className="font-medium text-lg mb-2">{faq.question}</h3><p className="text-muted-foreground">{faq.answer}</p></div>))}</div></section>
      </main>
    </>
  );
}
