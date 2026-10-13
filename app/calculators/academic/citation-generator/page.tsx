import { Metadata } from 'next';
import { CitationGenerator } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Citation Generator - APA & MLA Format',
  description: 'Free citation generator for APA and MLA formats. Create properly formatted citations for books, websites, and journal articles.',
  keywords: ['citation generator', 'APA citation', 'MLA citation', 'bibliography generator', 'reference generator'],
  alternates: { canonical: '/calculators/academic/citation-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Citation Generator',
  description: 'Generate APA and MLA citations for books, websites, and journal articles',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select citation style', text: 'Choose between APA (7th Edition) or MLA (9th Edition) format.' },
  { name: 'Choose source type', text: 'Select whether you are citing a book, website, or journal article.' },
  { name: 'Enter source details', text: 'Fill in the author(s), title, and other required information for your source.' },
  { name: 'Generate citation', text: 'Click "Generate Citation" to create your formatted citation.' },
  { name: 'Copy and use', text: 'Copy the citation to your clipboard and paste it into your paper or bibliography.' },
];

const faqs = [
  { 
    question: 'What is the difference between APA and MLA?', 
    answer: 'APA (American Psychological Association) is commonly used in social sciences, education, and psychology. MLA (Modern Language Association) is typically used in humanities, literature, and arts. They differ in formatting, author presentation, and date placement.' 
  },
  { 
    question: 'How do I cite a source with multiple authors?', 
    answer: 'Click "Add Author" to add more authors. In APA, 3+ authors use "et al." after the first author. In MLA, 3+ authors also use "et al." The generator handles this automatically.' 
  },
  { 
    question: 'What if I don\'t know the author?', 
    answer: 'Leave the author fields empty. The citation will start with the title (for APA) or the organization/website name (for websites). This is acceptable for sources without identified authors.' 
  },
  { 
    question: 'How do I cite a website with no date?', 
    answer: 'Leave the publish date field empty. The generator will use "n.d." (no date) in APA format, which is the standard way to indicate an undated source.' 
  },
  { 
    question: 'Should I include the DOI for journal articles?', 
    answer: 'Yes, if available. DOIs (Digital Object Identifiers) provide a permanent link to the article and are preferred in both APA and MLA formats. Enter just the DOI number (e.g., 10.1000/xyz123).' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/plagiarism-checker', title: 'Plagiarism Checker', description: 'Compare texts for similarity.' },
  { href: '/calculators/productivity/word-counter', title: 'Word Counter', description: 'Count words and characters.' },
];

export default function CitationGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="citation-generator"
          title="Citation Generator"
          description="Generate properly formatted APA and MLA citations for books, websites, and journal articles. Copy citations directly to your clipboard."
          colorClass="bg-amber-100 text-amber-600"
          category="Academic"
        />

        <section aria-label="Citation Generator">
          <CitationGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
