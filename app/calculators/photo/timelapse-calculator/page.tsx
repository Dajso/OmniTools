import { Metadata } from 'next';
import { TimeLapseCalculator } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tidsforløp (timelapse) – gratis kalkulator på nett',
  description: 'Regn ut intervall og varighet for timelapse-fotografering. Gratis og uten registrering.',
  keywords: ['timelapse', 'tidsforløp', 'intervall', 'bildefrekvens'],
  alternates: { canonical: '/calculators/photo/timelapse-calculator' },
  openGraph: {
    title: 'Tidsforløp (timelapse)',
    description: 'Regn ut intervall og varighet for timelapse-fotografering',
    url: '/calculators/photo/timelapse-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tidsforløp (timelapse)',
  description: 'Regn ut intervall og varighet for timelapse-fotografering',
  applicationCategory: 'PhotographyApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi hvor lenge hendelsen varer', text: 'Timer og minutter.' },
  { name: 'Oppgi ønsket videolengde', text: 'I sekunder, sammen med bildefrekvens.' },
  { name: 'Velg bildekvalitet', text: 'RAW eller JPEG i ulike størrelser.' },
  { name: 'Les av intervallet', text: 'Se også antall bilder og lagring som trengs.' },
];

const faqs = [
  { question: 'Hvilken bildefrekvens bør jeg velge?', answer: '25 b/s er vanlig i Europa. 24 b/s gir filmlook, og 30 b/s passer for nett.' },
  { question: 'Hvor mange bilder trenger jeg?', answer: 'Videolengde × bildefrekvens. Ti sekunder ved 25 b/s krever 250 bilder.' },
  { question: 'Hvordan velger jeg intervall?', answer: 'Del hendelsens lengde på antall bilder. Raske hendelser trenger kort intervall.' },
  { question: 'Hva med batteri og minnekort?', answer: 'Kalkulatoren gir et overslag. Ta med ekstra batteri ved lange opptak, særlig i kulde.' },
];

const relatedTools = [
  { href: '/calculators/photo/bitrate-calculator', title: 'Bitrate-kalkulator', description: 'Regn ut videobitrate og filstørrelse' },
  { href: '/calculators/photo/aspect-ratio-calculator', title: 'Sideforhold for video', description: 'Regn ut sideforhold og dimensjoner for video og bilder' },
  { href: '/calculators/photo/golden-hour-calculator', title: 'Gylden time og blå time', description: 'Regn ut gylden time og blå time for et sted' },
];

export default function TimeLapseCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="timelapse-calculator"
          title="Tidsforløp (timelapse)"
          description="Planlegg timelapse: regn ut intervall, antall bilder, videolengde og lagringsbehov. Gratis og uten registrering."
        />

        <section aria-label="Tidsforløp (timelapse)">
          <TimeLapseCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
