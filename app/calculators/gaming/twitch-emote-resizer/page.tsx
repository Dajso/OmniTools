import { Metadata } from 'next';
import { TwitchEmoteResizer } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Twitch Emote Resizer - Resize for Twitch, BTTV, FFZ',
  description: 'Resize images to standard Twitch emote dimensions. Supports Twitch, BTTV, and FFZ emote sizes. Download all sizes at once.',
  keywords: ['Twitch emote resizer', 'emote maker', 'BTTV emote', 'FFZ emote', 'emote size', 'Twitch emote dimensions'],
  alternates: { canonical: '/calculators/gaming/twitch-emote-resizer' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Twitch Emote Resizer',
  description: 'Resize images to standard Twitch, BTTV, and FFZ emote dimensions',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select platform', text: 'Choose Twitch, BTTV, or FFZ depending on where you\'ll upload.' },
  { name: 'Upload image', text: 'Click to upload or drag and drop your emote image.' },
  { name: 'Preview sizes', text: 'See how your emote looks at each required size.' },
  { name: 'Download', text: 'Download individual sizes or all at once.' },
];

const faqs = [
  {
    question: 'What are the Twitch emote size requirements?',
    answer: 'Twitch requires emotes in three sizes: 28×28 (1x), 56×56 (2x), and 112×112 (3x) pixels. All must be PNG format under 1MB.',
  },
  {
    question: 'What\'s the difference between Twitch, BTTV, and FFZ?',
    answer: 'Twitch is the official platform. BTTV (BetterTTV) and FFZ (FrankerFaceZ) are browser extensions that add custom emotes. Each has slightly different size requirements.',
  },
  {
    question: 'Should I use PNG or GIF?',
    answer: 'Use PNG for static emotes with transparency. GIF is only needed for animated emotes. This tool outputs PNG format.',
  },
  {
    question: 'Why does my emote look blurry at small sizes?',
    answer: 'Small emotes (28×28) have very few pixels to work with. Use simple, bold designs with high contrast for best results at small sizes.',
  },
  {
    question: 'Can I upload animated GIFs?',
    answer: 'This tool currently processes the first frame of GIFs. For animated emotes, you\'ll need to resize each frame separately using specialized GIF tools.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/minecraft-circle-generator', title: 'Minecraft Circle Generator', description: 'Generate pixel-perfect circles.' },
  { href: '/calculators/productivity/image-resolution-calculator', title: 'Image Resolution Calculator', description: 'Calculate image dimensions.' },
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'KD Ratio Calculator', description: 'Calculate your kill/death ratio.' },
];

export default function TwitchEmoteResizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="twitch-emote-resizer"
          title="Twitch Emote Resizer"
          description="Resize your images to standard Twitch emote dimensions. Supports Twitch, BTTV, and FFZ emote sizes with instant preview and download."
          colorClass="bg-purple-100 text-purple-600"
          category="Gaming"
        />

        <section aria-label="Twitch Emote Resizer">
          <TwitchEmoteResizer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
