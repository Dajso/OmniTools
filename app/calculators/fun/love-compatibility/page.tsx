import { Metadata } from 'next';
import { LoveCompatibilityCalculator } from '@/components/calculators/fun';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Love Compatibility Test - Free Name Compatibility Calculator',
  description: 'Test your love compatibility with our free calculator. Uses the classic FLAMES method and numerology to calculate relationship compatibility based on names.',
  keywords: ['love compatibility test', 'FLAMES calculator', 'name compatibility', 'relationship calculator', 'love calculator'],
  alternates: { canonical: '/calculators/fun/love-compatibility' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Love Compatibility Test',
  description: 'Calculate love compatibility based on names using FLAMES method and numerology',
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter first name', text: 'Type the first person\'s name in the first input field.' },
  { name: 'Enter second name', text: 'Type the second person\'s name in the second input field.' },
  { name: 'Calculate compatibility', text: 'Click the Calculate button to see your love compatibility results.' },
  { name: 'View results', text: 'See your compatibility percentage, FLAMES result, and personalized advice.' },
];

const faqs = [
  { 
    question: 'What is the FLAMES method?', 
    answer: 'FLAMES is a classic compatibility game that stands for Friends, Lovers, Affection, Marriage, Enemies, and Siblings. It works by removing common letters from both names and counting the remaining letters to determine the relationship type.' 
  },
  { 
    question: 'How accurate is this love compatibility test?', 
    answer: 'This is a fun entertainment tool based on the classic FLAMES game and numerology. It\'s meant for entertainment purposes only and should not be taken as relationship advice.' 
  },
  { 
    question: 'What does the numerology match mean?', 
    answer: 'The numerology match is calculated using the Pythagorean system, which assigns numerical values to letters. Names with similar or complementary numbers are considered more compatible.' 
  },
  { 
    question: 'Can I use nicknames or full names?', 
    answer: 'You can use either! The calculator works with any names. Try both your nicknames and full names to see different results.' 
  },
];

const relatedTools = [
  { href: '/calculators/fun/zodiac-sign', title: 'Zodiac Sign Calculator', description: 'Find your zodiac sign and horoscope.' },
  { href: '/calculators/fun/numerology', title: 'Numerology Calculator', description: 'Calculate your life path number.' },
  { href: '/calculators/fun/biorhythm', title: 'Biorhythm Calculator', description: 'Track your physical, emotional, and intellectual cycles.' },
];

export default function LoveCompatibilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="love-compatibility"
          title="Love Compatibility Test"
          description="Discover your love compatibility using the classic FLAMES method and numerology. Enter two names to see if you're meant to be!"
          colorClass="bg-pink-100 text-pink-600"
          category="Fun"
        />

        <section aria-label="Love Compatibility Calculator">
          <LoveCompatibilityCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">About FLAMES</h2>
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground">
              FLAMES is a popular game that has been played for generations to predict the relationship between two people. Each letter represents a different type of relationship:
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">F</span>
                <span>Friends</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">L</span>
                <span>Lovers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">A</span>
                <span>Affection</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">M</span>
                <span>Marriage</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">E</span>
                <span>Enemies</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">S</span>
                <span>Siblings</span>
              </li>
            </ul>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
