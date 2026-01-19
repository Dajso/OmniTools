import { Metadata } from 'next';
import { RPGStatRoller } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'RPG Stat Roller - D&D Ability Score Generator',
  description: 'Generate ability scores for D&D and other RPGs. Supports 4d6 drop lowest, 3d6 straight, standard array, and point buy methods.',
  keywords: ['stat roller', 'd&d stats', 'ability scores', '4d6 drop lowest', 'point buy', 'standard array', 'character creation'],
  alternates: { canonical: '/calculators/rpg/stat-roller' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RPG Stat Roller',
  description: 'Generate ability scores for RPG characters',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose method', text: 'Select your preferred stat generation method from the dropdown.' },
  { name: 'Roll or customize', text: 'Click Roll Stats for random methods, or adjust scores for point buy.' },
  { name: 'Review results', text: 'See your ability scores with their modifiers.' },
  { name: 'Reroll if needed', text: 'Not happy? Roll again until you get stats you like.' },
  { name: 'Copy your stats', text: 'Use the Copy button to save your stats for your character sheet.' },
];

const faqs = [
  {
    question: 'What is 4d6 drop lowest?',
    answer: 'Roll four 6-sided dice, remove the lowest die, and sum the remaining three. This is the most common method in D&D 5e and typically produces above-average stats.',
  },
  {
    question: 'What is the standard array?',
    answer: 'The standard array is a fixed set of scores (15, 14, 13, 12, 10, 8) that you assign to your abilities. It ensures balanced characters and fair party composition.',
  },
  {
    question: 'How does point buy work?',
    answer: 'You have 27 points to spend on ability scores. Each score from 8-15 has a cost. Higher scores cost more points. This gives you full control over your character build.',
  },
  {
    question: 'Which method should I use?',
    answer: '4d6 drop lowest is great for heroic characters. Standard array ensures balance. Point buy is best for optimized builds. 3d6 straight is for old-school challenge.',
  },
  {
    question: 'What do the modifiers mean?',
    answer: 'Modifiers are added to d20 rolls. A score of 10-11 gives +0. Each 2 points above adds +1, each 2 below subtracts 1. So 14 gives +2, and 8 gives -1.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll any dice for your RPG sessions.' },
  { href: '/calculators/rpg/fantasy-name-generator', title: 'Name Generator', description: 'Generate fantasy names for your character.' },
  { href: '/calculators/rpg/character-sheet-helper', title: 'Character Sheet Helper', description: 'Calculate modifiers and bonuses.' },
];

export default function StatRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="stat-roller"
          title="RPG Stat Roller"
          description="Generate ability scores for your D&D or RPG character using 4d6 drop lowest, standard array, point buy, or classic 3d6."
          colorClass="bg-purple-100 text-purple-600"
          category="RPG"
        />

        <section aria-label="RPG Stat Roller">
          <RPGStatRoller />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
