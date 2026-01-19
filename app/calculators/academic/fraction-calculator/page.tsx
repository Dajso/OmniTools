import { Metadata } from 'next';
import { FractionCalculator } from '@/components/calculators/academic';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fraction Calculator - Add, Subtract, Multiply, Divide Fractions',
  description: 'Free fraction calculator to add, subtract, multiply, divide, and simplify fractions. Results shown in simplified form with decimal equivalents.',
  keywords: ['fraction calculator', 'add fractions', 'subtract fractions', 'multiply fractions', 'divide fractions', 'simplify fractions'],
  alternates: { canonical: '/calculators/academic/fraction-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fraction Calculator',
  description: 'Add, subtract, multiply, divide, and simplify fractions',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select operation', text: 'Choose whether to add, subtract, multiply, divide, or simplify fractions.' },
  { name: 'Enter first fraction', text: 'Input the numerator and denominator of the first fraction.' },
  { name: 'Enter second fraction', text: 'For operations other than simplify, enter the second fraction.' },
  { name: 'View results', text: 'See the result as a simplified fraction, decimal, and mixed number (if applicable).' },
];

const faqs = [
  { 
    question: 'How do you add fractions?', 
    answer: 'To add fractions, find a common denominator, convert both fractions, add the numerators, and simplify. For example: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.' 
  },
  { 
    question: 'How do you multiply fractions?', 
    answer: 'To multiply fractions, multiply the numerators together and multiply the denominators together, then simplify. For example: 1/2 × 3/4 = 3/8.' 
  },
  { 
    question: 'How do you divide fractions?', 
    answer: 'To divide fractions, multiply by the reciprocal of the second fraction. For example: 1/2 ÷ 3/4 = 1/2 × 4/3 = 4/6 = 2/3.' 
  },
  { 
    question: 'What does it mean to simplify a fraction?', 
    answer: 'Simplifying a fraction means reducing it to its lowest terms by dividing both numerator and denominator by their greatest common divisor (GCD). For example: 6/8 simplifies to 3/4.' 
  },
  { 
    question: 'What is a mixed number?', 
    answer: 'A mixed number combines a whole number with a fraction. For example, 7/4 as a mixed number is 1 3/4 (one and three-fourths).' 
  },
];

const relatedTools = [
  { href: '/calculators/academic/scientific-notation-converter', title: 'Scientific Notation Converter', description: 'Convert numbers to scientific notation.' },
  { href: '/calculators/productivity/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages and conversions.' },
  { href: '/calculators/academic/gpa-calculator', title: 'GPA Calculator', description: 'Calculate your college GPA.' },
];

export default function FractionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fraction-calculator"
          title="Fraction Calculator"
          description="Add, subtract, multiply, divide, and simplify fractions. All results are automatically reduced to lowest terms with decimal equivalents."
          colorClass="bg-orange-100 text-orange-600"
          category="Academic"
        />

        <section aria-label="Fraction Calculator">
          <FractionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
