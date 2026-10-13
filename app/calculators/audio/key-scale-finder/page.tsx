import { Metadata } from 'next';
import { KeyScaleFinder } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Toneart- og skalafinner – gratis kalkulator på nett',
  description: 'Finn toneart og skala ved å velge toner. Gratis og uten registrering.',
  keywords: ['toneart', 'skala', 'musikkteori', 'akkordprogresjon'],
  alternates: { canonical: '/calculators/audio/key-scale-finder' },
  openGraph: {
    title: 'Toneart- og skalafinner',
    description: 'Finn toneart og skala ved å velge toner',
    url: '/calculators/audio/key-scale-finder',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Toneart- og skalafinner',
  description: 'Finn toneart og skala ved å velge toner',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg noter', text: 'Klikk på minst tre noter.' },
  { name: 'Se mest sannsynlige toneart', text: 'Den beste matchen vises øverst.' },
  { name: 'Utforsk skalaer', text: 'Se flere skalaer og hvor mange prosent som passer.' },
];

const faqs = [
  { question: 'Hvor mange noter trenger jeg?', answer: 'Minst tre, men jo flere noter du velger, jo sikrere blir resultatet.' },
  { question: 'Hva betyr prosent?', answer: 'Hvor stor andel av de valgte notene som finnes i skalaen.' },
  { question: 'Hva er parallell dur og moll?', answer: 'To tonearter som bruker de samme notene, for eksempel C-dur og A-moll.' },
  { question: 'Hvorfor heter B-naturlig H i Norge?', answer: 'I norsk notasjon heter B-naturlig H, og B er B-flat. Kalkulatoren bruker internasjonale notenavn.' },
];

const relatedTools = [
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
  { href: '/calculators/audio/guitar-tuner', title: 'Gitarstemmer', description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer' },
  { href: '/calculators/audio/song-structure-builder', title: 'Låtstruktur', description: 'Planlegg låtoppbyggingen med vers, refreng og bro, og regn ut total varighet' },
];

export default function KeyScaleFinderPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="key-scale-finder"
          title="Toneart- og skalafinner"
          description="Velg noter og finn tonearter og skalaer som passer, for eksempel for å finne tonearten i en sang. Gratis og uten registrering."
        />

        <section aria-label="Toneart- og skalafinner">
          <KeyScaleFinder />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
