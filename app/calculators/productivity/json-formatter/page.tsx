import { Metadata } from 'next';
import { JSONFormatter } from '@/components/calculators/productivity';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Free Online JSON Tool',
  description: 'Format, validate, and beautify JSON data instantly. Free online JSON formatter with syntax highlighting and error detection.',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json parser', 'format json online'],
  alternates: { canonical: '/calculators/productivity/json-formatter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON Formatter',
  description: 'Format, validate, and beautify JSON data',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Paste your JSON', text: 'Paste or type your JSON data into the input area.' },
  { name: 'Format automatically', text: 'JSON is formatted and validated in real-time.' },
  { name: 'Fix errors', text: 'Any syntax errors are highlighted with line numbers.' },
  { name: 'Copy result', text: 'Copy the formatted JSON to your clipboard.' },
];

const faqs = [
  { question: 'What is JSON?', answer: 'JSON (JavaScript Object Notation) is a lightweight data format used for storing and exchanging data between servers and web applications.' },
  { question: 'Why format JSON?', answer: 'Formatted JSON is easier to read, debug, and understand. It adds proper indentation and line breaks to make the structure clear.' },
  { question: 'Is my data secure?', answer: 'Yes, all processing happens in your browser. Your JSON data is never sent to any server.' },
  { question: 'What errors can this detect?', answer: 'Missing brackets, commas, quotes, invalid values, and other syntax errors are detected and highlighted.' },
];

const relatedTools = [
  { href: '/calculators/productivity/base64-converter', title: 'Base64 Converter', description: 'Encode and decode Base64 data.' },
  { href: '/calculators/productivity/text-to-binary', title: 'Text to Binary', description: 'Convert text to binary code.' },
];

export default function JSONFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="json-formatter"
          title="JSON Formatter"
          description="Format, validate, and beautify JSON data instantly. Syntax highlighting and real-time error detection included."
          colorClass="bg-purple-100 text-purple-600"
          category="Productivity"
        />

        <section aria-label="JSON Formatter Tool">
          <JSONFormatter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
