import { Metadata } from 'next';
import { AgeInDaysCalculator } from '@/components/calculators/fun/age-in-days-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Age in Days Calculator - How Many Days Old Are You?',
  description: 'Calculate your exact age in days, hours, minutes, and seconds. Find out how many days you have been alive with our free calculator.',
  keywords: ['age in days', 'days old calculator', 'age calculator', 'how many days old', 'seconds old', 'birthday countdown'],
  alternates: { canonical: '/calculators/fun/age-in-days' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Age in Days Calculator',
  description: 'Calculate your exact age in days, hours, minutes, and seconds',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter your birth date', text: 'Select your date of birth using the date picker.' },
  { name: 'Add birth time (optional)', text: 'For more precise results, enter your exact birth time.' },
  { name: 'Calculate your age', text: 'Click Calculate to see your age in various units.' },
  { name: 'Watch it update', text: 'The seconds counter updates in real-time!' },
];

const faqs = [
  { 
    question: 'How accurate is this calculator?', 
    answer: 'The calculator is accurate to the second when you provide your birth time. Without birth time, it calculates from midnight on your birth date.' 
  },
  { 
    question: 'How are heartbeats calculated?', 
    answer: 'Heartbeats are estimated using an average resting heart rate of 72 beats per minute. Your actual number may vary based on your activity level and health.' 
  },
  { 
    question: 'Does this account for leap years?', 
    answer: 'Yes! The calculator uses JavaScript\'s Date object which automatically accounts for leap years and varying month lengths.' 
  },
  { 
    question: 'Why does the seconds counter keep changing?', 
    answer: 'The calculator updates in real-time to show your exact age at this very moment. Every second you\'re getting older!' 
  },
  { 
    question: 'Can I calculate someone else\'s age?', 
    answer: 'Absolutely! Just enter their birth date and time to see how many days they\'ve been alive.' 
  },
];

const relatedTools = [
  { href: '/calculators/productivity/age-calculator', title: 'Age Calculator', description: 'Calculate exact age between dates.' },
  { href: '/calculators/productivity/date-difference', title: 'Date Difference Calculator', description: 'Find days between two dates.' },
  { href: '/calculators/fun/biorhythm', title: 'Biorhythm Calculator', description: 'Track your life cycles.' },
];

export default function AgeInDaysPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="age-in-days"
          title="Age in Days Calculator"
          description="Ever wondered exactly how many days you've been alive? Find out your age in days, hours, minutes, and even seconds!"
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Age in Days Calculator">
          <AgeInDaysCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Fun Age Milestones</h2>
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { days: '1,000', age: '~2.7 years' },
                { days: '5,000', age: '~13.7 years' },
                { days: '10,000', age: '~27.4 years' },
                { days: '15,000', age: '~41.1 years' },
                { days: '20,000', age: '~54.8 years' },
                { days: '25,000', age: '~68.5 years' },
              ].map(({ days, age }) => (
                <div key={days} className="text-center p-3 bg-background rounded-lg">
                  <span className="text-xl font-bold block">{days}</span>
                  <span className="text-sm text-muted-foreground">days = {age}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              🎉 Celebrate your day milestones! They're just as special as birthdays.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Did You Know?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">💓 Your Heart</h3>
              <p className="text-sm text-blue-600">
                The average heart beats about 100,000 times per day, or about 35 million times per year!
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="font-medium text-green-700 mb-2">🌬️ Your Breath</h3>
              <p className="text-sm text-green-600">
                You take about 20,000 breaths per day, moving about 2,000 gallons of air!
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
