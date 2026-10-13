import { Metadata } from 'next';
import { KnittingStitchConverter } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Knitting Stitch Converter - Gauge Calculator',
  description: 'Convert knitting pattern stitches to your gauge. Calculate cast-on stitches for any width based on your gauge swatch.',
  keywords: ['knitting calculator', 'stitch converter', 'gauge calculator', 'knitting gauge', 'cast on calculator'],
  alternates: { canonical: '/calculators/crafts/knitting-stitch-converter' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Knitting Stitch Converter',
  description: 'Convert knitting patterns between different gauges and calculate stitches for target widths',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Choose mode', text: 'Select whether to convert a pattern or calculate for a target size.' },
  { name: 'Enter pattern info', text: 'For conversion, enter the pattern\'s stitch count and gauge.' },
  { name: 'Enter your gauge', text: 'Input your gauge swatch measurements (stitches and rows per 4 inches).' },
  { name: 'View results', text: 'See the adjusted stitch count or stitches needed for your target width.' },
];

const faqs = [
  { question: 'Why is gauge important in knitting?', answer: 'Gauge determines the size of your finished project. Even a small difference in gauge can result in a significantly different finished size.' },
  { question: 'How do I measure my gauge?', answer: 'Knit a swatch at least 6" square, wash and block it, then count stitches and rows in a 4" square in the center.' },
  { question: 'What if my gauge doesn\'t match the pattern?', answer: 'You can change needle size (larger for fewer stitches, smaller for more) or use this calculator to adjust the pattern to your gauge.' },
  { question: 'Should I round stitch counts?', answer: 'Yes, round to the nearest whole number. For patterns with repeats, round to a number that works with your stitch pattern.' },
];

const relatedTools = [
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Crochet Hat Calculator', description: 'Calculate hat dimensions from head size.' },
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Yarn Substitution Helper', description: 'Find equivalent yarns by weight.' },
];

const gaugeChart = [
  { weight: 'Lace', stitches: '32-34', rows: '40-44', needle: '000-1' },
  { weight: 'Fingering', stitches: '27-32', rows: '36-40', needle: '1-3' },
  { weight: 'Sport', stitches: '23-26', rows: '30-34', needle: '3-5' },
  { weight: 'DK', stitches: '21-24', rows: '26-30', needle: '5-7' },
  { weight: 'Worsted', stitches: '16-20', rows: '22-26', needle: '7-9' },
  { weight: 'Bulky', stitches: '12-15', rows: '16-20', needle: '9-11' },
  { weight: 'Super Bulky', stitches: '7-11', rows: '12-16', needle: '11+' },
];

export default function KnittingStitchConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="knitting-stitch-converter"
          title="Knitting Stitch Converter"
          description="Convert pattern stitches to your gauge or calculate how many stitches to cast on for a specific width."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Knitting Stitch Converter">
          <KnittingStitchConverter />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Standard Gauge Reference (per 4 inches)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Yarn Weight</th>
                      <th className="text-center py-3 px-4 font-medium">Stitches</th>
                      <th className="text-center py-3 px-4 font-medium">Rows</th>
                      <th className="text-center py-3 px-4 font-medium">US Needle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gaugeChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.weight}</td>
                        <td className="py-3 px-4 text-center">{item.stitches}</td>
                        <td className="py-3 px-4 text-center">{item.rows}</td>
                        <td className="py-3 px-4 text-center">{item.needle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
