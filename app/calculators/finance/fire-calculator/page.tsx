import { Metadata } from 'next';
import { FireCalculator } from '@/components/calculators/finance/fire-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'FIRE Calculator - Financial Independence Retire Early',
  description: 'Calculate your FIRE number and how long until you can retire early. Plan your path to financial independence.',
  keywords: ['FIRE calculator', 'financial independence', 'early retirement', 'retirement calculator', 'FIRE number'],
  alternates: { canonical: '/calculators/finance/fire-calculator' },
};

const howToSteps = [
  { name: 'Enter annual expenses', text: 'Input your yearly living expenses in retirement.' },
  { name: 'Add current savings', text: 'Enter your current investment portfolio value.' },
  { name: 'Set annual savings', text: 'Enter how much you save and invest each year.' },
  { name: 'Adjust assumptions', text: 'Set expected return and safe withdrawal rate.' },
  { name: 'View your FIRE number', text: 'See how much you need and when you\'ll reach it.' },
];

const faqs = [
  { question: 'What is the FIRE movement?', answer: 'FIRE (Financial Independence, Retire Early) is a lifestyle movement focused on extreme savings and investment to retire much earlier than traditional retirement age.' },
  { question: 'What is the 4% rule?', answer: 'The 4% rule suggests you can withdraw 4% of your portfolio annually in retirement with low risk of running out of money over 30 years.' },
  { question: 'How much do I need to FIRE?', answer: 'Your FIRE number is typically 25x your annual expenses (based on 4% withdrawal rate). If you spend $40,000/year, you need $1,000,000.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="fire-calculator" title="FIRE Calculator"
        description="Calculate your Financial Independence Retire Early number and timeline to freedom."
        colorClass="bg-red-100 text-red-700" />
      <section aria-label="FIRE Calculator"><FireCalculator /></section>
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
