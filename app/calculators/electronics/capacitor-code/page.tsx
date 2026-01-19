import { Metadata } from 'next';
import { CapacitorCodeConverter } from '@/components/calculators/electronics';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Capacitor Code Converter - 3-Digit Code to Value',
  description: 'Convert capacitor codes (like 104) to actual values in pF, nF, and µF. Includes common code reference.',
  keywords: ['capacitor code', 'capacitor converter', '104 capacitor', 'electronics', 'pF nF uF'],
  alternates: { canonical: '/calculators/electronics/capacitor-code' },
};

export default function CapacitorCodePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
        toolId="capacitor-code"
        title="Capacitor Code Converter"
        description="Convert capacitor codes (like 104) to actual values in pF, nF, and µF. Includes common code reference."
        category="Electronics"
      />
      <CapacitorCodeConverter />
    </main>
  );
}
