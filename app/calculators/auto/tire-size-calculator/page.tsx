import { Metadata } from 'next';
import { TireSizeCalculator } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tire Size Calculator - Compare Tire Sizes & Speedometer Error',
  description: 'Compare tire sizes and calculate speedometer error, diameter difference, and ground clearance change. Visual tire comparison tool.',
  keywords: ['tire size calculator', 'tire comparison', 'speedometer error', 'tire diameter', 'wheel size'],
  alternates: { canonical: '/calculators/auto/tire-size-calculator' },
};

export default function TireSizeCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="tire-size-calculator"
        title="Tire Size Calculator"
        description="Compare tire sizes and calculate speedometer error, diameter difference, and ground clearance change."
        category="Auto"
      />
      <TireSizeCalculator />
    </main>
  );
}
