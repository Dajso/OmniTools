import { Metadata } from 'next';
import { NDFilterCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'ND Filter Calculator - Neutral Density Exposure Calculator',
  description: 'Calculate exposure adjustments when using ND filters. Find the correct shutter speed for long exposure photography with any ND filter strength.',
  keywords: ['ND filter calculator', 'neutral density', 'long exposure', 'shutter speed calculator', 'exposure calculator'],
  alternates: { canonical: '/calculators/photo/nd-filter-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ND Filter Calculator',
  description: 'Calculate exposure adjustments for neutral density filters',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Meter without filter', text: 'Take a light reading without the ND filter attached.' },
  { name: 'Enter base shutter speed', text: 'Input the shutter speed from your meter reading.' },
  { name: 'Select your ND filter', text: 'Choose your filter strength (stops or ND number).' },
  { name: 'Use new shutter speed', text: 'Set your camera to the calculated shutter speed.' },
];

const faqs = [
  {
    question: 'What do ND filter numbers mean?',
    answer: 'ND filters use different numbering systems. ND8 means 3 stops (filter factor 8), ND 0.9 means 3 stops (optical density 0.9). Each stop doubles the exposure time. ND1000 (10 stops) is popular for daytime long exposures.',
  },
  {
    question: 'Which ND filter should I buy first?',
    answer: 'A 6-stop (ND64) or 10-stop (ND1000) filter is most versatile. 6 stops allows 1-2 second exposures in daylight, while 10 stops enables 30+ second exposures for silky water and cloud streaks.',
  },
  {
    question: 'Can I stack ND filters?',
    answer: 'Yes, stacking filters adds their stops together. An ND8 (3 stops) plus ND64 (6 stops) equals 9 stops total. However, stacking can cause vignetting and reduce image quality.',
  },
  {
    question: 'Why are my long exposures too bright/dark?',
    answer: 'Light can change during long exposures, and some ND filters have color casts. Bracket your exposures and check your histogram. Very long exposures may need additional compensation for reciprocity failure.',
  },
  {
    question: 'What is a variable ND filter?',
    answer: 'Variable ND filters use two polarizing elements to adjust density from about 2-8 stops. They\'re convenient but can cause an "X" pattern at extreme settings and may have more color cast than fixed filters.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate DoF for your shots.' },
  { href: '/calculators/photo/shutter-angle-converter', title: 'Shutter Angle Converter', description: 'Convert cinema shutter settings.' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Golden Hour Calculator', description: 'Find the best light for photography.' },
];

export default function NDFilterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="nd-filter-calculator"
          title="ND Filter Calculator"
          description="Calculate the correct shutter speed when using neutral density filters. Perfect for long exposure photography with silky water, cloud streaks, and motion blur effects."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="ND Filter Calculator">
          <NDFilterCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
