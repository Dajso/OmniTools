import { Metadata } from 'next';
import { AspectRatioCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Aspect Ratio Calculator - Video & Image Dimensions',
  description: 'Calculate and convert aspect ratios for video and photography. Scale dimensions while maintaining proportions for any resolution.',
  keywords: ['aspect ratio calculator', 'video dimensions', '16:9 calculator', 'image ratio', 'resolution calculator'],
  alternates: { canonical: '/calculators/photo/aspect-ratio-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Aspect Ratio Calculator',
  description: 'Calculate and convert aspect ratios for video and photography',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter dimensions', text: 'Input your current width and height in pixels.' },
  { name: 'View aspect ratio', text: 'See the simplified aspect ratio and decimal value.' },
  { name: 'Scale dimensions', text: 'Enter a target width to calculate proportional height.' },
  { name: 'Use presets', text: 'Click common ratios or resolution presets for quick setup.' },
];

const faqs = [
  {
    question: 'What is aspect ratio?',
    answer: 'Aspect ratio is the proportional relationship between width and height of an image or video. Common ratios include 16:9 (widescreen), 4:3 (standard), and 1:1 (square).',
  },
  {
    question: 'What aspect ratio should I use for YouTube?',
    answer: 'YouTube recommends 16:9 aspect ratio. Standard resolutions are 1920×1080 (1080p), 2560×1440 (1440p), and 3840×2160 (4K). YouTube will add black bars to videos with different ratios.',
  },
  {
    question: 'What aspect ratio is best for Instagram?',
    answer: 'Instagram supports multiple ratios: 1:1 (square) for feed posts, 4:5 (portrait) for maximum feed visibility, 9:16 (vertical) for Stories and Reels, and 1.91:1 (landscape) for feed posts.',
  },
  {
    question: 'How do I maintain aspect ratio when resizing?',
    answer: 'To maintain aspect ratio, multiply or divide both dimensions by the same factor. This calculator automatically calculates the correct height when you specify a target width.',
  },
  {
    question: 'What is the difference between 16:9 and 1.78:1?',
    answer: 'They are the same ratio expressed differently. 16:9 is the simplified integer ratio, while 1.78:1 is the decimal equivalent (16÷9=1.78). Both represent standard HD widescreen.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/bitrate-calculator', title: 'Bitrate Calculator', description: 'Calculate video bitrate and file size.' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Time Lapse Calculator', description: 'Plan your timelapse shoots.' },
  { href: '/calculators/productivity/image-resolution-calculator', title: 'Image Resolution Calculator', description: 'Calculate image dimensions and DPI.' },
];

export default function AspectRatioCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="aspect-ratio-calculator"
          title="Aspect Ratio Calculator"
          description="Calculate and convert aspect ratios for video and photography. Scale dimensions while maintaining proportions for YouTube, Instagram, TikTok, and more."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Aspect Ratio Calculator">
          <AspectRatioCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
