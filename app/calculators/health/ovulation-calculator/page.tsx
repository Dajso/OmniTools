import { Metadata } from 'next';
import { OvulationCalculator } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Eggløsningskalender – gratis kalkulator på nett',
  description: 'Beregn eggløsning og fruktbare dager. Gratis og uten registrering.',
  keywords: ['eggløsning', 'fruktbare dager', 'sykluskalender', 'menstruasjon'],
  alternates: { canonical: '/calculators/health/ovulation-calculator' },
  openGraph: {
    title: 'Eggløsningskalender',
    description: 'Beregn eggløsning og fruktbare dager',
    url: '/calculators/health/ovulation-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Eggløsningskalender',
  description: 'Beregn eggløsning og fruktbare dager',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi første dag i siste menstruasjon', text: 'Velg datoen.' },
  { name: 'Fyll inn sykluslengde', text: 'Gjennomsnittlig antall dager fra én menstruasjon til neste.' },
  { name: 'Les resultatet', text: 'Se eggløsningsdato, fruktbare dager og sykluskalender.' },
];

const faqs = [
  { question: 'Når er eggløsningen?', answer: 'Som regel ca. 14 dager før neste menstruasjon. Ved en syklus på 28 dager er det rundt dag 14.' },
  { question: 'Hvor lenge varer det fruktbare vinduet?', answer: 'Omtrent seks dager: fem dager før og dagen etter eggløsningen.' },
  { question: 'Kan jeg bruke kalkulatoren som prevensjon?', answer: 'Nei. Den er et anslag og er ikke sikker prevensjon.' },
  { question: 'Hva om syklusen min er uregelmessig?', answer: 'Da blir beregningen usikker. Snakk med lege eller jordmor hvis du ønsker hjelp til å følge syklusen.' },
];

const relatedTools = [
  { href: '/calculators/health/due-date-calculator', title: 'Termindato-kalkulator', description: 'Beregn termindato ut fra siste menstruasjon eller unnfangelse' },
];

export default function OvulationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ovulation-calculator"
          title="Eggløsningskalender"
          description="Regn ut eggløsning og fruktbart vindu ut fra sykluslengde. Gratis og uten registrering."
        />

        <section aria-label="Eggløsningskalender">
          <OvulationCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
