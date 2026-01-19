import { Metadata } from 'next';
import { QuarterInchSeamTester } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Quarter Inch Seam Tester - Printable Seam Allowance Guide',
  description: 'Test and calibrate your sewing machine seam allowance with a printable guide. Free quarter inch seam tester for quilting and sewing.',
  keywords: ['quarter inch seam', 'seam allowance tester', 'sewing guide', 'quilting seam', 'seam calibration', 'printable sewing guide'],
  alternates: { canonical: '/calculators/crafts/quarter-inch-seam-tester' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Quarter Inch Seam Tester',
  description: 'Test and calibrate sewing machine seam allowance with printable guide',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select seam allowance', text: 'Choose your desired seam allowance (1/4", 3/8", 1/2", or 5/8").' },
  { name: 'Print the guide', text: 'Click Print and ensure your printer is set to 100% scale (no scaling).' },
  { name: 'Verify calibration', text: 'Measure the 1-inch test square to confirm accurate printing.' },
  { name: 'Test your seam', text: 'Align fabric edge with the guide line and sew along the needle line.' },
  { name: 'Measure results', text: 'Check your sewn seam against the guide to verify accuracy.' },
];

const faqs = [
  {
    question: 'Why is a quarter inch seam important?',
    answer: 'A consistent 1/4" seam allowance is crucial for quilting. Even small variations can compound across multiple seams, causing blocks to be the wrong size.',
  },
  {
    question: 'How do I know if my print is accurate?',
    answer: 'Measure the 1-inch calibration square on the printed guide. It should measure exactly 1 inch on each side. If not, adjust your printer settings.',
  },
  {
    question: 'What if my seam is consistently off?',
    answer: 'Adjust your needle position, use a different presser foot, or apply tape to your machine bed as a guide. Some machines have a 1/4" quilting foot available.',
  },
  {
    question: 'What\'s the difference between scant and full 1/4" seam?',
    answer: 'A scant 1/4" seam is slightly less than 1/4" to account for fabric taken up when pressing seams. Many quilters prefer scant seams for more accurate finished blocks.',
  },
  {
    question: 'Which seam allowance should I use?',
    answer: '1/4" is standard for quilting. 5/8" is standard for garment sewing patterns. 3/8" and 1/2" are common for various craft projects.',
  },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Fabric Yardage Calculator', description: 'Calculate fabric needed for projects.' },
  { href: '/calculators/crafts/quilt-binding-calculator', title: 'Quilt Binding Calculator', description: 'Calculate binding strip length.' },
  { href: '/calculators/crafts/circle-skirt-calculator', title: 'Circle Skirt Calculator', description: 'Calculate skirt pattern dimensions.' },
];

export default function QuarterInchSeamTesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="quarter-inch-seam-tester"
          title="Quarter Inch Seam Tester"
          description="Test and calibrate your sewing machine's seam allowance with a printable guide for accurate quilting and sewing."
          colorClass="bg-pink-100 text-pink-600"
          category="Crafts"
        />

        <section aria-label="Quarter Inch Seam Tester">
          <QuarterInchSeamTester />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
