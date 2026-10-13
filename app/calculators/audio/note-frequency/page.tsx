import { Metadata } from 'next';
import { NoteFrequencyConverter } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tone til frekvens – gratis kalkulator på nett',
  description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent. Gratis og uten registrering.',
  keywords: ['tone til frekvens', 'Hz', 'noter', 'A440', 'stemming'],
  alternates: { canonical: '/calculators/audio/note-frequency' },
  openGraph: {
    title: 'Tone til frekvens',
    description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent',
    url: '/calculators/audio/note-frequency',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tone til frekvens',
  description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Fra note til frekvens, eller fra frekvens til note.' },
  { name: 'Velg note og oktav', text: 'Eller skriv inn frekvensen.' },
  { name: 'Juster referansetone', text: 'Standard er A4 = 440 Hz.' },
  { name: 'Les av resultatet', text: 'Du får frekvens, nærmeste note og avvik i cent.' },
];

const faqs = [
  { question: 'Hva er likesvevende temperatur?', answer: 'Et system der oktaven er delt i 12 like halvtoner. Frekvensen øker med faktoren 2^(1/12) per halvtone.' },
  { question: 'Hva er en cent?', answer: 'En hundredel av en halvtone. Avvik under noen få cent hører de fleste ikke.' },
  { question: 'Hvorfor er A4 440 Hz?', answer: 'Det er internasjonal standard. Noen orkestre og barokkensembler bruker andre referansetoner.' },
  { question: 'Hvorfor heter tonen H i Norge?', answer: 'I norsk notasjon heter B-naturlig H, og B er det samme som B-flat. Kalkulatoren bruker internasjonale notenavn, der B er B-naturlig.' },
];

const relatedTools = [
  { href: '/calculators/audio/guitar-tuner', title: 'Gitarstemmer', description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer' },
  { href: '/calculators/audio/key-scale-finder', title: 'Toneart- og skalafinner', description: 'Finn toneart og skala ved å velge toner' },
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
];

export default function NoteFrequencyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="note-frequency"
          title="Tone til frekvens"
          description="Regn om mellom noter og frekvens i hertz med likesvevende temperatur og valgfri referansetone. Gratis og uten registrering."
        />

        <section aria-label="Tone til frekvens">
          <NoteFrequencyConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
