import { Metadata } from 'next';
import { GPACalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'GPA Calculator - Calculate Your Grade Point Average',
  description: 'Calculate your GPA on 4.0, 4.3, or 5.0 scale. Add courses with grades and credits.',
  keywords: ['GPA calculator', 'grade point average', 'college GPA', 'cumulative GPA'],
  alternates: { canonical: '/calculators/productivity/gpa-calculator' },
};

const faqs = [
  { question: 'What is a 4.0 GPA scale?', answer: 'The 4.0 scale is the most common in the US, where A=4.0, B=3.0, C=2.0, D=1.0, and F=0.' },
  { question: 'How are credits weighted?', answer: 'Each course\'s grade points are multiplied by its credits, then divided by total credits.' },
];

export default function GPACalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="gpa-calculator"
          title="GPA Calculator"
          description="Calculate your Grade Point Average with multiple scale options."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="GPA Calculator"><GPACalculator /></section>
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
