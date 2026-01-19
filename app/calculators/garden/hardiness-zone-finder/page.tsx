import { Metadata } from 'next';
import { HardinessZoneFinder } from '@/components/calculators/garden';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hardiness Zone Finder - USDA Plant Zone Lookup',
  description: 'Find your USDA Plant Hardiness Zone by ZIP code or temperature. Free zone finder for garden planning.',
  keywords: ['hardiness zone finder', 'usda zone', 'plant zone', 'growing zone', 'garden zone'],
  alternates: { canonical: '/calculators/garden/hardiness-zone-finder' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hardiness Zone Finder',
  description: 'Find USDA Plant Hardiness Zone by ZIP code or temperature',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose lookup method', text: 'Select ZIP code or temperature-based lookup.' },
  { name: 'Enter your information', text: 'Input your ZIP code or average minimum winter temperature.' },
  { name: 'Find your zone', text: 'Click the button to determine your hardiness zone.' },
  { name: 'View recommendations', text: 'See planting tips and suitable plants for your zone.' },
];

const faqs = [
  {
    question: 'What is a hardiness zone?',
    answer: 'USDA Plant Hardiness Zones divide North America into 13 zones based on average annual minimum winter temperature. Each zone is 10°F warmer or colder than adjacent zones.',
  },
  {
    question: 'Why does my zone matter?',
    answer: 'Your zone determines which perennial plants can survive winter in your area. Annuals are less affected since they complete their life cycle in one season.',
  },
  {
    question: 'Can I grow plants from other zones?',
    answer: 'You can grow plants rated for colder zones (lower numbers). Plants from warmer zones may need winter protection or be grown as annuals.',
  },
  {
    question: 'Are there microclimates in my yard?',
    answer: 'Yes! South-facing walls, low spots, and areas near buildings can be warmer or colder than your general zone. Observe your specific conditions.',
  },
  {
    question: 'How accurate is ZIP code lookup?',
    answer: 'ZIP codes cover large areas with varying conditions. For precise information, use the official USDA Plant Hardiness Zone Map at planthardiness.ars.usda.gov.',
  },
];

const relatedTools = [
  { href: '/calculators/garden/plant-spacing-calculator', title: 'Plant Spacing Calculator', description: 'Plan your garden layout.' },
  { href: '/calculators/garden/sun-shade-mapper', title: 'Sun/Shade Mapper', description: 'Estimate sun exposure.' },
  { href: '/calculators/garden/vegetable-yield-calculator', title: 'Vegetable Yield Calculator', description: 'Estimate harvest yields.' },
];

export default function HardinessZoneFinderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="hardiness-zone-finder"
          title="Hardiness Zone Finder"
          description="Find your USDA Plant Hardiness Zone to choose the right plants for your climate."
          colorClass="bg-green-100 text-green-600"
          category="Garden"
        />

        <section aria-label="Hardiness Zone Finder">
          <HardinessZoneFinder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
