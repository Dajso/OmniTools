import { Metadata } from 'next';
import { ResistorCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Resistor Color Code Calculator - 4 & 5 Band',
  description: 'Calculate resistance values from color bands. Supports 4-band and 5-band resistors with visual color selector.',
  keywords: ['resistor calculator', 'color code', 'resistance', 'electronics', 'ohms'],
  alternates: { canonical: '/calculators/electronics/resistor-calculator' },
};

export default function ResistorCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="resistor-calculator"
        title="Resistor Color Code Calculator"
        description="Calculate resistance values from color bands. Supports 4-band and 5-band resistors with visual color selector."
      />
      <ResistorCalculator />
    </main>
  );
}
