import { Metadata } from 'next';
import { KineticEnergyCalculator } from '@/components/calculators/physics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kinetic Energy Calculator - Calculate KE, Mass, or Velocity',
  description: 'Calculate kinetic energy, mass, or velocity using the formula KE = ½mv². Includes energy unit conversions.',
  keywords: ['kinetic energy calculator', 'physics calculator', 'energy calculator', 'mass velocity', 'KE formula'],
  alternates: { canonical: '/calculators/physics/kinetic-energy-calculator' },
};

export default function KineticEnergyCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="kinetic-energy-calculator"
        title="Kinetic Energy Calculator"
        description="Calculate kinetic energy, mass, or velocity using the formula KE = ½mv². Includes energy unit conversions."
      />
      <KineticEnergyCalculator />
    </main>
  );
}
