import { Metadata } from 'next';
import { GoldenRatioOverlay } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gylne snitt-overlegg – gratis kalkulator på nett',
  description: 'Lag gylne snitt-hjelpelinjer for bildekomposisjon. Gratis og uten registrering.',
  keywords: ['gylne snitt', 'phi-rutenett', 'gyllen spiral', 'tredjedelsregel', 'komposisjon'],
  alternates: { canonical: '/calculators/photo/golden-ratio-overlay' },
  openGraph: {
    title: 'Gylne snitt-overlegg',
    description: 'Lag gylne snitt-hjelpelinjer for bildekomposisjon',
    url: '/calculators/photo/golden-ratio-overlay',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gylne snitt-overlegg',
  description: 'Lag gylne snitt-hjelpelinjer for bildekomposisjon',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg størrelse', text: 'Oppgi bredde og høyde i piksler, eller velg et sideforhold.' },
  { name: 'Velg type overlegg', text: 'Spiral, rutenett, trekanter eller diagonaler.' },
  { name: 'Juster', text: 'Roter eller speilvend overlegget.' },
  { name: 'Bruk som hjelp', text: 'Bruk forhåndsvisningen når du komponerer eller beskjærer.' },
];

const faqs = [
  { question: 'Hva er det gylne snitt?', answer: 'Forholdet φ ≈ 1,618. Mange opplever komposisjoner basert på det som harmoniske.' },
  { question: 'Hva er forskjellen på gylden spiral og tredjedelsregelen?', answer: 'Fi-rutenettet ligger nærmere midten enn tredjedelsregelen, og spiralen leder blikket mot ett punkt.' },
  { question: 'Må jeg følge reglene?', answer: 'Nei. Regler for komposisjon er veiledning og ikke krav.' },
  { question: 'Hvordan bruker jeg overlegget?', answer: 'Se det som forhåndsvisning, og bruk samme proporsjoner når du komponerer eller beskjærer bildet.' },
];

const relatedTools = [
  { href: '/calculators/productivity/aspect-ratio-calculator', title: 'Sideforhold', description: 'Regn ut og omregn sideforhold for bilder og skjermer' },
  { href: '/calculators/photo/printing-size-calculator', title: 'Utskriftsstørrelse', description: 'Regn ut maksimal utskriftsstørrelse ut fra oppløsning og DPI' },
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Dybdeskarphet', description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand' },
];

export default function GoldenRatioOverlayPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="golden-ratio-overlay"
          title="Gylne snitt-overlegg"
          description="Lag komposisjonshjelp basert på det gylne snitt: gylden spiral, fi-rutenett, gylne trekanter og diagonalmetoden. Gratis og uten registrering."
        />

        <section aria-label="Gylne snitt-overlegg">
          <GoldenRatioOverlay />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
