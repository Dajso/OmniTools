import { Metadata } from 'next';
import { GoldenRatioOverlay } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Golden Ratio Overlay Generator - Photography Composition Tool',
  description: 'Generate golden ratio composition overlays for photography. Create golden spiral, phi grid, and golden triangle guides for better image composition.',
  keywords: ['golden ratio', 'photography composition', 'golden spiral', 'phi grid', 'rule of thirds', 'composition guide'],
  alternates: { canonical: '/calculators/photo/golden-ratio-overlay' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Golden Ratio Overlay Generator',
  description: 'Generate composition overlays based on the golden ratio for photography',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Set dimensions', text: 'Enter your image dimensions or select an aspect ratio preset.' },
  { name: 'Choose overlay type', text: 'Select golden spiral, phi grid, triangles, or diagonal method.' },
  { name: 'Adjust orientation', text: 'Flip or rotate the overlay to match your composition.' },
  { name: 'Apply to your image', text: 'Use the overlay as a guide when composing or cropping photos.' },
];

const faqs = [
  {
    question: 'What is the golden ratio?',
    answer: 'The golden ratio (φ ≈ 1.618) is a mathematical proportion found throughout nature and art. When used in composition, it creates naturally pleasing and balanced images.',
  },
  {
    question: 'How is the golden ratio different from rule of thirds?',
    answer: 'The rule of thirds divides the frame into equal thirds (1:1:1), while the phi grid uses the golden ratio (1:0.618:1). The phi grid places intersection points slightly closer to center, often creating more dynamic compositions.',
  },
  {
    question: 'When should I use the golden spiral?',
    answer: 'Use the golden spiral when you have leading lines or curved elements in your composition. Place the spiral so it leads the viewer\'s eye toward your main subject at the smallest point of the spiral.',
  },
  {
    question: 'What are power points?',
    answer: 'Power points are the four intersection points in the phi grid where the lines cross. Placing key subjects at these points creates strong, balanced compositions that naturally draw the viewer\'s attention.',
  },
  {
    question: 'Can I use multiple overlay types together?',
    answer: 'While you can mentally combine techniques, it\'s usually best to focus on one composition method per image. Choose the overlay that best matches your subject and the natural lines in your scene.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate and convert aspect ratios.' },
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Depth of Field Calculator', description: 'Calculate DoF for your shots.' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Golden Hour Calculator', description: 'Find the best light for photography.' },
];

export default function GoldenRatioOverlayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="golden-ratio-overlay"
          title="Golden Ratio Overlay Generator"
          description="Generate composition overlays based on the golden ratio (φ = 1.618). Create golden spiral, phi grid, and golden triangle guides for naturally pleasing photography compositions."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Golden Ratio Overlay Generator">
          <GoldenRatioOverlay />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
