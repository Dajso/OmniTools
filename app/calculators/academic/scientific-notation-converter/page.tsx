import { Metadata } from 'next';
import { ScientificNotationConverter } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Scientific Notation Converter - Convert Numbers',
  description: 'Convert numbers to and from scientific notation. Supports e notation, engineering notation, and SI prefixes.',
  keywords: ['scientific notation', 'e notation', 'exponent converter', 'engineering notation', 'SI prefixes'],
  alternates: { canonical: '/calculators/academic/scientific-notation-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Scientific Notation Converter',
  description: 'Convert numbers to and from scientific notation',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose conversion direction', text: 'Select whether to convert from decimal to scientific notation or vice versa.' },
  { name: 'Enter your number', text: 'For decimal input, type any number. For scientific notation, enter the coefficient and exponent.' },
  { name: 'View all formats', text: 'See your number in decimal, scientific notation, e notation, and engineering notation.' },
  { name: 'Copy results', text: 'Click the copy button to copy any format to your clipboard.' },
];

const faqs = [
  { 
    question: 'What is scientific notation?', 
    answer: 'Scientific notation expresses numbers as a coefficient between 1 and 10 multiplied by a power of 10. For example, 314159 becomes 3.14159 × 10^5. It\'s useful for very large or very small numbers.' 
  },
  { 
    question: 'What is the difference between scientific and engineering notation?', 
    answer: 'Engineering notation is similar to scientific notation, but the exponent is always a multiple of 3 (matching SI prefixes like kilo, mega, milli, micro). For example, 314159 is 314.159 × 10^3 in engineering notation.' 
  },
  { 
    question: 'What is e notation?', 
    answer: 'E notation is a compact way to write scientific notation used in calculators and programming. Instead of 3.14 × 10^5, you write 3.14e5. The "e" stands for "exponent" or "times 10 to the power of".' 
  },
  { 
    question: 'What are SI prefixes?', 
    answer: 'SI prefixes are standardized prefixes for powers of 10, like kilo (10^3), mega (10^6), milli (10^-3), and micro (10^-6). They\'re commonly used in science and engineering.' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/fraction-calculator', title: 'Fraction Calculator', description: 'Add, subtract, multiply, and divide fractions.' },
  { href: '/calculators/productivity/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages and conversions.' },
  { href: '/calculators/productivity/number-base-converter', title: 'Number Base Converter', description: 'Convert between binary, decimal, and hex.' },
];

export default function ScientificNotationConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="scientific-notation-converter"
          title="Scientific Notation Converter"
          description="Convert numbers to and from scientific notation. View results in multiple formats including e notation, engineering notation, and SI prefixes."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Scientific Notation Converter">
          <ScientificNotationConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
