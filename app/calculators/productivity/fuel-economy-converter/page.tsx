import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Fuel Economy Converter - MPG, L/100km, km/L | OmniTools',
  description: 'Convert between MPG, L/100km, and km/L. Free online fuel economy converter.',
  keywords: ['fuel economy converter', 'MPG to L/100km', 'gas mileage converter'],
  alternates: { canonical: '/calculators/productivity/fuel-economy-converter' },
};

export default function FuelEconomyConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="fuel-economy-converter"
        title="Fuel Economy Converter"
        description="Convert between MPG, L/100km, and km/L."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Fuel Economy Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between Miles per Gallon (MPG), Liters per 100km (L/100km), and Kilometers per Liter (km/L).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• MPG (US) = 235.215 / L/100km</li>
              <li>• L/100km = 235.215 / MPG (US)</li>
              <li>• km/L = 100 / L/100km</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
