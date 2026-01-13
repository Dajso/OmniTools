import { Metadata } from 'next';
import { WordCounter } from '@/components/calculators/productivity';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Word Counter - Free Online Word & Character Counter',
  description: 'Count words, characters, sentences, and paragraphs instantly. Free online word counter with reading time estimation.',
  keywords: ['word counter', 'character counter', 'sentence counter', 'word count tool', 'text analyzer'],
  alternates: { canonical: '/calculators/productivity/word-counter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Word Counter',
  description: 'Count words, characters, sentences, and paragraphs in your text',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your text', text: 'Type or paste your text into the text area.' },
  { name: 'View statistics', text: 'Word count, character count, and other stats update automatically.' },
  { name: 'Copy results', text: 'Click on any statistic to copy it to your clipboard.' },
];

const faqs = [
  { question: 'How are words counted?', answer: 'Words are counted by splitting text on whitespace. Hyphenated words count as one word.' },
  { question: 'Does the character count include spaces?', answer: 'We show both: total characters (including spaces) and characters without spaces.' },
  { question: 'How is reading time calculated?', answer: 'Reading time is based on an average reading speed of 200 words per minute.' },
  { question: 'How is speaking time calculated?', answer: 'Speaking time is based on an average speaking speed of 150 words per minute.' },
];

const relatedTools = [
  { href: '/calculators/productivity/character-counter', title: 'Character Counter', description: 'Count characters with detailed breakdown.' },
  { href: '/calculators/productivity/case-converter', title: 'Case Converter', description: 'Convert text between different cases.' },
];

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="word-counter"
          title="Word Counter"
          description="Count words, characters, sentences, and paragraphs instantly. Perfect for essays, articles, and social media posts."
          colorClass="bg-purple-100 text-purple-600"
          category="Productivity"
        />

        <section aria-label="Word Counter Tool">
          <WordCounter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
