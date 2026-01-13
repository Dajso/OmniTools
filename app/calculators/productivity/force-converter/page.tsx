import { Metadata } from 'next';
import { ToolPageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Force Converter - Newtons, Pounds-force, Dynes | OmniTools',
  description: 'Convert between Newtons, pounds-force, and dynes. Free online force unit converter.',
  keywords: ['force converter', 'Newtons to lbf', 'force units', 'physics'],
  alternates: { canonical: '/calculators/productivity/force-converter' },
};

export default function ForceConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="force-converter"
        title="Force Converter"
        description="Convert between Newtons, pounds-force, and dynes."
        colorClass="bg-purple-100 text-purple-700"
      />
      <Card>
        <CardHeader>
          <CardTitle>Force Converter</CardTitle>
          <CardDescription>This converter is coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Convert between Newtons (N), pounds-force (lbf), and dynes (dyn).
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Conversion Formulas:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 N = 0.2248 lbf</li>
              <li>• 1 lbf = 4.4482 N</li>
              <li>• 1 N = 100,000 dyn</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
