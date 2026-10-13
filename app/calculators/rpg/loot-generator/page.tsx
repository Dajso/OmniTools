import { Metadata } from 'next';
import { LootGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Loot Generator - D&D Treasure Generator',
  description: 'Generate random treasure, gems, art objects, and magic items for D&D and other RPGs. Based on official treasure tables.',
  keywords: ['loot generator', 'd&d treasure', 'magic items', 'treasure table', 'rpg loot', 'random treasure'],
  alternates: { canonical: '/calculators/rpg/loot-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loot Generator',
  description: 'Generate random treasure for tabletop RPGs',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select tier', text: 'Choose a treasure tier based on the CR of defeated monsters.' },
  { name: 'Configure options', text: 'Toggle which types of loot to include (magic items, gems, etc.).' },
  { name: 'Generate loot', text: 'Click Generate Loot to create a random treasure hoard.' },
  { name: 'Review items', text: 'See coins, gems, art objects, and magic items with values.' },
  { name: 'Copy or regenerate', text: 'Copy the loot list or generate again for different results.' },
];

const faqs = [
  {
    question: 'How do I choose the right tier?',
    answer: 'Match the tier to the Challenge Rating of the encounter: Minor (CR 0-4), Moderate (CR 5-10), Major (CR 11-16), Legendary (CR 17+).',
  },
  {
    question: 'Are magic items guaranteed?',
    answer: 'No, magic items have a chance to appear based on tier. Higher tiers have better chances and can include rarer items.',
  },
  {
    question: 'What are the gem and art values based on?',
    answer: 'Values are based on D&D 5e treasure tables from the Dungeon Master\'s Guide, with appropriate items for each tier.',
  },
  {
    question: 'Can I use this for other RPG systems?',
    answer: 'Yes! While based on D&D 5e, the generated loot works for any fantasy RPG. Just adjust gold values to your system.',
  },
  {
    question: 'What are mundane items for?',
    answer: 'Mundane items add flavor and storytelling opportunities. They\'re worth little but can spark player creativity.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Calculate encounter difficulty.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll dice for your sessions.' },
  { href: '/calculators/rpg/tavern-generator', title: 'Tavern Generator', description: 'Generate taverns to spend that loot.' },
];

export default function LootGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="loot-generator"
          title="Loot Generator"
          description="Generate random treasure hoards with coins, gems, art objects, and magic items for your D&D and RPG encounters."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Loot Generator">
          <LootGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
