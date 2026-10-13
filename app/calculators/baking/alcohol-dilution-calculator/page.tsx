import { Metadata } from 'next';
import { AlcoholDilutionCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Alkohol: fortynning – gratis kalkulator på nett',
  description: 'Regn ut hvor mye vann du må tilsette for å nå ønsket alkoholprosent. Gratis og uten registrering.',
  keywords: ['fortynning', 'alkoholprosent', 'vol%', 'sprit', 'vann å tilsette'],
  alternates: { canonical: '/calculators/baking/alcohol-dilution-calculator' },
  openGraph: {
    title: 'Alkohol: fortynning',
    description: 'Regn ut hvor mye vann du må tilsette for å nå ønsket alkoholprosent',
    url: '/calculators/baking/alcohol-dilution-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Alkohol: fortynning',
  description: 'Regn ut hvor mye vann du må tilsette for å nå ønsket alkoholprosent',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi mengde og styrke', text: 'Skriv inn volum i ml og nåværende alkoholstyrke.' },
  { name: 'Velg ønsket styrke', text: 'Oppgi prosenten du vil ende på.' },
  { name: 'Les resultatet', text: 'Se hvor mye vann du må tilsette og total mengde etterpå.' },
];

const faqs = [
  { question: 'Hvordan regnes fortynningen ut?', answer: 'Mengden ren alkohol er den samme før og etter. Total mengde blir volum × start-styrke ÷ ønsket styrke.' },
  { question: 'Kan jeg bruke vanlig kranvann?', answer: 'Ja, men destillert eller kokt og avkjølt vann gir et klarere resultat.' },
  { question: 'Er det lov å lage egen sprit?', answer: 'Nei. Destillering uten tillatelse er ulovlig i Norge. Kalkulatoren er til fortynning av lovlig kjøpt alkohol.' },
];

const relatedTools = [
  { href: '/calculators/baking/brine-calculator', title: 'Lakeberegner', description: 'Regn ut riktig forhold mellom salt og vann i lake til kjøtt og fisk' },
  { href: '/calculators/baking/unit-cost-per-serving', title: 'Kostnad per porsjon', description: 'Regn ut hva en porsjon koster ut fra råvarepriser og antall porsjoner' },
];

export default function AlcoholDilutionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="alcohol-dilution-calculator"
          title="Alkohol: fortynning"
          description="Regn ut hvor mye vann du må tilsette for å nå ønsket alkoholprosent. Gratis og uten registrering."
        />

        <section aria-label="Alkohol: fortynning">
          <AlcoholDilutionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
