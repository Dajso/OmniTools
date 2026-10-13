import { Metadata } from 'next';
import { CakePanConverterCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kakeform: omregner – gratis kalkulator på nett',
  description: 'Regn om oppskrifter mellom ulike former og størrelser, for eksempel springform i cm. Gratis og uten registrering.',
  keywords: ['kakeform', 'springform', 'formstørrelse', 'skalere oppskrift'],
  alternates: { canonical: '/calculators/baking/cake-pan-converter' },
  openGraph: {
    title: 'Kakeform: omregner',
    description: 'Regn om oppskrifter mellom ulike former og størrelser, for eksempel springform i cm',
    url: '/calculators/baking/cake-pan-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kakeform: omregner',
  description: 'Regn om oppskrifter mellom ulike former og størrelser, for eksempel springform i cm',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg original form', text: 'Oppgi form og mål i centimeter.' },
  { name: 'Velg ny form', text: 'Velg formen du vil bake i.' },
  { name: 'Les omregningen', text: 'Se hvor mye du må multiplisere ingrediensene med.' },
];

const faqs = [
  { question: 'Hvordan regnes mengden om?', answer: 'Kalkulatoren sammenligner arealet av de to formene og gir en faktor å gange alle ingredienser med.' },
  { question: 'Må steketiden endres?', answer: 'Ja. En større og grunnere kake blir ferdig raskere, en mindre og dypere kake trenger lenger tid. Sjekk med en tannpirker.' },
  { question: 'Hva er en vanlig springform?', answer: '24 cm er vanlig i Norge, men også 20, 22 og 26 cm brukes mye.' },
];

const relatedTools = [
  { href: '/calculators/baking/bakers-percentage-calculator', title: 'Bakerprosent', description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde' },
  { href: '/calculators/baking/egg-size-converter', title: 'Eggstørrelse', description: 'Regn om mellom eggstørrelser (S, M, L, XL) i oppskrifter' },
];

export default function CakePanConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cake-pan-converter"
          title="Kakeform: omregner"
          description="Regn om oppskriften mellom ulike kakeformer og størrelser, for eksempel springform i cm. Gratis og uten registrering."
        />

        <section aria-label="Kakeform: omregner">
          <CakePanConverterCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
