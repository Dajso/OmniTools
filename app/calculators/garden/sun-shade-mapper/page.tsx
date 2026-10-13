import { Metadata } from 'next';
import { SunShadeMapper } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sun/Shade Mapper - Garden Sun Exposure Calculator',
  description: 'Estimate sun exposure in your garden based on nearby obstacles. Free sun/shade calculator for garden planning.',
  keywords: ['sun shade mapper', 'garden sun exposure', 'shadow calculator', 'garden planning', 'sun hours'],
  alternates: { canonical: '/calculators/garden/sun-shade-mapper' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sun/Shade Mapper',
  description: 'Estimate sun exposure based on obstacles and location',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your latitude', text: 'Input your approximate latitude (use a map or GPS).' },
  { name: 'Select the month', text: 'Choose the month you want to analyze.' },
  { name: 'Measure obstacles', text: 'Enter the height and distance of nearby buildings or trees.' },
  { name: 'Set obstacle direction', text: 'Indicate which direction the obstacle is from your garden.' },
  { name: 'View results', text: 'See estimated sun hours and plant recommendations.' },
];

const faqs = [
  {
    question: 'How do I find my latitude?',
    answer: 'Search your address on Google Maps and look at the URL or use your phone\'s GPS. Most of the continental US is between 25° and 49° latitude.',
  },
  {
    question: 'What counts as full sun?',
    answer: 'Full sun means 6 or more hours of direct sunlight per day. Most vegetables and flowering plants need full sun.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'This provides estimates based on sun angle calculations. Actual conditions vary with weather, multiple obstacles, and terrain.',
  },
  {
    question: 'Does obstacle direction matter?',
    answer: 'Yes! In the northern hemisphere, obstacles to the south block the most sun. East obstacles affect morning sun, west affects afternoon.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Plan your garden layout.' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Watering Schedule', description: 'Generate watering schedules.' },
];

export default function SunShadeMapperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sun-shade-mapper"
          title="Sun/Shade Mapper"
          description="Estimate sun exposure in your garden based on nearby obstacles like buildings and trees."
          colorClass="bg-yellow-100 text-yellow-600"
        />

        <section aria-label="Sun/Shade Mapper">
          <SunShadeMapper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
