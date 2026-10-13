import { Metadata } from 'next';
import { DCPowerCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ampere og watt (DC) – gratis kalkulator på nett',
  description: 'Regn om mellom ampere, watt og volt for likestrøm. Gratis og uten registrering.',
  keywords: ['ampere til watt', 'watt til ampere', 'DC', 'spenning', 'effekt'],
  alternates: { canonical: '/calculators/solar/dc-power-calculator' },
  openGraph: {
    title: 'Ampere og watt (DC)',
    description: 'Regn om mellom ampere, watt og volt for likestrøm',
    url: '/calculators/solar/dc-power-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ampere og watt (DC)',
  description: 'Regn om mellom ampere, watt og volt for likestrøm',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil regne ut', text: 'Velg watt, ampere eller volt.' },
  { name: 'Fyll inn de to andre verdiene', text: 'Fyll ut feltene som vises.' },
  { name: 'Les av svaret', text: 'Resultatet vises med alle tre verdiene.' },
];

const faqs = [
  { question: 'Hva er formelen for effekt?', answer: 'Effekt (W) = spenning (V) × strøm (A).' },
  { question: 'Hvor mange ampere gir et solcellepanel på 100 W?', answer: 'Ved 12 V ca. 8,3 A (100 ÷ 12) og ved 24 V ca. 4,2 A. Faktisk strøm varierer med lys og temperatur.' },
  { question: 'Hvorfor er spenning viktig?', answer: 'Høyere spenning gir lavere strøm for samme effekt, og dermed tynnere kabler og mindre tap.' },
  { question: 'Gjelder dette også vekselstrøm?', answer: 'Nei, for vekselstrøm (230 V) må effektfaktor tas med i beregningen.' },
];

const relatedTools = [
  { href: '/calculators/solar/dc-wire-gauge-calculator', title: 'Kabeltverrsnitt (DC)', description: 'Regn ut riktig kabeltverrsnitt i mm² for likestrøm' },
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
  { href: '/calculators/solar/inverter-size-calculator', title: 'Vekselretter', description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm' },
];

export default function DCPowerCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dc-power-calculator"
          title="Ampere og watt (DC)"
          description="Regn mellom watt, ampere og volt for likestrøm (DC) med formelen P = U × I. Passer til solceller, båt og bobil. Gratis og uten registrering."
        />

        <section aria-label="Ampere og watt (DC)">
          <DCPowerCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
