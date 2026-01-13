import { Metadata } from 'next';
import { DebtSnowballCalculator } from '@/components/calculators/finance/debt-snowball-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Debt Snowball Calculator - Pay Off Debt Faster',
  description: 'Plan your debt payoff using the snowball method. See your path to becoming debt-free.',
  keywords: ['debt snowball', 'debt payoff', 'debt free', 'debt calculator', 'snowball method'],
  alternates: { canonical: '/calculators/finance/debt-snowball-calculator' },
};

const howToSteps = [
  { name: 'Enter your debts', text: 'Input each debt\'s balance, interest rate, and minimum payment.' },
  { name: 'Add extra payment', text: 'Enter any extra amount you can put toward debt each month.' },
  { name: 'View payoff order', text: 'See which debts to pay off first using the snowball method.' },
  { name: 'Track progress', text: 'See your total interest and time to become debt-free.' },
];

const faqs = [
  { question: 'What is the debt snowball method?', answer: 'The debt snowball method focuses on paying off your smallest debt first while making minimum payments on others. Once paid off, you roll that payment into the next smallest debt.' },
  { question: 'Snowball vs Avalanche - which is better?', answer: 'Avalanche (highest interest first) saves more money mathematically. Snowball (smallest balance first) provides psychological wins that help many people stay motivated.' },
  { question: 'How much extra should I pay?', answer: 'Any extra helps! Even $50-100 extra per month can significantly reduce your payoff time and total interest paid.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="debt-snowball-calculator" title="Debt Snowball Calculator"
        description="Plan your debt payoff using the snowball method. Pay off smallest debts first for quick wins."
        colorClass="bg-cyan-100 text-cyan-700" />
      <section aria-label="Debt Snowball Calculator"><DebtSnowballCalculator /></section>
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
