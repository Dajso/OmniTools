import { Metadata } from 'next';
import { FuelConsumptionConverter } from '@/components/calculators/auto';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fuel Consumption Converter - MPG to L/100km',
  description: 'Convert fuel economy between MPG (US), MPG (UK), L/100km, and km/L. Compare fuel efficiency across different measurement systems.',
  keywords: ['mpg to l/100km', 'fuel consumption converter', 'fuel economy calculator', 'mpg converter', 'km/l to mpg'],
  alternates: { canonical: '/calculators/auto/fuel-consumption-converter' },
};

export default function FuelConsumptionConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="fuel-consumption-converter"
        title="Fuel Consumption Converter"
        description="Convert fuel economy between MPG (US), MPG (UK), L/100km, and km/L. Compare fuel efficiency across different measurement systems."
        category="Auto"
      />
      <FuelConsumptionConverter />
    </main>
  );
}
