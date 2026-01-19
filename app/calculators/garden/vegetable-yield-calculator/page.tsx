import { Metadata } from 'next';
import { VegetableYieldCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Vegetable Yield Calculator - Garden Harvest Estimator',
  description: 'Estimate how much produce you can harvest from your vegetable garden. Free yield calculator for tomatoes, peppers, and more.',
  keywords: ['vegetable yield calculator', 'garden harvest', 'tomato yield', 'garden planning', 'crop yield'],
  alternates: { canonical: '/calculators/garden/vegetable-yield-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Vegetable Yield Calculator',
  description: 'Estimate vegetable harvest yields from garden area',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select vegetable', text: 'Choose the vegetable you want to grow.' },
  { name: 'Enter garden area', text: 'Input your garden bed size or number of plants.' },
  { name: 'Set growing conditions', text: 'Rate your soil, water, and sun conditions.' },
  { name: 'View yield estimate', text: 'See estimated harvest in pounds and per plant.' },
];

const faqs = [
  {
    question: 'How accurate are these yield estimates?',
    answer: 'These are average yields based on typical growing conditions. Actual yields vary based on variety, weather, pest pressure, and care. Use as a planning guide.',
  },
  {
    question: 'What affects vegetable yield?',
    answer: 'Key factors include soil quality, consistent watering, sunlight (6+ hours), proper spacing, fertilization, and pest/disease management.',
  },
  {
    question: 'How many tomato plants do I need for a family?',
    answer: 'For fresh eating, 2-4 plants per person. For canning/preserving, 6-10 plants per person. Each plant yields about 10-15 lbs.',
  },
  {
    question: 'What does "harvests per season" mean?',
    answer: 'Some crops like lettuce and radishes can be replanted multiple times per season. The yield shown is total across all plantings.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Calculate optimal plant spacing.' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate fertilizer needs.' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Watering Schedule', description: 'Generate watering schedules.' },
];

export default function VegetableYieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="vegetable-yield-calculator"
          title="Vegetable Yield Calculator"
          description="Estimate how much produce you can harvest from your vegetable garden based on area and growing conditions."
          colorClass="bg-green-100 text-green-600"
          category="Garden"
        />

        <section aria-label="Vegetable Yield Calculator">
          <VegetableYieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
