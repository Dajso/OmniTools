import { Metadata } from 'next';
import { CPMCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'CPM-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut kostnad per tusen visninger (CPM) i annonsekampanjer. Gratis og uten registrering.',
  keywords: ['CPM', 'kostnad per tusen', 'annonsekostnad', 'annonseinntekt'],
  alternates: { canonical: '/calculators/creator/cpm-calculator' },
  openGraph: {
    title: 'CPM-kalkulator',
    description: 'Regn ut kostnad per tusen visninger (CPM) i annonsekampanjer',
    url: '/calculators/creator/cpm-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CPM-kalkulator',
  description: 'Regn ut kostnad per tusen visninger (CPM) i annonsekampanjer',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg beregningsmodus', text: 'CPM, kostnad, visninger eller full analyse.' },
  { name: 'Fyll inn tallene', text: 'Kostnad, visninger, CPM eller klikk.' },
  { name: 'Sammenlign med plattform', text: 'Velg en plattform for å se typisk CPM.' },
  { name: 'Les av resultatet', text: 'Se CPM, CPC og CTR.' },
];

const faqs = [
  { question: 'Hva er CPM?', answer: 'Kostnad per mille: hva du betaler per 1 000 visninger av annonsen. CPM = kostnad ÷ visninger × 1000.' },
  { question: 'Hva er forskjellen på CPM, CPC og CTR?', answer: 'CPM er pris per 1 000 visninger, CPC er pris per klikk, og CTR er andelen visninger som gir klikk.' },
  { question: 'Er plattformtallene nøyaktige?', answer: 'Nei, de er veiledende gjennomsnitt i kroner og varierer mye med målgruppe og sesong.' },
  { question: 'Når bør jeg bruke CPM?', answer: 'Når målet er synlighet. Når målet er trafikk eller salg, er CPC eller kostnad per kjøp ofte et bedre mål.' },
];

const relatedTools = [
  { href: '/calculators/creator/youtube-money-calculator', title: 'YouTube-inntektskalkulator', description: 'Anslå YouTube-inntekter ut fra visninger og engasjement' },
  { href: '/calculators/creator/instagram-engagement-calculator', title: 'Instagram-engasjement', description: 'Regn ut engasjementsraten på Instagram' },
];

export default function CPMCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cpm-calculator"
          title="CPM-kalkulator"
          description="Regn ut CPM (kostnad per tusen visninger), CPC og CTR for annonsekampanjer, i kroner. Gratis og uten registrering."
        />

        <section aria-label="CPM-kalkulator">
          <CPMCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
