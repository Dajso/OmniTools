import { Metadata } from 'next';
import { UUIDGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'UUID-generator – gratis kalkulator på nett',
  description: 'Lag unike UUID-er (v4). Gratis og uten registrering.',
  keywords: ['UUID', 'GUID', 'unik ID', 'tilfeldig UUID'],
  alternates: { canonical: '/calculators/productivity/uuid-generator' },
  openGraph: {
    title: 'UUID-generator',
    description: 'Lag unike UUID-er (v4)',
    url: '/calculators/productivity/uuid-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UUID-generator',
  description: 'Lag unike UUID-er (v4)',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg antall', text: 'Skriv inn hvor mange UUID-er du trenger.' },
  { name: 'Velg versjon og format', text: 'Velg tilfeldig versjon, store bokstaver og om bindestreker skal være med.' },
  { name: 'Lag UUID-er', text: 'Trykk på knappen og kopier én eller alle.' },
];

const faqs = [
  { question: 'Hva er en UUID?', answer: 'En 128-bits identifikator, ofte skrevet som 32 sifre i fem grupper, som brukes til å gi unike navn til data i databaser og systemer.' },
  { question: 'Kan to UUID-er bli like?', answer: 'I praksis ikke. Sannsynligheten for at to tilfeldige UUID-er v4 er like er så liten at den kan ses bort fra.' },
  { question: 'Hva er forskjellen på versjonene?', answer: 'Versjon 4 er helt tilfeldig. Tidsbaserte versjoner bygger på klokkeslett og kan avsløre når de ble laget.' },
  { question: 'Er de trygge som passord?', answer: 'Nei. UUID-er er laget for å være unike, ikke hemmelige.' },
];

const relatedTools = [
  { href: '/calculators/productivity/password-generator', title: 'Passordgenerator', description: 'Lag sterke passord med styrkeindikator' },
  { href: '/calculators/productivity/random-number-generator', title: 'Tilfeldig tallgenerator', description: 'Trekk tilfeldige tall innenfor et intervall' },
];

export default function UUIDGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="uuid-generator"
          title="UUID-generator"
          description="Lag unike identifikatorer (UUID) i versjon 4, i store eller små bokstaver, med eller uten bindestreker. Gratis og uten registrering."
        />

        <section aria-label="UUID-generator">
          <UUIDGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
