import { Metadata } from 'next';
import { DiceRoller } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dice Roller - D&D & RPG Dice Roller',
  description: 'Roll dice for D&D, Pathfinder, and other tabletop RPGs. Supports standard notation like 2d6+3, d20, 4d6 drop lowest, and more.',
  keywords: ['dice roller', 'd20', 'd&d dice', 'rpg dice', 'tabletop dice', 'virtual dice', 'dice simulator'],
  alternates: { canonical: '/calculators/rpg/dice-roller' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dice Roller',
  description: 'Roll dice for tabletop RPGs using standard notation',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose dice type', text: 'Click a quick roll button (d4, d6, d8, d10, d12, d20, d100) or enter custom notation.' },
  { name: 'Enter notation', text: 'Use standard dice notation like 2d6+3 (2 six-sided dice plus 3).' },
  { name: 'Roll the dice', text: 'Click Roll or press Enter to roll your dice.' },
  { name: 'View results', text: 'See individual dice results, modifiers, and total.' },
  { name: 'Track history', text: 'Your roll history is saved for reference during your session.' },
];

const faqs = [
  {
    question: 'What dice notation formats are supported?',
    answer: 'Standard RPG notation is supported: [number]d[faces][+/-modifier]. Examples: d20 (one d20), 2d6 (two d6), 2d6+3 (two d6 plus 3), 4d6-2 (four d6 minus 2).',
  },
  {
    question: 'What do the colored dice mean?',
    answer: 'Green dice show maximum rolls (natural max), red dice show minimum rolls (natural 1), and blue shows modifiers. Regular dice are shown in gray.',
  },
  {
    question: 'Is this roller truly random?',
    answer: 'Yes, this roller uses JavaScript\'s Math.random() which provides cryptographically sufficient randomness for gaming purposes. Each roll is independent.',
  },
  {
    question: 'Can I roll multiple different dice at once?',
    answer: 'Currently, each roll uses a single dice notation. For multiple different dice, make separate rolls. Your history tracks all rolls.',
  },
  {
    question: 'What\'s the maximum number of dice I can roll?',
    answer: 'You can roll up to 100 dice at once with faces up to 1000. This covers all standard RPG needs and more.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/stat-roller', title: 'RPG Stat Roller', description: 'Generate character ability scores using 4d6 drop lowest.' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Fantasy Name Generator', description: 'Generate names for elves, dwarves, and other races.' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Calculate encounter difficulty for your party.' },
];

export default function DiceRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dice-roller"
          title="Dice Roller"
          description="Roll dice for D&D, Pathfinder, and other tabletop RPGs. Supports all standard dice types and custom notation with modifiers."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Dice Roller">
          <DiceRoller />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
