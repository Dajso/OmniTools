import { Metadata } from 'next';
import { EmbroideryFlossCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Embroidery Floss Calculator - Thread Estimator',
  description: 'Calculate how much embroidery floss you need for cross stitch and embroidery projects. Estimate thread requirements by stitch count and fabric type.',
  keywords: ['embroidery floss calculator', 'cross stitch thread', 'DMC floss', 'thread estimator', 'embroidery calculator'],
  alternates: { canonical: '/calculators/crafts/embroidery-floss-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Embroidery Floss Calculator',
  description: 'Calculate embroidery floss requirements for cross stitch and embroidery projects',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Count stitches', text: 'Count or estimate the number of stitches for each color in your pattern.' },
  { name: 'Select fabric', text: 'Choose your fabric count (e.g., 14 count Aida, 28 count linen).' },
  { name: 'Choose stitch type', text: 'Select the type of stitch you\'ll be using (cross stitch, backstitch, etc.).' },
  { name: 'Set strands', text: 'Enter how many strands of floss you\'ll use (typically 2 for cross stitch).' },
  { name: 'Get results', text: 'See how many skeins you need and total thread length required.' },
];

const faqs = [
  { question: 'How do I count stitches in a pattern?', answer: 'Most patterns list stitch counts per color. For charts, count the symbols or use pattern software that calculates automatically.' },
  { question: 'Why does fabric count matter?', answer: 'Higher count fabric has smaller squares, so each stitch uses less thread. A 14-count stitch uses more thread than an 18-count stitch.' },
  { question: 'How many strands should I use?', answer: 'For 14-count Aida, 2 strands is standard. For higher counts (18+), use 1-2 strands. For lower counts (11), use 3 strands.' },
  { question: 'What is "over two" stitching?', answer: 'On evenweave and linen fabrics, you can stitch over 2 threads instead of 1, making larger stitches that use more thread.' },
  { question: 'Should I buy extra skeins?', answer: 'Yes! Buy 1 extra skein per color for large projects to ensure dye lot consistency and have backup for mistakes.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Fabric Yardage Calculator', description: 'Calculate fabric needs.' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Stitch Converter', description: 'Convert between gauges.' },
];

const threadUsageGuide = [
  { fabric: '11 count Aida', strands: '3', coverage: 'Full coverage' },
  { fabric: '14 count Aida', strands: '2', coverage: 'Full coverage' },
  { fabric: '16 count Aida', strands: '2', coverage: 'Good coverage' },
  { fabric: '18 count Aida', strands: '1-2', coverage: 'Light to full' },
  { fabric: '25 count over 2', strands: '2', coverage: 'Full coverage' },
  { fabric: '28 count over 2', strands: '2', coverage: 'Full coverage' },
  { fabric: '32 count over 2', strands: '1-2', coverage: 'Light to full' },
];

export default function EmbroideryFlossCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="embroidery-floss-calculator"
          title="Embroidery Floss Calculator"
          description="Calculate how much embroidery floss you need for your cross stitch or embroidery project based on stitch count and fabric type."
          colorClass="bg-pink-100 text-pink-600"
        />

        <section aria-label="Embroidery Floss Calculator">
          <EmbroideryFlossCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Thread Usage Guide</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Fabric</th>
                      <th className="text-center py-3 px-4 font-medium">Strands</th>
                      <th className="text-left py-3 px-4 font-medium">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threadUsageGuide.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4">{item.fabric}</td>
                        <td className="py-3 px-4 text-center">{item.strands}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips for Accurate Estimation</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Standard Skein Size</h3>
                <p className="text-sm text-muted-foreground">
                  DMC and most brands sell 8-meter (8.7 yard) skeins with 6 strands. 
                  When you use 2 strands, you effectively get 3x the length.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Working Length</h3>
                <p className="text-sm text-muted-foreground">
                  Cut 18&quot; lengths for comfortable stitching. Longer threads tangle and fray.
                  Shorter threads waste time re-threading.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Backstitch Uses Less</h3>
                <p className="text-sm text-muted-foreground">
                  Backstitch outlines use about 75% of the thread that cross stitches use.
                  French knots use even less per stitch.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
