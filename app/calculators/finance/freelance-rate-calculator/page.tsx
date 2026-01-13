import { Metadata } from 'next';
import { FreelanceRateCalculator } from '@/components/calculators/finance/freelance-rate-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Freelance Rate Calculator - Calculate Your Hourly Rate',
  description: 'Calculate your ideal freelance hourly rate based on income goals, expenses, and taxes.',
  keywords: ['freelance rate', 'hourly rate', 'consulting rate', 'contractor rate', 'freelance calculator'],
  alternates: { canonical: '/calculators/finance/freelance-rate-calculator' },
};

const howToSteps = [
  { name: 'Set income goal', text: 'Enter your desired annual take-home income.' },
  { name: 'Estimate billable hours', text: 'Input how many hours per week you can bill clients.' },
  { name: 'Add working weeks', text: 'Account for vacation and non-billable time.' },
  { name: 'Include expenses', text: 'Add your annual business expenses.' },
  { name: 'View your rate', text: 'See your recommended hourly, daily, and monthly rates.' },
];

const faqs = [
  { question: 'How many hours should I bill?', answer: 'Most freelancers can bill 20-30 hours per week. The rest goes to admin, marketing, and business development.' },
  { question: 'Should I charge hourly or project-based?', answer: 'Project-based pricing often earns more as you get faster. Start hourly to understand your time, then transition to project rates.' },
  { question: 'How do I handle taxes?', answer: 'As a freelancer, you\'re responsible for self-employment tax (15.3%) plus income tax. Set aside 25-35% of income for taxes.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="freelance-rate-calculator" title="Freelance Rate Calculator"
        description="Calculate your ideal freelance hourly rate to meet your income goals after taxes and expenses."
        colorClass="bg-indigo-100 text-indigo-700" />
      <section aria-label="Freelance Rate Calculator"><FreelanceRateCalculator /></section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">How to Use This Calculator</h2>
        <ol className="space-y-4">
          {howToSteps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i + 1}</span>
              <div><h3 className="font-medium">{step.name}</h3><p className="text-muted-foreground">{step.text}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
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
  );
}
