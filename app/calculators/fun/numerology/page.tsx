import { Metadata } from 'next';
import { NumerologyCalculator } from '@/components/calculators/fun/numerology-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Numerology Calculator - Find Your Life Path Number',
  description: 'Calculate your numerology numbers including Life Path, Expression, Soul Urge, and more. Discover the meaning behind your numbers.',
  keywords: ['numerology calculator', 'life path number', 'expression number', 'soul urge number', 'numerology reading', 'master numbers'],
  alternates: { canonical: '/calculators/fun/numerology' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Numerology Calculator',
  description: 'Calculate your numerology numbers and discover their meanings',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your full name', text: 'Type your full birth name as it appears on your birth certificate.' },
  { name: 'Enter your birth date', text: 'Select your date of birth using the date picker.' },
  { name: 'Calculate your numbers', text: 'Click Calculate to reveal your numerology profile.' },
  { name: 'Explore meanings', text: 'Read the interpretations for each of your core numbers.' },
];

const faqs = [
  { 
    question: 'What is numerology?', 
    answer: 'Numerology is the study of numbers and their symbolic meanings. It suggests that numbers derived from your name and birth date can reveal insights about your personality, life purpose, and destiny.' 
  },
  { 
    question: 'What is a Life Path Number?', 
    answer: 'Your Life Path Number is the most important number in numerology. It\'s calculated from your birth date and represents your life\'s purpose, the path you\'re meant to walk, and the lessons you\'ll learn.' 
  },
  { 
    question: 'What are Master Numbers?', 
    answer: 'Master Numbers are 11, 22, and 33. They are not reduced to single digits because they carry special significance. They represent higher spiritual purpose and greater potential, but also greater challenges.' 
  },
  { 
    question: 'Should I use my birth name or current name?', 
    answer: 'For the most accurate reading, use your full name as it appears on your birth certificate. This is considered your "true" name in numerology, even if you\'ve changed it since.' 
  },
  { 
    question: 'How is the Expression Number different from Life Path?', 
    answer: 'While Life Path comes from your birth date and shows your life purpose, Expression Number comes from your name and reveals your natural talents, abilities, and the way you express yourself to the world.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Zodiac Sign Calculator', description: 'Find your zodiac sign and horoscope.' },
  { href: '/calculators/fun/love-compatibility', title: 'Love Compatibility Test', description: 'Test your compatibility with someone special.' },
  { href: '/calculators/fun/biorhythm', title: 'Biorhythm Calculator', description: 'Track your physical, emotional, and intellectual cycles.' },
];

export default function NumerologyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="numerology"
          title="Numerology Calculator"
          description="Discover the hidden meaning in your numbers. Calculate your Life Path, Expression, Soul Urge, and other core numerology numbers."
          colorClass="bg-purple-100 text-purple-600"
          category="Fun"
        />

        <section aria-label="Numerology Calculator">
          <NumerologyCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">The Core Numerology Numbers</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>🛤️</span> Life Path Number
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your most important number, revealing your life purpose and the path you're meant to follow.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>✨</span> Expression Number
                </h3>
                <p className="text-sm text-muted-foreground">
                  Also called Destiny Number, it reveals your natural talents and how you express yourself.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>💖</span> Soul Urge Number
                </h3>
                <p className="text-sm text-muted-foreground">
                  Also called Heart's Desire, it reveals your inner motivations and what truly drives you.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <span>🎭</span> Personality Number
                </h3>
                <p className="text-sm text-muted-foreground">
                  Shows how others perceive you and the impression you make on the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Number Meanings</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { num: 1, trait: 'Leadership' },
              { num: 2, trait: 'Cooperation' },
              { num: 3, trait: 'Creativity' },
              { num: 4, trait: 'Stability' },
              { num: 5, trait: 'Freedom' },
              { num: 6, trait: 'Nurturing' },
              { num: 7, trait: 'Wisdom' },
              { num: 8, trait: 'Abundance' },
              { num: 9, trait: 'Compassion' },
              { num: 11, trait: 'Intuition' },
            ].map(({ num, trait }) => (
              <div key={num} className="text-center p-3 bg-muted/50 rounded-lg">
                <span className="text-2xl font-bold block">{num}</span>
                <span className="text-xs text-muted-foreground">{trait}</span>
              </div>
            ))}
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
