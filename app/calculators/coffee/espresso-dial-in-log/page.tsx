import { Metadata } from 'next';
import { EspressoDialInLog } from '@/components/calculators/coffee/espresso-dial-in-log';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Espresso Dial-in Log - Track Espresso Shots & Extraction Metrics',
  description: 'Track your espresso shots with extraction ratio, flow rate, and taste notes. Free espresso dial-in log to systematically perfect your espresso recipe.',
  keywords: ['espresso dial-in', 'espresso log', 'extraction ratio', 'espresso tracker', 'shot tracking', 'espresso recipe', 'flow rate', 'espresso metrics'],
  alternates: { canonical: '/calculators/coffee/espresso-dial-in-log' },
  openGraph: {
    title: 'Espresso Dial-in Log - Track Espresso Shots & Extraction Metrics',
    description: 'Track your espresso shots with extraction ratio, flow rate, and taste notes.',
    url: '/calculators/coffee/espresso-dial-in-log',
    siteName: 'OmniTools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Espresso Dial-in Log - Track Espresso Shots & Extraction Metrics',
    description: 'Track your espresso shots with extraction ratio, flow rate, and taste notes.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Espresso Dial-in Log',
  description: 'Track espresso shots with dose, yield, time, and taste notes to systematically dial in your espresso recipe',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const howToSteps = [
  { name: 'Pull your shot', text: 'Record the dose (coffee in), yield (espresso out), and time for each shot.' },
  { name: 'Note grinder setting', text: 'Record your grinder setting to track adjustments.' },
  { name: 'Add taste notes', text: 'Describe the flavor - sour, bitter, balanced, sweet, etc.' },
  { name: 'Review metrics', text: 'Analyze extraction ratio (yield/dose) and flow rate (yield/time).' },
  { name: 'Adjust and repeat', text: 'Follow recommendations to dial in your perfect recipe.' },
];

const faqs = [
  { question: 'What is espresso dial-in?', answer: 'Espresso dial-in is the process of systematically adjusting espresso parameters (dose, grind size, yield, and time) to achieve optimal extraction. By tracking shots and analyzing metrics, you can make data-driven adjustments.' },
  { question: 'What is a good extraction ratio for espresso?', answer: 'A good extraction ratio is typically between 1.5 and 2.5. For example, an 18g dose should yield 27-45g of espresso. Ratios below 1.5 are under-extracted (sour), while ratios above 2.5 are over-extracted (bitter).' },
  { question: 'How do I calculate espresso extraction ratio?', answer: 'Espresso extraction ratio is calculated by dividing the beverage yield by the coffee dose. For example, 36g yield ÷ 18g dose = 2.0 ratio.' },
  { question: 'What is espresso flow rate and why does it matter?', answer: 'Flow rate is the speed at which espresso flows, measured in grams per second (g/s). It is calculated by dividing yield by extraction time. Typical flow rates range from 1.0 to 2.0 g/s.' },
  { question: 'How do I use an espresso dial-in log?', answer: 'Record dose, yield, and time for each shot. Note your grinder setting and taste notes. Review metrics and follow recommendations to adjust your recipe systematically.' },
];

const relatedTools = [
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Extraction Yield Calculator', description: 'Calculate extraction from TDS measurements.' },
  { href: '/calculators/coffee/grind-size-converter', title: 'Grind Size Converter', description: 'Convert grind settings between grinders.' },
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Brew Ratio Calculator', description: 'Calculate water amount for your brew ratio.' },
];

export default function EspressoDialInLogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="espresso-dial-in-log"
          title="Espresso Dial-in Log"
          description="Track your espresso shots with extraction ratio, flow rate, and taste notes to perfect your recipe."
          colorClass="bg-amber-100 text-amber-700"
        />

        <section aria-label="Espresso Dial-in Log">
          <EspressoDialInLog />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
