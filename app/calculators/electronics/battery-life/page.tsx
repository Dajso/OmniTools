import { Metadata } from 'next';
import { BatteryLifeCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Battery Life Calculator - Runtime Estimator',
  description: 'Calculate how long a battery will last based on capacity and current draw. Includes presets for common battery types.',
  keywords: ['battery life', 'battery calculator', 'runtime', 'mah', 'electronics'],
  alternates: { canonical: '/calculators/electronics/battery-life' },
};

export default function BatteryLifePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="battery-life"
        title="Battery Life Calculator"
        description="Calculate how long a battery will last based on capacity and current draw. Includes presets for common battery types."
      />
      <BatteryLifeCalculator />
    </main>
  );
}
