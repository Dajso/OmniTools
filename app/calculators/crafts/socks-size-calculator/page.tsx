import { Metadata } from 'next';
import { SocksSizeCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Socks Size Calculator - Knitting Sock Dimensions',
  description: 'Calculate sock dimensions and stitch counts from foot measurements. Free sock size calculator for knitting and crocheting.',
  keywords: ['sock size calculator', 'knitting socks', 'sock dimensions', 'cast on stitches', 'sock gauge', 'crochet socks'],
  alternates: { canonical: '/calculators/crafts/socks-size-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Socks Size Calculator',
  description: 'Calculate sock dimensions and stitch counts from foot measurements',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure your foot', text: 'Measure foot length (heel to toe) and circumference around the ball of your foot.' },
  { name: 'Enter measurements', text: 'Input your foot measurements in inches or centimeters.' },
  { name: 'Add gauge information', text: 'Enter your knitting gauge (stitches and rows per inch) from a swatch.' },
  { name: 'Select yarn weight', text: 'Choose your yarn weight for accurate yardage estimates.' },
  { name: 'Get your pattern numbers', text: 'View cast-on stitches, heel stitches, and other key measurements.' },
];

const faqs = [
  {
    question: 'How do I measure my foot for socks?',
    answer: 'Measure foot length from heel to longest toe while standing. For circumference, wrap a tape measure around the widest part of your foot (ball of foot).',
  },
  {
    question: 'What is negative ease in socks?',
    answer: 'Negative ease means the sock is slightly smaller than your foot measurement. This ensures a snug fit since knit fabric stretches. Typically 10% negative ease is used.',
  },
  {
    question: 'Why is gauge important for socks?',
    answer: 'Gauge determines how many stitches you need. Even small gauge differences can result in socks that are too tight or too loose. Always knit a gauge swatch first.',
  },
  {
    question: 'What yarn weight is best for socks?',
    answer: 'Fingering weight (sock yarn) is most common for durable, comfortable socks. Sport and DK weight work for thicker, warmer socks but may not fit in all shoes.',
  },
  {
    question: 'How much yarn do I need for a pair of socks?',
    answer: 'A typical adult sock pair needs 350-450 yards of fingering weight yarn. Longer legs or larger sizes need more. The calculator provides an estimate based on your measurements.',
  },
];

const relatedTools = [
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Crochet Hat Calculator', description: 'Calculate hat dimensions from head size.' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Knitting Stitch Converter', description: 'Convert stitch counts between gauges.' },
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Yarn Substitution Helper', description: 'Find yarn substitutes by weight.' },
];

export default function SocksSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="socks-size-calculator"
          title="Socks Size Calculator"
          description="Calculate sock dimensions and stitch counts from your foot measurements for knitting or crocheting custom-fit socks."
          colorClass="bg-pink-100 text-pink-600"
          category="Crafts"
        />

        <section aria-label="Socks Size Calculator">
          <SocksSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
