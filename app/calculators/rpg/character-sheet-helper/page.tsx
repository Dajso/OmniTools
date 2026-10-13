import { Metadata } from 'next';
import { CharacterSheetHelper } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Character Sheet Helper - D&D 5e Modifier Calculator',
  description: 'Calculate ability modifiers, skill bonuses, saving throws, and other D&D 5e character stats. Perfect for building and managing your RPG characters.',
  keywords: ['character sheet', 'd&d calculator', 'ability modifier', 'skill bonus', 'saving throw', 'proficiency bonus', 'dnd 5e'],
  alternates: { canonical: '/calculators/rpg/character-sheet-helper' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Character Sheet Helper',
  description: 'Calculate D&D 5e character stats and modifiers',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set level and class', text: 'Enter your character level (1-20) and select your class for hit dice and saving throw proficiencies.' },
  { name: 'Enter ability scores', text: 'Input your ability scores (1-30) or use the Standard Array button for quick setup.' },
  { name: 'View modifiers', text: 'See calculated ability modifiers, proficiency bonus, AC, and hit points automatically.' },
  { name: 'Set skill proficiencies', text: 'Click skills to cycle through: none, proficient, or expertise.' },
  { name: 'Customize saving throws', text: 'Click saving throws to toggle proficiency (class defaults are pre-selected).' },
];

const faqs = [
  {
    question: 'How are ability modifiers calculated?',
    answer: 'Ability modifiers are calculated as (Ability Score - 10) ÷ 2, rounded down. For example, a score of 14 gives a +2 modifier, while a score of 8 gives a -1 modifier.',
  },
  {
    question: 'What is the proficiency bonus?',
    answer: 'Proficiency bonus starts at +2 at level 1 and increases by 1 every 4 levels: +2 (1-4), +3 (5-8), +4 (9-12), +5 (13-16), +6 (17-20).',
  },
  {
    question: 'What is expertise?',
    answer: 'Expertise doubles your proficiency bonus for a skill. Rogues and Bards can gain expertise in certain skills. Click a proficient skill again to mark it as expertise.',
  },
  {
    question: 'How is hit point maximum calculated?',
    answer: 'At 1st level, HP = max hit die + CON modifier. Each additional level adds average hit die roll (rounded up) + CON modifier.',
  },
  {
    question: 'What is the Standard Array?',
    answer: 'The Standard Array (15, 14, 13, 12, 10, 8) is a balanced set of ability scores you can assign to your abilities instead of rolling.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/stat-roller', title: 'RPG Stat Roller', description: 'Roll ability scores using 4d6 drop lowest method.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll any dice combination for your game.' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Calculate encounter difficulty for your party.' },
];

export default function CharacterSheetHelperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="character-sheet-helper"
          title="Character Sheet Helper"
          description="Calculate ability modifiers, skill bonuses, saving throws, and other D&D 5e character stats. Perfect for building and managing your RPG characters."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Character Sheet Helper">
          <CharacterSheetHelper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
