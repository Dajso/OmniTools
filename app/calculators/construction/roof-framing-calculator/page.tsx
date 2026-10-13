import { Metadata } from 'next';
import { RoofFramingCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Roof Framing Calculator - Rafter Length, Ridge Height & Cut Angles',
  description: 'Calculate roof framing dimensions including rafter length, ridge height, number of rafters, and cut angles. Supports various roof pitches and rafter spacings.',
  keywords: ['roof framing calculator', 'rafter calculator', 'rafter length', 'ridge height', 'roof pitch', 'plumb cut', 'seat cut', 'bird\'s mouth', 'carpentry', 'construction'],
  alternates: { canonical: '/calculators/construction/roof-framing-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Roof Framing Calculator',
  description: 'Calculate roof framing dimensions including rafter length, ridge height, number of rafters, and common rafter cut angles',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter building span', text: 'Enter the total span of your building (wall to wall distance) in feet.' },
  { name: 'Select roof pitch', text: 'Choose a common roof pitch preset or enter a custom pitch value (rise per 12 inches of run).' },
  { name: 'Choose rafter spacing', text: 'Select the rafter spacing (typically 16" or 24" on center).' },
  { name: 'Set overhang', text: 'Enter the desired overhang distance (horizontal projection past the wall).' },
  { name: 'Add building length', text: 'Optionally enter the building length to calculate the total number of rafters needed.' },
  { name: 'View results', text: 'See rafter length, ridge height, cut angles, and rafter count.' },
];

const faqs = [
  { 
    question: 'What is roof pitch?', 
    answer: 'Roof pitch is the slope of a roof expressed as a ratio of rise to run. For example, a 6:12 pitch means the roof rises 6 inches for every 12 inches of horizontal run. Common residential pitches range from 4:12 to 9:12.' 
  },
  { 
    question: 'How do I calculate rafter length?', 
    answer: 'Rafter length is calculated using the Pythagorean theorem: Rafter Length = √(Run² + Rise²). The run is half the building span, and the rise is calculated from the pitch (Rise = Run × Pitch/12). Add the overhang diagonal length for total rafter length.' 
  },
  { 
    question: 'What is a plumb cut?', 
    answer: 'A plumb cut is a vertical cut made on a rafter. It\'s used at the ridge (where the rafter meets the ridge board) and at the tail (the end of the overhang). The plumb cut angle equals the roof slope angle.' 
  },
  { 
    question: 'What is a seat cut (bird\'s mouth)?', 
    answer: 'A seat cut, also called a bird\'s mouth, is the notch cut into a rafter where it sits on the wall plate. It consists of a horizontal cut (seat) and a vertical cut (heel). The seat cut angle is 90° minus the plumb cut angle.' 
  },
  { 
    question: 'What rafter spacing should I use?', 
    answer: '16 inches on center is the most common rafter spacing for residential construction. 24 inches on center may be used for lighter loads or with engineered trusses. 12 inches on center provides extra strength for heavy snow loads or long spans.' 
  },
  { 
    question: 'How do I use a framing square for rafter cuts?', 
    answer: 'Place the framing square on the rafter with the pitch number (e.g., 6 for 6:12) on the tongue (short arm) and 12 on the blade (long arm). The tongue edge gives you the plumb cut line, and the blade edge gives you the level cut line.' 
  },
];

const relatedTools = [
  { href: '/calculators/construction/concrete-slab-calculator', title: 'Concrete Slab Calculator', description: 'Calculate concrete volume and rebar needs.' },
  { href: '/calculators/construction/crown-molding-calculator', title: 'Crown Molding Calculator', description: 'Calculate miter and bevel angles.' },
  { href: '/calculators/construction/baluster-calculator', title: 'Baluster Spacing Calculator', description: 'Calculate baluster spacing for code compliance.' },
];

const pitchReferenceChart = [
  { pitch: '2:12', angle: '9.46°', rise: '2"', description: 'Low slope - requires special roofing' },
  { pitch: '4:12', angle: '18.43°', rise: '4"', description: 'Moderate - common residential' },
  { pitch: '5:12', angle: '22.62°', rise: '5"', description: 'Standard - good for most climates' },
  { pitch: '6:12', angle: '26.57°', rise: '6"', description: 'Standard - most common residential' },
  { pitch: '8:12', angle: '33.69°', rise: '8"', description: 'Steep - good for snow shedding' },
  { pitch: '10:12', angle: '39.81°', rise: '10"', description: 'Very steep - dramatic appearance' },
  { pitch: '12:12', angle: '45.00°', rise: '12"', description: '45° angle - maximum common pitch' },
];

export default function RoofFramingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="roof-framing-calculator"
          title="Roof Framing Calculator"
          description="Calculate rafter length, ridge height, cut angles, and number of rafters for roof framing projects."
          colorClass="bg-amber-100 text-amber-600"
          category="Construction"
        />

        <section aria-label="Roof Framing Calculator">
          <RoofFramingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Roof Pitch Reference Chart</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Pitch</th>
                      <th className="text-left py-3 px-4 font-medium">Angle</th>
                      <th className="text-left py-3 px-4 font-medium">Rise per Foot</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pitchReferenceChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.pitch}</td>
                        <td className="py-3 px-4 font-mono">{item.angle}</td>
                        <td className="py-3 px-4">{item.rise}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Roof Framing</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Key Roof Framing Terms</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>Span:</strong> The total width of the building from wall to wall.</li>
                  <li><strong>Run:</strong> Half the span - the horizontal distance from the wall to the ridge.</li>
                  <li><strong>Rise:</strong> The vertical height from the wall plate to the ridge.</li>
                  <li><strong>Pitch:</strong> The slope expressed as rise per 12 inches of run (e.g., 6:12).</li>
                  <li><strong>Rafter Length:</strong> The diagonal distance from wall plate to ridge.</li>
                  <li><strong>Overhang:</strong> The horizontal distance the rafter extends past the wall.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Rafter Cuts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Plumb Cut:</strong> A vertical cut made at the ridge and tail of the rafter. 
                    The angle equals the roof slope angle.
                  </div>
                  <div>
                    <strong>Seat Cut (Bird&apos;s Mouth):</strong> The notch where the rafter sits on the wall plate. 
                    Consists of a level cut and a plumb cut.
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">The Formula</h3>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-sm space-y-1">
                  <p>Run = Span ÷ 2</p>
                  <p>Rise = Run × (Pitch ÷ 12)</p>
                  <p>Rafter Length = √(Run² + Rise²)</p>
                  <p>Slope Angle = arctan(Pitch ÷ 12)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Framing Square Usage</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                A framing square is an essential tool for marking rafter cuts. Here&apos;s how to use it:
              </p>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Place the square on the rafter board with the pitch number on the tongue (short arm).</li>
                <li>Align 12 inches on the blade (long arm) with the edge of the board.</li>
                <li>The tongue edge marks the plumb cut line.</li>
                <li>The blade edge marks the level (seat) cut line.</li>
                <li>For a 6:12 pitch, use 6&quot; on the tongue and 12&quot; on the blade.</li>
              </ol>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Pro Tip:</strong> The unit rafter length (shown in results) tells you how many inches of rafter 
                  you need for each foot of run. Multiply this by your run in feet to get the rafter length.
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
