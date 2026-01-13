import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Number Base Converter - Binary, Decimal, Hex, Octal | OmniTools',
  description: 'Convert between binary, decimal, octal, and hexadecimal. Free online number base converter.',
  keywords: ['number base converter', 'binary to decimal', 'hex converter', 'octal converter'],
  alternates: { canonical: '/calculators/productivity/number-base-converter' },
};

export default function NumberBaseConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="number-base-converter"
        title="Number Base Converter"
        description="Convert between binary, decimal, octal, and hexadecimal."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Number Base Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert numbers between different bases: Binary (base 2), Octal (base 8), Decimal (base 10), and Hexadecimal (base 16).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Examples:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Decimal 255 = Binary 11111111</li>
              <li>• Decimal 255 = Hex FF</li>
              <li>• Decimal 255 = Octal 377</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
