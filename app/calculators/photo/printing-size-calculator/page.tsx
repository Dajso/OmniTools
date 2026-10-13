import { Metadata } from 'next';
import { PrintingSizeCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Utskriftsstørrelse – gratis kalkulator på nett',
  description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI. Gratis og uten registrering.',
  keywords: ['utskriftsstørrelse', 'dpi', 'fotoutskrift', 'megapiksler'],
  alternates: { canonical: '/calculators/photo/printing-size-calculator' },
  openGraph: {
    title: 'Utskriftsstørrelse',
    description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI',
    url: '/calculators/photo/printing-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Utskriftsstørrelse',
  description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg modus', text: 'Fra bildestørrelse, eller fra ønsket utskriftsstørrelse.' },
  { name: 'Oppgi mål', text: 'Piksler for bildet, eller cm for utskriften.' },
  { name: 'Velg DPI', text: '300 DPI for nærbetraktning, 150 for plakater som ses på avstand.' },
  { name: 'Les av resultatet', text: 'Du får størrelse i cm og tommer, eller nødvendig antall piksler.' },
];

const faqs = [
  { question: 'Hva er DPI?', answer: 'Punkter per tomme (2,54 cm). Høyere DPI gir finere utskrift, men mindre maksimal størrelse.' },
  { question: 'Hvilken DPI bør jeg bruke?', answer: '300 DPI for bilder som ses på nært hold og 150–200 for plakater på avstand.' },
  { question: 'Hvor stor er A4?', answer: '21 × 29,7 cm. A3 er 29,7 × 42 cm, og A2 er 42 × 59,4 cm.' },
  { question: 'Kan jeg skrive ut større enn oppløsningen tillater?', answer: 'Ja, men skarpheten blir lavere. Lav DPI passer best til store plakater.' },
];

const relatedTools = [
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Sideforhold', description: 'Regn ut og omregn sideforhold for bilder og skjermer' },
  { href: '/calculators/photo/golden-ratio-overlay', title: 'Gylne snitt-overlegg', description: 'Lag gylne snitt-hjelpelinjer for bildekomposisjon' },
  { href: '/calculators/photo/focal-length-calculator', title: 'Brennvidde og crop-faktor', description: 'Regn ut tilsvarende brennvidde med crop-faktor' },
];

export default function PrintingSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="printing-size-calculator"
          title="Utskriftsstørrelse"
          description="Regn ut største utskriftsstørrelse ut fra bildets oppløsning, eller hvor mange piksler du trenger til A4, A3, 50×70 cm og andre størrelser. Gratis og uten registrering."
        />

        <section aria-label="Utskriftsstørrelse">
          <PrintingSizeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
