import { Metadata } from 'next';
import { FocalLengthCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Brennvidde og crop-faktor – gratis kalkulator på nett',
  description: 'Regn ut tilsvarende brennvidde med crop-faktor. Gratis og uten registrering.',
  keywords: ['brennvidde', 'crop-faktor', 'fullformat', 'APS-C', 'sensorstørrelse'],
  alternates: { canonical: '/calculators/photo/focal-length-calculator' },
  openGraph: {
    title: 'Brennvidde og crop-faktor',
    description: 'Regn ut tilsvarende brennvidde med crop-faktor',
    url: '/calculators/photo/focal-length-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Brennvidde og crop-faktor',
  description: 'Regn ut tilsvarende brennvidde med crop-faktor',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg kameraets sensor', text: 'For eksempel APS-C eller fullformat.' },
  { name: 'Oppgi brennvidde', text: 'I millimeter.' },
  { name: 'Velg format å sammenligne med', text: 'Se tilsvarende brennvidde.' },
  { name: 'Les av synsfeltet', text: 'Horisontalt, vertikalt og diagonalt.' },
];

const faqs = [
  { question: 'Hva er beskjæringsfaktor?', answer: 'Forholdet mellom fullformat og sensoren din. APS-C har ofte 1,5–1,6, og Micro Four Thirds har 2,0.' },
  { question: 'Endrer sensoren selve brennvidden?', answer: 'Nei, men synsfeltet blir smalere, som om du hadde en lengre brennvidde på fullformat.' },
  { question: 'Hva betyr tilsvarende 35 mm?', answer: 'Brennvidden som gir samme synsfelt på fullformat.' },
  { question: 'Påvirker det dybdeskarpheten?', answer: 'Ja, mindre sensorer gir ved samme synsfelt større dybdeskarphet.' },
];

const relatedTools = [
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Dybdeskarphet', description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand' },
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND-filter', description: 'Regn ut lukkertid ved bruk av ND-filter' },
  { href: '/calculators/photo/printing-size-calculator', title: 'Utskriftsstørrelse', description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI' },
];

export default function FocalLengthCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="focal-length-calculator"
          title="Brennvidde og crop-faktor"
          description="Regn om brennvidder mellom sensorformater og se synsfeltet. Beskjæringsfaktor for fullformat, APS-C, Micro Four Thirds og mobil. Gratis og uten registrering."
        />

        <section aria-label="Brennvidde og crop-faktor">
          <FocalLengthCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
