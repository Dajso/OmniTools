import { Metadata } from 'next';
import { CryptoProfitLossCalculator } from '@/components/calculators/finance/crypto-profit-loss-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Crypto Profit/Loss Calculator - Calculate Your Gains',
  description: 'Calculate your cryptocurrency profit or loss including trading fees. Track your crypto investment returns.',
  keywords: ['crypto calculator', 'bitcoin profit', 'cryptocurrency', 'crypto gains', 'trading calculator'],
  alternates: { canonical: '/calculators/finance/crypto-profit-loss' },
};

const howToSteps = [
  { name: 'Enter buy price', text: 'Input the price you paid per coin/token.' },
  { name: 'Enter sell price', text: 'Input the price you sold (or current price) per coin/token.' },
  { name: 'Add quantity', text: 'Enter how many coins/tokens you traded.' },
  { name: 'Include fees', text: 'Add any trading fees from your exchange.' },
  { name: 'View results', text: 'See your profit/loss and ROI percentage.' },
];

const faqs = [
  { question: 'How are crypto gains taxed?', answer: 'In the US, crypto is taxed as property. Short-term gains (held < 1 year) are taxed as ordinary income. Long-term gains have lower rates.' },
  { question: 'What fees should I include?', answer: 'Include exchange trading fees (typically 0.1-1%), network/gas fees, and any withdrawal fees.' },
  { question: 'What is ROI?', answer: 'Return on Investment (ROI) shows your profit as a percentage of your initial investment. A 50% ROI means you made 50% on your money.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="crypto-profit-loss" title="Crypto Profit/Loss Calculator"
        description="Calculate your cryptocurrency trading profits and losses including fees and ROI."
        colorClass="bg-orange-100 text-orange-700" />
      <section aria-label="Crypto Profit Loss Calculator"><CryptoProfitLossCalculator /></section>
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
