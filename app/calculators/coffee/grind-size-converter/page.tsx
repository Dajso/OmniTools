import { Metadata } from 'next';
import { GrindSizeConverter } from '@/components/calculators/coffee/grind-size-converter';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kvernstørrelse – gratis kalkulator på nett',
  description: 'Regn om kverninnstillinger mellom ulike kaffekverner. Gratis og uten registrering.',
  keywords: ['kvern', 'kverninnstilling', 'kaffekvern', 'comandante', 'baratza'],
  alternates: { canonical: '/calculators/coffee/grind-size-converter' },
  openGraph: {
    title: 'Kvernstørrelse',
    description: 'Regn om kverninnstillinger mellom ulike kaffekverner',
    url: '/calculators/coffee/grind-size-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kvernstørrelse',
  description: 'Regn om kverninnstillinger mellom ulike kaffekverner',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg kvernen din', text: 'Velg kvernen du regner fra, og oppgi stillingen.' },
  { name: 'Velg ny kvern', text: 'Velg kvernen du vil regne til.' },
  { name: 'Les resultatet', text: 'Se anbefalt stilling og hvor sikker omregningen er.' },
];

const faqs = [
  { question: 'Hvor nøyaktig er omregningen?', answer: 'Den er omtrentlig. Bruk resultatet som utgangspunkt og juster etter smak.' },
  { question: 'Hvorfor er kvernene så forskjellige?', answer: 'Kvernsteinenes form, størrelse og skalaen på innstillingen varierer mellom modellene.' },
  { question: 'Hva betyr sikkerhet?', answer: 'Hvor godt de to kvernene lar seg sammenligne. Lav sikkerhet betyr at du bør justere ekstra mye selv.' },
  { question: 'Hvilken kvernstørrelse bruker jeg til hva?', answer: 'Fin til espresso, middels til traktekaffe og pour over, grov til presskanne og cold brew.' },
];

const relatedTools = [
  { href: '/calculators/coffee/brew-ratio-calculator', title: 'Bryggeforhold', description: 'Regn ut vannmengde for ønsket bryggeforhold og jevn kaffestyrke' },
  { href: '/calculators/coffee/espresso-dial-in-log', title: 'Espresso: innstillingslogg', description: 'Logg dose, utbytte, tid og smak for å finne den beste espressoen' },
  { href: '/calculators/coffee/extraction-yield-calculator', title: 'Ekstraksjonsgrad for kaffe', description: 'Regn ut ekstraksjonsgrad fra TDS og se om kaffen er riktig trukket' },
];

export default function GrindSizeConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="grind-size-converter"
          title="Kvernstørrelse"
          description="Regn om kvernstilling mellom ulike håndkverner og elektriske kverner, så du kan gjenskape oppskrifter. Gratis og uten registrering."
        />

        <section aria-label="Kvernstørrelse">
          <GrindSizeConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
