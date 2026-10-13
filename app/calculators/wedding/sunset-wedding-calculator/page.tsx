import { Metadata } from 'next';
import { SunsetTimeCalculator } from '@/components/calculators/wedding';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Solnedgang til bryllupet – gratis kalkulator på nett',
  description: 'Slå opp omtrentlig solnedgang og gylden time for dato og sted. Gratis og uten registrering.',
  keywords: ['solnedgang', 'gylden time', 'bryllup', 'seremoni', 'tidspunkt'],
  alternates: { canonical: '/calculators/wedding/sunset-wedding-calculator' },
  openGraph: {
    title: 'Solnedgang til bryllupet',
    description: 'Slå opp omtrentlig solnedgang og gylden time for dato og sted',
    url: '/calculators/wedding/sunset-wedding-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Solnedgang til bryllupet',
  description: 'Slå opp omtrentlig solnedgang og gylden time for dato og sted',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dato', text: 'Datoen for bryllupet.' },
  { name: 'Velg sted', text: 'Velg en by, eller legg inn egne koordinater.' },
  { name: 'Les av solnedgangen', text: 'Se klokkeslett for solnedgang og gylden time.' },
  { name: 'Planlegg bildene', text: 'Legg portrettbildene i den gylne timen, før solnedgangen.' },
];

const faqs = [
  { question: 'Hva er den gylde timen?', answer: 'Timen før solnedgang, når lyset er mykt og varmt og passer godt til bilder.' },
  { question: 'Er klokkeslettene nøyaktige?', answer: 'De er omtrentlige og gjelder norsk tid. Terreng og horisont kan gjøre at solen forsvinner noen minutter tidligere.' },
  { question: 'Hva er midnattssol?', answer: 'Perioder om sommeren nord for polarsirkelen da solen ikke går ned. Kalkulatoren viser da en melding i stedet for et klokkeslett.' },
  { question: 'Tar kalkulatoren hensyn til sommertid?', answer: 'Ja, den bruker norsk tid, også når sommertid gjelder.' },
];

const relatedTools = [
  { href: '/calculators/wedding/save-the-date-timeline', title: 'Tidslinje for bryllupsplanlegging', description: 'Lag en tidslinje med datoer for «lagre datoen», invitasjoner og svarfrist' },
  { href: '/calculators/wedding/tent-size-calculator', title: 'Teltstørrelse', description: 'Regn ut størrelsen på teltet til utebryllup eller arrangement' },
];

export default function SunsetWeddingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sunset-wedding-calculator"
          title="Solnedgang til bryllupet"
          description="Slå opp omtrentlig solnedgang og gylden time for bryllupsdagen din, for steder i Norge. Gratis og uten registrering."
        />

        <section aria-label="Solnedgang til bryllupet">
          <SunsetTimeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
