import { Metadata } from 'next';
import { CircleSkirtCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Circle Skirt Calculator - Free Pattern Calculator',
  description: 'Calculate the inner radius and fabric requirements for full, half, and quarter circle skirts. Get exact measurements for your waist size.',
  keywords: ['circle skirt calculator', 'skirt pattern calculator', 'full circle skirt', 'half circle skirt', 'sewing calculator'],
  alternates: { canonical: '/calculators/crafts/circle-skirt-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Circle Skirt Calculator',
  description: 'Calculate inner radius and fabric requirements for circle skirts',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure your waist', text: 'Measure around your natural waist where you want the skirt to sit.' },
  { name: 'Decide on length', text: 'Measure from your waist to where you want the hem to fall.' },
  { name: 'Choose skirt type', text: 'Select full, 3/4, half, or quarter circle based on desired fullness.' },
  { name: 'Set allowances', text: 'Enter seam and hem allowances (typically 0.5" and 1" respectively).' },
  { name: 'Cut your fabric', text: 'Use the inner and outer radius measurements to cut your pattern.' },
];

const faqs = [
  { question: 'What\'s the difference between circle skirt types?', answer: 'A full circle (360°) has the most volume and swing. Half circle (180°) is less full but still flowy. Quarter circle (90°) is the least full, more like an A-line.' },
  { question: 'How do I cut a circle skirt?', answer: 'Fold your fabric in quarters, mark the inner radius from the corner, then mark the outer radius. Cut along both arcs. For half/quarter circles, cut multiple pieces.' },
  { question: 'Why is my waist opening too small?', answer: 'Make sure you\'re using your actual waist measurement, not your pants size. Add 1-2 inches for ease if using a non-stretch fabric.' },
  { question: 'How much fabric do I need?', answer: 'For a full circle skirt, you typically need fabric at least as wide as twice the outer radius. The calculator shows exact requirements.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Fabric Yardage Calculator', description: 'Calculate fabric for other garments.' },
  { href: '/calculators/crafts/quilt-binding-calculator', title: 'Quilt Binding Calculator', description: 'Calculate binding strip requirements.' },
];

const skirtTypes = [
  { type: 'Full Circle', angle: '360°', fullness: 'Maximum', panels: '1', best: 'Formal, dance, twirly skirts' },
  { type: '3/4 Circle', angle: '270°', fullness: 'High', panels: '1-2', best: 'Semi-formal, everyday wear' },
  { type: 'Half Circle', angle: '180°', fullness: 'Medium', panels: '2', best: 'Casual, office wear' },
  { type: 'Quarter Circle', angle: '90°', fullness: 'Low', panels: '4', best: 'A-line look, less fabric' },
];

export default function CircleSkirtCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="circle-skirt-calculator"
          title="Circle Skirt Calculator"
          description="Calculate the inner radius and fabric requirements for circle skirts. Supports full, 3/4, half, and quarter circle styles."
          colorClass="bg-rose-100 text-rose-600"
          category="Crafts"
        />

        <section aria-label="Circle Skirt Calculator">
          <CircleSkirtCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Circle Skirt Types Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-center py-3 px-4 font-medium">Angle</th>
                      <th className="text-center py-3 px-4 font-medium">Fullness</th>
                      <th className="text-center py-3 px-4 font-medium">Panels</th>
                      <th className="text-left py-3 px-4 font-medium">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skirtTypes.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.type}</td>
                        <td className="py-3 px-4 text-center">{item.angle}</td>
                        <td className="py-3 px-4 text-center">{item.fullness}</td>
                        <td className="py-3 px-4 text-center">{item.panels}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">The Math Behind Circle Skirts</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Circle skirts use the relationship between circumference and radius:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-4">
                Circumference = 2 × π × radius
                <br />
                Therefore: radius = circumference ÷ (2 × π)
              </div>
              <p className="text-sm text-muted-foreground">
                For a full circle skirt, your waist measurement IS the circumference of the inner circle.
                For partial circles, we multiply the waist by a factor to get the same opening size
                with less fabric.
              </p>
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
