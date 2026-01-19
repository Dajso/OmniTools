import { Metadata } from 'next';
import { PrintingSizeCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Printing Size Calculator - Photo Print DPI Calculator',
  description: 'Calculate maximum print size from image resolution or required pixels for a specific print size. Ensure sharp prints with proper DPI calculations.',
  keywords: ['print size calculator', 'DPI calculator', 'photo printing', 'image resolution', 'pixels to inches'],
  alternates: { canonical: '/calculators/photo/printing-size-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Printing Size Calculator',
  description: 'Calculate print sizes and required resolution for photo printing',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose calculation mode', text: 'Select whether to calculate from image size or desired print size.' },
  { name: 'Enter dimensions', text: 'Input your image pixels or desired print dimensions.' },
  { name: 'Select target DPI', text: 'Choose your desired print quality (300 DPI for professional).' },
  { name: 'View results', text: 'See maximum print size or required resolution.' },
];

const faqs = [
  {
    question: 'What DPI should I use for printing?',
    answer: '300 DPI is the standard for professional prints viewed up close. 240 DPI is acceptable for most home prints. For large prints viewed from a distance (posters, banners), 150 DPI or even lower can work well.',
  },
  {
    question: 'How many megapixels do I need for a large print?',
    answer: 'For a 16×20" print at 300 DPI, you need about 29 megapixels. For 8×10" at 300 DPI, you need about 7.2 megapixels. Most modern cameras (24+ MP) can produce excellent prints up to 16×20".',
  },
  {
    question: 'Can I print larger than the calculator suggests?',
    answer: 'Yes, but quality will decrease. Large prints are often viewed from farther away, so lower DPI is less noticeable. A billboard might only be 15 DPI but looks fine from across the street.',
  },
  {
    question: 'What is the difference between DPI and PPI?',
    answer: 'PPI (pixels per inch) refers to digital images, while DPI (dots per inch) refers to printed output. They\'re often used interchangeably, but technically DPI depends on your printer\'s capabilities.',
  },
  {
    question: 'Why do my prints look different from my screen?',
    answer: 'Screens emit light while prints reflect it, causing color differences. Calibrate your monitor and use soft-proofing in your editing software. Also ensure your print lab uses color profiles.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate image dimensions.' },
  { href: '/calculators/productivity/image-resolution-calculator', title: 'Image Resolution Calculator', description: 'Calculate image dimensions and DPI.' },
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate DoF for sharp images.' },
];

export default function PrintingSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="printing-size-calculator"
          title="Printing Size Calculator"
          description="Calculate maximum print size from your image resolution, or find out how many pixels you need for a specific print size. Ensure sharp, professional-quality prints every time."
          colorClass="bg-amber-100 text-amber-600"
          category="Photography"
        />

        <section aria-label="Printing Size Calculator">
          <PrintingSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
