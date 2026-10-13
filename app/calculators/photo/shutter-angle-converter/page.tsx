import { Metadata } from 'next';
import { ShutterAngleConverter } from '@/components/calculators/photo';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lukkervinkel – gratis kalkulator på nett',
  description: 'Regn om mellom lukkervinkel og lukkertid for film. Gratis og uten registrering.',
  keywords: ['lukkervinkel', 'lukkertid', '180-gradersregelen', 'bevegelsesuskarphet'],
  alternates: { canonical: '/calculators/photo/shutter-angle-converter' },
  openGraph: {
    title: 'Lukkervinkel',
    description: 'Regn om mellom lukkervinkel og lukkertid for film',
    url: '/calculators/photo/shutter-angle-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lukkervinkel',
  description: 'Regn om mellom lukkervinkel og lukkertid for film',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Fra vinkel til tid, eller omvendt.' },
  { name: 'Oppgi verdi og bildefrekvens', text: 'For eksempel 180° ved 25 b/s.' },
  { name: 'Les av resultatet', text: 'Du får lukkertid, eksponering i prosent og beskrivelse av bevegelsesuskarpheten.' },
  { name: 'Prøv en filmlook', text: 'Velg et ferdig valg for ulike uttrykk.' },
];

const faqs = [
  { question: 'Hva er lukkervinkel?', answer: 'En måte å beskrive eksponeringstid i film, som en andel av tiden til ett bilde. 360° er hele bildetiden.' },
  { question: 'Hva er 180°-regelen?', answer: 'Lukkertiden er 1/(2 × bilder per sekund). Det gir naturlig bevegelsesuskarphet. Ved 25 b/s blir det 1/50.' },
  { question: 'Hvorfor er 24 b/s vanlig?', answer: 'Det er filmstandarden. I Europa brukes ofte 25 b/s til TV og video.' },
  { question: 'Hva gjør kortere vinkel?', answer: 'Skarpere bevegelser med mer staccato-uttrykk, som i mange actionscener.' },
];

const relatedTools = [
  { href: '/calculators/photo/nd-filter-calculator', title: 'ND-filter', description: 'Regn ut lukkertid ved bruk av ND-filter' },
  { href: '/calculators/photo/timelapse-calculator', title: 'Tidsforløp (timelapse)', description: 'Regn ut intervall og varighet for timelapse-fotografering' },
  { href: '/calculators/photo/bitrate-calculator', title: 'Bitrate-kalkulator', description: 'Regn ut videobitrate og filstørrelse' },
];

export default function ShutterAngleConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="shutter-angle-converter"
          title="Lukkervinkel"
          description="Regn om mellom lukkervinkel (film) og lukkertid (foto) ved ulike bildefrekvenser. Gratis og uten registrering."
        />

        <section aria-label="Lukkervinkel">
          <ShutterAngleConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
