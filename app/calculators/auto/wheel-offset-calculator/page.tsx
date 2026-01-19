import { Metadata } from 'next';
import { WheelOffsetCalculator } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Wheel Offset (ET) Calculator - Fitment & Backspacing',
  description: 'Calculate wheel offset, backspacing, and fitment changes when changing wheel specifications. Check if new wheels will fit your vehicle.',
  keywords: ['wheel offset calculator', 'ET calculator', 'backspacing', 'wheel fitment', 'wheel width'],
  alternates: { canonical: '/calculators/auto/wheel-offset-calculator' },
};

export default function WheelOffsetCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="wheel-offset-calculator"
        title="Wheel Offset Calculator"
        description="Calculate wheel offset, backspacing, and fitment changes when changing wheel specifications."
        category="Auto"
      />
      <WheelOffsetCalculator />
    </main>
  );
}
