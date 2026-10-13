import { Metadata } from 'next';
import { MulchSoilCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Mulch & Soil Calculator - Landscaping Volume Calculator',
  description: 'Calculate how much mulch, topsoil, or gravel you need for your landscaping project. Free mulch calculator with bag estimates.',
  keywords: ['mulch calculator', 'soil calculator', 'landscaping calculator', 'cubic yards', 'gravel calculator', 'garden soil'],
  alternates: { canonical: '/calculators/garden/mulch-soil-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mulch & Soil Calculator',
  description: 'Calculate mulch, soil, or gravel volume for landscaping projects',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select material type', text: 'Choose mulch, topsoil, or gravel based on your project needs.' },
  { name: 'Choose area shape', text: 'Select rectangular for beds or circular for tree rings.' },
  { name: 'Enter dimensions', text: 'Input the length, width (or diameter) of your area.' },
  { name: 'Set desired depth', text: 'Enter how deep you want the material (typically 2-4 inches for mulch).' },
  { name: 'View results', text: 'See cubic yards needed, bag counts, and weight estimates.' },
];

const faqs = [
  {
    question: 'How deep should mulch be?',
    answer: '2-3 inches is ideal for weed suppression and moisture retention. 3-4 inches provides better insulation for winter. Avoid more than 4 inches as it can suffocate plant roots.',
  },
  {
    question: 'Should I buy bags or bulk mulch?',
    answer: 'For small projects under 3 cubic yards, bags are convenient. For larger areas, bulk delivery is more economical and easier to spread.',
  },
  {
    question: 'How much does mulch weigh?',
    answer: 'Mulch weighs about 400-800 lbs per cubic yard depending on moisture content. Dry mulch is lighter; wet mulch can be significantly heavier.',
  },
  {
    question: 'How often should I replace mulch?',
    answer: 'Most mulch should be refreshed annually. Add 1-2 inches each year to maintain proper depth as it decomposes.',
  },
  {
    question: 'What\'s the difference between topsoil and garden soil?',
    answer: 'Topsoil is natural soil from the ground. Garden soil is topsoil amended with compost and nutrients, better for planting beds.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Calculate plant spacing for gardens.' },
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate N-P-K fertilizer needs.' },
  { href: '/calculators/garden/potting-soil-calculator', title: 'Potting Soil Calculator', description: 'Calculate soil for containers.' },
];

export default function MulchSoilCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mulch-soil-calculator"
          title="Mulch & Soil Calculator"
          description="Calculate how much mulch, topsoil, or gravel you need for your landscaping project with bag and bulk estimates."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="Mulch & Soil Calculator">
          <MulchSoilCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
