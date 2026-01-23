import { Metadata } from 'next';
import { PourOverTimer } from '@/components/calculators/coffee/pour-over-timer';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pour Over Timer - 4:6 Method Coffee Brewing Timer',
  description: 'Multi-stage pour over timer with 4:6 method (Tetsu Kasuya) and custom pour schedules. Free pour over coffee timer for consistent brewing results.',
  keywords: ['pour over timer', '4:6 method', 'Tetsu Kasuya', 'coffee timer', 'pour over coffee', 'brewing timer', 'V60 timer', 'Chemex timer'],
  alternates: { canonical: '/calculators/coffee/pour-over-timer' },
  openGraph: {
    title: 'Pour Over Timer - 4:6 Method Coffee Brewing Timer',
    description: 'Multi-stage pour over timer with 4:6 method and custom pour schedules.',
    url: '/calculators/coffee/pour-over-timer',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pour Over Timer - 4:6 Method Coffee Brewing Timer',
    description: 'Multi-stage pour over timer with 4:6 method and custom pour schedules.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pour Over Timer',
  description: 'Multi-stage pour timer with 4:6 method and custom pour schedules for consistent brewing',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select brewing method', text: 'Choose 4:6 method or custom pour schedule.' },
  { name: 'Enter total water', text: 'Input your total water amount in grams.' },
  { name: 'Review pour schedule', text: 'See water amounts and timing for each pour stage.' },
  { name: 'Start the timer', text: 'Begin brewing and follow the visual and audio cues.' },
  { name: 'Pour at each stage', text: 'Pour the indicated water amount at each interval.' },
];

const faqs = [
  { question: 'What is the 4:6 method for pour over coffee?', answer: 'The 4:6 method, developed by Tetsu Kasuya, divides water into 5 pours. The first 2 pours (40%) control sweetness and acidity, the last 3 pours (60%) control strength.' },
  { question: 'How do I use a pour over timer?', answer: 'Select your method, enter total water, review the schedule, start the timer when brewing begins, and pour the specified amount at each stage following the visual indicators.' },
  { question: 'What is the timing for the 4:6 method?', answer: 'The method uses 5 pours with 45-second intervals: Pour 1 at 0:00-0:45, Pour 2 at 0:45-1:30, Pour 3 at 1:30-2:15, Pour 4 at 2:15-3:00, Pour 5 at 3:00-3:45.' },
  { question: 'Can I customize the pour schedule?', answer: 'Yes, select custom mode to specify total water and number of pours (1-10). The timer will divide water evenly across all pours.' },
  { question: 'What coffee brewing methods work with this timer?', answer: 'This timer works with any pour over method including Hario V60, Chemex, Kalita Wave, Melitta, and other manual drippers.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
  { href: '/calculators/coffee/grind-size-converter', title: 'Grind Size Converter', description: 'Convert grind settings between grinders.' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
];

export default function PourOverTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="pour-over-timer"
          title="Pour Over Timer"
          description="Multi-stage pour over timer with 4:6 method and custom pour schedules."
          colorClass="bg-amber-100 text-amber-700"
          category="Coffee"
        />

        <section aria-label="Pour Over Timer">
          <PourOverTimer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
