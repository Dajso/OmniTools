import { Metadata } from 'next';
import { CaseConverter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Case Converter - Free Text Case Changer',
  description: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more.',
  keywords: ['case converter', 'text case changer', 'uppercase converter', 'camelCase converter'],
  alternates: { canonical: '/calculators/productivity/case-converter' },
};

const faqs = [
  { question: 'What is Title Case?', answer: 'Title Case capitalizes the first letter of each word, like in book titles.' },
  { question: 'What is camelCase?', answer: 'camelCase joins words together with the first word lowercase and subsequent words capitalized.' },
];

export default function CaseConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="case-converter"
          title="Case Converter"
          description="Convert text between different cases instantly."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Case Converter"><CaseConverter /></section>
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
