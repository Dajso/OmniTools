import { Metadata } from 'next';
import { SeedGerminationTracker } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Seed Germination Tracker - Garden Seed Log',
  description: 'Track and log seed germination rates for your garden. Free seed tracking tool with germination rate calculator.',
  keywords: ['seed germination tracker', 'seed log', 'germination rate', 'garden planner', 'seed starting'],
  alternates: { canonical: '/calculators/garden/seed-germination-tracker' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Seed Germination Tracker',
  description: 'Track seed germination rates for garden planning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add seed batch', text: 'Select plant type and enter the number of seeds planted.' },
  { name: 'Set planting date', text: 'Record when you planted the seeds.' },
  { name: 'Track germination', text: 'Click +1 each time a seed germinates.' },
  { name: 'Monitor progress', text: 'View germination rates and compare batches.' },
  { name: 'Add notes', text: 'Record conditions like soil type and temperature.' },
];

const faqs = [
  {
    question: 'What is a good germination rate?',
    answer: '80% or higher is excellent. 50-80% is acceptable. Below 50% may indicate old seeds, poor conditions, or planting too deep.',
  },
  {
    question: 'How long should I wait for germination?',
    answer: 'It varies by plant. Most vegetables germinate in 5-14 days. Some like carrots and parsley can take 2-3 weeks.',
  },
  {
    question: 'Why are my seeds not germinating?',
    answer: 'Common causes: old seeds, wrong temperature, too wet/dry, planted too deep, or poor seed-to-soil contact.',
  },
  {
    question: 'Is my data saved?',
    answer: 'Yes, your seed tracking data is saved in your browser\'s local storage. It persists between visits but is device-specific.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Plan your garden layout.' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Vegetable Yield Calculator', description: 'Estimate harvest yields.' },
  { href: '/calculators/garden/watering-schedule-generator', title: 'Watering Schedule', description: 'Generate watering schedules.' },
];

export default function SeedGerminationTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="seed-germination-tracker"
          title="Seed Germination Tracker"
          description="Track and log seed germination rates for your garden to improve your seed starting success."
          colorClass="bg-green-100 text-green-600"
          category="Garden"
        />

        <section aria-label="Seed Germination Tracker">
          <SeedGerminationTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
