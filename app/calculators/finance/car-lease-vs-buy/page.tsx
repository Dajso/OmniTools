import { Metadata } from 'next';
import { CarLeaseVsBuyCalculator } from '@/components/calculators/finance/car-lease-vs-buy-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Car Lease vs Buy Calculator - Compare Total Costs',
  description: 'Compare the total cost of leasing versus buying a car. Make an informed decision with our free calculator.',
  keywords: ['car lease calculator', 'lease vs buy', 'auto loan calculator', 'car payment', 'vehicle cost comparison'],
  alternates: { canonical: '/calculators/finance/car-lease-vs-buy' },
};

const howToSteps = [
  { name: 'Enter car price', text: 'Input the total price of the vehicle you\'re considering.' },
  { name: 'Add down payment', text: 'Enter how much you plan to put down upfront.' },
  { name: 'Set loan terms', text: 'Enter the loan term and interest rate for buying.' },
  { name: 'Enter lease details', text: 'Input the lease term and monthly payment.' },
  { name: 'Compare results', text: 'See which option costs less over the term.' },
];

const faqs = [
  { question: 'Is it better to lease or buy a car?', answer: 'It depends on your situation. Leasing typically has lower monthly payments but you don\'t build equity. Buying costs more upfront but you own the car at the end.' },
  { question: 'What is residual value?', answer: 'Residual value is what the car is worth at the end of the loan term. This affects your true cost of ownership when buying.' },
  { question: 'What are typical lease terms?', answer: 'Most leases are 24-36 months with mileage limits of 10,000-15,000 miles per year.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="car-lease-vs-buy" title="Car Lease vs Buy Calculator"
        description="Compare the total cost of leasing versus buying a car to make the best financial decision."
        colorClass="bg-blue-100 text-blue-700" />
      <section aria-label="Car Lease vs Buy Calculator"><CarLeaseVsBuyCalculator /></section>
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
