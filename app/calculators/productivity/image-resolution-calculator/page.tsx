import { Metadata } from 'next';
import { ImageResolutionCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Image Resolution Calculator - DPI/PPI Calculator',
  description: 'Calculate image resolution, DPI, print size, and pixel dimensions. Estimate file sizes.',
  keywords: ['DPI calculator', 'PPI calculator', 'image resolution', 'print size calculator'],
  alternates: { canonical: '/calculators/productivity/image-resolution-calculator' },
};

const faqs = [
  { question: 'What is DPI?', answer: 'DPI (Dots Per Inch) measures print resolution. 300 DPI is standard for high-quality prints.' },
  { question: 'What is PPI?', answer: 'PPI (Pixels Per Inch) measures screen resolution. DPI and PPI are often used interchangeably.' },
];

export default function ImageResolutionCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="image-resolution-calculator"
          title="Image Resolution Calculator"
          description="Calculate DPI, print sizes, and pixel dimensions for your images."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Image Resolution Calculator"><ImageResolutionCalculator /></section>
      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-semibold mb-6">FAQ</h2>
        <div className="space-y-6">{faqs.map((faq, i) => (
          <div key={i} className="border-b pb-6 last:border-b-0">
            <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}</div>
      </section>
    </main>
  );
}
