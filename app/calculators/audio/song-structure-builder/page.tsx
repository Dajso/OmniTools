import { Metadata } from 'next';
import { SongStructureBuilder } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Låtstruktur – gratis kalkulator på nett',
  description: 'Planlegg låtoppbyggingen med vers, refreng og bro, og regn ut total varighet. Gratis og uten registrering.',
  keywords: ['låtstruktur', 'arrangement', 'vers', 'refreng', 'komposisjon'],
  alternates: { canonical: '/calculators/audio/song-structure-builder' },
  openGraph: {
    title: 'Låtstruktur',
    description: 'Planlegg låtoppbyggingen med vers, refreng og bro, og regn ut total varighet',
    url: '/calculators/audio/song-structure-builder',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Låtstruktur',
  description: 'Planlegg låtoppbyggingen med vers, refreng og bro, og regn ut total varighet',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg et utgangspunkt', text: 'Start med et ferdig valg eller en tom låt.' },
  { name: 'Legg til deler', text: 'Klikk på deltypene du trenger.' },
  { name: 'Endre rekkefølge og lengde', text: 'Dra delene og juster takter med +4 og -4.' },
  { name: 'Les av oversikten', text: 'Se total varighet, takter og slag.' },
];

const faqs = [
  { question: 'Hvor lang bør en poplåt være?', answer: 'Ofte 3–4 minutter, rundt 64–80 takter ved 120 BPM.' },
  { question: 'Hvordan regnes varigheten ut?', answer: 'Antall takter × slag per takt ÷ BPM gir minutter.' },
  { question: 'Hva er en bro?', answer: 'En kontrastdel, ofte mot slutten, som gir variasjon før siste refreng.' },
  { question: 'Lagres låten min?', answer: 'Nei, strukturen lagres ikke på noen server.' },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay- og reverb-tid', description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder' },
  { href: '/calculators/audio/key-scale-finder', title: 'Toneart- og skalafinner', description: 'Finn toneart og skala ved å velge toner' },
];

export default function SongStructureBuilderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="song-structure-builder"
          title="Låtstruktur"
          description="Planlegg låtstrukturen med intro, vers, refreng, bro og mer. Se total varighet og antall takter. Gratis og uten registrering."
        />

        <section aria-label="Låtstruktur">
          <SongStructureBuilder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
