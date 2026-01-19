import { Metadata } from 'next';
import { SchengenCalculator } from '@/components/calculators/travel/schengen-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Schengen Visa Calculator - 90/180 Day Rule Calculator',
  description: 'Calculate your remaining days under the Schengen 90/180 visa rule. Track your travel history and plan future trips to stay compliant.',
  keywords: ['Schengen calculator', 'visa calculator', '90/180 rule', 'Schengen visa', 'travel calculator', 'Europe visa'],
  alternates: { canonical: '/calculators/travel/schengen-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Schengen Visa Calculator',
  description: 'Calculate remaining days under the Schengen 90/180 visa rule',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set reference date', text: 'Choose the date you want to calculate from (usually today).' },
  { name: 'Add travel history', text: 'Enter your past trips to the Schengen Area with entry and exit dates.' },
  { name: 'Add planned trips', text: 'Include any upcoming trips you\'re planning.' },
  { name: 'View results', text: 'See your days used, remaining days, and mandatory exit date if applicable.' },
  { name: 'Check the timeline', text: 'Review the visual timeline showing your Schengen days over time.' },
];

const faqs = [
  { 
    question: 'What is the Schengen 90/180 rule?', 
    answer: 'The 90/180 rule allows non-EU citizens to stay in the Schengen Area for up to 90 days within any 180-day rolling period. This is a sliding window, not a calendar-based calculation.' 
  },
  { 
    question: 'Which countries are in the Schengen Area?', 
    answer: 'The Schengen Area includes 27 European countries: Austria, Belgium, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, and Switzerland.' 
  },
  { 
    question: 'How does the sliding window work?', 
    answer: 'For any given day, the calculator looks back 180 days and counts how many of those days you spent in the Schengen Area. You cannot exceed 90 days in any such 180-day window.' 
  },
  { 
    question: 'What happens if I overstay?', 
    answer: 'Overstaying can result in fines, deportation, and future entry bans to the Schengen Area. Always ensure you comply with the 90/180 rule.' 
  },
  { 
    question: 'Do I need to track each country separately?', 
    answer: 'No, the Schengen Area is treated as a single zone. Days spent in any Schengen country count toward your 90-day limit.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Time Zone Meeting Planner', description: 'Plan meetings across multiple time zones.' },
  { href: '/calculators/travel/currency-converter', title: 'Currency Converter', description: 'Convert between world currencies.' },
  { href: '/calculators/travel/flight-duration', title: 'Flight Duration Calculator', description: 'Estimate flight times between cities.' },
];

export default function SchengenCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="schengen-calculator"
          title="Schengen Visa Calculator"
          description="Calculate your remaining days under the Schengen 90/180 visa rule. Track your travel history and plan future trips to ensure you stay compliant with European visa regulations."
          colorClass="bg-blue-100 text-blue-600"
          category="Travel"
        />

        <section aria-label="Schengen Visa Calculator">
          <SchengenCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
