import { Metadata } from 'next';
import { HorsepowerKwConverter } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Horsepower to kW Converter - HP, PS, BHP Conversion',
  description: 'Convert between horsepower (HP), kilowatts (kW), metric horsepower (PS), and brake horsepower (BHP). Quick and accurate power unit conversion.',
  keywords: ['horsepower to kw', 'hp to kw converter', 'ps to hp', 'power converter', 'bhp calculator'],
  alternates: { canonical: '/calculators/auto/horsepower-kw-converter' },
};

export default function HorsepowerKwConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="horsepower-kw-converter"
        title="Horsepower to kW Converter"
        description="Convert between horsepower (HP), kilowatts (kW), metric horsepower (PS), and brake horsepower (BHP)."
        category="Auto"
      />
      <HorsepowerKwConverter />
    </main>
  );
}
