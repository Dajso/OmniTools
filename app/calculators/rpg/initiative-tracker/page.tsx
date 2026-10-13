import { Metadata } from 'next';
import { InitiativeTracker } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Initiative Tracker - D&D Combat Order Manager',
  description: 'Track combat initiative order, HP, AC, and conditions for D&D and other tabletop RPGs. Perfect for DMs managing encounters.',
  keywords: ['initiative tracker', 'd&d combat', 'turn order', 'combat tracker', 'rpg combat', 'encounter manager'],
  alternates: { canonical: '/calculators/rpg/initiative-tracker' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Initiative Tracker',
  description: 'Track combat initiative and conditions for tabletop RPGs',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add combatants', text: 'Enter names, initiative (or auto-roll), HP, and AC for each creature.' },
  { name: 'Mark players', text: 'Check "Player Character" for PCs to distinguish them from enemies.' },
  { name: 'Start combat', text: 'Click Start Combat to begin tracking turns.' },
  { name: 'Track turns', text: 'Use Next Turn to advance. Adjust HP and add conditions as needed.' },
  { name: 'Mark defeated', text: 'Click the skull icon to mark creatures as defeated.' },
];

const faqs = [
  {
    question: 'How is initiative order determined?',
    answer: 'Combatants are sorted by initiative from highest to lowest. You can manually adjust initiative using the up/down arrows.',
  },
  {
    question: 'What happens when a combatant reaches 0 HP?',
    answer: 'They are automatically marked as defeated and will be skipped during turn order. You can revive them using the heart icon.',
  },
  {
    question: 'Can I track conditions?',
    answer: 'Yes! Use the Quick Add Conditions buttons to add conditions to the current combatant. Click on a condition to remove it.',
  },
  {
    question: 'Is my data saved?',
    answer: 'Currently, data is stored in your browser session. Refreshing the page will clear the tracker. Save important encounters manually.',
  },
  {
    question: 'Can I use this for systems other than D&D?',
    answer: 'Absolutely! The tracker works for any system that uses initiative order. Just ignore the conditions if they don\'t apply.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Calculate encounter difficulty.' },
  { href: '/calculators/rpg/dice-roller', title: 'Dice Roller', description: 'Roll dice for attacks and saves.' },
  { href: '/calculators/rpg/loot-generator', title: 'Loot Generator', description: 'Generate treasure for defeated enemies.' },
];

export default function InitiativeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="initiative-tracker"
          title="Initiative Tracker"
          description="Track combat order, HP, conditions, and more for your D&D and RPG encounters. Perfect for DMs and players alike."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Initiative Tracker">
          <InitiativeTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
