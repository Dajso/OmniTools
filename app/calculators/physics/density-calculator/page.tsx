import { Metadata } from 'next';
import { DensityCalculator } from '@/components/calculators/physics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Density Calculator - Calculate Mass, Volume, or Density',
  description: 'Calculate density, mass, or volume using the density formula ρ = m/V. Includes material presets and buoyancy calculations.',
  keywords: ['density calculator', 'mass calculator', 'volume calculator', 'physics', 'density formula', 'buoyancy'],
  alternates: { canonical: '/calculators/physics/density-calculator' },
};

export default function DensityCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="density-calculator"
        title="Density Calculator"
        description="Calculate density, mass, or volume using the density formula ρ = m/V. Includes material presets and buoyancy calculations."
        category="Physics"
      />
      <DensityCalculator />
    </main>
  );
}
