import { Metadata } from 'next';
import { TextToBinaryConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Text to Binary Converter - Free Binary Translator',
  description: 'Convert text to binary code and binary to text. Free online binary translator.',
  keywords: ['text to binary', 'binary converter', 'binary translator', 'ASCII to binary'],
  alternates: { canonical: '/calculators/productivity/text-to-binary' },
};

const faqs = [
  { question: 'How does text to binary work?', answer: 'Each character is converted to its ASCII code, then represented as an 8-bit binary number.' },
  { question: 'What is binary code?', answer: 'Binary is a base-2 number system using only 0s and 1s, the fundamental language of computers.' },
];

export default function TextToBinaryPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="text-to-binary"
          title="Text to Binary Converter"
          description="Convert text to binary and binary back to text."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Text to Binary Converter"><TextToBinaryConverter /></section>
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
