import { Metadata } from 'next';
import { YouTubeMoneyCalculator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'YouTube-inntektskalkulator – gratis kalkulator på nett',
  description: 'Anslå YouTube-inntekter ut fra visninger og engasjement. Gratis og uten registrering.',
  keywords: ['youtube', 'inntekter', 'annonseinntekt', 'adsense'],
  alternates: { canonical: '/calculators/creator/youtube-money-calculator' },
  openGraph: {
    title: 'YouTube-inntektskalkulator',
    description: 'Anslå YouTube-inntekter ut fra visninger og engasjement',
    url: '/calculators/creator/youtube-money-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'YouTube-inntektskalkulator',
  description: 'Anslå YouTube-inntekter ut fra visninger og engasjement',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall visninger', text: 'Totalt antall visninger.' },
  { name: 'Velg innholdskategori', text: 'Kategorien avgjør typisk CPM.' },
  { name: 'Juster CPM ved behov', text: 'Bruk egne verdier hvis du kjenner kanalens tall.' },
  { name: 'Les av anslaget', text: 'Se lavt, høyt og gjennomsnittlig anslag.' },
];

const faqs = [
  { question: 'Hvor mye betaler YouTube per 1 000 visninger?', answer: 'Det varierer mye. Tallene i verktøyet er veiledende anslag i kroner og avhenger av kategori, publikum og sesong.' },
  { question: 'Hva er CPM og RPM?', answer: 'CPM er det annonsørene betaler per 1 000 annonsevisninger. RPM er det du faktisk sitter igjen med per 1 000 visninger etter YouTubes andel.' },
  { question: 'Hvor stor del får skaperen?', answer: 'Omtrent 55 % av annonseinntektene i vanlige videoer.' },
  { question: 'Er tallene nøyaktige?', answer: 'Nei, de er grove anslag. Se YouTube Studio for de faktiske tallene på kanalen din.' },
];

const relatedTools = [
  { href: '/calculators/creator/instagram-engagement-calculator', title: 'Instagram-engasjement', description: 'Regn ut engasjementsraten på Instagram' },
  { href: '/calculators/creator/cpm-calculator', title: 'CPM-kalkulator', description: 'Regn ut kostnad per tusen visninger (CPM) i annonsekampanjer' },
];

export default function YouTubeMoneyCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="youtube-money-calculator"
          title="YouTube-inntektskalkulator"
          description="Anslå hvor mye du kan tjene på YouTube ut fra antall visninger og type innhold, i kroner. Gratis og uten registrering."
        />

        <section aria-label="YouTube-inntektskalkulator">
          <YouTubeMoneyCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
