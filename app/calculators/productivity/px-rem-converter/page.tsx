import { Metadata } from 'next';
import { PxRemConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Px til rem – gratis kalkulator på nett',
  description: 'Regn om mellom piksler og rem i responsiv CSS. Gratis og uten registrering.',
  keywords: ['px til rem', 'rem til px', 'CSS', 'responsivt design', 'skriftstørrelse'],
  alternates: { canonical: '/calculators/productivity/px-rem-converter' },
  openGraph: {
    title: 'Px til rem',
    description: 'Regn om mellom piksler og rem i responsiv CSS',
    url: '/calculators/productivity/px-rem-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Px til rem',
  description: 'Regn om mellom piksler og rem i responsiv CSS',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Piksler til rem, eller rem til piksler.' },
  { name: 'Velg basisstørrelse', text: 'Nettleserens standard er 16 px.' },
  { name: 'Skriv inn verdien', text: 'Resultatet vises med en gang, sammen med em.' },
  { name: 'Bruk tabellen', text: 'Tabellen viser vanlige verdier.' },
];

const faqs = [
  { question: 'Hva er rem?', answer: 'En enhet relativ til skriftstørrelsen på rotelementet (html). 1 rem er normalt 16 px.' },
  { question: 'Hvorfor bruke rem i stedet for px?', answer: 'Rem følger brukerens skriftinnstillinger, som er viktig for universell utforming.' },
  { question: 'Hva er forskjellen på rem og em?', answer: 'Rem er relativ til rotelementet, em er relativ til nærmeste foreldreelement.' },
  { question: 'Kan jeg endre basisstørrelsen?', answer: 'Ja, hvis nettstedet ditt setter en annen skriftstørrelse på html.' },
];

const relatedTools = [
  { href: '/calculators/productivity/hex-to-rgb', title: 'HEX til RGB', description: 'Gjør om HEX-fargekoder til RGB-verdier' },
  { href: '/calculators/productivity/json-formatter', title: 'JSON-formaterer og validator', description: 'Formater og valider JSON-data' },
];

export default function PxRemConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="px-rem-converter"
          title="Px til rem"
          description="Regn om mellom piksler (px) og rem for responsiv CSS, med tabell og valgfri basisstørrelse. Gratis og uten registrering."
        />

        <section aria-label="Px til rem">
          <PxRemConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
