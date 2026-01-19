import { Metadata } from 'next';
import { TimeLapseCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Time Lapse Calculator - Timelapse Interval & Storage Calculator',
  description: 'Calculate timelapse settings including shooting interval, total frames, and storage requirements. Plan your timelapse photography with precision.',
  keywords: ['timelapse calculator', 'time lapse interval', 'timelapse photography', 'interval timer', 'frames calculator'],
  alternates: { canonical: '/calculators/photo/timelapse-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Time Lapse Calculator',
  description: 'Calculate timelapse settings for photography',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter event duration', text: 'Input how long the event you want to capture will last.' },
  { name: 'Set output duration', text: 'Choose how long you want your final video to be.' },
  { name: 'Select frame rate', text: 'Choose the frame rate for your output video (24fps is standard).' },
  { name: 'Choose image quality', text: 'Select your image format to estimate storage needs.' },
];

const faqs = [
  {
    question: 'What interval should I use for timelapse?',
    answer: 'The interval depends on your subject. Fast-moving clouds: 1-5 seconds. Sunsets: 2-5 seconds. Stars: 20-30 seconds. Construction: 5-10 minutes. Flowers blooming: 5-15 minutes.',
  },
  {
    question: 'How many frames do I need for a smooth timelapse?',
    answer: 'For smooth playback, aim for at least 24 frames per second of final video. A 30-second video at 24fps needs 720 frames. More frames allow for longer videos or higher frame rates.',
  },
  {
    question: 'What frame rate should I use?',
    answer: '24fps gives a cinematic look, 30fps is standard for web video, and 60fps provides ultra-smooth playback. Higher frame rates require more frames but look smoother.',
  },
  {
    question: 'How do I calculate storage needs?',
    answer: 'Multiply total frames by your image file size. RAW files are 20-60MB each, while JPEGs are 2-12MB. Always bring extra memory cards and add a 10-20% buffer.',
  },
  {
    question: 'How many batteries do I need?',
    answer: 'Most cameras get 300-500 shots per battery. Divide your total frames by shots per battery and add one extra. Cold weather reduces battery life significantly.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate DoF for your shots.' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND Filter Calculator', description: 'Calculate exposure with ND filters.' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Golden Hour Calculator', description: 'Find the best light for your shoot.' },
];

export default function TimeLapseCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timelapse-calculator"
          title="Time Lapse Calculator"
          description="Plan your timelapse photography with precision. Calculate shooting intervals, total frames needed, storage requirements, and equipment estimates."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Time Lapse Calculator">
          <TimeLapseCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
