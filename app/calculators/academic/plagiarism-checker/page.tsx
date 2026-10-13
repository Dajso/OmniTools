import { Metadata } from 'next';
import { PlagiarismChecker } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Plagiarism Checker - Text Compare Tool',
  description: 'Free plagiarism checker to compare two texts and find similarities. Detect matching phrases and calculate similarity percentage.',
  keywords: ['plagiarism checker', 'text compare', 'similarity checker', 'duplicate content', 'text comparison'],
  alternates: { canonical: '/calculators/academic/plagiarism-checker' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Plagiarism Checker',
  description: 'Compare two texts to find similarities and potential plagiarism',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter original text', text: 'Paste or type the original text in the first text box.' },
  { name: 'Enter comparison text', text: 'Paste or type the text you want to compare in the second box.' },
  { name: 'Click Compare', text: 'Click the Calculate button to analyze both texts.' },
  { name: 'Review results', text: 'See the similarity percentage, matching phrases, and unique words in each text.' },
];

const faqs = [
  { 
    question: 'How does this plagiarism checker work?', 
    answer: 'This tool compares two texts by analyzing word overlap and matching phrases. It calculates a similarity percentage based on shared words and common phrase patterns (3+ word sequences).' 
  },
  { 
    question: 'Is this a complete plagiarism detection tool?', 
    answer: 'This is a basic text comparison tool for local comparison between two texts. For comprehensive plagiarism detection against online sources, consider dedicated services like Turnitin or Grammarly.' 
  },
  { 
    question: 'What similarity percentage indicates plagiarism?', 
    answer: 'There\'s no universal threshold. Generally, 0-20% is low similarity, 20-40% is moderate, 40-60% is high, and above 60% is very high. Context matters - technical documents may naturally share terminology.' 
  },
  { 
    question: 'Does this tool store my text?', 
    answer: 'No, all text comparison is done locally in your browser. Your text is never sent to any server or stored anywhere.' 
  },
  { 
    question: 'Can I compare documents in different languages?', 
    answer: 'This tool works best with English text. It may work with other languages using Latin characters, but accuracy may vary.' 
  },
];

const relatedTools = [
  { href: '/calculators/productivity/word-counter', title: 'Word Counter', description: 'Count words, characters, and sentences.' },
  { href: '/calculators/academic/citation-generator', title: 'Citation Generator', description: 'Generate APA and MLA citations.' },
  { href: '/calculators/productivity/character-counter', title: 'Character Counter', description: 'Count characters with or without spaces.' },
];

export default function PlagiarismCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="plagiarism-checker"
          title="Plagiarism Checker"
          description="Compare two texts to find similarities and potential plagiarism. See matching phrases, unique words, and get a similarity percentage score."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="Plagiarism Checker">
          <PlagiarismChecker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
