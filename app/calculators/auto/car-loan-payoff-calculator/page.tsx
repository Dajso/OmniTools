import { Metadata } from 'next';
import { CarLoanPayoffCalculator } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Car Loan Early Payoff Calculator - Save on Interest',
  description: 'Calculate how extra payments can help you pay off your car loan faster and save money on interest. See your potential savings instantly.',
  keywords: ['car loan payoff calculator', 'auto loan calculator', 'early payoff', 'extra payment calculator', 'car loan interest'],
  alternates: { canonical: '/calculators/auto/car-loan-payoff-calculator' },
};

export default function CarLoanPayoffCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="car-loan-payoff-calculator"
        title="Car Loan Early Payoff Calculator"
        description="Calculate how extra payments can help you pay off your car loan faster and save money on interest."
      />
      <CarLoanPayoffCalculator />
    </main>
  );
}
