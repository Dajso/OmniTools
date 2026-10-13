import { Metadata } from 'next';
import { FlightDurationCalculator } from '@/components/calculators/travel/flight-duration-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Flight Duration Calculator - Estimate Flight Times',
  description: 'Calculate estimated flight times between major world airports. Get distance in km and miles, plus flight type classification.',
  keywords: ['flight duration', 'flight time calculator', 'flight distance', 'airport distance', 'travel time', 'how long is flight'],
  alternates: { canonical: '/calculators/travel/flight-duration' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Flight Duration Calculator',
  description: 'Estimate flight times between major world airports',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select departure airport', text: 'Click on the departure field and search for your origin airport.' },
  { name: 'Select arrival airport', text: 'Click on the arrival field and search for your destination airport.' },
  { name: 'View results', text: 'See the estimated flight time, distance, and flight type classification.' },
  { name: 'Try popular routes', text: 'Use the quick buttons to check common international routes.' },
  { name: 'Swap direction', text: 'Click the arrow button to reverse your route.' },
];

const faqs = [
  { 
    question: 'How accurate are the flight time estimates?', 
    answer: 'Estimates are based on great circle distance and typical cruise speeds for each flight type. Actual times may vary by 10-20% due to weather, routing, aircraft type, and air traffic.' 
  },
  { 
    question: 'What do the flight types mean?', 
    answer: 'Short-haul flights are under 1,500 km (typically 1-3 hours). Medium-haul is 1,500-4,000 km (3-6 hours). Long-haul is 4,000-10,000 km (6-14 hours). Ultra long-haul exceeds 10,000 km (14+ hours).' 
  },
  { 
    question: 'Does this include layover time?', 
    answer: 'No, this calculator shows direct flight time only. For connecting flights, add your layover time plus the duration of each flight segment.' 
  },
  { 
    question: 'Why might my actual flight be longer?', 
    answer: 'Actual flights may be longer due to headwinds, air traffic control routing, weather diversions, or using slower aircraft. Eastbound transatlantic flights are often faster than westbound due to jet streams.' 
  },
  { 
    question: 'Which airports are included?', 
    answer: 'We include 50+ major international airports across all continents. Search by city name, airport code, or country to find your airports.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Time Zone Planner', description: 'Plan meetings across time zones.' },
  { href: '/calculators/travel/packing-list', title: 'Packing List Generator', description: 'Generate a packing list for your trip.' },
];

export default function FlightDurationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="flight-duration-calculator"
          title="Flight Duration Calculator"
          description="Estimate flight times between major world airports. Get distance calculations and flight type classifications for your travel planning."
          colorClass="bg-sky-100 text-sky-600"
        />

        <section aria-label="Flight Duration Calculator">
          <FlightDurationCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
