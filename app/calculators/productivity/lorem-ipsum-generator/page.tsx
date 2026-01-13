import { Metadata } from 'next';
import { LoremIpsumGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Free Placeholder Text Generator',
  description: 'Generate Lorem Ipsum placeholder text for your designs. Create paragraphs, sentences, or words.',
  keywords: ['lorem ipsum generator', 'placeholder text', 'dummy text', 'filler text'],
  alternates: { canonical: '/calculators/productivity/lorem-ipsum-generator' },
};

const faqs = [
  { question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is placeholder text used in design and publishing to demonstrate visual form without meaningful content.' },
  { question: 'Why use Lorem Ipsum?', answer: 'It helps designers focus on layout and typography without being distracted by readable content.' },
];

export default function LoremIpsumGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="lorem-ipsum-generator"
          title="Lorem Ipsum Generator"
          description="Generate placeholder text for your designs and mockups."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Lorem Ipsum Generator"><LoremIpsumGenerator /></section>
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
