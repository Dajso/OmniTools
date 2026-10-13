import { Metadata } from 'next';
import { WateringScheduleGenerator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Watering Schedule Generator - Plant Watering Guide',
  description: 'Generate a customized watering schedule for your plants based on type, soil, sun exposure, and season.',
  keywords: ['watering schedule', 'plant watering', 'garden watering', 'irrigation schedule', 'when to water plants'],
  alternates: { canonical: '/calculators/garden/watering-schedule-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Watering Schedule Generator',
  description: 'Generate customized watering schedules for plants',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select plant type', text: 'Choose what type of plants you are growing.' },
  { name: 'Choose growing location', text: 'Select in-ground, raised bed, container, or hanging basket.' },
  { name: 'Specify soil type', text: 'Indicate your soil type for drainage considerations.' },
  { name: 'Set sun exposure', text: 'Choose full sun, partial sun, or shade.' },
  { name: 'Select season', text: 'Pick the current season for accurate recommendations.' },
];

const faqs = [
  {
    question: 'How do I know if my plants need water?',
    answer: 'Stick your finger 1-2 inches into the soil. If it feels dry, it\'s time to water. Wilting leaves can also indicate thirst, but check soil first.',
  },
  {
    question: 'Is it better to water in the morning or evening?',
    answer: 'Morning is best - it allows foliage to dry during the day, reducing disease risk. Evening watering can promote fungal growth.',
  },
  {
    question: 'How much water do plants need?',
    answer: 'Most gardens need 1-2 inches of water per week. Deep, infrequent watering encourages deeper root growth than frequent shallow watering.',
  },
  {
    question: 'Should I water every day in summer?',
    answer: 'Not necessarily. Deep watering every 2-3 days is often better than daily shallow watering. Container plants may need daily watering in hot weather.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Plan your garden layout.' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate fertilizer needs.' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Vegetable Yield Calculator', description: 'Estimate harvest yields.' },
];

export default function WateringScheduleGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="watering-schedule-generator"
          title="Watering Schedule Generator"
          description="Generate a customized watering schedule based on your plants, soil, sun exposure, and season."
          colorClass="bg-blue-100 text-blue-600"
        />

        <section aria-label="Watering Schedule Generator">
          <WateringScheduleGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
