import { Metadata } from 'next';
import { SquareFootageCalculator } from '@/components/calculators/home';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Square Footage Calculator - Calculate Area in Square Feet',
  description: 'Calculate square footage for rectangles, triangles, circles, and trapezoids. Free area calculator with multiple unit conversions.',
  keywords: ['square footage calculator', 'area calculator', 'sq ft calculator', 'room size calculator'],
  alternates: { canonical: '/calculators/home/square-footage-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Square Footage Calculator',
  description: 'Calculate area in square feet for any shape',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select shape', text: 'Choose rectangle, triangle, circle, or trapezoid.' },
  { name: 'Enter dimensions', text: 'Input the required measurements for your selected shape.' },
  { name: 'View results', text: 'See area in square feet, yards, meters, and acres.' },
];

const faqs = [
  { question: 'How do I calculate square footage?', answer: 'For rectangles: length × width. For triangles: ½ × base × height. For circles: π × radius². Our calculator handles all formulas automatically.' },
  { question: 'How many square feet in a square yard?', answer: 'There are 9 square feet in one square yard (3 feet × 3 feet = 9 sq ft).' },
  { question: 'How many square feet in an acre?', answer: 'One acre equals 43,560 square feet. This is roughly the size of a football field.' },
  { question: 'How do I measure an irregular room?', answer: 'Break the room into regular shapes (rectangles, triangles), calculate each area separately, then add them together.' },
];

const relatedTools = [
  { href: '/calculators/home/paint-calculator', title: 'Paint Calculator', description: 'Calculate paint needed for your room.' },
  { href: '/calculators/home/tile-calculator', title: 'Tile Calculator', description: 'Calculate tiles needed for flooring.' },
];

export default function SquareFootageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="square-footage-calculator"
          title="Square Footage Calculator"
          description="Calculate area for any shape in square feet, yards, meters, and acres. Perfect for home improvement projects."
          colorClass="bg-amber-100 text-amber-600"
          category="Home"
        />

        <section aria-label="Square Footage Calculator">
          <SquareFootageCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
