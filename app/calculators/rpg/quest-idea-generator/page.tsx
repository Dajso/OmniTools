import { Metadata } from 'next';
import { QuestIdeaGenerator } from '@/components/calculators/rpg';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Quest Idea Generator - Random D&D Adventure Hooks',
  description: 'Generate random quest ideas and adventure hooks for your D&D or tabletop RPG campaign. Includes objectives, NPCs, complications, and rewards.',
  keywords: ['quest generator', 'd&d quest', 'adventure hook', 'rpg quest ideas', 'campaign ideas', 'dungeon master tools'],
  alternates: { canonical: '/calculators/rpg/quest-idea-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Quest Idea Generator',
  description: 'Generate random quest ideas for tabletop RPGs',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose quest type', text: 'Select a specific quest type (fetch, rescue, eliminate, etc.) or leave as random.' },
  { name: 'Set difficulty', text: 'Choose easy, medium, hard, or deadly to match your party level.' },
  { name: 'Generate quest', text: 'Click Generate Quest to create a complete adventure hook.' },
  { name: 'Review details', text: 'See the quest giver, objective, location, and complications.' },
  { name: 'Check rewards', text: 'View gold, items, and reputation rewards appropriate to difficulty.' },
  { name: 'Reveal twist', text: 'Optionally reveal the secret twist for added drama (GM eyes only!).' },
];

const faqs = [
  {
    question: 'How do difficulty levels affect rewards?',
    answer: 'Easy quests reward 50-200 gp, Medium 200-500 gp, Hard 500-2000 gp with magic items, and Deadly 2000-10000 gp with multiple magic items. Higher difficulties also have more complications.',
  },
  {
    question: 'What are complications?',
    answer: 'Complications are unexpected challenges that make quests more interesting. They range from minor (bad weather) to critical (betrayal). Higher difficulty quests have more and worse complications.',
  },
  {
    question: 'What is the secret twist?',
    answer: 'About 30% of quests have a secret twist - a hidden element that changes the nature of the quest. These are meant for GM eyes only and can dramatically alter the story.',
  },
  {
    question: 'How should I use quest hooks?',
    answer: 'Quest hooks are the initial story that draws players in. Use them as-is or adapt them to your campaign. The hook should intrigue players and give them a reason to accept the quest.',
  },
  {
    question: 'Can I customize the generated quests?',
    answer: 'Absolutely! These quests are starting points. Feel free to change names, locations, rewards, or any other details to fit your campaign world and player preferences.',
  },
];

const relatedTools = [
  { href: '/calculators/rpg/tavern-generator', title: 'Tavern Generator', description: 'Generate taverns where quests might begin.' },
  { href: '/calculators/rpg/encounter-calculator', title: 'Encounter Calculator', description: 'Balance combat encounters for your quest.' },
  { href: '/calculators/rpg/loot-generator', title: 'Loot Generator', description: 'Generate treasure rewards for completed quests.' },
];

export default function QuestIdeaGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="quest-idea-generator"
          title="Quest Idea Generator"
          description="Generate random quest ideas and adventure hooks for your D&D or tabletop RPG campaign. Includes objectives, NPCs, complications, and rewards."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Quest Idea Generator">
          <QuestIdeaGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
