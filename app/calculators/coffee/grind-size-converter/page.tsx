import { Metadata } from 'next';
import { GrindSizeConverter } from '@/components/calculators/coffee/grind-size-converter';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Grind Size Converter - Convert Coffee Grinder Settings',
  description: 'Convert grind settings between different coffee grinder models. Free grind size converter for Comandante, Baratza, Timemore, and 15+ popular grinders.',
  keywords: ['grind size converter', 'coffee grinder settings', 'grinder conversion', 'comandante settings', 'baratza settings', 'timemore settings', 'grind size chart'],
  alternates: { canonical: '/calculators/coffee/grind-size-converter' },
  openGraph: {
    title: 'Grind Size Converter - Convert Coffee Grinder Settings',
    description: 'Convert grind settings between different coffee grinder models.',
    url: '/calculators/coffee/grind-size-converter',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grind Size Converter - Convert Coffee Grinder Settings',
    description: 'Convert grind settings between different coffee grinder models.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Grind Size Converter',
  description: 'Convert grind settings between different coffee grinder models to replicate recipes',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Select source grinder', text: 'Choose the grinder you currently have or are converting from.' },
  { name: 'Enter your setting', text: 'Input your current grind setting for that grinder.' },
  { name: 'Select target grinder', text: 'Choose the grinder you want to convert the setting to.' },
  { name: 'View converted setting', text: 'See the equivalent setting and grind size description.' },
  { name: 'Fine-tune as needed', text: 'Use the result as a starting point and adjust to taste.' },
];

const faqs = [
  { question: 'How do I convert grind settings between different grinders?', answer: 'Select your current grinder and setting, then select the target grinder. The converter normalizes your setting to a universal scale and converts it to the equivalent setting on the target grinder.' },
  { question: 'Why are grinder conversions approximate?', answer: 'Different grinders have unique burr geometries, materials, and calibrations. Even identical models can vary due to burr wear. Always use conversions as a starting point and adjust to taste.' },
  { question: 'What grinders are supported by this converter?', answer: 'The converter supports 18+ popular grinders including Comandante C40, Timemore C2/C3, Baratza Encore/Virtuoso/Vario/Sette, Hario, Porlex, Fellow Ode, Niche Zero, and more.' },
  { question: 'What is the difference between grind size categories?', answer: 'Grind sizes range from extra-fine (Turkish) to extra-coarse (cold brew). Fine for espresso, medium-fine for pour over, medium for drip, coarse for French press.' },
  { question: 'How accurate is the grind size converter?', answer: 'Accuracy varies by grinder type. The confidence indicator shows reliability. Always start with the suggested setting and adjust based on taste and extraction results.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
  { href: '/calculators/coffee/espresso-dial-in-log', title: 'Espresso Dial-in Log', description: 'Track and optimize your espresso shots.' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
];

export default function GrindSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="grind-size-converter"
          title="Grind Size Converter"
          description="Convert grind settings between different coffee grinder models."
          colorClass="bg-amber-100 text-amber-700"
        />

        <section aria-label="Grind Size Converter">
          <GrindSizeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
