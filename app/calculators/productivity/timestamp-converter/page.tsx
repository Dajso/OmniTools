import { Metadata } from 'next';
import { TimestampConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidsstempel-omregner – gratis kalkulator på nett',
  description: 'Gjør om Unix-tidsstempler til lesbare datoer. Gratis og uten registrering.',
  keywords: ['tidsstempel', 'Unix-tid', 'epoch', 'datoomregner'],
  alternates: { canonical: '/calculators/productivity/timestamp-converter' },
  openGraph: {
    title: 'Tidsstempel-omregner',
    description: 'Gjør om Unix-tidsstempler til lesbare datoer',
    url: '/calculators/productivity/timestamp-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidsstempel-omregner',
  description: 'Gjør om Unix-tidsstempler til lesbare datoer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Unix til dato, eller dato til Unix.' },
  { name: 'Skriv inn verdien', text: 'Skriv inn tidsstemplet eller datoen, eller trykk på «Nå».' },
  { name: 'Les av resultatet', text: 'Du får sekunder, millisekunder, ISO 8601, UTC og lokal tid.' },
];

const faqs = [
  { question: 'Hva er et Unix-tidsstempel?', answer: 'Antall sekunder siden 1. januar 1970 klokken 00:00 UTC.' },
  { question: 'Sekunder eller millisekunder?', answer: 'Ti sifre er vanligvis sekunder og tretten sifre millisekunder. Kalkulatoren gjenkjenner begge.' },
  { question: 'Hvilken tidssone vises?', answer: 'Lokal tid er nettleserens tidssone, for deg normalt norsk tid. UTC er verdenstid.' },
  { question: 'Hva er Y2038-problemet?', answer: 'Eldre systemer lagrer tid som 32-bits tall som går tom i januar 2038. Moderne systemer bruker 64 bit.' },
];

const relatedTools = [
  { href: '/calculators/productivity/date-difference', title: 'Dager mellom to datoer', description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder' },
  { href: '/calculators/productivity/timezone-converter', title: 'Tidssoneomregner', description: 'Regn om klokkeslett mellom tidssoner' },
];

export default function TimestampConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timestamp-converter"
          title="Tidsstempel-omregner"
          description="Gjør om Unix-tidsstempler til lesbare datoer og tilbake, med tidsforskjell fra nå. Gratis og uten registrering."
        />

        <section aria-label="Tidsstempel-omregner">
          <TimestampConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
