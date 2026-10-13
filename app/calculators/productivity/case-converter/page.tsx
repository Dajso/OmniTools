import { Metadata } from 'next';
import { CaseConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Store og små bokstaver – gratis kalkulator på nett',
  description: 'Gjør om tekst til store bokstaver, små bokstaver, tittelformat og setningsformat. Gratis og uten registrering.',
  keywords: ['store bokstaver', 'små bokstaver', 'tittelformat', 'tekstkonvertering'],
  alternates: { canonical: '/calculators/productivity/case-converter' },
  openGraph: {
    title: 'Store og små bokstaver',
    description: 'Gjør om tekst til store bokstaver, små bokstaver, tittelformat og setningsformat',
    url: '/calculators/productivity/case-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Store og små bokstaver',
  description: 'Gjør om tekst til store bokstaver, små bokstaver, tittelformat og setningsformat',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn teksten', text: 'Skriv eller lim inn teksten du vil endre.' },
  { name: 'Velg skrivemåte', text: 'Velg for eksempel store bokstaver, setningsformat eller camelCase.' },
  { name: 'Kopier resultatet', text: 'Trykk på «Kopier».' },
];

const faqs = [
  { question: 'Hva er setningsformat?', answer: 'Bare første bokstav i hver setning er stor. Det er vanlig skrivemåte for titler og overskrifter på norsk.' },
  { question: 'Hva er camelCase og snake_case?', answer: 'Skrivemåter brukt i programmering. I camelCase begynner hvert ord med stor bokstav bortsett fra det første, mens snake_case bruker understrek mellom ordene.' },
  { question: 'Fungerer det med æ, ø og å?', answer: 'Ja, bokstavene gjøres riktig om mellom store og små.' },
  { question: 'Endres selve teksten?', answer: 'Nei, bare skrivemåten. Ingenting sendes til noen server.' },
];

const relatedTools = [
  { href: '/calculators/productivity/word-counter', title: 'Ordteller', description: 'Tell ord, tegn og setninger i en tekst' },
  { href: '/calculators/productivity/character-counter', title: 'Tegnteller', description: 'Tell tegn med eller uten mellomrom' },
];

export default function CaseConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="case-converter"
          title="Store og små bokstaver"
          description="Gjør om tekst til STORE BOKSTAVER, små bokstaver, setningsformat, camelCase, snake_case og flere. Støtter æ, ø og å. Gratis og uten registrering."
        />

        <section aria-label="Store og små bokstaver">
          <CaseConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
