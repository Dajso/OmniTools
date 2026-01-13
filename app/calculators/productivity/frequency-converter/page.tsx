import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Frequency Converter - Hz, kHz, MHz, GHz | OmniTools',
  description: 'Convert between Hz, kHz, MHz, and GHz. Free online frequency unit converter.',
  keywords: ['frequency converter', 'Hz to MHz', 'hertz converter', 'GHz converter'],
  alternates: { canonical: '/calculators/productivity/frequency-converter' },
};

export default function FrequencyConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="frequency-converter"
        title="Frequency Converter"
        description="Convert between Hz, kHz, MHz, and GHz."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Frequency Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), and Gigahertz (GHz).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 kHz = 1,000 Hz</li>
              <li>• 1 MHz = 1,000,000 Hz</li>
              <li>• 1 GHz = 1,000,000,000 Hz</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
