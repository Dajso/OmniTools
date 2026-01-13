import { Metadata } from 'next';
import { DateDifferenceCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Date Difference Calculator - Days Between Dates',
  description: 'Calculate the difference between two dates in days, weeks, months, and years. Includes business days.',
  keywords: ['date difference', 'days between dates', 'date calculator', 'business days calculator'],
  alternates: { canonical: '/calculators/productivity/date-difference' },
};

const faqs = [
  { question: 'What are business days?', answer: 'Business days are weekdays (Monday-Friday), excluding weekends.' },
  { question: 'Should I include the end date?', answer: 'Include the end date if you want to count both the start and end dates in your calculation.' },
];

export default function DateDifferencePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="date-difference-calculator"
          title="Date Difference Calculator"
          description="Calculate the exact difference between any two dates."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Date Difference Calculator"><DateDifferenceCalculator /></section>
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
