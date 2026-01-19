import { Metadata } from 'next';
import { KDRatioCalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'KD Ratio Calculator - Kill Death Ratio',
  description: 'Calculate your Kill/Death ratio and KDA for any game. See how you compare and get tips to improve your stats.',
  keywords: ['KD ratio calculator', 'kill death ratio', 'KDA calculator', 'gaming stats', 'FPS stats', 'K/D ratio'],
  alternates: { canonical: '/calculators/gaming/kd-ratio-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'KD Ratio Calculator',
  description: 'Calculate your Kill/Death ratio and KDA for gaming',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter kills', text: 'Input your total number of kills.' },
  { name: 'Enter deaths', text: 'Input your total number of deaths.' },
  { name: 'Add assists', text: 'Optionally add assists to calculate KDA.' },
  { name: 'View results', text: 'See your K/D ratio, classification, and improvement tips.' },
];

const faqs = [
  {
    question: 'What is a good K/D ratio?',
    answer: 'A K/D of 1.0 means you get one kill for every death. Above 1.0 is considered good, 1.5+ is very good, and 2.0+ is excellent. Pro players often have 2.0-4.0+ K/D ratios.',
  },
  {
    question: 'What is the difference between K/D and KDA?',
    answer: 'K/D only counts kills and deaths. KDA (Kill/Death/Assist) includes assists in the calculation: (Kills + Assists) / Deaths. KDA gives credit for team play.',
  },
  {
    question: 'Does K/D matter in team games?',
    answer: 'K/D is one metric but not the only important one. Objective play, assists, and winning games often matter more than individual K/D in team-based games.',
  },
  {
    question: 'How can I improve my K/D?',
    answer: 'Focus on positioning, game sense, and aim. Play more cautiously, learn maps, and practice in aim trainers. Dying less is often easier than getting more kills.',
  },
  {
    question: 'Why is my K/D different in different games?',
    answer: 'Each game has different mechanics, TTK (time to kill), and player skill levels. A 1.5 K/D in one game might be equivalent to 1.0 in another.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI Calculator', description: 'Calculate your effective DPI.' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/aim-trainer', title: 'Aim Trainer', description: 'Practice your aim.' },
];

export default function KDRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="kd-ratio-calculator"
          title="KD Ratio Calculator"
          description="Calculate your Kill/Death ratio and KDA. See how your stats compare and get personalized tips to improve your gaming performance."
          colorClass="bg-red-100 text-red-600"
          category="Gaming"
        />

        <section aria-label="KD Ratio Calculator">
          <KDRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
