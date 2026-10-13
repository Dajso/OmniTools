import { Metadata } from 'next';
import { AimTrainer } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Aim Trainer - Practice Your Aim Online',
  description: 'Free browser-based aim trainer to improve your accuracy in FPS games. Practice clicking targets with adjustable difficulty levels.',
  keywords: ['aim trainer', 'aim practice', 'FPS aim', 'click trainer', 'mouse accuracy', 'gaming practice', 'target practice'],
  alternates: { canonical: '/calculators/gaming/aim-trainer' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Aim Trainer',
  description: 'Browser-based aim trainer for improving FPS game accuracy',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select difficulty', text: 'Choose from Easy, Medium, Hard, or Extreme difficulty.' },
  { name: 'Start the game', text: 'Click the Start Game button to begin.' },
  { name: 'Click targets', text: 'Click on the red targets as fast as you can.' },
  { name: 'Avoid misses', text: 'Clicking empty space counts as a miss and hurts your accuracy.' },
  { name: 'View your score', text: 'After 30 seconds, see your final score based on accuracy and speed.' },
];

const faqs = [
  {
    question: 'How is the score calculated?',
    answer: 'Your score is based on the number of hits, your accuracy percentage, and your average reaction time. Higher accuracy and faster reactions result in higher scores.',
  },
  {
    question: 'What difficulty should I start with?',
    answer: 'Start with Easy or Medium to get comfortable with the mechanics. Once you can consistently hit 80%+ accuracy, move to a harder difficulty.',
  },
  {
    question: 'Will this improve my aim in games?',
    answer: 'Yes! Regular practice with aim trainers can improve your mouse control, reaction time, and target acquisition. However, in-game practice is also important for game-specific mechanics.',
  },
  {
    question: 'How often should I practice?',
    answer: 'Short, focused sessions of 10-15 minutes daily are more effective than long occasional sessions. Consistency is key for improvement.',
  },
  {
    question: 'Why are my scores inconsistent?',
    answer: 'Factors like fatigue, focus, and even the time of day can affect performance. Warm up before gaming sessions and take breaks to maintain peak performance.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Sensitivity Converter', description: 'Convert sensitivity between games.' },
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI Calculator', description: 'Calculate your effective DPI.' },
];

export default function AimTrainerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="aim-trainer"
          title="Aim Trainer"
          description="Practice your aim with this browser-based target trainer. Click targets as fast as you can to improve your accuracy and reaction time for FPS games."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="Aim Trainer">
          <AimTrainer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
