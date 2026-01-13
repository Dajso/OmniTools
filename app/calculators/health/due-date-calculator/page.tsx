import { Metadata } from 'next';
import { DueDateCalculator } from '@/components/calculators/health';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Due Date Calculator - Pregnancy Due Date Calculator',
  description: 'Calculate your pregnancy due date and track milestones. Supports LMP, conception date, and ultrasound methods. Free pregnancy calculator.',
  keywords: ['due date calculator', 'pregnancy calculator', 'due date estimator', 'pregnancy due date', 'conception calculator', 'pregnancy weeks calculator'],
  alternates: { canonical: '/calculators/health/due-date-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Due Date Calculator',
  description: 'Calculate your estimated due date and pregnancy milestones',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose calculation method', text: 'Select LMP (last menstrual period), conception date, or ultrasound due date.' },
  { name: 'Enter the date', text: 'Input the relevant date based on your chosen method.' },
  { name: 'Adjust cycle length', text: 'If using LMP, enter your average cycle length for more accuracy.' },
  { name: 'View your results', text: 'See your due date, current week, trimester, and pregnancy milestones.' },
];

const faqs = [
  { question: 'How is the due date calculated?', answer: 'Using LMP, the due date is 280 days (40 weeks) from the first day of your last period. From conception, it\'s 266 days. These are estimates - only 5% of babies arrive on their due date.' },
  { question: 'What are the trimesters?', answer: 'First trimester: weeks 1-12. Second trimester: weeks 13-26. Third trimester: weeks 27-40. Each trimester has different developmental milestones.' },
  { question: 'When should I see a doctor?', answer: 'Schedule your first prenatal visit around 8 weeks. Contact your healthcare provider immediately if you experience severe pain, heavy bleeding, or other concerning symptoms.' },
];

export default function DueDateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="due-date-calculator"
          title="Due Date Calculator"
          description="Calculate your estimated due date and track pregnancy milestones. Supports multiple calculation methods."
          colorClass="bg-red-100 text-red-700"
        />
        <section aria-label="Due Date Calculator"><DueDateCalculator /></section>
        <section className="mt-12" aria-labelledby="how-to-heading">
          <h2 id="how-to-heading" className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
          <ol className="space-y-4">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span>
                <div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div>
              </li>
            ))}
          </ol>
        </section>
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
