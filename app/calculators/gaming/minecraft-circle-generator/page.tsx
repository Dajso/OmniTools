import { Metadata } from 'next';
import { MinecraftCircleGenerator } from '@/components/calculators/gaming';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Minecraft Circle Generator - Pixel Perfect Circles & Spheres',
  description: 'Generate pixel-perfect circles, ovals, and spheres for Minecraft building. Visual block-by-block guide for any diameter.',
  keywords: ['Minecraft circle generator', 'Minecraft sphere', 'pixel circle', 'Minecraft building', 'block circle', 'Minecraft oval'],
  alternates: { canonical: '/calculators/gaming/minecraft-circle-generator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Minecraft Circle Generator',
  description: 'Generate pixel-perfect circles and spheres for Minecraft building',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose shape', text: 'Select Circle, Oval, or Sphere depending on what you want to build.' },
  { name: 'Set dimensions', text: 'Enter the diameter in blocks. For ovals, set width and height separately.' },
  { name: 'Toggle fill', text: 'Check "Fill shape" if you want a solid shape instead of just the outline.' },
  { name: 'View the grid', text: 'Green blocks show where to place blocks in Minecraft.' },
  { name: 'Build in-game', text: 'Follow the pattern block by block. For spheres, build each layer at the correct Y-level.' },
];

const faqs = [
  {
    question: 'How do I build a sphere in Minecraft?',
    answer: 'Use the Sphere mode and slider to see each horizontal layer. Start from the bottom layer and build upward, placing blocks according to each layer\'s pattern at increasing Y-levels.',
  },
  {
    question: 'Why don\'t circles look perfectly round?',
    answer: 'Minecraft uses blocks, so circles are approximated using pixels. Larger diameters look smoother because there are more blocks to work with. This generator uses the midpoint circle algorithm for the best possible approximation.',
  },
  {
    question: 'What\'s the maximum size I can generate?',
    answer: 'Circles and ovals can be up to 128 blocks in diameter. Spheres are limited to 64 blocks to keep the layer count manageable.',
  },
  {
    question: 'How many blocks do I need?',
    answer: 'The generator shows the exact block count. For outlines, it shows outline blocks. When filled, it shows the total blocks needed including the interior.',
  },
  {
    question: 'Can I use this for other voxel games?',
    answer: 'Yes! This generator works for any block-based game like Terraria, Starbound, or voxel art programs. The pixel patterns are universal.',
  },
];

const relatedTools = [
  { href: '/calculators/gaming/pokemon-type-calculator', title: 'Pokemon Type Calculator', description: 'Calculate type effectiveness.' },
  { href: '/calculators/gaming/reaction-time-test', title: 'Reaction Time Test', description: 'Test your reaction speed.' },
  { href: '/calculators/gaming/kd-ratio-calculator', title: 'KD Ratio Calculator', description: 'Calculate your kill/death ratio.' },
];

export default function MinecraftCircleGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="minecraft-circle-generator"
          title="Minecraft Circle Generator"
          description="Generate pixel-perfect circles, ovals, and spheres for Minecraft building. Get a visual block-by-block guide for any diameter."
          colorClass="bg-emerald-100 text-emerald-600"
        />

        <section aria-label="Minecraft Circle Generator">
          <MinecraftCircleGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
