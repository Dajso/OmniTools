import { Metadata } from 'next';
import { FabricYardageCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Fabric Yardage Calculator - Free Sewing Fabric Calculator',
  description: 'Calculate how much fabric you need for your sewing project. Supports different garment types, sizes, and fabric widths.',
  keywords: ['fabric calculator', 'yardage calculator', 'sewing calculator', 'fabric requirements', 'how much fabric'],
  alternates: { canonical: '/calculators/crafts/fabric-yardage-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Fabric Yardage Calculator',
  description: 'Calculate fabric requirements for sewing projects based on garment type and size',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select garment type', text: 'Choose the type of garment you want to make (dress, skirt, pants, etc.).' },
  { name: 'Choose your size', text: 'Select your size from XS to 3XL.' },
  { name: 'Enter fabric width', text: 'Select the width of your fabric (36", 45", 54", or 60").' },
  { name: 'Indicate directional fabric', text: 'Specify if your fabric has a nap or directional print.' },
  { name: 'Add pattern repeat', text: 'If your fabric has a pattern, enter the repeat length for matching.' },
];

const faqs = [
  { question: 'How do I know if my fabric is directional?', answer: 'Directional fabrics include velvet, corduroy, one-way prints, and fabrics with a nap. If the fabric looks different when viewed from different directions, it\'s directional.' },
  { question: 'What is pattern repeat?', answer: 'Pattern repeat is the distance between identical points in a repeating pattern. You\'ll need extra fabric to match patterns at seams.' },
  { question: 'Why does fabric width matter?', answer: 'Wider fabric allows pattern pieces to be laid out more efficiently, often requiring less total yardage than narrower fabric.' },
  { question: 'Should I buy extra fabric?', answer: 'Yes! It\'s recommended to buy an extra 1/4 to 1/2 yard for mistakes, shrinkage, and pattern matching.' },
];

const relatedTools = [
  { href: '/calculators/crafts/circle-skirt-calculator', title: 'Circle Skirt Calculator', description: 'Calculate fabric for circle skirts.' },
  { href: '/calculators/crafts/quilt-binding-calculator', title: 'Quilt Binding Calculator', description: 'Calculate binding strip requirements.' },
];

const yardageChart = [
  { garment: 'Short Dress', xs: '2.0', m: '2.5', xl: '3.0' },
  { garment: 'Midi Dress', xs: '2.5', m: '3.0', xl: '3.5' },
  { garment: 'Maxi Dress', xs: '3.5', m: '4.0', xl: '4.5' },
  { garment: 'Pants', xs: '2.0', m: '2.5', xl: '3.0' },
  { garment: 'Blouse', xs: '1.5', m: '2.0', xl: '2.5' },
  { garment: 'Jacket', xs: '2.5', m: '3.0', xl: '3.5' },
];

export default function FabricYardageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fabric-yardage-calculator"
          title="Fabric Yardage Calculator"
          description="Calculate how much fabric you need for your sewing project. Accounts for garment type, size, fabric width, and pattern matching."
          colorClass="bg-pink-100 text-pink-600"
          category="Crafts"
        />

        <section aria-label="Fabric Yardage Calculator">
          <FabricYardageCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Reference Chart (45" Fabric)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Garment</th>
                      <th className="text-center py-3 px-4 font-medium">XS</th>
                      <th className="text-center py-3 px-4 font-medium">M</th>
                      <th className="text-center py-3 px-4 font-medium">XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yardageChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.garment}</td>
                        <td className="py-3 px-4 text-center">{item.xs} yd</td>
                        <td className="py-3 px-4 text-center">{item.m} yd</td>
                        <td className="py-3 px-4 text-center">{item.xl} yd</td>
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
