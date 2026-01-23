import { Metadata } from 'next';
import { ExtractionYieldCalculator } from '@/components/calculators/coffee';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Coffee Extraction Yield Calculator - TDS to Extraction %',
  description: 'Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted. Free coffee extraction calculator with SCA standards.',
  keywords: ['extraction yield calculator', 'TDS calculator', 'coffee extraction', 'brew strength', 'coffee refractometer', 'SCA standards'],
  alternates: { canonical: '/calculators/coffee/extraction-yield-calculator' },
  openGraph: {
    title: 'Coffee Extraction Yield Calculator - TDS to Extraction %',
    description: 'Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted. Free coffee extraction calculator with SCA standards.',
    url: '/calculators/coffee/extraction-yield-calculator',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Extraction Yield Calculator - TDS to Extraction %',
    description: 'Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Coffee Extraction Yield Calculator',
  description: 'Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Measure TDS', text: 'Use a coffee refractometer to measure your brewed coffee\'s Total Dissolved Solids (typical range: 1.15-1.55%).' },
  { name: 'Enter coffee dose', text: 'Input the weight of coffee grounds you used in grams.' },
  { name: 'Enter beverage weight', text: 'Input the weight of your brewed coffee (not the water used) in grams.' },
  { name: 'View extraction yield', text: 'See your extraction percentage and whether it\'s under, optimal, or over-extracted.' },
  { name: 'Follow recommendations', text: 'Adjust your brewing parameters based on the recommendations provided.' },
];

const faqs = [
  { question: 'What is coffee extraction yield?', answer: 'Coffee extraction yield is the percentage of coffee grounds that dissolved into your brewed coffee. It is calculated using the formula: (TDS × Beverage Weight) / Coffee Dose × 100. The optimal extraction range is 18-22% according to SCA standards.' },
  { question: 'What is TDS in coffee?', answer: 'TDS stands for Total Dissolved Solids, measured as a percentage of dissolved coffee solids in your brewed coffee. It is typically measured using a refractometer and ranges from 1.15% to 1.55% for optimal coffee.' },
  { question: 'What does under-extracted coffee mean?', answer: 'Under-extracted coffee (extraction yield below 18%) means not enough flavor compounds were dissolved from the coffee grounds. This typically results in sour, acidic, or weak-tasting coffee. To fix under-extraction, try grinding finer, increasing water temperature, or extending brew time.' },
  { question: 'What does over-extracted coffee mean?', answer: 'Over-extracted coffee (extraction yield above 22%) means too many compounds were dissolved from the coffee grounds, including bitter and astringent flavors. This results in harsh, bitter coffee. To fix over-extraction, try grinding coarser, lowering water temperature, or reducing brew time.' },
  { question: 'How do I measure TDS for this calculator?', answer: 'TDS is measured using a coffee refractometer, which analyzes a sample of your brewed coffee. Simply place a drop of coffee on the refractometer sensor, and it will display the TDS percentage.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your desired brew ratio.' },
  { href: '/calculators/coffee/iced-coffee-dilution-calculator', title: 'Iced Coffee Dilution Calculator', description: 'Calculate ice and coffee amounts for perfect iced coffee.' },
  { href: '/calculators/coffee/water-recipe-calculator', title: 'Water Recipe Calculator', description: 'Create SCA-standard brewing water.' },
];

export default function ExtractionYieldCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="extraction-yield-calculator"
          title="Coffee Extraction Yield Calculator"
          description="Calculate extraction yield from TDS measurements to determine if your coffee is properly extracted."
          colorClass="bg-amber-100 text-amber-700"
          category="Coffee"
        />

        <section aria-label="Coffee Extraction Yield Calculator">
          <ExtractionYieldCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
