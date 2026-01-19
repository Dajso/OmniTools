import { Metadata } from 'next';
import { FertilizerCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fertilizer N-P-K Calculator - Garden Fertilizer Calculator',
  description: 'Calculate how much fertilizer to apply based on N-P-K ratio. Free fertilizer calculator for lawns and gardens.',
  keywords: ['fertilizer calculator', 'npk calculator', 'lawn fertilizer', 'garden fertilizer', 'nitrogen calculator'],
  alternates: { canonical: '/calculators/garden/fertilizer-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fertilizer N-P-K Calculator',
  description: 'Calculate fertilizer application rates based on N-P-K ratios',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select fertilizer type', text: 'Choose a common fertilizer or enter custom N-P-K values.' },
  { name: 'Set nitrogen rate', text: 'Use quick-set buttons or enter your target nitrogen rate.' },
  { name: 'Enter area', text: 'Input the size of the area you want to fertilize.' },
  { name: 'Choose units', text: 'Select your preferred area and weight units.' },
  { name: 'View results', text: 'See total fertilizer needed and nutrients applied.' },
];

const faqs = [
  {
    question: 'What does N-P-K mean?',
    answer: 'N-P-K stands for Nitrogen-Phosphorus-Potassium, the three primary nutrients in fertilizer. The numbers represent the percentage of each nutrient by weight.',
  },
  {
    question: 'How much nitrogen should I apply to my lawn?',
    answer: 'Cool-season lawns typically need 1 lb of nitrogen per 1,000 sq ft per application. Warm-season lawns need about 0.5 lb. Never exceed 1 lb N per application.',
  },
  {
    question: 'What is the best N-P-K ratio for vegetables?',
    answer: 'A balanced fertilizer like 10-10-10 works well for most vegetables. Leafy greens prefer higher nitrogen, while fruiting plants benefit from more phosphorus.',
  },
  {
    question: 'When should I fertilize my lawn?',
    answer: 'Cool-season lawns: early spring and fall. Warm-season lawns: late spring through summer. Avoid fertilizing during extreme heat or drought.',
  },
  {
    question: 'Can I over-fertilize?',
    answer: 'Yes! Over-fertilizing can burn plants, pollute waterways, and waste money. Always follow recommended rates and water in after application.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Calculate plant spacing for gardens.' },
  { href: '/calculators/garden/compost-calculator', title: 'Compost C:N Calculator', description: 'Calculate compost ratios.' },
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Mulch & Soil Calculator', description: 'Calculate mulch and soil needs.' },
];

export default function FertilizerCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fertilizer-calculator"
          title="Fertilizer N-P-K Calculator"
          description="Calculate how much fertilizer to apply based on N-P-K ratio and target nitrogen rate for lawns and gardens."
          colorClass="bg-green-100 text-green-600"
          category="Garden"
        />

        <section aria-label="Fertilizer Calculator">
          <FertilizerCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
