import { Metadata } from 'next';
import { NumberBaseConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tallsystem-omregner – gratis kalkulator på nett',
  description: 'Regn om mellom binære, oktale, desimale og heksadesimale tall. Gratis og uten registrering.',
  keywords: ['tallsystem', 'binær til desimal', 'hex til desimal', 'oktal', 'heksadesimal'],
  alternates: { canonical: '/calculators/productivity/number-base-converter' },
  openGraph: {
    title: 'Tallsystem-omregner',
    description: 'Regn om mellom binære, oktale, desimale og heksadesimale tall',
    url: '/calculators/productivity/number-base-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tallsystem-omregner',
  description: 'Regn om mellom binære, oktale, desimale og heksadesimale tall',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg tallsystem', text: 'Velg om tallet du skriver inn er binært, oktalt, desimalt eller heksadesimalt.' },
  { name: 'Skriv inn tallet', text: 'Skriv for eksempel 255, 11111111 eller FF. Prefikser som 0x og 0b godtas.' },
  { name: 'Les av resultatet', text: 'Du ser tallet i alle fire tallsystemene og kan kopiere hvert av dem.' },
];

const faqs = [
  { question: 'Hva er binære tall?', answer: 'Tall som bare bruker sifrene 0 og 1. Datamaskiner lagrer all informasjon på denne måten.' },
  { question: 'Hva er heksadesimale tall?', answer: 'Tall med 16 sifre: 0–9 og A–F. De brukes blant annet i fargekoder, minneadresser og MAC-adresser. Desimal 255 er FF.' },
  { question: 'Hva er oktale tall?', answer: 'Tall med sifrene 0–7. De brukes blant annet i filrettigheter på Linux, for eksempel chmod 755.' },
  { question: 'Hvor store tall kan jeg bruke?', answer: 'Omregneren bruker heltall med vilkårlig størrelse, så også svært store tall regnes riktig. Desimaltall støttes ikke.' },
  { question: 'Kan jeg bruke negative tall?', answer: 'Ja, skriv minustegn foran. Resultatet vises med minustegn og ikke som toerkomplement.' },
];

const relatedTools = [
  { href: '/calculators/productivity/text-to-binary', title: 'Tekst til binær', description: 'Gjør om tekst til binærkode og tilbake' },
  { href: '/calculators/productivity/hex-to-rgb', title: 'HEX til RGB', description: 'Gjør om HEX-fargekoder til RGB-verdier' },
];

export default function NumberBaseConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="number-base-converter"
          title="Tallsystem-omregner"
          description="Regn om mellom binære, oktale, desimale og heksadesimale tall. Gratis og uten registrering."
        />

        <section aria-label="Tallsystem-omregner">
          <NumberBaseConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
