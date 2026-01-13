import { Metadata } from 'next';
import { RefinanceCalculator } from '@/components/calculators/finance/refinance-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Refinance Calculator - Should You Refinance?',
  description: 'Calculate if refinancing your mortgage makes sense. See monthly savings, total savings, and break-even point.',
  keywords: ['refinance calculator', 'mortgage refinance', 'loan refinance', 'break even', 'refinancing'],
  alternates: { canonical: '/calculators/finance/refinance-calculator' },
};

const howToSteps = [
  { name: 'Enter current loan', text: 'Input your current loan balance and interest rate.' },
  { name: 'Add new rate', text: 'Enter the new interest rate you\'ve been offered.' },
  { name: 'Set remaining term', text: 'Enter how many months are left on your current loan.' },
  { name: 'Include closing costs', text: 'Add the estimated closing costs for refinancing.' },
  { name: 'View analysis', text: 'See if refinancing makes financial sense for you.' },
];

const faqs = [
  { question: 'When should I refinance?', answer: 'Generally, refinancing makes sense if you can lower your rate by 0.5-1% or more, plan to stay in the home past the break-even point, and closing costs are reasonable.' },
  { question: 'What is the break-even point?', answer: 'The break-even point is when your monthly savings equal the closing costs. After this point, you\'re saving money by refinancing.' },
  { question: 'What are typical closing costs?', answer: 'Closing costs typically range from 2-5% of the loan amount, including appraisal, title insurance, and lender fees.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="refinance-calculator" title="Refinance Calculator"
        description="Calculate if refinancing your mortgage makes financial sense. See your potential savings."
        colorClass="bg-green-100 text-green-700" />
      <section aria-label="Refinance Calculator"><RefinanceCalculator /></section>
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
