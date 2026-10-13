import { Metadata } from 'next';
import { TimezoneConverter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidssoneomregner – gratis kalkulator på nett',
  description: 'Regn om klokkeslett mellom tidssoner. Gratis og uten registrering.',
  keywords: ['tidssone', 'verdensklokke', 'klokkeslett', 'tidsforskjell'],
  alternates: { canonical: '/calculators/productivity/timezone-converter' },
  openGraph: {
    title: 'Tidssoneomregner',
    description: 'Regn om klokkeslett mellom tidssoner',
    url: '/calculators/productivity/timezone-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidssoneomregner',
  description: 'Regn om klokkeslett mellom tidssoner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg dato og klokkeslett', text: 'Skriv inn tidspunktet, eller trykk på «Nå».' },
  { name: 'Velg fra- og til-sone', text: 'Velg sonene du regner mellom. Bruk ⇄ for å bytte.' },
  { name: 'Regn om', text: 'Trykk på «Regn om» og se klokkeslett og tidsforskjell.' },
];

const faqs = [
  { question: 'Hvilken tidssone har Norge?', answer: 'Norge bruker mellomeuropeisk tid (CET, UTC+1) om vinteren og sommertid (CEST, UTC+2) fra siste søndag i mars til siste søndag i oktober.' },
  { question: 'Hvilken tidssone gjelder klokkeslettet jeg skriver inn?', answer: 'Klokkeslettet gjelder i sonen du har valgt under «Fra», ikke nødvendigvis der du er.' },
  { question: 'Hvorfor varierer tidsforskjellen til USA?', answer: 'USA bytter til sommertid på andre datoer enn Europa, så forskjellen endres noen uker i mars og oktober/november.' },
  { question: 'Hva er forskjellen på UTC og GMT?', answer: 'De er nesten like for praktisk bruk. UTC er det offisielle standardsystemet.' },
];

const relatedTools = [
  { href: '/calculators/productivity/timestamp-converter', title: 'Tidsstempel-omregner', description: 'Gjør om Unix-tidsstempler til lesbare datoer' },
];

export default function TimezoneConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timezone-converter"
          title="Tidssoneomregner"
          description="Regn om klokkeslett mellom tidssoner, med riktig sommertid. Oslo er valgt som standard. Gratis og uten registrering."
        />

        <section aria-label="Tidssoneomregner">
          <TimezoneConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
