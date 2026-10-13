import { Metadata } from 'next';
import { AWGConverter } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'AWG to mm Converter - Wire Gauge Calculator',
  description: 'Convert American Wire Gauge (AWG) to metric measurements. Includes diameter, area, and resistance per length.',
  keywords: ['awg converter', 'wire gauge', 'awg to mm', 'wire size', 'electronics'],
  alternates: { canonical: '/calculators/electronics/awg-converter' },
};

export default function AWGConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="awg-converter"
        title="AWG to mm Converter"
        description="Convert American Wire Gauge (AWG) to metric measurements. Includes diameter, area, and resistance per length."
      />
      <AWGConverter />
    </main>
  );
}
