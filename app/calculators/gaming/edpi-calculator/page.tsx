import { Metadata } from 'next';
import { EDPICalculator } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'eDPI Calculator - Effective DPI for Gaming',
  description: 'Calculate your effective DPI (eDPI) for gaming. Compare your sensitivity with pro players and find the optimal settings for FPS games.',
  keywords: ['eDPI calculator', 'effective DPI', 'gaming sensitivity', 'mouse DPI', 'FPS settings', 'pro player sensitivity'],
  alternates: { canonical: '/calculators/gaming/edpi-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'eDPI Calculator',
  description: 'Calculate effective DPI for gaming and compare with pro player settings',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your DPI', text: 'Input your mouse DPI setting from your mouse software.' },
  { name: 'Enter sensitivity', text: 'Input your in-game sensitivity value.' },
  { name: 'View your eDPI', text: 'See your calculated eDPI and how it compares to pro players.' },
  { name: 'Optional: Set target', text: 'Enter a target eDPI to find the required sensitivity.' },
];

const faqs = [
  {
    question: 'What is eDPI?',
    answer: 'eDPI (effective DPI) is calculated by multiplying your mouse DPI by your in-game sensitivity. It provides a standardized way to compare sensitivity settings across different DPI configurations.',
  },
  {
    question: 'What is a good eDPI for FPS games?',
    answer: 'Most pro players use eDPI between 200-800. Lower eDPI (200-400) is common in tactical shooters like CS2 and Valorant, while higher eDPI (400-800) is more common in fast-paced games like Apex Legends.',
  },
  {
    question: 'Should I use high DPI with low sensitivity or vice versa?',
    answer: 'Both can achieve the same eDPI. Higher DPI with lower sensitivity may provide smoother cursor movement due to more data points, but the difference is minimal for most players.',
  },
  {
    question: 'Why do pro players use low eDPI?',
    answer: 'Lower eDPI allows for more precise micro-adjustments when aiming. It requires more physical mouse movement but provides better accuracy for small corrections.',
  },
  {
    question: 'Is eDPI the same across all games?',
    answer: 'No, eDPI is game-specific because each game has different internal sensitivity multipliers. Use a sensitivity converter to match your aim feel across different games.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Sensitivity Converter', description: 'Convert sensitivity between games.' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/aim-trainer', title: 'Aim Trainer', description: 'Practice your aim with click targets.' },
];

export default function EDPICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="edpi-calculator"
          title="eDPI Calculator"
          description="Calculate your effective DPI (eDPI) and compare your sensitivity settings with professional players. Find the optimal mouse settings for competitive gaming."
          colorClass="bg-purple-100 text-purple-600"
          category="Gaming"
        />

        <section aria-label="eDPI Calculator">
          <EDPICalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
