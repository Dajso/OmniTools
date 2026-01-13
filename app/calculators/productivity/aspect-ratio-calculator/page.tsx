import { Metadata } from 'next';
import { AspectRatioCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator - Calculate & Resize Ratios',
  description: 'Calculate aspect ratios and resize dimensions while maintaining proportions. Common ratios included.',
  keywords: ['aspect ratio calculator', 'image ratio', 'video aspect ratio', '16:9 calculator'],
  alternates: { canonical: '/calculators/productivity/aspect-ratio-calculator' },
};

const faqs = [
  { question: 'What is aspect ratio?', answer: 'Aspect ratio is the proportional relationship between width and height, expressed as width:height (e.g., 16:9).' },
  { question: 'What is 16:9?', answer: '16:9 is the standard widescreen aspect ratio used for HD video, TVs, and computer monitors.' },
];

export default function AspectRatioCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="aspect-ratio-calculator"
          title="Aspect Ratio Calculator"
          description="Calculate aspect ratios and resize images while maintaining proportions."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Aspect Ratio Calculator"><AspectRatioCalculator /></section>
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
