import { Metadata } from 'next';
import { CreditCardPayoffCalculator } from '@/components/calculators/finance/credit-card-payoff-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Credit Card Payoff Calculator - Debt Free Timeline',
  description: 'Calculate how long it will take to pay off your credit card debt. See total interest and create a payoff plan.',
  keywords: ['credit card payoff', 'debt calculator', 'credit card debt', 'payoff calculator', 'debt free'],
  alternates: { canonical: '/calculators/finance/credit-card-payoff' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Credit Card Payoff Calculator',
  description: 'Calculate how long to pay off credit card debt',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your balance', text: 'Input your current credit card balance.' },
  { name: 'Add your APR', text: 'Enter your card\'s annual percentage rate (found on your statement).' },
  { name: 'Set monthly payment', text: 'Enter how much you can pay each month.' },
  { name: 'View your timeline', text: 'See how long until you\'re debt-free and total interest paid.' },
];

const faqs = [
  { question: 'What is APR?', answer: 'APR (Annual Percentage Rate) is the yearly interest rate charged on your credit card balance. It\'s typically between 15-25% for most cards.' },
  { question: 'Should I pay more than the minimum?', answer: 'Yes! Paying only the minimum can take decades to pay off debt and costs thousands in interest. Even small increases help significantly.' },
  { question: 'What\'s the debt avalanche method?', answer: 'Pay minimums on all cards, then put extra money toward the highest APR card first. This minimizes total interest paid.' },
  { question: 'What\'s the debt snowball method?', answer: 'Pay off smallest balances first for psychological wins, then roll those payments into larger debts.' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader toolId="credit-card-payoff" title="Credit Card Payoff Calculator"
          description="Calculate your path to becoming debt-free. See how long it will take to pay off your credit card and how much interest you'll pay."
          colorClass="bg-red-100 text-red-700" />
        <section aria-label="Credit Card Payoff Calculator"><CreditCardPayoffCalculator /></section>
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
