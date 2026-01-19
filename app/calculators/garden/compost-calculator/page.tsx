import { Metadata } from 'next';
import { CompostCalculator } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Compost C:N Ratio Calculator - Carbon Nitrogen Calculator',
  description: 'Calculate the carbon to nitrogen ratio of your compost mix. Free C:N ratio calculator for optimal composting.',
  keywords: ['compost calculator', 'c:n ratio', 'carbon nitrogen ratio', 'composting', 'green brown ratio'],
  alternates: { canonical: '/calculators/garden/compost-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compost C:N Ratio Calculator',
  description: 'Calculate carbon to nitrogen ratio for compost mixtures',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add materials', text: 'Select the materials you\'re adding to your compost.' },
  { name: 'Enter amounts', text: 'Input relative amounts (parts, buckets, or wheelbarrows).' },
  { name: 'Calculate ratio', text: 'Click calculate to see your C:N ratio.' },
  { name: 'Adjust if needed', text: 'Follow suggestions to reach the optimal 25-30:1 range.' },
];

const faqs = [
  {
    question: 'What is the ideal C:N ratio for compost?',
    answer: 'The ideal C:N ratio is 25:1 to 30:1. This provides the right balance for microorganisms to break down materials efficiently.',
  },
  {
    question: 'What are "greens" and "browns"?',
    answer: 'Greens are nitrogen-rich materials (grass, food scraps, manure). Browns are carbon-rich materials (leaves, straw, cardboard). You need both for good compost.',
  },
  {
    question: 'What happens if my C:N ratio is too high?',
    answer: 'High C:N (too much carbon) slows decomposition. The pile will be dry and take longer to break down. Add more greens.',
  },
  {
    question: 'What happens if my C:N ratio is too low?',
    answer: 'Low C:N (too much nitrogen) causes odor problems and nutrient loss. The pile may become slimy and smelly. Add more browns.',
  },
  {
    question: 'Do I need to measure exactly?',
    answer: 'No, rough estimates work fine. The calculator helps you understand the balance. A general rule is 2-3 parts browns to 1 part greens by volume.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/fertilizer-calculator', title: 'Fertilizer Calculator', description: 'Calculate N-P-K fertilizer needs.' },
  { href: '/calculators/garden/mulch-soil-calculator', title: 'Mulch & Soil Calculator', description: 'Calculate mulch and soil needs.' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Vegetable Yield Calculator', description: 'Estimate harvest yields.' },
];

export default function CompostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="compost-calculator"
          title="Compost C:N Ratio Calculator"
          description="Calculate the carbon to nitrogen ratio of your compost mix for optimal decomposition (ideal: 25-30:1)."
          colorClass="bg-amber-100 text-amber-600"
          category="Garden"
        />

        <section aria-label="Compost Calculator">
          <CompostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
