import { Metadata } from 'next';
import { HeatSinkCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Heat Sink Calculator - Thermal Resistance',
  description: 'Calculate required thermal resistance for heat sinks. Includes junction, case, and heat sink temperature calculations.',
  keywords: ['heat sink', 'thermal resistance', 'cooling', 'electronics', 'thermal management'],
  alternates: { canonical: '/calculators/electronics/heat-sink' },
};

export default function HeatSinkPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="heat-sink"
        title="Heat Sink Calculator"
        description="Calculate required thermal resistance for heat sinks. Includes junction, case, and heat sink temperature calculations."
      />
      <HeatSinkCalculator />
    </main>
  );
}
