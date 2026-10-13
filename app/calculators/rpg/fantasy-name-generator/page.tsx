import { Metadata } from 'next';
import { FantasyNameGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Fantasy Name Generator - D&D & RPG Character Names',
  description: 'Generate fantasy names for elves, dwarves, humans, orcs, halflings, and dragonborn. Perfect for D&D, Pathfinder, and other tabletop RPGs.',
  keywords: ['fantasy name generator', 'elf names', 'dwarf names', 'd&d names', 'rpg character names', 'orc names', 'dragonborn names'],
  alternates: { canonical: '/calculators/rpg/fantasy-name-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fantasy Name Generator',
  description: 'Generate fantasy names for RPG characters',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select a race', text: 'Choose from elf, dwarf, human, orc, halfling, or dragonborn.' },
  { name: 'Choose gender', text: 'Select male, female, or neutral for androgynous names.' },
  { name: 'Set count', text: 'Choose how many names to generate (1-20).' },
  { name: 'Generate names', text: 'Click Generate Names to create your list.' },
  { name: 'Copy names', text: 'Click on any name to copy it, or use Copy All.' },
];

const faqs = [
  {
    question: 'How are the names generated?',
    answer: 'Names are created by combining race-specific prefixes and suffixes. Each race has its own naming conventions that reflect their cultural identity in fantasy settings.',
  },
  {
    question: 'Are these names from official D&D sources?',
    answer: 'The naming patterns are inspired by fantasy literature and RPG traditions, but the specific combinations are generated randomly. They\'re designed to feel authentic to each race.',
  },
  {
    question: 'Can I use these names commercially?',
    answer: 'Yes! The generated names are random combinations and are free to use for any purpose, including commercial projects, games, and stories.',
  },
  {
    question: 'What does "neutral" gender mean?',
    answer: 'Neutral names are designed to work for any gender. They use naming patterns that don\'t have strong masculine or feminine associations in their respective cultures.',
  },
  {
    question: 'Why do some names look similar?',
    answer: 'Names within a race share common prefixes and suffixes to maintain cultural consistency. This is intentional to make names feel like they belong to the same people.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll dice for your RPG sessions.' },
  { href: '/calculators/rpg/tavern-generator', title: 'Tavern Generator', description: 'Generate taverns with NPCs and menus.' },
  { href: '/calculators/rpg/quest-idea-generator', title: 'Quest Generator', description: 'Generate adventure hooks and quests.' },
];

export default function FantasyNameGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fantasy-name-generator"
          title="Fantasy Name Generator"
          description="Generate culturally appropriate names for elves, dwarves, humans, orcs, halflings, and dragonborn characters."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Fantasy Name Generator">
          <FantasyNameGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
