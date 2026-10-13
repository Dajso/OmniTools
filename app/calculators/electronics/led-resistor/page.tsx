import { Metadata } from 'next';
import { LEDResistorCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'LED Resistor Calculator - Series Resistor for LEDs',
  description: 'Calculate the required series resistor for LED circuits. Includes presets for common LED colors and power rating recommendations.',
  keywords: ['led resistor', 'led calculator', 'series resistor', 'electronics', 'led circuit'],
  alternates: { canonical: '/calculators/electronics/led-resistor' },
};

export default function LEDResistorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="led-resistor"
        title="LED Resistor Calculator"
        description="Calculate the required series resistor for LED circuits. Includes presets for common LED colors and power rating recommendations."
      />
      <LEDResistorCalculator />
    </main>
  );
}
