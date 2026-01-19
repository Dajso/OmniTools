import { Metadata } from 'next';
import { YarnSubstitutionHelper } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Yarn Substitution Helper - Yarn Calculator',
  description: 'Calculate how much substitute yarn you need when swapping yarns in a knitting or crochet pattern. Compare yarn weights and yardage.',
  keywords: ['yarn substitution', 'yarn calculator', 'knitting calculator', 'yarn weight', 'yarn yardage'],
  alternates: { canonical: '/calculators/crafts/yarn-substitution-helper' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Yarn Substitution Helper',
  description: 'Calculate substitute yarn requirements based on yardage and weight',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter original yarn', text: 'Input the yarn weight, yardage per skein, and grams per skein from your pattern.' },
  { name: 'Enter skeins needed', text: 'Input how many skeins the pattern calls for.' },
  { name: 'Enter substitute yarn', text: 'Input the details of the yarn you want to use instead.' },
  { name: 'Check compatibility', text: 'Review the compatibility warning and gauge recommendations.' },
  { name: 'Buy substitute yarn', text: 'Purchase the calculated number of substitute skeins.' },
];

const faqs = [
  { question: 'Why substitute by yardage instead of weight?', answer: 'Different fibers have different densities. A 100g skein of cotton has less yardage than 100g of wool. Matching yardage ensures you have enough yarn.' },
  { question: 'Can I substitute different yarn weights?', answer: 'You can, but it will significantly affect your gauge and finished size. Stay within one weight category for best results.' },
  { question: 'What if my substitute has more yardage?', answer: 'You\'ll have leftover yarn. Consider making matching accessories or save it for future projects.' },
  { question: 'Should I buy extra skeins?', answer: 'Yes! Buy 1-2 extra skeins to account for gauge differences and ensure dye lot consistency.' },
];

const relatedTools = [
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Stitch Converter', description: 'Convert patterns between gauges.' },
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Crochet Hat Calculator', description: 'Calculate hat dimensions.' },
];

const yarnWeights = [
  { cyc: '0', name: 'Lace', aliases: 'Cobweb, Thread', gauge: '33-40', needle: '000-1' },
  { cyc: '1', name: 'Super Fine', aliases: 'Fingering, Sock', gauge: '27-32', needle: '1-3' },
  { cyc: '2', name: 'Fine', aliases: 'Sport, Baby', gauge: '23-26', needle: '3-5' },
  { cyc: '3', name: 'Light', aliases: 'DK, Light Worsted', gauge: '21-24', needle: '5-7' },
  { cyc: '4', name: 'Medium', aliases: 'Worsted, Aran', gauge: '16-20', needle: '7-9' },
  { cyc: '5', name: 'Bulky', aliases: 'Chunky, Craft', gauge: '12-15', needle: '9-11' },
  { cyc: '6', name: 'Super Bulky', aliases: 'Roving', gauge: '7-11', needle: '11-17' },
  { cyc: '7', name: 'Jumbo', aliases: 'Roving', gauge: '1-6', needle: '17+' },
];

export default function YarnSubstitutionHelperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="yarn-substitution-helper"
          title="Yarn Substitution Helper"
          description="Calculate how much substitute yarn you need when swapping yarns in a pattern. Compare weights and get gauge recommendations."
          colorClass="bg-violet-100 text-violet-600"
          category="Crafts"
        />

        <section aria-label="Yarn Substitution Helper">
          <YarnSubstitutionHelper />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Yarn Weight Reference (CYC Standard)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-center py-3 px-4 font-medium">CYC</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Also Called</th>
                      <th className="text-center py-3 px-4 font-medium">Gauge (st/4&quot;)</th>
                      <th className="text-center py-3 px-4 font-medium">US Needle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yarnWeights.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 text-center font-mono">{item.cyc}</td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.aliases}</td>
                        <td className="py-3 px-4 text-center">{item.gauge}</td>
                        <td className="py-3 px-4 text-center">{item.needle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Substitution Tips</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Match the Yardage, Not the Weight</h3>
                <p className="text-sm text-muted-foreground">
                  A 100g skein of cotton might have 180 yards, while 100g of wool could have 220 yards.
                  Always calculate based on total yardage needed.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Consider Fiber Content</h3>
                <p className="text-sm text-muted-foreground">
                  Different fibers behave differently. Cotton has no memory, wool is springy, 
                  acrylic is durable. Consider how the fiber will affect your finished project.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Always Swatch</h3>
                <p className="text-sm text-muted-foreground">
                  Even with the same weight category, different yarns can produce different gauges.
                  Always knit a gauge swatch before starting your project.
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
