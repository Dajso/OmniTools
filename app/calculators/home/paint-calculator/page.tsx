import { Metadata } from 'next';
import { PaintCalculator } from '@/components/calculators/home/paint-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Paint Calculator - How Much Paint Do I Need?',
  description: 'Calculate how much paint you need for your room. Free paint calculator estimates gallons needed based on room dimensions.',
  keywords: ['paint calculator', 'how much paint do I need', 'wall paint calculator', 'room paint estimator'],
  alternates: { canonical: '/calculators/home/paint-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Paint Calculator',
  description: 'Calculate how much paint you need for your room based on dimensions and coverage',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure your room', text: 'Measure length, width, and wall height in feet.' },
  { name: 'Count doors and windows', text: 'These areas will be subtracted from total wall area.' },
  { name: 'Choose number of coats', text: 'Most projects require 2 coats for best coverage.' },
  { name: 'Check paint coverage', text: 'Most paints cover 300-400 sq ft per gallon.' },
  { name: 'Get your results', text: 'See how many gallons you need to purchase.' },
];

const faqs = [
  { question: 'How much paint do I need for a 12x12 room?', answer: 'For a 12x12 room with 8-foot ceilings, you need about 334 sq ft of coverage after subtracting doors/windows. With 2 coats, you\'ll need approximately 2 gallons.' },
  { question: 'How many square feet does a gallon cover?', answer: 'Most interior paints cover 300-400 sq ft per gallon. Premium paints may cover up to 400 sq ft, while budget paints might only cover 250-300 sq ft.' },
  { question: 'Should I buy extra paint?', answer: 'Yes, buy 10-15% extra for touch-ups and to account for textured walls or porous surfaces.' },
  { question: 'How many coats of paint do I need?', answer: 'Most projects require 2 coats. You may need 3 coats when painting over dark colors with light paint.' },
];

const relatedTools = [
  { href: '/calculators/home/wallpaper-calculator', title: 'Wallpaper Calculator', description: 'Calculate wallpaper rolls needed.' },
  { href: '/calculators/home/square-footage-calculator', title: 'Square Footage Calculator', description: 'Calculate room square footage.' },
];

export default function PaintCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="paint-calculator"
          title="Paint Calculator"
          description="Calculate how much paint you need for your room. Enter dimensions, doors, and windows for an accurate estimate."
          colorClass="bg-amber-100 text-amber-600"
          category="Home"
        />

        <section aria-label="Paint Calculator">
          <PaintCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
