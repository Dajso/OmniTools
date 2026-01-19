import { Metadata } from 'next';
import { EncounterDifficultyCalculator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Encounter Difficulty Calculator - D&D 5e Encounter Builder',
  description: 'Calculate encounter difficulty for D&D 5e. Enter party levels and monster CRs to determine if your encounter is easy, medium, hard, or deadly.',
  keywords: ['encounter calculator', 'd&d encounter', 'cr calculator', 'encounter difficulty', 'dnd 5e', 'encounter builder'],
  alternates: { canonical: '/calculators/rpg/encounter-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Encounter Difficulty Calculator',
  description: 'Calculate D&D 5e encounter difficulty',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add party members', text: 'Enter the level and count for each party member group.' },
  { name: 'Add monsters', text: 'Select the CR and count for each monster type in the encounter.' },
  { name: 'View difficulty', text: 'The calculator automatically shows the encounter difficulty.' },
  { name: 'Check thresholds', text: 'Compare adjusted XP against party thresholds.' },
  { name: 'Adjust as needed', text: 'Add or remove monsters to tune the difficulty.' },
];

const faqs = [
  {
    question: 'How is encounter difficulty calculated?',
    answer: 'The calculator uses D&D 5e DMG rules: sum monster XP, apply a multiplier based on monster count, then compare against party XP thresholds for each difficulty level.',
  },
  {
    question: 'What is the XP multiplier?',
    answer: 'Multiple monsters are more dangerous than their XP suggests. The multiplier ranges from 1× (single monster) to 4× (15+ monsters), adjusted for party size.',
  },
  {
    question: 'Why is my encounter showing as deadly?',
    answer: 'Deadly encounters can kill characters. Consider reducing monster count, using lower CR creatures, or ensuring your party has resources available.',
  },
  {
    question: 'How many encounters per day?',
    answer: 'The DMG suggests 6-8 medium/hard encounters per adventuring day. Fewer deadly encounters or more easy ones can substitute.',
  },
  {
    question: 'Does this account for terrain and tactics?',
    answer: 'No, this is a baseline calculation. Advantageous terrain, surprise, or clever tactics can make encounters easier or harder than calculated.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/initiative-tracker', title: 'Initiative Tracker', description: 'Track combat order for your encounter.' },
  { href: '/calculators/rpg/loot-generator', title: 'Loot Generator', description: 'Generate treasure for defeated monsters.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll dice for combat.' },
];

export default function EncounterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="encounter-calculator"
          title="Encounter Difficulty Calculator"
          description="Calculate encounter difficulty for D&D 5e using official DMG rules. Balance your encounters for the perfect challenge."
          colorClass="bg-purple-100 text-purple-600"
          category="RPG"
        />

        <section aria-label="Encounter Difficulty Calculator">
          <EncounterDifficultyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
