import { Metadata } from 'next';
import { CostPerCupCalculator } from '@/components/calculators/coffee/cost-per-cup-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Cost Per Cup Calculator - Coffee Cost Calculator',
  description: 'Calculate the actual cost per cup from your coffee bag price. Free coffee cost calculator with monthly and annual budget projections.',
  keywords: ['cost per cup calculator', 'coffee cost calculator', 'coffee price calculator', 'coffee budget', 'cost per gram', 'coffee expenses'],
  alternates: { canonical: '/calculators/coffee/cost-per-cup-calculator' },
  openGraph: {
    title: 'Cost Per Cup Calculator - Coffee Cost Calculator',
    description: 'Calculate the actual cost per cup from your coffee bag price.',
    url: '/calculators/coffee/cost-per-cup-calculator',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cost Per Cup Calculator - Coffee Cost Calculator',
    description: 'Calculate the actual cost per cup from your coffee bag price.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Cost Per Cup Calculator',
  description: 'Calculate the actual cost per cup from your coffee bag price with budget projections',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter bag price', text: 'Input the price of your coffee bag in dollars.' },
  { name: 'Enter bag weight', text: 'Input the weight of the coffee bag in grams.' },
  { name: 'Enter dose per cup', text: 'Input how much coffee you use per cup in grams.' },
  { name: 'Add daily consumption', text: 'Optionally enter cups per day for budget projections.' },
  { name: 'View cost breakdown', text: 'See cost per cup, per gram, and monthly/annual costs.' },
];

const faqs = [
  { question: 'How do I calculate the cost per cup of coffee?', answer: 'Divide the bag price by bag weight to get cost per gram, then multiply by your dose per cup. For example, $18 ÷ 340g × 20g = $1.06 per cup.' },
  { question: 'How much does home-brewed coffee cost compared to café coffee?', answer: 'Home-brewed coffee typically costs $0.50-$2.00 per cup, while café coffee costs $3-6. Brewing at home can save $2-5 per cup.' },
  { question: 'What is a typical dose per cup for coffee?', answer: 'Typical doses: 15-20g for pour over, 18-20g for espresso, 30-40g for French press, 10-15g for drip coffee makers.' },
  { question: 'How many cups can I get from a 12oz bag of coffee?', answer: 'A 12oz (340g) bag yields approximately 17-23 cups depending on dose size. With a 20g dose, about 17 cups; with 15g dose, about 23 cups.' },
  { question: 'Is expensive specialty coffee worth the cost?', answer: 'Even expensive specialty coffee ($25-45/bag) costs $1.50-3.50 per cup at home, still cheaper than café coffee. The cost per cup depends more on dose size than bag price.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
  { href: '/calculators/coffee/caffeine-half-life-tracker', title: 'Caffeine Half-Life Tracker', description: 'Track caffeine levels for better sleep.' },
];

export default function CostPerCupCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cost-per-cup-calculator"
          title="Cost Per Cup Calculator"
          description="Calculate the actual cost per cup from your coffee bag price with budget projections."
          colorClass="bg-amber-100 text-amber-700"
          category="Coffee"
        />

        <section aria-label="Cost Per Cup Calculator">
          <CostPerCupCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
