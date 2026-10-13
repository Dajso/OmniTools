import { Metadata } from 'next';
import { BitrateCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Video Bitrate Calculator - File Size & Quality Estimator',
  description: 'Calculate video bitrate and file size based on resolution, frame rate, and codec. Estimate storage needs for YouTube, streaming, and professional video.',
  keywords: ['bitrate calculator', 'video file size', 'video quality', 'codec comparison', 'streaming bitrate'],
  alternates: { canonical: '/calculators/photo/bitrate-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Video Bitrate Calculator',
  description: 'Calculate video bitrate and file size for different quality settings',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select resolution', text: 'Choose your video resolution (1080p, 4K, etc.).' },
  { name: 'Set frame rate', text: 'Select your target frame rate (24fps for cinema, 60fps for smooth motion).' },
  { name: 'Choose quality', text: 'Select a quality preset based on your use case.' },
  { name: 'Select codec', text: 'Choose your video codec (H.264 for compatibility, H.265 for smaller files).' },
];

const faqs = [
  {
    question: 'What bitrate should I use for YouTube?',
    answer: 'YouTube recommends 8-12 Mbps for 1080p at 24-30fps, and 35-68 Mbps for 4K. Higher bitrates ensure better quality after YouTube re-encodes your video.',
  },
  {
    question: 'What is the difference between H.264 and H.265?',
    answer: 'H.265 (HEVC) provides about 50% better compression than H.264, meaning smaller files at the same quality. However, H.264 has better compatibility with older devices and software.',
  },
  {
    question: 'How does frame rate affect file size?',
    answer: 'Higher frame rates require more data. 60fps video is roughly twice the size of 30fps at the same quality. Consider whether the smoother motion is worth the extra storage.',
  },
  {
    question: 'What bitrate do I need for streaming?',
    answer: 'For live streaming, use 4-6 Mbps for 1080p on Twitch, 3-6 Mbps for YouTube Live. Your upload speed should be at least 1.5x your streaming bitrate for stability.',
  },
  {
    question: 'Why is my exported file larger than calculated?',
    answer: 'Actual file sizes vary based on video content complexity. Fast action and detailed scenes require more data. The calculator provides estimates based on average content.',
  },
];

const relatedTools = [
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Aspect Ratio Calculator', description: 'Calculate video dimensions.' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Time Lapse Calculator', description: 'Plan timelapse storage needs.' },
  { href: '/calculators/photo/shutter-angle-converter', title: 'Shutter Angle Converter', description: 'Convert cinema shutter settings.' },
];

export default function BitrateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bitrate-calculator"
          title="Video Bitrate Calculator"
          description="Calculate video bitrate and file size based on resolution, frame rate, and codec. Get platform-specific recommendations for YouTube, Vimeo, and streaming."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Video Bitrate Calculator">
          <BitrateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
