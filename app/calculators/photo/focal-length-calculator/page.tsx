import { Metadata } from 'next';
import { FocalLengthCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Focal Length Calculator - Crop Factor & Equivalent FL',
  description: 'Calculate equivalent focal lengths across different sensor sizes. Convert between full-frame, APS-C, and Micro Four Thirds with crop factor calculations.',
  keywords: ['focal length calculator', 'crop factor', 'equivalent focal length', 'sensor size', 'field of view'],
  alternates: { canonical: '/calculators/photo/focal-length-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Focal Length Calculator',
  description: 'Calculate equivalent focal lengths across different camera sensor sizes',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter focal length', text: 'Input your lens focal length in millimeters.' },
  { name: 'Select your sensor', text: 'Choose your camera\'s sensor format.' },
  { name: 'Select comparison', text: 'Choose the sensor format to compare against.' },
  { name: 'View equivalents', text: 'See the equivalent focal length and field of view.' },
];

const faqs = [
  {
    question: 'What is crop factor?',
    answer: 'Crop factor is the ratio of a camera sensor\'s diagonal to a full-frame (35mm) sensor. APS-C has a 1.5× crop factor, meaning a 50mm lens gives the same field of view as a 75mm lens on full-frame.',
  },
  {
    question: 'Does crop factor affect depth of field?',
    answer: 'Indirectly, yes. To get the same field of view on a crop sensor, you use a shorter focal length, which increases depth of field. A 35mm lens on APS-C gives similar framing to 50mm on full-frame, but with more depth of field.',
  },
  {
    question: 'What is 35mm equivalent?',
    answer: 'The 35mm equivalent is the focal length that would give the same field of view on a full-frame (35mm) camera. It\'s a standard reference point for comparing lenses across different sensor sizes.',
  },
  {
    question: 'Why do different APS-C cameras have different crop factors?',
    answer: 'Canon APS-C sensors are slightly smaller (1.6× crop) than Nikon/Sony/Fuji APS-C sensors (1.5× crop). This small difference affects equivalent focal length calculations.',
  },
  {
    question: 'How does sensor size affect image quality?',
    answer: 'Larger sensors generally capture more light, providing better low-light performance and dynamic range. However, modern smaller sensors have improved significantly, and the difference is less pronounced than before.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate DoF for your lens.' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND Filter Calculator', description: 'Calculate exposure with ND filters.' },
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate image dimensions.' },
];

export default function FocalLengthCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="focal-length-calculator"
          title="Focal Length Calculator"
          description="Calculate equivalent focal lengths across different sensor sizes. Understand how crop factor affects field of view when comparing full-frame, APS-C, and Micro Four Thirds cameras."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Focal Length Calculator">
          <FocalLengthCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
