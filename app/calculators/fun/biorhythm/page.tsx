import { Metadata } from 'next';
import { BiorhythmCalculator } from '@/components/calculators/fun/biorhythm-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Biorhythm Calculator - Track Your Physical, Emotional & Intellectual Cycles',
  description: 'Calculate your biorhythm cycles based on your birth date. Track physical, emotional, and intellectual patterns with interactive charts.',
  keywords: ['biorhythm calculator', 'biorhythm chart', 'physical cycle', 'emotional cycle', 'intellectual cycle', 'life cycles'],
  alternates: { canonical: '/calculators/fun/biorhythm' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Biorhythm Calculator',
  description: 'Track your physical, emotional, and intellectual cycles with interactive biorhythm charts',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your birth date', text: 'Select your date of birth using the date picker.' },
  { name: 'Choose a view date', text: 'Select the date you want to view your biorhythm for (defaults to today).' },
  { name: 'Calculate biorhythm', text: 'Click Calculate to see your current biorhythm values.' },
  { name: 'Analyze the chart', text: 'View the 30-day chart to see your cycle patterns over time.' },
];

const faqs = [
  { 
    question: 'What is biorhythm?', 
    answer: 'Biorhythm is a theory that suggests our lives are affected by rhythmic biological cycles. The three primary cycles are Physical (23 days), Emotional (28 days), and Intellectual (33 days).' 
  },
  { 
    question: 'How are biorhythm cycles calculated?', 
    answer: 'Biorhythm values are calculated using sine waves based on the number of days since your birth. Each cycle has a different period: Physical (23 days), Emotional (28 days), and Intellectual (33 days).' 
  },
  { 
    question: 'What do the values mean?', 
    answer: 'Values range from -100 to +100. Positive values indicate high periods (peak performance), negative values indicate low periods (rest and recovery), and values near zero are critical days (transition periods).' 
  },
  { 
    question: 'What are critical days?', 
    answer: 'Critical days occur when a cycle crosses zero (transitions from positive to negative or vice versa). These are considered unstable periods where you may want to be more cautious.' 
  },
  { 
    question: 'Is biorhythm scientifically proven?', 
    answer: 'Biorhythm theory is not supported by scientific evidence. It should be viewed as entertainment and self-reflection tool rather than a scientifically validated method for predicting performance or behavior.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Zodiac Sign Calculator', description: 'Find your zodiac sign and horoscope.' },
  { href: '/calculators/fun/moon-phase-calculator', title: 'Moon Phase Calculator', description: 'See the current moon phase.' },
  { href: '/calculators/health/sleep-cycle-calculator', title: 'Sleep Cycle Calculator', description: 'Optimize your sleep schedule.' },
];

export default function BiorhythmPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="biorhythm"
          title="Biorhythm Calculator"
          description="Track your physical, emotional, and intellectual cycles with our interactive biorhythm calculator. Visualize your patterns over time."
          colorClass="bg-gradient-to-r from-red-100 via-green-100 to-blue-100 text-gray-700"
          category="Fun"
        />

        <section aria-label="Biorhythm Calculator">
          <BiorhythmCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">The Three Biorhythm Cycles</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💪</span>
                <h3 className="font-semibold text-red-700">Physical Cycle</h3>
              </div>
              <p className="text-sm text-red-600 mb-2">23-day cycle</p>
              <p className="text-sm text-muted-foreground">
                Affects physical strength, endurance, coordination, and overall energy levels. High periods are ideal for physical activities.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💚</span>
                <h3 className="font-semibold text-green-700">Emotional Cycle</h3>
              </div>
              <p className="text-sm text-green-600 mb-2">28-day cycle</p>
              <p className="text-sm text-muted-foreground">
                Influences mood, creativity, sensitivity, and emotional stability. High periods favor social interactions and creative work.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <h3 className="font-semibold text-blue-700">Intellectual Cycle</h3>
              </div>
              <p className="text-sm text-blue-600 mb-2">33-day cycle</p>
              <p className="text-sm text-muted-foreground">
                Affects mental alertness, memory, analytical thinking, and learning ability. High periods are best for complex mental tasks.
              </p>
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
