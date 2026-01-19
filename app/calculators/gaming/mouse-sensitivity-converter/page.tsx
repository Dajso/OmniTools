import { Metadata } from 'next';
import { MouseSensitivityConverter } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Mouse Sensitivity Converter - Convert Between Games',
  description: 'Convert your mouse sensitivity between Valorant, CS2, Apex Legends, Overwatch 2, and more. Preserves your cm/360 for consistent aim across games.',
  keywords: ['mouse sensitivity converter', 'gaming sensitivity', 'cm/360', 'Valorant sensitivity', 'CS2 sensitivity', 'Apex sensitivity', 'FPS games'],
  alternates: { canonical: '/calculators/gaming/mouse-sensitivity-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mouse Sensitivity Converter',
  description: 'Convert mouse sensitivity between different FPS games while preserving cm/360',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your DPI', text: 'Input your mouse DPI setting. Common values are 400, 800, or 1600.' },
  { name: 'Select source game', text: 'Choose the game you\'re converting from.' },
  { name: 'Enter current sensitivity', text: 'Input your in-game sensitivity for the source game.' },
  { name: 'Select target game', text: 'Choose the game you want to convert to.' },
  { name: 'Get converted sensitivity', text: 'See your equivalent sensitivity for the target game.' },
];

const faqs = [
  {
    question: 'What is cm/360?',
    answer: 'cm/360 is the distance in centimeters you need to move your mouse to complete a full 360-degree turn in-game. It\'s a universal metric for comparing sensitivity across different games.',
  },
  {
    question: 'Why do sensitivities differ between games?',
    answer: 'Each game uses different internal multipliers for mouse input. A sensitivity of 1.0 in Valorant feels very different from 1.0 in CS2 because of these game-specific multipliers.',
  },
  {
    question: 'What DPI should I use?',
    answer: 'Most pro players use 400-800 DPI. Higher DPI can provide smoother cursor movement but the actual in-game sensitivity depends on both DPI and in-game sensitivity combined.',
  },
  {
    question: 'Will my aim feel exactly the same after converting?',
    answer: 'The physical mouse movement will be identical, but games may have different mouse acceleration, smoothing, or FOV settings that can affect how it feels. The cm/360 will be preserved.',
  },
  {
    question: 'What is eDPI?',
    answer: 'eDPI (effective DPI) is DPI multiplied by in-game sensitivity. It\'s useful for comparing sensitivities within the same game but doesn\'t account for game-specific multipliers.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI Calculator', description: 'Calculate your effective DPI.' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'KD Ratio Calculator', description: 'Calculate your kill/death ratio.' },
];

export default function MouseSensitivityConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="mouse-sensitivity-converter"
          title="Mouse Sensitivity Converter"
          description="Convert your mouse sensitivity between different FPS games while preserving your cm/360. Supports Valorant, CS2, Apex Legends, Overwatch 2, Fortnite, and more."
          colorClass="bg-purple-100 text-purple-600"
          category="Gaming"
        />

        <section aria-label="Mouse Sensitivity Converter">
          <MouseSensitivityConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
