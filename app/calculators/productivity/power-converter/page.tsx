import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Power Converter - Watts, Kilowatts, Horsepower | OmniTools',
  description: 'Convert between watts, kilowatts, and horsepower. Free online power unit converter.',
  keywords: ['power converter', 'watts to hp', 'kilowatts converter', 'horsepower'],
  alternates: { canonical: '/calculators/productivity/power-converter' },
};

export default function PowerConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="power-converter"
        title="Power Converter"
        description="Convert between watts, kilowatts, and horsepower."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Power Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between Watts (W), Kilowatts (kW), and Horsepower (hp).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 kW = 1,000 W</li>
              <li>• 1 hp (mechanical) = 745.7 W</li>
              <li>• 1 kW = 1.341 hp</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
