import { Metadata } from 'next';
import { PaypalFeeCalculator } from '@/components/calculators/finance/paypal-fee-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'PayPal Fee Calculator - Calculate Transaction Fees',
  description: 'Calculate PayPal transaction fees for domestic and international payments. Know exactly what you\'ll receive.',
  keywords: ['PayPal fees', 'transaction fee', 'payment processing', 'PayPal calculator', 'payment fees'],
  alternates: { canonical: '/calculators/finance/paypal-fee-calculator' },
};

const howToSteps = [
  { name: 'Enter amount', text: 'Input the payment amount you\'re receiving.' },
  { name: 'Select transaction type', text: 'Choose domestic, international, or friends & family.' },
  { name: 'View fees', text: 'See the fee amount and what you\'ll actually receive.' },
  { name: 'Calculate request amount', text: 'Find out how much to request to receive your full amount.' },
];

const faqs = [
  { question: 'What are PayPal\'s standard fees?', answer: 'PayPal charges 2.9% + $0.30 for domestic transactions and 4.4% + fixed fee for international transactions.' },
  { question: 'Are Friends & Family payments free?', answer: 'Yes, sending money to friends and family is free when funded by PayPal balance or bank account. Credit card funding has fees.' },
  { question: 'Can I pass fees to customers?', answer: 'In most cases, yes. Many sellers add a small surcharge or request a higher amount to cover PayPal fees.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="paypal-fee-calculator" title="PayPal Fee Calculator"
        description="Calculate PayPal transaction fees and know exactly how much you'll receive from payments."
        colorClass="bg-blue-100 text-blue-700" />
      <section aria-label="PayPal Fee Calculator"><PaypalFeeCalculator /></section>
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
