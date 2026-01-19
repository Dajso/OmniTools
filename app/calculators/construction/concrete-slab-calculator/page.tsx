import { Metadata } from 'next';
import { ConcreteSlabCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Concrete Slab Calculator - Volume, Bags & Rebar Estimation',
  description: 'Calculate concrete volume in cubic yards, number of bags needed, and rebar estimation for slab projects. Includes waste percentage and ready-mix truck estimates.',
  keywords: ['concrete calculator', 'slab calculator', 'concrete volume', 'rebar calculator', 'concrete bags', 'cubic yards', 'construction calculator'],
  alternates: { canonical: '/calculators/construction/concrete-slab-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Concrete Slab Calculator',
  description: 'Calculate concrete volume, bags needed, and rebar estimation for slab projects with waste percentage calculation',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter dimensions', text: 'Enter the length and width of your slab in feet, inches, or meters.' },
  { name: 'Select thickness', text: 'Choose a preset slab type or enter a custom thickness. Common thicknesses are 4" for patios and 6" for driveways.' },
  { name: 'Choose rebar spacing', text: 'Select rebar spacing if reinforcement is needed. Standard is 16" on center.' },
  { name: 'Set waste percentage', text: 'Add waste percentage (typically 10%) to account for spillage and uneven ground.' },
  { name: 'View results', text: 'See concrete volume, bags needed, rebar pieces, and ready-mix truck recommendations.' },
];

const faqs = [
  { 
    question: 'How do I calculate concrete for a slab?', 
    answer: 'Multiply length × width × thickness (all in feet) to get cubic feet, then divide by 27 to convert to cubic yards. For example, a 10\' × 12\' × 4" slab = 10 × 12 × 0.333 = 40 cubic feet = 1.48 cubic yards.' 
  },
  { 
    question: 'How thick should a concrete slab be?', 
    answer: 'Thickness depends on the application: 4" for sidewalks and patios, 4-6" for driveways and garage floors, 6" for heavy-duty applications, and 8"+ for foundations. Always check local building codes.' 
  },
  { 
    question: 'How much waste should I add to my concrete estimate?', 
    answer: 'Add 10% for waste to account for spillage, uneven ground, and form variations. For complex shapes or uneven terrain, consider adding 15-20%.' 
  },
  { 
    question: 'When should I use bagged concrete vs. ready-mix?', 
    answer: 'Bagged concrete is economical for small projects under 1 cubic yard. For projects over 2-3 cubic yards, ready-mix delivery is more cost-effective and ensures consistent quality.' 
  },
  { 
    question: 'What rebar spacing should I use?', 
    answer: 'Standard rebar spacing is 16" on center for most residential slabs. Use 12" spacing for heavy-duty applications like driveways with heavy vehicles. Light-duty patios may use 18-24" spacing or wire mesh instead.' 
  },
  { 
    question: 'How many bags of concrete do I need?', 
    answer: 'A 60 lb bag covers about 0.45 cubic feet, and an 80 lb bag covers about 0.60 cubic feet. For a 1 cubic yard project (27 cu ft), you\'d need about 60 bags of 60 lb mix or 45 bags of 80 lb mix.' 
  },
];

const relatedTools = [
  { href: '/calculators/construction/board-foot-calculator', title: 'Board Foot Calculator', description: 'Calculate lumber volume and pricing.' },
  { href: '/calculators/construction/crown-molding-calculator', title: 'Crown Molding Calculator', description: 'Calculate miter and bevel angles.' },
  { href: '/calculators/construction/baluster-calculator', title: 'Baluster Spacing Calculator', description: 'Calculate baluster spacing for code compliance.' },
];

const quickReferenceTable = [
  { size: '8\' × 10\'', thickness: '4"', cubicYards: '0.99', bags60lb: '66', bags80lb: '50' },
  { size: '10\' × 10\'', thickness: '4"', cubicYards: '1.23', bags60lb: '82', bags80lb: '62' },
  { size: '10\' × 12\'', thickness: '4"', cubicYards: '1.48', bags60lb: '99', bags80lb: '74' },
  { size: '12\' × 12\'', thickness: '4"', cubicYards: '1.78', bags60lb: '119', bags80lb: '89' },
  { size: '12\' × 16\'', thickness: '4"', cubicYards: '2.37', bags60lb: '158', bags80lb: '119' },
  { size: '16\' × 16\'', thickness: '4"', cubicYards: '3.16', bags60lb: '211', bags80lb: '158' },
  { size: '16\' × 20\'', thickness: '4"', cubicYards: '3.95', bags60lb: '264', bags80lb: '198' },
  { size: '20\' × 20\'', thickness: '4"', cubicYards: '4.94', bags60lb: '330', bags80lb: '247' },
  { size: '20\' × 24\'', thickness: '4"', cubicYards: '5.93', bags60lb: '395', bags80lb: '297' },
  { size: '24\' × 24\'', thickness: '4"', cubicYards: '7.11', bags60lb: '475', bags80lb: '356' },
];

export default function ConcreteSlabCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="concrete-slab-calculator"
          title="Concrete Slab Calculator"
          description="Calculate concrete volume, bags needed, and rebar estimation for slab projects. Includes waste percentage and ready-mix truck recommendations."
          colorClass="bg-gray-100 text-gray-600"
          category="Construction"
        />

        <section aria-label="Concrete Slab Calculator">
          <ConcreteSlabCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Reference: Common Slab Sizes (4&quot; thick, 10% waste)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Slab Size</th>
                      <th className="text-left py-3 px-4 font-medium">Thickness</th>
                      <th className="text-right py-3 px-4 font-medium">Cubic Yards</th>
                      <th className="text-right py-3 px-4 font-medium">60 lb Bags</th>
                      <th className="text-right py-3 px-4 font-medium">80 lb Bags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceTable.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.size}</td>
                        <td className="py-3 px-4">{item.thickness}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.cubicYards}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.bags60lb}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.bags80lb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Concrete Slabs</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Concrete Volume Formula</h3>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-sm">
                  Volume (cu yd) = (Length × Width × Thickness) ÷ 27
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where all dimensions are in feet. One cubic yard equals 27 cubic feet.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Rebar Reinforcement</h3>
                <p className="text-sm text-muted-foreground">
                  Rebar (reinforcing bar) strengthens concrete and prevents cracking. It&apos;s laid in a grid pattern 
                  with pieces running both lengthwise and widthwise. Standard #4 rebar (1/2&quot; diameter) is commonly 
                  used for residential slabs. The rebar should be positioned in the lower third of the slab thickness.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Concrete Bag Coverage</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>60 lb bag:</strong> Covers approximately 0.45 cubic feet</li>
                  <li><strong>80 lb bag:</strong> Covers approximately 0.60 cubic feet</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  For large projects (over 2-3 cubic yards), ready-mix concrete delivery is more economical 
                  and ensures consistent quality throughout the pour.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slab Thickness Guidelines</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">4&quot; Thickness</h4>
                    <p className="text-sm text-muted-foreground">Sidewalks, patios, garage floors, light foot traffic</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">5&quot; Thickness</h4>
                    <p className="text-sm text-muted-foreground">Driveways for passenger vehicles</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">6&quot; Thickness</h4>
                    <p className="text-sm text-muted-foreground">Heavy-duty driveways, RV parking, industrial floors</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md">
                    <h4 className="font-medium">8&quot;+ Thickness</h4>
                    <p className="text-sm text-muted-foreground">Foundations, structural slabs, heavy equipment areas</p>
                  </div>
                </div>
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
