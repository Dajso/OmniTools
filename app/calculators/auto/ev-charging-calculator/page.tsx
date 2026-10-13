import { Metadata } from 'next';
import { EVChargingCalculator } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'EV Charging Time Calculator - Electric Vehicle Charging',
  description: 'Calculate how long it takes to charge your electric vehicle. Compare Level 1, Level 2, and DC fast charging times with cost estimates.',
  keywords: ['ev charging calculator', 'electric vehicle charging', 'charging time', 'ev charger', 'tesla charging'],
  alternates: { canonical: '/calculators/auto/ev-charging-calculator' },
};

export default function EVChargingCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="ev-charging-calculator"
        title="EV Charging Time Calculator"
        description="Calculate how long it takes to charge your electric vehicle. Compare Level 1, Level 2, and DC fast charging times with cost estimates."
      />
      <EVChargingCalculator />
    </main>
  );
}
