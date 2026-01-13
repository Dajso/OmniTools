import { Metadata } from 'next';
import { PercentageCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Percentage Calculator - Free Online Percent Calculator',
  description: 'Calculate percentages easily. Find X% of Y, percentage change, increase, and decrease.',
  keywords: ['percentage calculator', 'percent calculator', 'percentage change', 'percent of number'],
  alternates: { canonical: '/calculators/productivity/percentage-calculator' },
};

const faqs = [
  { question: 'How do I calculate percentage?', answer: 'To find X% of Y, multiply Y by X and divide by 100. Our calculator does this automatically.' },
  { question: 'What is percentage change?', answer: 'Percentage change shows how much a value has increased or decreased relative to its original value.' },
];

export default function PercentageCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="percentage-calculator"
          title="Percentage Calculator"
          description="Calculate percentages in multiple ways with step-by-step formulas."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Percentage Calculator"><PercentageCalculator /></section>
      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
        <div className="space-y-6">{faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6 last:border-b-0">
            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}</div>
      </section>
    </main>
  );
}
