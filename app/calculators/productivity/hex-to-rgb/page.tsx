import { Metadata } from 'next';
import { HexToRgbConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hex to RGB Converter - Free Color Code Converter',
  description: 'Convert hex color codes to RGB and vice versa. Also shows HSL values.',
  keywords: ['hex to RGB', 'color converter', 'RGB to hex', 'color code converter'],
  alternates: { canonical: '/calculators/productivity/hex-to-rgb' },
};

const faqs = [
  { question: 'What is a hex color?', answer: 'Hex colors use a 6-digit hexadecimal code (e.g., #FF5733) to represent RGB values.' },
  { question: 'What is RGB?', answer: 'RGB stands for Red, Green, Blue - the three color channels that combine to create colors on screens.' },
];

export default function HexToRgbPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="hex-to-rgb"
          title="Hex to RGB Converter"
          description="Convert between hex and RGB color formats with live preview."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Hex to RGB Converter"><HexToRgbConverter /></section>
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
