import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Illuminance Converter - Lux, Foot-candles | OmniTools',
  description: 'Convert between lux and foot-candles. Free online illuminance unit converter.',
  keywords: ['illuminance converter', 'lux to foot-candles', 'light measurement', 'brightness'],
  alternates: { canonical: '/calculators/productivity/illuminance-converter' },
};

export default function IlluminanceConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="illuminance-converter"
        title="Illuminance Converter"
        description="Convert between lux and foot-candles."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Illuminance Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between lux (lx) and foot-candles (fc).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 foot-candle = 10.764 lux</li>
              <li>• 1 lux = 0.0929 foot-candles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
