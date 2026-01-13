import { Metadata } from 'next';
import { HourlySalaryCalculator } from '@/components/calculators/finance';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hourly to Salary Calculator - Wage Converter',
  description: 'Convert hourly wage to annual salary or salary to hourly rate. Free wage calculator with daily, weekly, and monthly breakdowns.',
  keywords: ['hourly to salary calculator', 'salary to hourly', 'wage calculator', 'pay converter'],
  alternates: { canonical: '/calculators/finance/hourly-salary-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hourly to Salary Calculator',
  description: 'Convert between hourly wage and annual salary',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqs = [
  { question: 'How do I convert hourly to salary?', answer: 'Multiply your hourly rate by hours worked per week, then by weeks worked per year. For example: $25/hr × 40 hrs × 52 weeks = $52,000/year.' },
  { question: 'What is a standard work year?', answer: 'A standard full-time work year is 2,080 hours (40 hours/week × 52 weeks). Some calculations use 50 weeks to account for vacation.' },
  { question: 'Should I include overtime in my calculation?', answer: 'For base salary comparison, use your regular hours. Overtime pay varies and should be calculated separately.' },
];

export default function HourlySalaryCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hourly-to-salary"
          title="Hourly to Salary Calculator"
          description="Convert between hourly wage and annual salary. See daily, weekly, and monthly breakdowns."
          colorClass="bg-green-100 text-green-700"
        />
        <section aria-label="Hourly Salary Calculator"><HourlySalaryCalculator /></section>
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-b-0">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
