import { Metadata } from 'next';
import { Base64Converter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Free Online Tool',
  description: 'Encode text to Base64 or decode Base64 to text. Supports URL-safe encoding.',
  keywords: ['Base64 encoder', 'Base64 decoder', 'Base64 converter', 'encode decode'],
  alternates: { canonical: '/calculators/productivity/base64-converter' },
};

const faqs = [
  { question: 'What is Base64?', answer: 'Base64 is an encoding scheme that converts binary data to ASCII text, commonly used for transmitting data.' },
  { question: 'What is URL-safe Base64?', answer: 'URL-safe Base64 replaces + and / with - and _ to avoid issues in URLs.' },
];

export default function Base64ConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="base64-encoder"
          title="Base64 Encoder/Decoder"
          description="Encode and decode Base64 strings instantly."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Base64 Converter"><Base64Converter /></section>
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
