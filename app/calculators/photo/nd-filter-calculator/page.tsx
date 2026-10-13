import { Metadata } from 'next';
import { NDFilterCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'ND-filter – gratis kalkulator på nett',
  description: 'Regn ut lukkertid ved bruk av ND-filter. Gratis og uten registrering.',
  keywords: ['ND-filter', 'gråfilter', 'lang eksponering', 'lukkertid'],
  alternates: { canonical: '/calculators/photo/nd-filter-calculator' },
  openGraph: {
    title: 'ND-filter',
    description: 'Regn ut lukkertid ved bruk av ND-filter',
    url: '/calculators/photo/nd-filter-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'ND-filter',
  description: 'Regn ut lukkertid ved bruk av ND-filter',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi lukkertid uten filter', text: 'Velg en vanlig lukkertid eller skriv inn selv.' },
  { name: 'Velg ND-filter', text: 'Fra ND2 til ND100000.' },
  { name: 'Les av ny lukkertid', text: 'Se også blendertrinn og filterfaktor.' },
  { name: 'Bruk tipsene', text: 'Stativ og fjernutløser gir best resultat.' },
];

const faqs = [
  { question: 'Hva betyr ND8?', answer: 'Filteret slipper gjennom en åttedel av lyset, altså tre blendertrinn.' },
  { question: 'Hvordan regnes ny lukkertid ut?', answer: 'Lukkertid × filterfaktor. Hvert blendertrinn dobler tiden.' },
  { question: 'Hvilket filter gir silkemykt vann?', answer: 'Ofte ND64 til ND1000, avhengig av lyset og ønsket effekt.' },
  { question: 'Hvorfor blir bildene mørke eller blå?', answer: 'Svært sterke filtre kan gi fargestikk. Rett det opp i hvitbalansen eller etterpå.' },
];

const relatedTools = [
  { href: '/calculators/photo/shutter-angle-converter', title: 'Lukkervinkel', description: 'Regn om mellom lukkervinkel og lukkertid for film' },
  { href: '/calculators/photo/depth-of-field-calculator', title: 'Dybdeskarphet', description: 'Regn ut dybdeskarphet ut fra brennvidde, blenderåpning og avstand' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Gylden time og blå time', description: 'Regn ut gylden time og blå time for et sted' },
];

export default function NDFilterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="nd-filter-calculator"
          title="ND-filter"
          description="Regn ut ny lukkertid med ND-filter for lang eksponering av vann, skyer og lysspor. Gratis og uten registrering."
        />

        <section aria-label="ND-filter">
          <NDFilterCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
