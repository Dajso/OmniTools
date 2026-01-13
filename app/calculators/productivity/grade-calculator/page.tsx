import { Metadata } from 'next';
import { GradeCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Grade Calculator - Calculate Your Class Grade',
  description: 'Calculate your overall grade from assignments. Supports weighted and unweighted grades.',
  keywords: ['grade calculator', 'final grade calculator', 'weighted grade', 'class grade'],
  alternates: { canonical: '/calculators/productivity/grade-calculator' },
};

const faqs = [
  { question: 'What are weighted grades?', answer: 'Weighted grades give different importance to assignments. A final exam might be worth 40% while homework is 20%.' },
  { question: 'How do I know what grade I need?', answer: 'Our calculator shows what score you need on remaining work to achieve A, B, or C grades.' },
];

export default function GradeCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="grade-calculator"
          title="Grade Calculator"
          description="Calculate your overall grade from individual assignments."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Grade Calculator"><GradeCalculator /></section>
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
