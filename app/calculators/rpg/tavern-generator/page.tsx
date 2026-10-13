import { Metadata } from 'next';
import { TavernGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tavern Generator - Random D&D Tavern Creator',
  description: 'Generate random taverns with names, staff, menus, and rumors for your D&D or tabletop RPG campaign. Perfect for game masters.',
  keywords: ['tavern generator', 'd&d tavern', 'rpg tavern', 'random tavern', 'inn generator', 'fantasy tavern'],
  alternates: { canonical: '/calculators/rpg/tavern-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tavern Generator',
  description: 'Generate random taverns for tabletop RPGs',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select quality', text: 'Choose a quality level (squalid to aristocratic) or leave as random for variety.' },
  { name: 'Generate tavern', text: 'Click Generate Tavern to create a complete establishment.' },
  { name: 'Review details', text: 'See the tavern name, description, atmosphere, and any special features.' },
  { name: 'Meet the staff', text: 'Each tavern includes NPCs with names, roles, descriptions, and quirks.' },
  { name: 'Check the menu', text: 'View food and drink options with prices in copper, silver, or gold.' },
  { name: 'Gather rumors', text: 'Use the rumors as adventure hooks or local color for your campaign.' },
];

const faqs = [
  {
    question: 'What do the quality levels mean?',
    answer: 'Quality levels follow D&D 5e lifestyle expenses: Squalid (1 sp/day) is dangerous and minimal, Poor (2 sp/day) is basic, Modest (1 gp/day) is decent, Comfortable (2 gp/day) is good quality, Wealthy (4 gp/day) is upscale, and Aristocratic (10+ gp/day) is luxury.',
  },
  {
    question: 'How are menu prices determined?',
    answer: 'Base prices are adjusted by quality level. Squalid taverns have 50% prices, while aristocratic establishments charge double. Prices are shown in the most appropriate denomination (cp, sp, or gp).',
  },
  {
    question: 'What are NPC quirks?',
    answer: 'Quirks are memorable personality traits or habits that make NPCs more interesting and memorable. Not every NPC has a quirk - about half will have one randomly assigned.',
  },
  {
    question: 'Can I use the rumors as quest hooks?',
    answer: 'Absolutely! Rumors are designed to spark adventure ideas. They range from local gossip to hints about dungeons, monsters, and mysteries that could become full quests.',
  },
  {
    question: 'What are special features?',
    answer: 'About 30% of taverns have a special feature - something unique like a secret room, resident ghost, fighting pit, or magical amenity that makes the establishment memorable.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/quest-idea-generator', title: 'Quest Idea Generator', description: 'Generate adventure hooks and quest ideas.' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasy Name Generator', description: 'Generate names for characters and places.' },
  { href: '/calculators/rpg/loot-generator', title: 'Loot Generator', description: 'Generate treasure and loot for your adventures.' },
];

export default function TavernGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="tavern-generator"
          title="Tavern Generator"
          description="Generate random taverns with names, staff, menus, and rumors for your D&D or tabletop RPG campaign. Perfect for game masters who need quick inspiration."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Tavern Generator">
          <TavernGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
