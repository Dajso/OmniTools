import { Metadata } from 'next';
import { MapGridGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Map Grid Generator - Hex & Square Battle Maps',
  description: 'Create hex and square grids for tabletop RPG battle maps. Paint terrain, add coordinates, and export as SVG for virtual tabletops or printing.',
  keywords: ['map grid', 'hex grid', 'battle map', 'd&d map', 'rpg map maker', 'tabletop map', 'dungeon map'],
  alternates: { canonical: '/calculators/rpg/map-grid-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Map Grid Generator',
  description: 'Create hex and square grids for tabletop RPG battle maps',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose grid type', text: 'Select square grid, flat-top hex, or pointy-top hex based on your game system.' },
  { name: 'Set dimensions', text: 'Enter the number of rows and columns for your map. Adjust cell size for detail level.' },
  { name: 'Select terrain', text: 'Click a terrain type from the palette (grass, water, forest, etc.).' },
  { name: 'Paint the map', text: 'Click and drag on the grid to paint terrain. Select "Empty" to erase.' },
  { name: 'Export your map', text: 'Download as SVG for use in virtual tabletops or for printing.' },
];

const faqs = [
  {
    question: 'What grid type should I use?',
    answer: 'Square grids are standard for D&D 5e and most d20 systems. Hex grids are popular for wargames and some RPGs like GURPS. Flat-top hexes are common for overland maps, while pointy-top hexes work well for tactical combat.',
  },
  {
    question: 'How big should my grid be?',
    answer: 'For tactical combat, 20x20 squares covers most encounters. For dungeon rooms, 10x10 to 15x15 is typical. Larger grids (30x30) work for outdoor battles or complex dungeons.',
  },
  {
    question: 'What does each terrain type represent?',
    answer: 'Empty = clear terrain, Grass = normal outdoor, Water = swimming/difficult, Forest = cover/difficult, Mountain = impassable, Road = normal movement, Building = structures, Wall = impassable, Door = passage, Difficult = half movement speed.',
  },
  {
    question: 'Can I use this with virtual tabletops?',
    answer: 'Yes! Export as SVG and import into Roll20, Foundry VTT, or other virtual tabletops. SVG files scale perfectly to any size.',
  },
  {
    question: 'What scale should I use?',
    answer: 'Standard D&D scale is 1 square = 5 feet. For hex grids, each hex typically represents 5 feet across (flat side to flat side).',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Calculate encounter difficulty for your battle.' },
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiative Tracker', description: 'Track combat order during encounters.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll dice for combat and skill checks.' },
];

export default function MapGridGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <ToolPageHeader
          toolId="map-grid-generator"
          title="Map Grid Generator"
          description="Create hex and square grids for tabletop RPG battle maps. Paint terrain, add coordinates, and export as SVG for virtual tabletops or printing."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Map Grid Generator">
          <MapGridGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
