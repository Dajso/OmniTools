import { Metadata } from 'next';
import { SunCalculator } from '@/components/calculators/travel/sun-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Sun Calculator - Sunrise, Sunset & Golden Hour Times',
  description: 'Calculate sunrise, sunset, golden hour, and blue hour times for any location. Perfect for photographers and travelers.',
  keywords: ['sunrise calculator', 'sunset calculator', 'golden hour', 'blue hour', 'sun angle', 'photography times', 'solar calculator'],
  alternates: { canonical: '/calculators/travel/sun-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sun Calculator',
  description: 'Calculate sunrise, sunset, golden hour, and blue hour times',
  applicationCategory: 'TravelApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set your location', text: 'Use your current location, select a preset city, or enter coordinates manually.' },
  { name: 'Choose a date', text: 'Select the date you want to calculate sun times for.' },
  { name: 'View sun times', text: 'See sunrise, solar noon, and sunset times for your location.' },
  { name: 'Plan photography', text: 'Check golden hour and blue hour times for optimal lighting.' },
  { name: 'Check sun angle', text: 'See the sun angle at noon for shadow planning.' },
];

const faqs = [
  { 
    question: 'What is golden hour?', 
    answer: 'Golden hour is the period shortly after sunrise and before sunset when the sun is low in the sky, producing warm, soft, golden light. It\'s ideal for photography as it creates flattering, dramatic lighting.' 
  },
  { 
    question: 'What is blue hour?', 
    answer: 'Blue hour occurs just before sunrise and after sunset when the sun is below the horizon but still illuminates the sky with a deep blue color. It\'s perfect for cityscape and landscape photography.' 
  },
  { 
    question: 'How accurate are these calculations?', 
    answer: 'The calculations are based on astronomical formulas and are accurate to within a few minutes. Actual times may vary slightly due to atmospheric conditions, elevation, and local terrain.' 
  },
  { 
    question: 'What does sun angle at noon mean?', 
    answer: 'The sun angle at noon is the maximum height the sun reaches in the sky that day. A higher angle means shorter shadows and more direct sunlight. This varies by latitude and season.' 
  },
  { 
    question: 'Why do sunrise/sunset times change throughout the year?', 
    answer: 'Earth\'s tilted axis causes the sun\'s path across the sky to change throughout the year. This results in longer days in summer and shorter days in winter for locations away from the equator.' 
  },
];

const relatedTools = [
  { href: '/calculators/travel/timezone-planner', title: 'Time Zone Planner', description: 'Plan meetings across time zones.' },
  { href: '/calculators/travel/flight-duration', title: 'Flight Duration Calculator', description: 'Estimate flight times.' },
  { href: '/calculators/productivity/timestamp-converter', title: 'Timestamp Converter', description: 'Convert timestamps and dates.' },
];

export default function SunCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sun-calculator"
          title="Sun Calculator"
          description="Calculate sunrise, sunset, golden hour, and blue hour times for any location. Perfect for photographers, travelers, and outdoor enthusiasts."
          colorClass="bg-yellow-100 text-yellow-600"
        />

        <section aria-label="Sun Calculator">
          <SunCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
