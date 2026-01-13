import { Metadata } from 'next';
import { AgeCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Age Calculator - Calculate Your Exact Age',
  description: 'Calculate your exact age in years, months, and days. Also shows zodiac sign and days until birthday.',
  keywords: ['age calculator', 'birthday calculator', 'how old am I', 'age in days'],
  alternates: { canonical: '/calculators/productivity/age-calculator' },
};

const faqs = [
  { question: 'How is age calculated?', answer: 'We calculate the exact difference between your birth date and today (or a target date) in years, months, and days.' },
  { question: 'What zodiac signs are shown?', answer: 'We show both Western zodiac (based on birth month) and Chinese zodiac (based on birth year).' },
];

export default function AgeCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="age-calculator"
          title="Age Calculator"
          description="Calculate your exact age and discover fun facts about your birthday."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Age Calculator"><AgeCalculator /></section>
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
