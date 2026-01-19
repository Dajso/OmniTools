import { Metadata } from 'next';
import { DepthOfFieldCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Depth of Field Calculator - Photography DoF Calculator',
  description: 'Calculate depth of field for photography. Find near focus, far focus, and hyperfocal distance based on focal length, aperture, and sensor size.',
  keywords: ['depth of field calculator', 'DoF calculator', 'photography calculator', 'hyperfocal distance', 'aperture', 'bokeh'],
  alternates: { canonical: '/calculators/photo/depth-of-field-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Depth of Field Calculator',
  description: 'Calculate depth of field for photography based on camera settings',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter focal length', text: 'Input your lens focal length in millimeters.' },
  { name: 'Select aperture', text: 'Choose your aperture f-stop value.' },
  { name: 'Enter subject distance', text: 'Input the distance to your subject in meters.' },
  { name: 'Select sensor size', text: 'Choose your camera sensor size for accurate calculations.' },
];

const faqs = [
  {
    question: 'What is depth of field?',
    answer: 'Depth of field (DoF) is the distance between the nearest and farthest objects in a photo that appear acceptably sharp. A shallow DoF creates background blur (bokeh), while a deep DoF keeps more of the scene in focus.',
  },
  {
    question: 'How does aperture affect depth of field?',
    answer: 'A wider aperture (smaller f-number like f/1.8) creates a shallower depth of field with more background blur. A narrower aperture (larger f-number like f/16) creates a deeper depth of field with more of the scene in focus.',
  },
  {
    question: 'What is hyperfocal distance?',
    answer: 'Hyperfocal distance is the closest distance at which a lens can be focused while keeping objects at infinity acceptably sharp. When focused at the hyperfocal distance, everything from half that distance to infinity will be in focus.',
  },
  {
    question: 'How does sensor size affect depth of field?',
    answer: 'Larger sensors (like full-frame) produce shallower depth of field at the same field of view compared to smaller sensors (like APS-C or Micro Four Thirds). This is because larger sensors require longer focal lengths for the same framing.',
  },
  {
    question: 'What is circle of confusion?',
    answer: 'Circle of confusion (CoC) is the largest blur spot that will still appear as a point to the human eye. It varies by sensor size and determines what is considered "acceptably sharp" in depth of field calculations.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/focal-length-calculator', title: 'Focal Length Calculator', description: 'Calculate equivalent focal lengths across sensor sizes.' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND Filter Calculator', description: 'Calculate exposure with ND filters.' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Time Lapse Calculator', description: 'Plan your timelapse shoots.' },
];

export default function DepthOfFieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="depth-of-field-calculator"
          title="Depth of Field Calculator"
          description="Calculate depth of field for your photography. Find near focus, far focus, hyperfocal distance, and understand how aperture, focal length, and sensor size affect your images."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Depth of Field Calculator">
          <DepthOfFieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
