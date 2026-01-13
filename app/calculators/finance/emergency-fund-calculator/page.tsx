import { Metadata } from 'next';
import { EmergencyFundCalculator } from '@/components/calculators/finance/emergency-fund-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Emergency Fund Calculator - How Much Do You Need?',
  description: 'Calculate how much you need in your emergency fund based on monthly expenses and coverage goals.',
  keywords: ['emergency fund', 'savings goal', 'rainy day fund', 'financial safety', 'emergency savings'],
  alternates: { canonical: '/calculators/finance/emergency-fund-calculator' },
};

const howToSteps = [
  { name: 'Enter monthly expenses', text: 'Input your total monthly living expenses.' },
  { name: 'Choose coverage months', text: 'Select how many months of expenses to save (3-12).' },
  { name: 'Add current savings', text: 'Enter how much you\'ve already saved.' },
  { name: 'Set savings rate', text: 'Input how much you can save each month.' },
  { name: 'Track progress', text: 'See your target, progress, and time to goal.' },
];

const faqs = [
  { question: 'How much should I have in an emergency fund?', answer: 'Most experts recommend 3-6 months of expenses. If you have variable income or are the sole earner, aim for 6-12 months.' },
  { question: 'Where should I keep my emergency fund?', answer: 'Keep it in a high-yield savings account. It should be easily accessible but separate from your checking account to avoid temptation.' },
  { question: 'What counts as an emergency?', answer: 'True emergencies include job loss, medical emergencies, major car repairs, or urgent home repairs. Planned expenses and wants are not emergencies.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="emergency-fund-calculator" title="Emergency Fund Calculator"
        description="Calculate your emergency fund target and track your progress toward financial security."
        colorClass="bg-emerald-100 text-emerald-700" />
      <section aria-label="Emergency Fund Calculator"><EmergencyFundCalculator /></section>
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
