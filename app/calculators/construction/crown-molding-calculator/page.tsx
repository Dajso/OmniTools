import { Metadata } from 'next';
import { CrownMoldingCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Crown Molding Angle Calculator - Miter & Bevel Angles',
  description: 'Calculate miter and bevel angles for crown molding cuts. Supports inside and outside corners with compound miter saw setup instructions.',
  keywords: ['crown molding calculator', 'miter angle calculator', 'bevel angle calculator', 'crown molding cuts', 'compound miter', 'carpentry calculator', 'woodworking'],
  alternates: { canonical: '/calculators/construction/crown-molding-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Crown Molding Angle Calculator',
  description: 'Calculate miter and bevel angles for crown molding cuts with compound miter saw setup instructions',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select corner type', text: 'Choose whether you are cutting for an inside corner or outside corner.' },
  { name: 'Choose crown molding type', text: 'Select your crown molding spring angle (38/52 is most common) or enter a custom angle.' },
  { name: 'Set corner angle', text: 'Select 90° for standard corners or enter a custom angle for non-standard corners.' },
  { name: 'View results', text: 'See the miter and bevel angles needed for your compound miter saw.' },
  { name: 'Follow setup instructions', text: 'Use the detailed saw setup instructions for cutting both pieces of the corner.' },
];

const faqs = [
  { 
    question: 'What is a spring angle?', 
    answer: 'The spring angle is the angle between the back of the crown molding and the wall when installed. Common spring angles are 38° (38/52 crown, most common) and 45° (45/45 crown). You can find this information on the molding packaging or measure it yourself.' 
  },
  { 
    question: 'What is the difference between miter and bevel angles?', 
    answer: 'The miter angle is the horizontal rotation of the saw blade (left or right), while the bevel angle is the vertical tilt of the blade. Crown molding requires both angles (compound cuts) because it sits at an angle from the wall.' 
  },
  { 
    question: 'What is the flat cutting method?', 
    answer: 'The flat cutting method involves positioning the crown molding upside down and backwards against the saw fence, with the ceiling edge against the fence and wall edge on the table. This method only requires a miter cut (no bevel) but needs a taller fence to support the molding.' 
  },
  { 
    question: 'Why are inside and outside corners different?', 
    answer: 'Inside corners (like where two walls meet in a room) and outside corners (like around a column or exterior corner) require the cuts to angle in opposite directions. The calculator adjusts the saw setup instructions accordingly.' 
  },
  { 
    question: 'How do I know if my crown is 38/52 or 45/45?', 
    answer: 'Check the packaging or place the crown against a framing square. For 38/52 crown, the ceiling projection is larger than the wall projection. For 45/45 crown, both projections are equal. You can also measure the angle with a protractor.' 
  },
  { 
    question: 'What if my corner is not exactly 90 degrees?', 
    answer: 'Many corners are not perfectly square. Use an angle finder to measure the actual corner angle and enter it in the calculator. Even a few degrees off from 90° will change the required miter and bevel angles.' 
  },
];

const relatedTools = [
  { href: '/calculators/construction/board-foot-calculator', title: 'Board Foot Calculator', description: 'Calculate lumber volume and pricing.' },
  { href: '/calculators/construction/baluster-calculator', title: 'Baluster Spacing Calculator', description: 'Calculate baluster spacing for code compliance.' },
  { href: '/calculators/construction/concrete-slab-calculator', title: 'Concrete Slab Calculator', description: 'Calculate concrete volume and rebar needs.' },
];

const quickReferenceTable = [
  { spring: 38, corner: 90, miter: '31.62°', bevel: '33.86°', desc: '38/52 crown, 90° corner (most common)' },
  { spring: 45, corner: 90, miter: '35.26°', bevel: '30.00°', desc: '45/45 crown, 90° corner' },
  { spring: 52, corner: 90, miter: '38.94°', bevel: '25.28°', desc: '52/38 crown, 90° corner' },
  { spring: 38, corner: 135, miter: '19.04°', bevel: '21.47°', desc: '38/52 crown, 135° corner' },
  { spring: 45, corner: 135, miter: '21.47°', bevel: '19.04°', desc: '45/45 crown, 135° corner' },
];

export default function CrownMoldingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="crown-molding-calculator"
          title="Crown Molding Angle Calculator"
          description="Calculate miter and bevel angles for crown molding cuts. Get precise compound miter saw settings for inside and outside corners."
          colorClass="bg-amber-100 text-amber-600"
          category="Construction"
        />

        <section aria-label="Crown Molding Angle Calculator">
          <CrownMoldingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Reference: Common Angle Combinations</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Spring</th>
                      <th className="text-left py-3 px-4 font-medium">Corner</th>
                      <th className="text-right py-3 px-4 font-medium">Miter</th>
                      <th className="text-right py-3 px-4 font-medium">Bevel</th>
                      <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceTable.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.spring}°</td>
                        <td className="py-3 px-4">{item.corner}°</td>
                        <td className="py-3 px-4 text-right font-mono">{item.miter}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.bevel}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Crown Molding Cuts</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Why Compound Cuts?</h3>
                <p className="text-sm text-muted-foreground">
                  Crown molding sits at an angle between the wall and ceiling, not flat against either surface. 
                  This angled installation means you need compound cuts (both miter and bevel) to create tight-fitting corners.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">The Formulas</h3>
                <div className="bg-muted/50 p-3 rounded-md space-y-2 font-mono text-sm">
                  <p>Miter = arctan(sin(spring) ÷ tan(corner/2))</p>
                  <p>Bevel = arcsin(cos(spring) × sin(corner/2))</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where spring is the spring angle and corner is the wall corner angle.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Two Cutting Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Compound Method</p>
                    <p className="text-xs text-muted-foreground">
                      Crown lies flat on saw table. Requires both miter and bevel angles. 
                      Works with any saw that has bevel capability.
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Flat Method</p>
                    <p className="text-xs text-muted-foreground">
                      Crown positioned upside down against fence. Only miter angle needed. 
                      Requires tall fence to support molding at spring angle.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips for Perfect Crown Molding Corners</h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span><strong>Measure your corners</strong> - Most corners are not exactly 90°. Use an angle finder for accurate measurements.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span><strong>Test on scrap first</strong> - Always make test cuts on scrap pieces before cutting your actual molding.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span><strong>Mark your pieces</strong> - Label each piece with its position (left/right, inside/outside) to avoid confusion.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">4.</span>
                  <span><strong>Cut long, trim short</strong> - It&apos;s easier to trim a piece that&apos;s slightly too long than to fix one that&apos;s too short.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">5. </span>
                  <span><strong>Use coping for inside corners</strong> - Many professionals cope inside corners instead of mitering for a tighter fit.</span>
                </li>
              </ul>
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
