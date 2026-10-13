import { Metadata } from 'next';
import { DayOfWeekCalculator } from '@/components/calculators/fun/day-of-week-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Day of the Week Calculator - What Day Was I Born?',
  description: 'Find out what day of the week any date falls on. Discover what day you were born and learn interesting facts about each day of the week.',
  keywords: ['day of week calculator', 'what day was I born', 'day finder', 'weekday calculator', 'birth day calculator'],
  alternates: { canonical: '/calculators/fun/day-of-week' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Day of the Week Calculator',
  description: 'Find out what day of the week any date falls on',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter a date', text: 'Select any date using the date picker - past, present, or future.' },
  { name: 'Calculate', text: 'Click Calculate to find out what day of the week it is.' },
  { name: 'Learn about the day', text: 'Discover the origin, meaning, and fun facts about that day.' },
  { name: 'Explore history', text: 'See notable historical events that happened on that day of the week.' },
];

const faqs = [
  { 
    question: 'How far back can I check dates?', 
    answer: 'You can check any date that your browser supports, typically ranging from year 0001 to 9999. The calculator uses the Gregorian calendar.' 
  },
  { 
    question: 'Why are days named after gods?', 
    answer: 'English day names come from a mix of Norse and Roman mythology. Sunday and Monday are named after the Sun and Moon, while Tuesday through Friday are named after Norse gods (Tiw, Odin, Thor, Frigg). Saturday is named after the Roman god Saturn.' 
  },
  { 
    question: 'What day of the week was I born?', 
    answer: 'Simply enter your birth date in the calculator to find out! Many people are curious about their birth day as it\'s said to influence personality in some traditions.' 
  },
  { 
    question: 'Does this account for calendar changes?', 
    answer: 'The calculator uses the Gregorian calendar throughout. For dates before the Gregorian calendar was adopted (1582 in most of Europe), results may differ from historical records that used the Julian calendar.' 
  },
  { 
    question: 'Why does the week start on different days in different countries?', 
    answer: 'Cultural and religious traditions determine the first day of the week. In many Western countries, Sunday is considered the first day, while in others (especially in Europe and ISO standards), Monday is the first day.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/age-in-days', title: 'Age in Days Calculator', description: 'Find out how many days old you are.' },
  { href: '/calculators/productivity/date-difference', title: 'Date Difference Calculator', description: 'Calculate days between dates.' },
  { href: '/calculators/fun/numerology', title: 'Numerology Calculator', description: 'Discover your life path number.' },
];

export default function DayOfWeekPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="day-of-week"
          title="Day of the Week Calculator"
          description="Curious what day of the week you were born? Or what day a future event falls on? Find out instantly with our day of the week calculator."
          colorClass="bg-cyan-100 text-cyan-600"
        />

        <section aria-label="Day of the Week Calculator">
          <DayOfWeekCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Days of the Week Origins</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium">Norse/Germanic Origins</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Tuesday:</strong> Tiw (god of war)</li>
                  <li>• <strong>Wednesday:</strong> Odin/Woden (chief god)</li>
                  <li>• <strong>Thursday:</strong> Thor (god of thunder)</li>
                  <li>• <strong>Friday:</strong> Frigg/Freya (goddess of love)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Celestial Bodies</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Sunday:</strong> The Sun</li>
                  <li>• <strong>Monday:</strong> The Moon</li>
                  <li>• <strong>Saturday:</strong> Saturn (Roman god)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Birth Day Traditions</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              The famous nursery rhyme "Monday's Child" assigns personality traits based on birth day:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Monday</span>
                <span className="text-muted-foreground">Fair of face</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Tuesday</span>
                <span className="text-muted-foreground">Full of grace</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Wednesday</span>
                <span className="text-muted-foreground">Full of woe</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Thursday</span>
                <span className="text-muted-foreground">Far to go</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Friday</span>
                <span className="text-muted-foreground">Loving & giving</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center">
                <span className="block font-medium">Saturday</span>
                <span className="text-muted-foreground">Works hard</span>
              </div>
              <div className="bg-background p-3 rounded-lg text-center col-span-2 md:col-span-1">
                <span className="block font-medium">Sunday</span>
                <span className="text-muted-foreground">Bonny & blithe</span>
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
