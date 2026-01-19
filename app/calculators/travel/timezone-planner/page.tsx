import { Metadata } from 'next';
import { TimezonePlanner } from '@/components/calculators/travel/timezone-planner';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Time Zone Meeting Planner - Find Best Meeting Times',
  description: 'Plan meetings across multiple time zones. Find overlapping business hours and the best time for international calls and meetings.',
  keywords: ['time zone planner', 'meeting planner', 'world clock', 'time zone converter', 'international meeting', 'business hours'],
  alternates: { canonical: '/calculators/travel/timezone-planner' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Time Zone Meeting Planner',
  description: 'Find the best meeting time across multiple time zones',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select your time zone', text: 'Choose your local time zone from the dropdown.' },
  { name: 'Add participant time zones', text: 'Add the time zones of all meeting participants.' },
  { name: 'Adjust the meeting time', text: 'Use the slider to select your preferred meeting time.' },
  { name: 'Review the results', text: 'See the meeting time in all time zones and check if everyone is within business hours.' },
  { name: 'Find overlapping hours', text: 'View the overlapping business hours when all participants are available.' },
];

const faqs = [
  { 
    question: 'What are considered business hours?', 
    answer: 'Business hours are typically defined as 9 AM to 6 PM local time. The planner highlights when meeting times fall within or outside these hours for each participant.' 
  },
  { 
    question: 'What does "overnight" mean?', 
    answer: 'Overnight indicates times before 6 AM or after 10 PM, which are generally unsuitable for meetings as participants would need to wake up very early or stay up late.' 
  },
  { 
    question: 'How do I find the best meeting time?', 
    answer: 'Look for times when all participants show green (business hours). The overlapping business hours section shows UTC times when everyone is available during normal working hours.' 
  },
  { 
    question: 'Does this account for daylight saving time?', 
    answer: 'The current version uses fixed UTC offsets. For precise scheduling, verify times close to DST transitions as offsets may change.' 
  },
  { 
    question: 'Can I add more than two time zones?', 
    answer: 'Yes! You can add as many time zones as needed. The planner will show the meeting time in all selected zones and calculate overlapping business hours.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/schengen-calculator', title: 'Schengen Visa Calculator', description: 'Calculate your Schengen visa days.' },
  { href: '/calculators/travel/flight-duration', title: 'Flight Duration Calculator', description: 'Estimate flight times between cities.' },
  { href: '/calculators/productivity/timestamp-converter', title: 'Timestamp Converter', description: 'Convert between timestamps and dates.' },
];

export default function TimezonePlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timezone-planner"
          title="Time Zone Meeting Planner"
          description="Find the perfect meeting time for participants across different time zones. See at a glance who's in business hours and find overlapping availability."
          colorClass="bg-purple-100 text-purple-600"
          category="Travel"
        />

        <section aria-label="Time Zone Meeting Planner">
          <TimezonePlanner />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
