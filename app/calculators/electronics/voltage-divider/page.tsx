import { Metadata } from 'next';
import { VoltageDividerCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Voltage Divider Calculator - Resistor Network',
  description: 'Calculate output voltage for a resistive voltage divider circuit. Find the right resistor values for your project.',
  keywords: ['voltage divider', 'resistor network', 'electronics', 'circuit design'],
  alternates: { canonical: '/calculators/electronics/voltage-divider' },
};

export default function VoltageDividerPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="voltage-divider"
        title="Voltage Divider Calculator"
        description="Calculate output voltage for a resistive voltage divider circuit. Find the right resistor values for your project."
      />
      <VoltageDividerCalculator />
    </main>
  );
}
