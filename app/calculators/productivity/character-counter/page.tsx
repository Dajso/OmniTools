import { Metadata } from 'next';
import { CharacterCounter } from '@/components/calculators/productivity';
import { ToolPageHeader } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Character Counter - Free Online Character Count Tool',
  description: 'Count characters with or without spaces. Free character counter with letter, digit, and special character breakdown.',
  keywords: ['character counter', 'letter counter', 'text length', 'char count'],
  alternates: { canonical: '/calculators/productivity/character-counter' },
};

const faqs = [
  { question: 'What counts as a character?', answer: 'Every letter, number, space, and symbol counts as one character.' },
  { question: 'Why count characters without spaces?', answer: 'Some platforms like Twitter count characters without spaces for certain limits.' },
];

export default function CharacterCounterPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ToolPageHeader
          toolId="character-counter"
          title="Character Counter"
          description="Count characters, letters, digits, and special characters in your text."
          colorClass="bg-purple-100 text-purple-700"
        />
      <section aria-label="Character Counter Tool"><CharacterCounter /></section>
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
