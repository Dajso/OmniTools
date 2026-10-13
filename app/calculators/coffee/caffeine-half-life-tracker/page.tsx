import { Metadata } from 'next';
import { CaffeineHalfLifeTracker } from '@/components/calculators/coffee/caffeine-half-life-tracker';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Caffeine Half-Life Tracker - Track Caffeine Levels for Better Sleep',
  description: 'Track your caffeine intake and see current blood levels using exponential decay. Free caffeine tracker with sleep recommendations based on 5-hour half-life.',
  keywords: ['caffeine tracker', 'caffeine half-life', 'caffeine calculator', 'sleep quality', 'caffeine metabolism', 'coffee tracker', 'caffeine levels'],
  alternates: { canonical: '/calculators/coffee/caffeine-half-life-tracker' },
  openGraph: {
    title: 'Caffeine Half-Life Tracker - Track Caffeine Levels for Better Sleep',
    description: 'Track your caffeine intake and see current blood levels using exponential decay.',
    url: '/calculators/coffee/caffeine-half-life-tracker',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caffeine Half-Life Tracker - Track Caffeine Levels for Better Sleep',
    description: 'Track your caffeine intake and see current blood levels.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Caffeine Half-Life Tracker',
  description: 'Track your caffeine intake and calculate current blood levels using exponential decay',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Add your drinks', text: 'Enter each caffeinated drink with its time of consumption and caffeine amount.' },
  { name: 'View current level', text: 'See your estimated current caffeine level based on 5-hour half-life.' },
  { name: 'Check timeline', text: 'View how your caffeine levels will decay over the next hours.' },
  { name: 'Read recommendations', text: 'Get personalized sleep recommendations based on your current level.' },
  { name: 'Plan your intake', text: 'Use the tracker to optimize coffee consumption for better sleep.' },
];

const faqs = [
  { question: 'What is caffeine half-life?', answer: 'Caffeine half-life is the time it takes for your body to eliminate half of the caffeine. The average is approximately 5 hours. After 5 hours, 50% remains; after 10 hours, 25%; after 15 hours, 12.5%.' },
  { question: 'How much caffeine is safe before sleep?', answer: 'For optimal sleep, caffeine levels should be below 50mg. Levels between 50-100mg may slightly affect sleep, while above 100mg can significantly impact sleep quality.' },
  { question: 'How does this caffeine tracker work?', answer: 'The tracker uses the exponential decay formula C(t) = C₀ × (1/2)^(t/5h) to calculate remaining caffeine from each intake, then sums them for your current level.' },
  { question: 'How much caffeine is in common drinks?', answer: 'Espresso (single): 64mg, Espresso (double): 128mg, Pour Over: 95mg, Drip Coffee: 95mg, French Press: 107mg, Cold Brew: 200mg, Energy Drink: 80mg, Green Tea: 28mg.' },
  { question: 'Does caffeine half-life vary between people?', answer: 'Yes, half-life can range from 3 to 7 hours depending on genetics, age, liver function, pregnancy, and medications. This calculator uses the average 5-hour half-life.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
  { href: '/calculators/coffee/cost-per-cup-calculator', title: 'Cost Per Cup Calculator', description: 'Calculate your coffee expenses.' },
];

export default function CaffeineHalfLifeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="caffeine-half-life-tracker"
          title="Caffeine Half-Life Tracker"
          description="Track your caffeine intake and see current blood levels for better sleep quality."
          colorClass="bg-amber-100 text-amber-700"
        />

        <section aria-label="Caffeine Half-Life Tracker">
          <CaffeineHalfLifeTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
