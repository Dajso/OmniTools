import { Metadata } from 'next';
import { UUIDGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'UUID Generator - Free Online UUID/GUID Generator',
  description: 'Generate UUIDs (Universally Unique Identifiers) instantly. Support for UUID v4 and bulk generation.',
  keywords: ['UUID generator', 'GUID generator', 'unique ID', 'random UUID'],
  alternates: { canonical: '/calculators/productivity/uuid-generator' },
};

const faqs = [
  { question: 'What is a UUID?', answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time.' },
  { question: 'What is UUID v4?', answer: 'UUID v4 is randomly generated and is the most commonly used version for general purposes.' },
];

export default function UUIDGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="uuid-generator"
          title="UUID Generator"
          description="Generate universally unique identifiers for your applications."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="UUID Generator"><UUIDGenerator /></section>
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
