import { Metadata } from 'next';
import { PreciseAgeCalculator } from '@/components/calculators/time';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Precise Age Calculator - Exact Age in Years, Months, Days',
  description: 'Calculate your exact age in years, months, days, hours, minutes, and seconds. Find out your zodiac sign and days until your next birthday.',
  keywords: ['age calculator', 'exact age', 'birthday calculator', 'how old am I', 'age in days', 'age in seconds'],
  alternates: { canonical: '/calculators/time/precise-age-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Precise Age Calculator',
  description: 'Calculate exact age in years, months, days, hours, minutes, and seconds',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter birth date', text: 'Select your date of birth from the date picker.' },
  { name: 'Add birth time (optional)', text: 'Enable the birth time option for more precise calculations.' },
  { name: 'View your age', text: 'See your exact age broken down into years, months, days, and more.' },
  { name: 'Explore additional info', text: 'Discover your zodiac sign and countdown to your next birthday.' },
];

const faqs = [
  {
    question: 'How accurate is this age calculator?',
    answer: 'The calculator is accurate to the second when you include your birth time. It accounts for varying month lengths and leap years. The display updates in real-time every second.',
  },
  {
    question: 'Why does my age in days seem so high?',
    answer: 'A year has 365 days (366 in leap years), so even a young person has lived thousands of days. For example, a 30-year-old has lived approximately 10,950 days!',
  },
  {
    question: 'How is the zodiac sign determined?',
    answer: 'Your zodiac sign is determined by your birth date according to Western astrology. The calculator uses the traditional date ranges for each of the 12 zodiac signs.',
  },
  {
    question: 'Does the calculator account for leap years?',
    answer: 'Yes, the calculator correctly handles leap years when calculating your age and the number of days you have lived.',
  },
  {
    question: 'Why include birth time?',
    answer: 'Including your birth time allows for precise calculation of hours, minutes, and seconds lived. Without it, the calculator assumes midnight (00:00) as your birth time.',
  },
];

const relatedTools = [
  { href: '/calculators/fun/age-in-days', title: 'Age in Days Calculator', description: 'Fun facts about your age in various units.' },
  { href: '/calculators/fun/zodiac-sign', title: 'Zodiac Sign Calculator', description: 'Find your zodiac sign and horoscope.' },
  { href: '/calculators/time/business-days-calculator', title: 'Business Days Calculator', description: 'Calculate business days between dates.' },
];

export default function PreciseAgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="precise-age-calculator"
          title="Precise Age Calculator"
          description="Calculate your exact age down to the second. Find out how many years, months, days, hours, minutes, and seconds you have lived, plus your zodiac sign and days until your next birthday."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Precise Age Calculator">
          <PreciseAgeCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Age Milestones</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Age</th>
                  <th className="text-right py-2 px-3">Days</th>
                  <th className="text-right py-2 px-3">Hours</th>
                  <th className="text-right py-2 px-3">Heartbeats*</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">1 year</td><td className="text-right py-2 px-3">365</td><td className="text-right py-2 px-3">8,760</td><td className="text-right py-2 px-3">~42 million</td></tr>
                <tr className="border-b"><td className="py-2 px-3">10 years</td><td className="text-right py-2 px-3">3,652</td><td className="text-right py-2 px-3">87,648</td><td className="text-right py-2 px-3">~420 million</td></tr>
                <tr className="border-b"><td className="py-2 px-3">18 years</td><td className="text-right py-2 px-3">6,574</td><td className="text-right py-2 px-3">157,776</td><td className="text-right py-2 px-3">~756 million</td></tr>
                <tr className="border-b"><td className="py-2 px-3">30 years</td><td className="text-right py-2 px-3">10,957</td><td className="text-right py-2 px-3">262,968</td><td className="text-right py-2 px-3">~1.26 billion</td></tr>
                <tr className="border-b"><td className="py-2 px-3">50 years</td><td className="text-right py-2 px-3">18,262</td><td className="text-right py-2 px-3">438,288</td><td className="text-right py-2 px-3">~2.1 billion</td></tr>
                <tr><td className="py-2 px-3">80 years</td><td className="text-right py-2 px-3">29,220</td><td className="text-right py-2 px-3">701,280</td><td className="text-right py-2 px-3">~3.36 billion</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">
              * Estimated at average 80 beats per minute
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Zodiac Signs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-muted/50 rounded">♈ Aries: Mar 21 - Apr 19</div>
            <div className="p-2 bg-muted/50 rounded">♉ Taurus: Apr 20 - May 20</div>
            <div className="p-2 bg-muted/50 rounded">♊ Gemini: May 21 - Jun 20</div>
            <div className="p-2 bg-muted/50 rounded">♋ Cancer: Jun 21 - Jul 22</div>
            <div className="p-2 bg-muted/50 rounded">♌ Leo: Jul 23 - Aug 22</div>
            <div className="p-2 bg-muted/50 rounded">♍ Virgo: Aug 23 - Sep 22</div>
            <div className="p-2 bg-muted/50 rounded">♎ Libra: Sep 23 - Oct 22</div>
            <div className="p-2 bg-muted/50 rounded">♏ Scorpio: Oct 23 - Nov 21</div>
            <div className="p-2 bg-muted/50 rounded">♐ Sagittarius: Nov 22 - Dec 21</div>
            <div className="p-2 bg-muted/50 rounded">♑ Capricorn: Dec 22 - Jan 19</div>
            <div className="p-2 bg-muted/50 rounded">♒ Aquarius: Jan 20 - Feb 18</div>
            <div className="p-2 bg-muted/50 rounded">♓ Pisces: Feb 19 - Mar 20</div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
