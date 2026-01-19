import { Metadata } from 'next';
import { PokemonTypeCalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pokemon Type Calculator - Type Effectiveness Chart',
  description: 'Calculate Pokemon type effectiveness. Find weaknesses, resistances, and immunities for any type combination. Includes all 18 Pokemon types.',
  keywords: ['Pokemon type calculator', 'type effectiveness', 'Pokemon weakness', 'type chart', 'Pokemon battle', 'super effective'],
  alternates: { canonical: '/calculators/gaming/pokemon-type-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pokemon Type Calculator',
  description: 'Calculate Pokemon type effectiveness and weaknesses',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose mode', text: 'Select Defensive to find weaknesses or Offensive to find what you beat.' },
  { name: 'Select types', text: 'Click on 1-2 types for defensive analysis, or 1 type for offensive.' },
  { name: 'View matchups', text: 'See super effective, not very effective, and immune type matchups.' },
  { name: 'Plan your strategy', text: 'Use this information to build better teams and win battles.' },
];

const faqs = [
  {
    question: 'How does dual typing work?',
    answer: 'When a Pokemon has two types, the effectiveness multipliers are multiplied together. For example, a Water/Flying type takes 4× damage from Electric (2× to Water × 2× to Flying).',
  },
  {
    question: 'What does "immune" mean?',
    answer: 'Immune means the attack has no effect (0× damage). For example, Ground-type moves have no effect on Flying-type Pokemon.',
  },
  {
    question: 'Are these type matchups the same in all Pokemon games?',
    answer: 'The core type chart has been consistent since Generation 6 (X/Y) when Fairy type was added. Earlier games had some differences, particularly with Steel and Dark types.',
  },
  {
    question: 'What is STAB?',
    answer: 'STAB (Same Type Attack Bonus) gives a 1.5× damage boost when a Pokemon uses a move that matches one of its types. This calculator shows base type effectiveness without STAB.',
  },
  {
    question: 'How many types are there?',
    answer: 'There are 18 Pokemon types: Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, and Fairy.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/minecraft-circle-generator', title: 'Minecraft Circle Generator', description: 'Generate pixel-perfect circles.' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'KD Ratio Calculator', description: 'Calculate your kill/death ratio.' },
];

export default function PokemonTypeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pokemon-type-calculator"
          title="Pokemon Type Calculator"
          description="Calculate type effectiveness for Pokemon battles. Find weaknesses, resistances, and immunities for any single or dual type combination."
          colorClass="bg-yellow-100 text-yellow-600"
          category="Gaming"
        />

        <section aria-label="Pokemon Type Calculator">
          <PokemonTypeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
