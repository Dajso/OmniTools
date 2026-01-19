import { Metadata } from 'next';
import { ZodiacSignCalculator } from '@/components/calculators/fun/zodiac-sign-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Zodiac Sign Calculator - Find Your Astrological Sign',
  description: 'Discover your zodiac sign based on your birth date. Learn about your personality traits, strengths, weaknesses, and compatible signs.',
  keywords: ['zodiac sign calculator', 'horoscope', 'astrology', 'birth sign', 'star sign', 'zodiac compatibility'],
  alternates: { canonical: '/calculators/fun/zodiac-sign' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Zodiac Sign Calculator',
  description: 'Find your zodiac sign and learn about your astrological personality traits',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your birth date', text: 'Select your date of birth using the date picker.' },
  { name: 'Calculate your sign', text: 'Click the Calculate button to discover your zodiac sign.' },
  { name: 'Explore your traits', text: 'Learn about your personality traits, strengths, and weaknesses.' },
  { name: 'Check compatibility', text: 'See which zodiac signs are most compatible with yours.' },
];

const faqs = [
  { 
    question: 'How is my zodiac sign determined?', 
    answer: 'Your zodiac sign is determined by the position of the Sun at the time of your birth. Each sign corresponds to a specific date range in the year.' 
  },
  { 
    question: 'What are the 12 zodiac signs?', 
    answer: 'The 12 zodiac signs are: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces.' 
  },
  { 
    question: 'What are the four elements in astrology?', 
    answer: 'The four elements are Fire (Aries, Leo, Sagittarius), Earth (Taurus, Virgo, Capricorn), Air (Gemini, Libra, Aquarius), and Water (Cancer, Scorpio, Pisces). Each element represents different personality characteristics.' 
  },
  { 
    question: 'What does my ruling planet mean?', 
    answer: 'Each zodiac sign has a ruling planet that influences its characteristics. For example, Mars rules Aries (energy and action), Venus rules Taurus and Libra (love and beauty), and Mercury rules Gemini and Virgo (communication and intellect).' 
  },
  { 
    question: 'How accurate is zodiac compatibility?', 
    answer: 'Zodiac compatibility is based on traditional astrological beliefs about how different signs interact. While many find it insightful, it should be viewed as entertainment rather than a definitive guide to relationships.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/love-compatibility', title: 'Love Compatibility Test', description: 'Test your compatibility with someone special.' },
  { href: '/calculators/fun/moon-phase-calculator', title: 'Moon Phase Calculator', description: 'See the current moon phase.' },
  { href: '/calculators/fun/numerology', title: 'Numerology Calculator', description: 'Calculate your life path number.' },
];

export default function ZodiacSignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="zodiac-sign"
          title="Zodiac Sign Calculator"
          description="Discover your zodiac sign and explore your astrological personality. Learn about your element, ruling planet, and compatible signs."
          colorClass="bg-purple-100 text-purple-600"
          category="Fun"
        />

        <section aria-label="Zodiac Sign Calculator">
          <ZodiacSignCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">The 12 Zodiac Signs</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { sign: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
                { sign: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
                { sign: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
                { sign: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
                { sign: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
                { sign: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
                { sign: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
                { sign: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
                { sign: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
                { sign: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
                { sign: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
                { sign: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' },
              ].map(({ sign, symbol, dates }) => (
                <div key={sign} className="text-center p-3 bg-background rounded-lg">
                  <span className="text-2xl block mb-1">{symbol}</span>
                  <span className="font-medium text-sm block">{sign}</span>
                  <span className="text-xs text-muted-foreground">{dates}</span>
                </div>
              ))}
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
