import { Metadata } from 'next';
import { BoardFootCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Board Foot Calculator - Lumber Pricing & Volume Calculator',
  description: 'Calculate board feet for lumber pricing and estimation. Supports nominal lumber sizes (2x4, 2x6, etc.) and custom dimensions with total cost calculation.',
  keywords: ['board foot calculator', 'lumber calculator', 'wood calculator', 'board feet', 'lumber pricing', 'woodworking calculator', 'carpentry'],
  alternates: { canonical: '/calculators/construction/board-foot-calculator' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Board Foot Calculator',
  description: 'Calculate board feet for lumber pricing and estimation with support for nominal and actual lumber dimensions',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select lumber size', text: 'Choose a nominal lumber size (like 2x4 or 2x6) from the dropdown, or enter custom dimensions.' },
  { name: 'Enter length', text: 'Select a common length or enter a custom length in feet.' },
  { name: 'Set quantity', text: 'Enter the number of pieces you need.' },
  { name: 'Add price (optional)', text: 'Enter the price per board foot to calculate total cost.' },
  { name: 'View results', text: 'See board feet per piece, total board feet, and total price.' },
];

const faqs = [
  { 
    question: 'What is a board foot?', 
    answer: 'A board foot is a unit of volume for lumber equal to 144 cubic inches, or the volume of a board 1 foot long, 1 foot wide, and 1 inch thick. It\'s the standard unit for pricing hardwood lumber in the United States.' 
  },
  { 
    question: 'How do I calculate board feet?', 
    answer: 'Board feet = (Thickness × Width × Length) / 12, where thickness and width are in inches and length is in feet. For example, a 2" × 6" × 8\' board = (2 × 6 × 8) / 12 = 8 board feet.' 
  },
  { 
    question: 'What\'s the difference between nominal and actual lumber sizes?', 
    answer: 'Nominal size is the name used to sell lumber (like 2x4), while actual size is the true dimension after drying and planing. A nominal 2x4 is actually 1.5" × 3.5". This calculator uses actual dimensions for accurate calculations.' 
  },
  { 
    question: 'Why is lumber sold by board feet?', 
    answer: 'Board feet provide a standardized way to price lumber regardless of dimensions. This allows fair pricing comparison between different sizes and makes it easier to estimate costs for projects requiring various lumber sizes.' 
  },
  { 
    question: 'How much waste should I add to my lumber estimate?', 
    answer: 'A common rule is to add 10-15% for waste due to cutting, defects, and mistakes. For complex projects with many cuts, consider adding up to 20%.' 
  },
];

const relatedTools = [
  { href: '/calculators/construction/concrete-slab-calculator', title: 'Concrete Slab Calculator', description: 'Calculate concrete volume and rebar needs.' },
  { href: '/calculators/construction/crown-molding-calculator', title: 'Crown Molding Calculator', description: 'Calculate miter and bevel angles.' },
  { href: '/calculators/construction/baluster-calculator', title: 'Baluster Spacing Calculator', description: 'Calculate baluster spacing for code compliance.' },
];

const nominalSizeChart = [
  { nominal: '1×2', actual: '0.75" × 1.5"', boardFeet8ft: '1.00' },
  { nominal: '1×4', actual: '0.75" × 3.5"', boardFeet8ft: '2.33' },
  { nominal: '1×6', actual: '0.75" × 5.5"', boardFeet8ft: '3.67' },
  { nominal: '1×8', actual: '0.75" × 7.25"', boardFeet8ft: '4.83' },
  { nominal: '1×12', actual: '0.75" × 11.25"', boardFeet8ft: '7.50' },
  { nominal: '2×4', actual: '1.5" × 3.5"', boardFeet8ft: '3.50' },
  { nominal: '2×6', actual: '1.5" × 5.5"', boardFeet8ft: '5.50' },
  { nominal: '2×8', actual: '1.5" × 7.25"', boardFeet8ft: '7.25' },
  { nominal: '2×10', actual: '1.5" × 9.25"', boardFeet8ft: '9.25' },
  { nominal: '2×12', actual: '1.5" × 11.25"', boardFeet8ft: '11.25' },
  { nominal: '4×4', actual: '3.5" × 3.5"', boardFeet8ft: '8.17' },
];

export default function BoardFootCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="board-foot-calculator"
          title="Board Foot Calculator"
          description="Calculate board feet for lumber pricing and estimation. Supports nominal lumber sizes and custom dimensions."
          colorClass="bg-amber-100 text-amber-600"
          category="Construction"
        />

        <section aria-label="Board Foot Calculator">
          <BoardFootCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Nominal vs Actual Lumber Sizes (8-foot length)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Nominal Size</th>
                      <th className="text-left py-3 px-4 font-medium">Actual Size</th>
                      <th className="text-right py-3 px-4 font-medium">Board Feet (8&apos;)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nominalSizeChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.nominal}</td>
                        <td className="py-3 px-4">{item.actual}</td>
                        <td className="py-3 px-4 text-right font-mono">{item.boardFeet8ft} BF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Understanding Board Feet</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">What is a Board Foot?</h3>
                <p className="text-sm text-muted-foreground">
                  A board foot (BF) is the standard unit of measurement for lumber volume in the United States. 
                  One board foot equals 144 cubic inches—equivalent to a piece of wood 12 inches long, 12 inches wide, and 1 inch thick.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">The Formula</h3>
                <div className="bg-muted/50 p-3 rounded-md font-mono text-sm">
                  Board Feet = (Thickness × Width × Length) ÷ 12
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Where thickness and width are in inches, and length is in feet.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Why Use Board Feet?</h3>
                <p className="text-sm text-muted-foreground">
                  Board feet provide a standardized way to price lumber regardless of dimensions. 
                  Hardwood lumber is typically sold by the board foot, while softwood (like construction lumber) 
                  is often sold by the linear foot or piece.
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
