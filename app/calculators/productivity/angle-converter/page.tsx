import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Angle Converter - Degrees, Radians, Gradians | OmniTools',
  description: 'Convert between degrees, radians, and gradians. Free online angle unit converter.',
  keywords: ['angle converter', 'degrees to radians', 'radians to degrees', 'gradians'],
  alternates: { canonical: '/calculators/productivity/angle-converter' },
};

export default function AngleConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="angle-converter"
        title="Angle Converter"
        description="Convert between degrees, radians, and gradians."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Angle Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between degrees (°), radians (rad), and gradians (grad).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 radian = 180/π degrees ≈ 57.2958°</li>
              <li>• 1 degree = π/180 radians ≈ 0.01745 rad</li>
              <li>• 1 gradian = 0.9 degrees</li>
              <li>• 360° = 2π radians = 400 gradians</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
