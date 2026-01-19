import { Metadata } from 'next';
import { ShutterAngleConverter } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Shutter Angle Converter - Cinema Shutter Speed Calculator',
  description: 'Convert between shutter angle (cinema) and shutter speed (photography). Understand the 180-degree rule and achieve cinematic motion blur.',
  keywords: ['shutter angle', '180 degree rule', 'cinema shutter', 'motion blur', 'frame rate calculator'],
  alternates: { canonical: '/calculators/photo/shutter-angle-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Shutter Angle Converter',
  description: 'Convert between cinema shutter angle and photography shutter speed',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose conversion mode', text: 'Select whether to convert from angle to speed or vice versa.' },
  { name: 'Enter your value', text: 'Input shutter angle (degrees) or shutter speed (seconds).' },
  { name: 'Select frame rate', text: 'Choose your video frame rate (24fps is cinema standard).' },
  { name: 'View results', text: 'See the converted value and motion blur description.' },
];

const faqs = [
  {
    question: 'What is the 180-degree rule?',
    answer: 'The 180-degree rule states that shutter speed should be approximately double the frame rate for natural motion blur. At 24fps, use 1/48 second (180° shutter angle). This creates the motion blur we associate with cinema.',
  },
  {
    question: 'Why do cinema cameras use shutter angle instead of shutter speed?',
    answer: 'Shutter angle originated from film cameras with rotating disc shutters. It describes what fraction of the frame time the sensor is exposed. 180° means exposed for half the frame time, regardless of frame rate.',
  },
  {
    question: 'When should I break the 180-degree rule?',
    answer: 'Use lower angles (90°, 45°) for sharper action with less motion blur, like in "Saving Private Ryan." Use higher angles (270°, 360°) for dreamier, smoother footage. Breaking the rule is a creative choice.',
  },
  {
    question: 'How does frame rate affect shutter angle?',
    answer: 'The same shutter angle produces different shutter speeds at different frame rates. 180° at 24fps = 1/48s, but 180° at 60fps = 1/120s. The motion blur look remains consistent relative to the frame rate.',
  },
  {
    question: 'What shutter angle do most digital cameras use?',
    answer: 'Many digital cinema cameras default to 172.8° or 180°. Consumer cameras often use 1/50 or 1/60 second, which is close to 180° at 25fps or 30fps respectively.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/bitrate-calculator', title: 'Bitrate Calculator', description: 'Calculate video bitrate and file size.' },
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate video dimensions.' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND Filter Calculator', description: 'Calculate exposure with ND filters.' },
];

export default function ShutterAngleConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="shutter-angle-converter"
          title="Shutter Angle Converter"
          description="Convert between cinema shutter angle and photography shutter speed. Understand the 180-degree rule and achieve the perfect cinematic motion blur for your videos."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Shutter Angle Converter">
          <ShutterAngleConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
