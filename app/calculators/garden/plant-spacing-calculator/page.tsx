import { Metadata } from 'next';
import { PlantSpacingCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Plant Spacing Calculator - Garden Layout Planner',
  description: 'Calculate how many plants fit in your garden bed with optimal spacing. Free plant spacing calculator for vegetables and flowers.',
  keywords: ['plant spacing calculator', 'garden planner', 'vegetable spacing', 'planting calculator', 'garden layout'],
  alternates: { canonical: '/calculators/garden/plant-spacing-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Plant Spacing Calculator',
  description: 'Calculate optimal plant spacing for garden beds',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select plant type', text: 'Choose a plant for recommended spacing or use custom values.' },
  { name: 'Enter garden dimensions', text: 'Input the length and width of your garden bed.' },
  { name: 'Choose planting pattern', text: 'Select square grid, triangular, or traditional rows.' },
  { name: 'Adjust spacing', text: 'Fine-tune plant and row spacing as needed.' },
  { name: 'View results', text: 'See total plants, rows, and a visual layout preview.' },
];

const faqs = [
  {
    question: 'What is the best planting pattern?',
    answer: 'Triangular/offset patterns fit about 15% more plants than square grids. Traditional rows are best for crops that need cultivation access between rows.',
  },
  {
    question: 'Why is proper plant spacing important?',
    answer: 'Correct spacing ensures plants have enough room for roots, air circulation, and sunlight. Overcrowding leads to disease, competition for nutrients, and reduced yields.',
  },
  {
    question: 'Should I use the minimum or maximum recommended spacing?',
    answer: 'Use minimum spacing for intensive gardening with rich soil and regular watering. Use maximum spacing in poor soil or dry conditions.',
  },
  {
    question: 'How do I measure plant spacing?',
    answer: 'Measure from the center of one plant to the center of the next. For transplants, this is where the main stem meets the soil.',
  },
  {
    question: 'What about companion planting?',
    answer: 'When companion planting, use the spacing of the larger plant. Some companions like basil with tomatoes can be planted closer together.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Mulch & Soil Calculator', description: 'Calculate mulch and soil needs.' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate N-P-K fertilizer needs.' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Vegetable Yield Calculator', description: 'Estimate harvest yields.' },
];

export default function PlantSpacingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="plant-spacing-calculator"
          title="Plant Spacing Calculator"
          description="Calculate how many plants fit in your garden bed with optimal spacing for maximum yield."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Plant Spacing Calculator">
          <PlantSpacingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
