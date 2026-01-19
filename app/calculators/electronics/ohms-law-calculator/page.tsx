import { Metadata } from 'next';
import { OhmsLawCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: "Ohm's Law Calculator - Voltage, Current, Resistance, Power",
  description: "Calculate voltage, current, resistance, and power using Ohm's Law. Enter any two values to find the others.",
  keywords: ['ohms law', 'voltage calculator', 'current calculator', 'resistance', 'power', 'electronics'],
  alternates: { canonical: '/calculators/electronics/ohms-law-calculator' },
};

export default function OhmsLawCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="ohms-law-calculator"
        title="Ohm's Law Calculator"
        description="Calculate voltage, current, resistance, and power using Ohm's Law. Enter any two values to find the others."
        category="Electronics"
      />
      <OhmsLawCalculator />
    </main>
  );
}
