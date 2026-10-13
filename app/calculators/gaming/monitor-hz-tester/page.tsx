import { Metadata } from 'next';
import { MonitorHzTester } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Monitor Hz Tester - Check Your Refresh Rate',
  description: 'Test your monitor\'s actual refresh rate. Verify if your display is running at 60Hz, 144Hz, 240Hz, or other refresh rates.',
  keywords: ['monitor Hz tester', 'refresh rate test', 'FPS test', '144Hz test', '240Hz test', 'monitor test'],
  alternates: { canonical: '/calculators/gaming/monitor-hz-tester' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Monitor Hz Tester',
  description: 'Test your monitor refresh rate and frame consistency',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Prepare', text: 'Close other browser tabs and applications for accurate results.' },
  { name: 'Start test', text: 'Click the Start Test button to begin measuring.' },
  { name: 'Wait', text: 'The test runs for 5 seconds, measuring frame times.' },
  { name: 'View results', text: 'See your estimated refresh rate and frame consistency.' },
];

const faqs = [
  {
    question: 'How does this test work?',
    answer: 'The test uses requestAnimationFrame to measure how many frames your browser can render per second. Since browsers cap FPS at your monitor\'s refresh rate, this gives us an estimate of your Hz.',
  },
  {
    question: 'Why is my result different from my monitor\'s specs?',
    answer: 'Several factors can affect results: V-Sync settings, browser limitations, background processes, or your monitor not actually running at its maximum refresh rate. Check your display settings.',
  },
  {
    question: 'What is frame consistency?',
    answer: 'Frame consistency measures how evenly spaced your frames are. 100% means perfect timing between frames. Lower values indicate stuttering or frame time variations.',
  },
  {
    question: 'Why does refresh rate matter for gaming?',
    answer: 'Higher refresh rates provide smoother motion, reduced input lag, and can give competitive advantages in fast-paced games. 144Hz is a popular choice for gaming.',
  },
  {
    question: 'How do I enable my monitor\'s full refresh rate?',
    answer: 'Check your display settings in Windows (Display Settings > Advanced Display) or macOS (System Preferences > Displays). Make sure the highest refresh rate is selected.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/mouse-sensitivity-converter', title: 'Sensitivity Converter', description: 'Convert sensitivity between games.' },
  { href: '/calculators/gaming/edpi-calculator', title: 'eDPI Calculator', description: 'Calculate your effective DPI.' },
];

export default function MonitorHzTesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="monitor-hz-tester"
          title="Monitor Refresh Rate Tester"
          description="Test your monitor's actual refresh rate. Verify if your display is running at 60Hz, 144Hz, 240Hz, or any other refresh rate."
          colorClass="bg-cyan-100 text-cyan-600"
        />

        <section aria-label="Monitor Hz Tester">
          <MonitorHzTester />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
