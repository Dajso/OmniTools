import { Metadata } from 'next';
import { FuelCostCalculator } from '@/components/calculators/finance/fuel-cost-calculator';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fuel Cost Trip Calculator - Calculate Gas Costs',
  description: 'Calculate fuel costs for your trip in MPG or L/100km. Plan your road trip budget with our free calculator.',
  keywords: ['fuel cost', 'gas calculator', 'trip cost', 'MPG calculator', 'road trip calculator'],
  alternates: { canonical: '/calculators/finance/fuel-cost-calculator' },
};

const howToSteps = [
  { name: 'Choose units', text: 'Select Imperial (MPG) or Metric (L/100km).' },
  { name: 'Enter distance', text: 'Input the total distance of your trip.' },
  { name: 'Add fuel efficiency', text: 'Enter your vehicle\'s fuel efficiency.' },
  { name: 'Set fuel price', text: 'Input the current price per gallon or liter.' },
  { name: 'View costs', text: 'See total fuel needed and trip cost.' },
];

const faqs = [
  { question: 'How do I find my car\'s MPG?', answer: 'Check your owner\'s manual, the sticker on the driver\'s door, or websites like fueleconomy.gov. Real-world MPG is often 10-15% lower than EPA estimates.' },
  { question: 'What affects fuel efficiency?', answer: 'Speed, tire pressure, AC usage, cargo weight, driving style, and terrain all affect fuel efficiency. Highway driving is typically more efficient.' },
  { question: 'How do I convert MPG to L/100km?', answer: 'Divide 235.215 by your MPG. For example, 30 MPG = 235.215/30 = 7.84 L/100km.' },
];

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader toolId="fuel-cost-calculator" title="Fuel Cost Trip Calculator"
        description="Calculate how much fuel you'll need and what it will cost for your road trip."
        colorClass="bg-yellow-100 text-yellow-700" />
      <section aria-label="Fuel Cost Calculator"><FuelCostCalculator /></section>
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
