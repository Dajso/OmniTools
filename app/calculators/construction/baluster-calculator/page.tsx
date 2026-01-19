import { Metadata } from 'next';
import { BalusterCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Baluster Spacing Calculator - 4-Inch Sphere Rule Compliance',
  description: 'Calculate baluster spacing for code-compliant railings. Ensures compliance with the 4-inch sphere rule (IRC R312.1.3) for deck and stair railings.',
  keywords: ['baluster spacing calculator', 'baluster calculator', '4 inch sphere rule', 'railing code compliance', 'deck railing', 'stair railing', 'IRC R312.1.3', 'baluster gap'],
  alternates: { canonical: '/calculators/construction/baluster-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Baluster Spacing Calculator',
  description: 'Calculate baluster spacing for code-compliant railings with 4-inch sphere rule compliance',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure the span', text: 'Measure the clear distance between the inside edges of your posts. This is the area to fill with balusters.' },
  { name: 'Select baluster type', text: 'Choose your baluster width from common presets (2×2 lumber, metal balusters) or enter a custom width.' },
  { name: 'Choose units', text: 'Select your preferred unit of measurement (inches, centimeters, or millimeters).' },
  { name: 'View results', text: 'See the number of balusters needed and the spacing between them.' },
  { name: 'Verify compliance', text: 'Check that the calculated gap is within the 4-inch maximum for code compliance.' },
];

const faqs = [
  { 
    question: 'What is the 4-inch sphere rule?', 
    answer: 'The 4-inch sphere rule (IRC R312.1.3) is a building code requirement that states a 4-inch diameter sphere cannot pass through any opening in a guard or railing. This is designed to prevent children from getting their heads stuck between balusters. The gap between balusters must be less than 4 inches.' 
  },
  { 
    question: 'What is the difference between gap and center-to-center spacing?', 
    answer: 'The gap (or clear spacing) is the actual open space between balusters - this is what the building code measures. Center-to-center spacing is the distance from the center of one baluster to the center of the next, which includes half of each baluster\'s width. For installation, center-to-center is often easier to mark.' 
  },
  { 
    question: 'How do I measure the span between posts?', 
    answer: 'Measure from the inside edge of one post to the inside edge of the other post. This is the clear opening that will be filled with balusters. Do not include the post widths in this measurement.' 
  },
  { 
    question: 'What size balusters should I use?', 
    answer: 'The most common baluster sizes are 2×2 lumber (1.5" actual) for wood railings and 3/4" to 1" for metal balusters. Larger balusters require fewer pieces but may look bulkier. Smaller balusters create a more open feel but require more pieces.' 
  },
  { 
    question: 'Does the 4-inch rule apply to all railings?', 
    answer: 'The 4-inch sphere rule applies to guards and railings in residential construction under the International Residential Code (IRC). Commercial buildings may have different requirements. Always check your local building codes as they may be more restrictive.' 
  },
  { 
    question: 'What about the spacing at the ends near the posts?', 
    answer: 'The gap between the posts and the first/last balusters must also comply with the 4-inch rule. This calculator ensures even spacing throughout, including the end gaps, so all openings are code-compliant.' 
  },
];

const relatedTools = [
  { href: '/calculators/construction/board-foot-calculator', title: 'Board Foot Calculator', description: 'Calculate lumber volume and pricing.' },
  { href: '/calculators/construction/crown-molding-calculator', title: 'Crown Molding Calculator', description: 'Calculate miter and bevel angles for crown molding.' },
  { href: '/calculators/construction/concrete-slab-calculator', title: 'Concrete Slab Calculator', description: 'Calculate concrete volume and rebar needs.' },
];

const quickReferenceTable = [
  { span: 24, balusters: 5, gap: '3.25"', compliant: true },
  { span: 30, balusters: 6, gap: '3.43"', compliant: true },
  { span: 36, balusters: 8, gap: '3.33"', compliant: true },
  { span: 42, balusters: 9, gap: '3.45"', compliant: true },
  { span: 48, balusters: 10, gap: '3.55"', compliant: true },
  { span: 60, balusters: 13, gap: '3.54"', compliant: true },
  { span: 72, balusters: 15, gap: '3.56"', compliant: true },
  { span: 96, balusters: 20, gap: '3.57"', compliant: true },
];

export default function BalusterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="baluster-calculator"
          title="Baluster Spacing Calculator"
          description="Calculate the optimal number of balusters and spacing for code-compliant railings. Ensures compliance with the 4-inch sphere rule (IRC R312.1.3)."
          colorClass="bg-amber-100 text-amber-600"
          category="Construction"
        />

        <section aria-label="Baluster Spacing Calculator">
          <BalusterCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Reference: Common Spans (1.5&quot; Balusters)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Span</th>
                      <th className="text-right py-3 px-4 font-medium">Balusters</th>
                      <th className="text-right py-3 px-4 font-medium">Gap</th>
                      <th className="text-center py-3 px-4 font-medium">Compliant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceTable.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.span}&quot;</td>
                        <td className="py-3 px-4 text-right">{item.balusters}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.gap}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            item.compliant 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {item.compliant ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            * Based on 1.5&quot; (2×2 lumber) balusters with 4&quot; maximum gap
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding the 4-Inch Sphere Rule</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Why 4 Inches?</h3>
                <p className="text-sm text-muted-foreground">
                  The 4-inch sphere rule is based on the average head size of young children. 
                  By ensuring that a 4-inch sphere cannot pass through any opening, the code prevents 
                  children from getting their heads stuck between balusters, which could lead to 
                  strangulation or injury.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">The Formula</h3>
                <div className="bg-muted/50 p-3 rounded-md space-y-2 font-mono text-sm">
                  <p>Minimum Balusters = ⌈(Span - Max Gap) ÷ (Baluster Width + Max Gap)⌉</p>
                  <p>Actual Gap = (Span - (Balusters × Width)) ÷ (Balusters + 1)</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where Max Gap is 4 inches per building code.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Code References</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">IRC R312.1.3</p>
                    <p className="text-xs text-muted-foreground">
                      International Residential Code section covering guard openings. 
                      Requires that openings shall not allow passage of a sphere 4 inches in diameter.
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Local Codes</p>
                    <p className="text-xs text-muted-foreground">
                      Some jurisdictions have stricter requirements. Always verify with your 
                      local building department before construction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Installation Tips</h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">1.</span>
                  <span><strong>Mark center-to-center</strong> - It&apos;s easier to mark baluster positions using center-to-center spacing rather than measuring each gap.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">2.</span>
                  <span><strong>Start from one end</strong> - Begin marking from one post and work your way across. Any small accumulated error will be at the far end.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">3.</span>
                  <span><strong>Use a spacer jig</strong> - Cut a piece of scrap wood to the exact gap width and use it as a spacer between balusters during installation.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">4.</span>
                  <span><strong>Check plumb</strong> - Use a level to ensure each baluster is perfectly vertical before securing.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold">5.</span>
                  <span><strong>Pre-drill holes</strong> - To prevent splitting, especially with wood balusters, pre-drill holes for screws or nails.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Common Baluster Types</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Wood Balusters</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>2×2 Lumber:</strong> 1.5&quot; actual width, most common for decks</li>
                    <li>• <strong>Turned Balusters:</strong> Decorative, typically 1.25&quot; - 1.5&quot;</li>
                    <li>• <strong>Square Balusters:</strong> Clean look, various sizes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Metal Balusters</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Round:</strong> 5/8&quot; to 1&quot; diameter</li>
                    <li>• <strong>Square:</strong> 1/2&quot; to 3/4&quot; typical</li>
                    <li>• <strong>Decorative:</strong> Scrolls, baskets, various widths</li>
                  </ul>
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
