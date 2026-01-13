import { Metadata } from 'next';
import { StudentLoanPayoffCalculator } from '@/components/calculators/finance/student-loan-payoff-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Student Loan Payoff Calculator - Debt Free Timeline',
  description: 'Calculate how long it will take to pay off your student loans. See total interest and create a payoff plan.',
  keywords: ['student loan calculator', 'loan payoff', 'education loan', 'debt payoff', 'student debt'],
  alternates: { canonical: '/calculators/finance/student-loan-payoff' },
};

const howToSteps = [
  { name: 'Enter loan balance', text: 'Input your current student loan balance.' },
  { name: 'Add interest rate', text: 'Enter your loan\'s annual interest rate.' },
  { name: 'Set monthly payment', text: 'Enter how much you can pay each month.' },
  { name: 'View timeline', text: 'See how long until you\'re debt-free.' },
];

const faqs = [
  { question: 'What is the average student loan interest rate?', answer: 'Federal student loan rates typically range from 4-7%. Private loans can be higher, ranging from 3-14% depending on credit.' },
  { question: 'Should I pay more than the minimum?', answer: 'Yes! Extra payments go directly to principal, reducing total interest paid and shortening your payoff timeline.' },
  { question: 'What is income-driven repayment?', answer: 'IDR plans cap your monthly payment at a percentage of your discretionary income, making payments more manageable.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="student-loan-payoff" title="Student Loan Payoff Calculator"
        description="Calculate your path to becoming student debt-free. See your payoff timeline and total interest."
        colorClass="bg-purple-100 text-purple-700" />
      <section aria-label="Student Loan Payoff Calculator"><StudentLoanPayoffCalculator /></section>
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
