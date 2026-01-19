import { Metadata } from 'next';
import { QuiltBindingCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Quilt Binding Calculator - Free Quilting Calculator',
  description: 'Calculate how much binding fabric you need for your quilt. Supports double-fold and single-fold binding with standard quilt size presets.',
  keywords: ['quilt binding calculator', 'quilting calculator', 'binding strips', 'quilt finishing', 'how much binding'],
  alternates: { canonical: '/calculators/crafts/quilt-binding-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Quilt Binding Calculator',
  description: 'Calculate binding strip length and fabric requirements for quilts',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter quilt size', text: 'Select a preset size or enter custom width and height in inches.' },
  { name: 'Choose binding type', text: 'Select double-fold (French) or single-fold binding.' },
  { name: 'Set strip width', text: 'Enter your desired cut width (2.5" is standard for double-fold).' },
  { name: 'Enter fabric width', text: 'Input your usable fabric width (typically 42" from 44/45" fabric).' },
  { name: 'View results', text: 'See total binding length, number of strips, and fabric needed.' },
];

const faqs = [
  { question: 'What\'s the difference between double-fold and single-fold binding?', answer: 'Double-fold (French) binding is folded in half lengthwise before attaching, creating a more durable edge. Single-fold binding uses less fabric but is less sturdy.' },
  { question: 'Why do I need extra binding length?', answer: 'Extra length (typically 10-12") accounts for joining strips together, mitering corners, and finishing the binding ends.' },
  { question: 'What width should I cut my binding strips?', answer: 'For double-fold binding, 2.5" is standard (finishes to about 5/8"). For single-fold, 2" is common. Adjust based on your preference.' },
  { question: 'Should I cut binding on the bias?', answer: 'Bias binding is recommended for quilts with curved edges. For straight edges, straight-grain binding works well and uses less fabric.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Fabric Yardage Calculator', description: 'Calculate fabric for garments.' },
  { href: '/calculators/crafts/circle-skirt-calculator', title: 'Circle Skirt Calculator', description: 'Calculate circle skirt measurements.' },
];

const quiltSizes = [
  { name: 'Crib', dimensions: '36" × 52"', perimeter: '176"', binding: '~0.375 yd' },
  { name: 'Throw', dimensions: '50" × 65"', perimeter: '230"', binding: '~0.5 yd' },
  { name: 'Twin', dimensions: '68" × 88"', perimeter: '312"', binding: '~0.625 yd' },
  { name: 'Full', dimensions: '81" × 96"', perimeter: '354"', binding: '~0.75 yd' },
  { name: 'Queen', dimensions: '90" × 108"', perimeter: '396"', binding: '~0.875 yd' },
  { name: 'King', dimensions: '108" × 108"', perimeter: '432"', binding: '~1 yd' },
];

export default function QuiltBindingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="quilt-binding-calculator"
          title="Quilt Binding Calculator"
          description="Calculate how much binding fabric you need for your quilt. Includes standard size presets and supports both double-fold and single-fold binding."
          colorClass="bg-amber-100 text-amber-600"
          category="Crafts"
        />

        <section aria-label="Quilt Binding Calculator">
          <QuiltBindingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Standard Quilt Sizes Reference</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Size</th>
                      <th className="text-center py-3 px-4 font-medium">Dimensions</th>
                      <th className="text-center py-3 px-4 font-medium">Perimeter</th>
                      <th className="text-center py-3 px-4 font-medium">Binding (approx)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiltSizes.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-center">{item.dimensions}</td>
                        <td className="py-3 px-4 text-center">{item.perimeter}</td>
                        <td className="py-3 px-4 text-center">{item.binding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            * Binding estimates based on 2.5&quot; strips from 42&quot; wide fabric
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Binding Tips</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Joining Strips</h3>
                <p className="text-sm text-muted-foreground">
                  Join binding strips at a 45° angle to reduce bulk. This diagonal seam distributes 
                  the thickness more evenly around your quilt.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Mitered Corners</h3>
                <p className="text-sm text-muted-foreground">
                  Stop stitching 1/4&quot; from each corner, fold the binding up at 45°, then fold 
                  back down to create a neat mitered corner.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Finishing</h3>
                <p className="text-sm text-muted-foreground">
                  Leave about 10&quot; unsewn at the start. When you reach the end, join the binding 
                  ends with a diagonal seam for a seamless finish.
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
