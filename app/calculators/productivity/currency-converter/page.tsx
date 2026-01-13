import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Currency Converter - USD, EUR, GBP Exchange Rates | OmniTools',
  description: 'Convert between USD, EUR, GBP, and other currencies. Free online currency converter.',
  keywords: ['currency converter', 'USD to EUR', 'exchange rate', 'money converter'],
  alternates: { canonical: '/calculators/productivity/currency-converter' },
};

export default function CurrencyConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="currency-converter"
        title="Currency Converter"
        description="Convert between USD, EUR, GBP, and other currencies."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Currency Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between major world currencies including USD, EUR, GBP, JPY, and more.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Note:</h4>
            <p className="text-sm text-muted-foreground">
              Currency exchange rates fluctuate constantly. This tool will provide real-time rates when available.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
