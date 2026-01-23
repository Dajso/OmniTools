import { Metadata } from 'next';
import { WaterRecipeCalculator } from '@/components/calculators/coffee/water-recipe-calculator';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Water Recipe Calculator - Coffee Brewing Water Chemistry Calculator',
  description: 'Calculate mineral additions to create SCA-standard brewing water for optimal coffee extraction. Free water recipe calculator with Epsom salt and baking soda amounts.',
  keywords: ['water recipe calculator', 'coffee water chemistry', 'brewing water', 'SCA water standards', 'Epsom salt', 'baking soda', 'water hardness', 'water alkalinity'],
  alternates: { canonical: '/calculators/coffee/water-recipe-calculator' },
  openGraph: {
    title: 'Water Recipe Calculator - Coffee Brewing Water Chemistry Calculator',
    description: 'Calculate mineral additions to create SCA-standard brewing water for optimal coffee extraction.',
    url: '/calculators/coffee/water-recipe-calculator',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Water Recipe Calculator - Coffee Brewing Water Chemistry Calculator',
    description: 'Calculate mineral additions to create SCA-standard brewing water.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Water Recipe Calculator',
  description: 'Calculate mineral additions to create SCA-standard brewing water for optimal coffee extraction',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Enter water volume', text: 'Specify the amount of distilled or RO water you want to prepare in liters.' },
  { name: 'Set target hardness', text: 'Enter desired hardness in ppm (SCA recommends 50-175 ppm).' },
  { name: 'Set target alkalinity', text: 'Enter desired alkalinity in ppm (SCA recommends 40-70 ppm).' },
  { name: 'Measure minerals', text: 'Measure the calculated amounts of Epsom salt and baking soda.' },
  { name: 'Mix thoroughly', text: 'Add minerals to water, stir vigorously until dissolved, and let rest 10-15 minutes.' },
];

const faqs = [
  { question: 'Why does water chemistry matter for coffee?', answer: 'Water chemistry significantly affects coffee extraction and flavor. Hardness enhances extraction and body, while alkalinity buffers acidity. SCA standards (50-175 ppm hardness, 40-70 ppm alkalinity) ensure balanced extraction.' },
  { question: 'What are SCA water standards for coffee brewing?', answer: 'The Specialty Coffee Association recommends water with 50-175 ppm hardness and 40-70 ppm alkalinity. Water outside these ranges can result in flat, sour, bitter, or chalky coffee.' },
  { question: 'How do I make brewing water with Epsom salt and baking soda?', answer: 'Start with distilled or RO water. Add Epsom salt (MgSO4·7H2O) for hardness and baking soda (NaHCO3) for alkalinity. Stir until dissolved and let rest before using.' },
  { question: 'What does hardness do in coffee brewing water?', answer: 'Hardness, primarily from magnesium in Epsom salt, enhances extraction and contributes to body and mouthfeel. Too little causes flat coffee, too much causes bitterness and scaling.' },
  { question: 'What does alkalinity do in coffee brewing water?', answer: 'Alkalinity from bicarbonate in baking soda buffers acidity and prevents sour flavors. Too little causes excessively acidic coffee, too much causes flat, chalky flavors.' },
];

const relatedTools = [
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
  { href: '/calculators/coffee/pour-over-timer', title: 'Pour Over Timer', description: 'Multi-stage timer for pour over brewing.' },
];

export default function WaterRecipeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="water-recipe-calculator"
          title="Water Recipe Calculator"
          description="Calculate mineral additions to create SCA-standard brewing water for optimal coffee extraction."
          colorClass="bg-amber-100 text-amber-700"
          category="Coffee"
        />

        <section aria-label="Water Recipe Calculator">
          <WaterRecipeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
