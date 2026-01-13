import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Torque Converter - Nm, ft-lb, in-lb | OmniTools',
  description: 'Convert between Newton-meters, foot-pounds, and inch-pounds. Free online torque converter.',
  keywords: ['torque converter', 'Nm to ft-lb', 'torque units', 'Newton-meters'],
  alternates: { canonical: '/calculators/productivity/torque-converter' },
};

export default function TorqueConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="torque-converter"
        title="Torque Converter"
        description="Convert between Newton-meters, foot-pounds, and inch-pounds."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Torque Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between Newton-meters (Nm), foot-pounds (ft-lb), and inch-pounds (in-lb).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 Nm = 0.7376 ft-lb</li>
              <li>• 1 ft-lb = 1.3558 Nm</li>
              <li>• 1 ft-lb = 12 in-lb</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
