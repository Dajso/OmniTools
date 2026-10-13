import { Metadata } from 'next';
import { ImageResolutionCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Bildeoppløsning – gratis kalkulator på nett',
  description: 'Regn ut DPI/PPI for bilder og trykk. Gratis og uten registrering.',
  keywords: ['DPI', 'PPI', 'bildeoppløsning', 'utskriftsstørrelse', 'trykk'],
  alternates: { canonical: '/calculators/productivity/image-resolution-calculator' },
  openGraph: {
    title: 'Bildeoppløsning',
    description: 'Regn ut DPI/PPI for bilder og trykk',
    url: '/calculators/productivity/image-resolution-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bildeoppløsning',
  description: 'Regn ut DPI/PPI for bilder og trykk',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil regne ut', text: 'Trykkstørrelse, antall piksler eller DPI.' },
  { name: 'Fyll inn tallene', text: 'Oppgi piksler, cm og DPI etter valget.' },
  { name: 'Les av resultatet', text: 'Du får størrelse i cm og tommer, megapiksler og anslått kvalitet.' },
];

const faqs = [
  { question: 'Hvilken DPI trengs for trykk?', answer: '300 DPI er standard for profesjonelt trykk. 150–200 DPI kan holde for plakater som sees på avstand.' },
  { question: 'Hva er forskjellen på DPI og PPI?', answer: 'PPI er piksler per tomme på skjermen, DPI er prikker per tomme i trykk. I praksis brukes de om hverandre.' },
  { question: 'Hvor stort kan jeg skrive ut et bilde?', answer: 'Del antall piksler på DPI og gang med 2,54 for å få cm. Kalkulatoren gjør dette for deg.' },
  { question: 'Hvor nøyaktig er filstørrelsen?', answer: 'Den er et grovt anslag. Faktisk størrelse avhenger av innhold og komprimering.' },
];

const relatedTools = [
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Sideforhold', description: 'Regn ut og omregn sideforhold for bilder og skjermer' },
];

export default function ImageResolutionCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="image-resolution-calculator"
          title="Bildeoppløsning"
          description="Regn ut DPI, trykkstørrelse i cm og antall piksler for bilder, med anslått filstørrelse. Gratis og uten registrering."
        />

        <section aria-label="Bildeoppløsning">
          <ImageResolutionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
