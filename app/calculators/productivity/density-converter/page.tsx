import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Density Converter - kg/m³, g/cm³, lb/ft³ | OmniTools',
  description: 'Convert between kg/m³, g/cm³, and lb/ft³. Free online density unit converter.',
  keywords: ['density converter', 'kg/m³ to lb/ft³', 'specific gravity', 'density units'],
  alternates: { canonical: '/calculators/productivity/density-converter' },
};

export default function DensityConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="density-converter"
        title="Density Converter"
        description="Convert between kg/m³, g/cm³, and lb/ft³."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Density Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between kilograms per cubic meter (kg/m³), grams per cubic centimeter (g/cm³), and pounds per cubic foot (lb/ft³).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 g/cm³ = 1,000 kg/m³</li>
              <li>• 1 kg/m³ = 0.0624 lb/ft³</li>
              <li>• 1 lb/ft³ = 16.02 kg/m³</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
