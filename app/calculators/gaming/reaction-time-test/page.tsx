import { Metadata } from 'next';
import { ReactionTimeTest } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Reaction Time Test - Test Your Reflexes',
  description: 'Test your reaction time with this visual stimulus test. Measure your reflexes, track your average, and compare with others.',
  keywords: ['reaction time test', 'reflex test', 'reaction speed', 'gaming reflexes', 'response time', 'click speed test'],
  alternates: { canonical: '/calculators/gaming/reaction-time-test' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Reaction Time Test',
  description: 'Test your reaction time and reflexes with visual stimulus',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Start the test', text: 'Click the box or press Space/Enter to begin.' },
  { name: 'Wait for green', text: 'The box will turn red. Wait for it to turn green.' },
  { name: 'Click immediately', text: 'As soon as you see green, click as fast as you can.' },
  { name: 'View your results', text: 'See your reaction time in milliseconds and how you compare.' },
  { name: 'Track your progress', text: 'Take multiple attempts to see your average and best times.' },
];

const faqs = [
  {
    question: 'What is a good reaction time?',
    answer: 'The average human reaction time to visual stimulus is around 250ms. Under 200ms is considered excellent, and under 150ms is exceptional. Pro gamers often achieve 150-180ms consistently.',
  },
  {
    question: 'Can I improve my reaction time?',
    answer: 'Yes! Regular practice can improve reaction time. Factors like sleep, caffeine, and focus also affect performance. However, there\'s a biological limit to how fast humans can react.',
  },
  {
    question: 'Why does my reaction time vary?',
    answer: 'Reaction time is affected by many factors including fatigue, alertness, anticipation, and even the time of day. Some variation is completely normal.',
  },
  {
    question: 'Is this test accurate?',
    answer: 'This test measures your reaction to a visual stimulus with millisecond precision. However, factors like display latency and input lag can add a few milliseconds to your measured time.',
  },
  {
    question: 'What\'s the difference between reaction time and reflexes?',
    answer: 'Reaction time is the conscious response to a stimulus, while reflexes are automatic responses. This test measures reaction time, which involves visual processing and motor response.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/aim-trainer', title: 'Aim Trainer', description: 'Practice your aim with click targets.' },
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Sensitivity Converter', description: 'Convert sensitivity between games.' },
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI Calculator', description: 'Calculate your effective DPI.' },
];

export default function ReactionTimeTestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="reaction-time-test"
          title="Reaction Time Test"
          description="Test your reaction speed with this visual stimulus test. Click when the screen turns green and measure your reflexes in milliseconds."
          colorClass="bg-green-100 text-green-600"
          category="Gaming"
        />

        <section aria-label="Reaction Time Test">
          <ReactionTimeTest />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
