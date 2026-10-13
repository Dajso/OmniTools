import { Metadata } from 'next';
import { MoonPhaseCalculator } from '@/components/calculators/fun/moon-phase-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Moon Phase Calculator - Free Lunar Phase Calendar',
  description: 'Calculate the moon phase for any date with our free calculator. See visual moon display, illumination percentage, and upcoming full and new moon dates.',
  keywords: ['moon phase calculator', 'lunar calendar', 'moon cycle', 'full moon', 'new moon', 'moon illumination'],
  alternates: { canonical: '/calculators/fun/moon-phase-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Moon Phase Calculator',
  description: 'Calculate the moon phase for any date with visual display and illumination percentage',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select a date', text: 'Choose the date you want to check the moon phase for using the date picker.' },
  { name: 'View the moon phase', text: 'See the visual representation of the moon and its current phase name.' },
  { name: 'Check illumination', text: 'View the percentage of the moon that is illuminated.' },
  { name: 'See upcoming phases', text: 'Find out when the next full moon and new moon will occur.' },
];

const faqs = [
  { 
    question: 'How accurate is this moon phase calculator?', 
    answer: 'Our calculator uses astronomical algorithms based on the synodic month (29.53 days) and a known new moon reference date. It provides accurate moon phase information for any date within several centuries.' 
  },
  { 
    question: 'What is a synodic month?', 
    answer: 'A synodic month is the time it takes for the Moon to complete one full cycle of phases (from new moon to new moon), which is approximately 29.53 days.' 
  },
  { 
    question: 'What are the 8 phases of the moon?', 
    answer: 'The 8 phases are: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, and Waning Crescent.' 
  },
  { 
    question: 'Why does the moon have phases?', 
    answer: 'Moon phases occur because we see different portions of the Moon\'s illuminated surface as it orbits Earth. The Sun always illuminates half of the Moon, but we see varying amounts of that lit portion depending on the Moon\'s position.' 
  },
  { 
    question: 'How long does each moon phase last?', 
    answer: 'Each of the 8 phases lasts approximately 3.7 days. The four primary phases (New, First Quarter, Full, Last Quarter) are instantaneous moments, while the intermediate phases span the time between them.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Zodiac Sign Calculator', description: 'Find your zodiac sign and horoscope.' },
  { href: '/calculators/fun/biorhythm', title: 'Biorhythm Calculator', description: 'Track your physical, emotional, and intellectual cycles.' },
  { href: '/calculators/travel/sun-calculator', title: 'Sun Calculator', description: 'Calculate sunrise and sunset times.' },
];

export default function MoonPhaseCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="moon-phase-calculator"
          title="Moon Phase Calculator"
          description="Discover the moon phase for any date with a beautiful visual display. See illumination percentage, moon age, and upcoming lunar events."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Moon Phase Calculator">
          <MoonPhaseCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Moon Phases</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              The Moon goes through a complete cycle of phases approximately every 29.5 days. Each phase has its own characteristics and cultural significance:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌑</span>
                <span className="font-medium text-sm">New Moon</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌓</span>
                <span className="font-medium text-sm">First Quarter</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌕</span>
                <span className="font-medium text-sm">Full Moon</span>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <span className="text-3xl block mb-2">🌗</span>
                <span className="font-medium text-sm">Last Quarter</span>
              </div>
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
