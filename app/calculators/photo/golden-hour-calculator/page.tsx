import { Metadata } from 'next';
import { GoldenHourCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Golden Hour Calculator - Blue Hour & Sunrise/Sunset Times',
  description: 'Calculate golden hour and blue hour times for photography. Find the perfect lighting conditions for portraits, landscapes, and cityscapes.',
  keywords: ['golden hour', 'blue hour', 'sunrise', 'sunset', 'photography lighting', 'magic hour'],
  alternates: { canonical: '/calculators/photo/golden-hour-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Golden Hour Calculator',
  description: 'Calculate golden hour and blue hour times for photography based on location',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set your location', text: 'Use your current location or select a city preset, or enter coordinates manually.' },
  { name: 'Choose a date', text: 'Select the date you want to calculate golden hour times for.' },
  { name: 'View results', text: 'See sunrise, sunset, golden hour, and blue hour times for your location.' },
  { name: 'Plan your shoot', text: 'Use the times to plan when to arrive for the best lighting conditions.' },
];

const faqs = [
  {
    question: 'What is golden hour in photography?',
    answer: 'Golden hour is the period shortly after sunrise or before sunset when the sun is low in the sky (0-6° above the horizon). The light is warm, soft, and diffused, creating flattering conditions for portraits and dramatic landscapes.',
  },
  {
    question: 'What is blue hour?',
    answer: 'Blue hour occurs when the sun is 4-6° below the horizon, just before sunrise or after sunset. The sky takes on a deep blue color while there\'s still enough ambient light to photograph. It\'s ideal for cityscapes where artificial lights balance with the blue sky.',
  },
  {
    question: 'How long does golden hour last?',
    answer: 'Golden hour typically lasts 20-60 minutes depending on your latitude and time of year. Near the equator, it\'s shorter. At higher latitudes, especially near solstices, it can last much longer.',
  },
  {
    question: 'Why is golden hour light better for photography?',
    answer: 'During golden hour, sunlight travels through more atmosphere, which scatters blue light and creates warm tones. The low angle also creates longer shadows and more dimensional lighting, reducing harsh contrasts.',
  },
  {
    question: 'What camera settings should I use during golden hour?',
    answer: 'Start with a lower ISO (100-400), use aperture priority mode, and consider warming your white balance slightly. The changing light means you\'ll need to adjust settings frequently. Shoot in RAW for maximum flexibility.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate focus range for your shots.' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND Filter Calculator', description: 'Calculate exposure with ND filters.' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Time Lapse Calculator', description: 'Plan your time lapse sequences.' },
];

export default function GoldenHourCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="golden-hour-calculator"
          title="Golden Hour Calculator"
          description="Calculate golden hour and blue hour times for any location. Plan your photography shoots to capture the perfect natural lighting conditions."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Golden Hour Calculator">
          <GoldenHourCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
