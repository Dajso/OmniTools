import { Metadata } from 'next';
import { PottingSoilCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Potting Soil Volume Calculator - Container Soil Calculator',
  description: 'Calculate how much potting soil you need for containers and planters. Free soil volume calculator for pots.',
  keywords: ['potting soil calculator', 'container soil', 'pot volume', 'planter calculator', 'soil volume'],
  alternates: { canonical: '/calculators/garden/potting-soil-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Potting Soil Volume Calculator',
  description: 'Calculate potting soil volume for containers using πr²h formula',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select container shape', text: 'Choose round, rectangular, or tapered pot shape.' },
  { name: 'Enter dimensions', text: 'Input diameter/length, width, and height of your container.' },
  { name: 'Adjust fill level', text: 'Set fill percentage (leave room for watering).' },
  { name: 'View results', text: 'See volume in gallons, quarts, liters, and bags needed.' },
];

const faqs = [
  {
    question: 'How do I measure a tapered pot?',
    answer: 'Measure the diameter at the top rim and at the bottom inside. The calculator uses the frustum formula to account for the taper.',
  },
  {
    question: 'Should I fill the pot completely?',
    answer: 'Leave 1-2 inches from the rim for watering. Use 90-95% fill for most containers.',
  },
  {
    question: 'What size bag should I buy?',
    answer: 'For small pots, 8-quart bags are convenient. For multiple large containers, 2 cubic foot bags are more economical.',
  },
  {
    question: 'Do I need drainage material at the bottom?',
    answer: 'Modern advice says no - it can actually impede drainage. Just ensure your pot has drainage holes and use quality potting mix.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Mulch & Soil Calculator', description: 'Calculate mulch for garden beds.' },
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Plan your garden layout.' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate fertilizer needs.' },
];

export default function PottingSoilCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="potting-soil-calculator"
          title="Potting Soil Volume Calculator"
          description="Calculate how much potting soil you need for containers and planters using the cylinder volume formula (πr²h)."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Potting Soil Calculator">
          <PottingSoilCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
