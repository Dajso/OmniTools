import { Metadata } from 'next';
import { CrochetHatCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Crochet Hat Size Calculator - Hat Dimensions',
  description: 'Calculate crochet hat dimensions from head circumference. Get crown diameter, hat height, and yarn estimates for beanies, slouchy hats, and more.',
  keywords: ['crochet hat calculator', 'hat size chart', 'beanie dimensions', 'crown diameter', 'crochet sizing'],
  alternates: { canonical: '/calculators/crafts/crochet-hat-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Crochet Hat Size Calculator',
  description: 'Calculate crochet hat dimensions from head circumference',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure head', text: 'Measure head circumference around the widest part, just above the ears.' },
  { name: 'Choose size method', text: 'Use custom measurement or select from standard size chart.' },
  { name: 'Select hat style', text: 'Choose beanie, slouchy, fitted, or earflap style.' },
  { name: 'Adjust ease', text: 'Set negative ease (10% is standard for a snug fit).' },
  { name: 'Get dimensions', text: 'View crown diameter, hat circumference, and height for your project.' },
];

const faqs = [
  { question: 'What is negative ease?', answer: 'Negative ease means the hat is slightly smaller than the head measurement. This ensures a snug fit since yarn stretches. 10% is standard for most hats.' },
  { question: 'How do I measure head circumference?', answer: 'Wrap a measuring tape around the head at the widest point, typically just above the ears and eyebrows. Keep the tape snug but not tight.' },
  { question: 'What is crown diameter?', answer: 'Crown diameter is how wide your flat circle needs to be before you start the sides. It\'s calculated from the hat circumference using π.' },
  { question: 'How much yarn do I need?', answer: 'An adult beanie typically needs 150-250 yards of worsted weight yarn. Bulky yarn uses less yardage. See the yarn estimates in the results.' },
  { question: 'Why is my hat too small/big?', answer: 'Check your gauge! If your stitches are tighter than the pattern, your hat will be smaller. Always make a gauge swatch and adjust hook size as needed.' },
];

const relatedTools = [
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Yarn Substitution', description: 'Calculate yarn substitutions.' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Stitch Converter', description: 'Convert between gauges.' },
];

const sizeChart = [
  { age: 'Preemie', circ: '12"', height: '4.5"', crown: '3.4"' },
  { age: 'Newborn', circ: '14"', height: '5"', crown: '4.0"' },
  { age: 'Baby 3-6m', circ: '16"', height: '5.5"', crown: '4.6"' },
  { age: 'Baby 6-12m', circ: '18"', height: '6"', crown: '5.2"' },
  { age: 'Toddler', circ: '19"', height: '6.5"', crown: '5.4"' },
  { age: 'Child', circ: '20"', height: '7"', crown: '5.7"' },
  { age: 'Teen', circ: '21"', height: '7.5"', crown: '6.0"' },
  { age: 'Adult S', circ: '21.5"', height: '8"', crown: '6.2"' },
  { age: 'Adult M', circ: '22.5"', height: '8.5"', crown: '6.4"' },
  { age: 'Adult L', circ: '24"', height: '9"', crown: '6.9"' },
];

export default function CrochetHatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="crochet-hat-calculator"
          title="Crochet Hat Size Calculator"
          description="Calculate hat dimensions from head circumference. Get crown diameter, hat height, and yarn estimates for your crochet project."
          colorClass="bg-amber-100 text-amber-600"
          category="Crafts"
        />

        <section aria-label="Crochet Hat Size Calculator">
          <CrochetHatCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Standard Hat Size Chart</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Age/Size</th>
                      <th className="text-center py-3 px-4 font-medium">Head Circ.</th>
                      <th className="text-center py-3 px-4 font-medium">Hat Height</th>
                      <th className="text-center py-3 px-4 font-medium">Crown Dia.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.age}</td>
                        <td className="py-3 px-4 text-center">{item.circ}</td>
                        <td className="py-3 px-4 text-center">{item.height}</td>
                        <td className="py-3 px-4 text-center">{item.crown}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            * Crown diameter calculated with 10% negative ease
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hat Style Guide</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Beanie (Standard)</h3>
                <p className="text-sm text-muted-foreground">
                  Classic fitted hat that covers the ears. Uses 10% negative ease for a snug fit.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Slouchy</h3>
                <p className="text-sm text-muted-foreground">
                  Relaxed fit with extra length that slouches at the back. Uses less negative ease (5%) 
                  and adds 2&quot; to height.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Fitted</h3>
                <p className="text-sm text-muted-foreground">
                  Very snug fit, often worn as a skull cap. Uses more negative ease (15%) 
                  and slightly shorter height.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Earflap</h3>
                <p className="text-sm text-muted-foreground">
                  Standard beanie with added earflaps. Calculate main hat dimensions, 
                  then add flaps separately.
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
