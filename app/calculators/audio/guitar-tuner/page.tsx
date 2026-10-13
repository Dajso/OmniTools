import { Metadata } from 'next';
import { GuitarTuner } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gitarstemmer – gratis kalkulator på nett',
  description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer. Gratis og uten registrering.',
  keywords: ['gitarstemmer', 'stemmeapparat', 'kromatisk', 'drop d', 'standard stemming'],
  alternates: { canonical: '/calculators/audio/guitar-tuner' },
  openGraph: {
    title: 'Gitarstemmer',
    description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer',
    url: '/calculators/audio/guitar-tuner',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gitarstemmer',
  description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Gi tilgang til mikrofonen', text: 'Nettleseren spør om tillatelse første gang.' },
  { name: 'Velg stemming', text: 'For eksempel standard, drop D eller åpen G.' },
  { name: 'Slå an en streng', text: 'Se om tonen er for høy, for lav eller stemt.' },
  { name: 'Juster til tonen er stemt', text: 'Vri på stemmeskruen til meldingen viser at strengen er stemt.' },
];

const faqs = [
  { question: 'Hvorfor trenger siden mikrofonen?', answer: 'For å høre tonen du spiller. Lyd behandles i nettleseren og sendes ikke noe sted.' },
  { question: 'Fungerer den med el-gitar?', answer: 'Ja, hold mikrofonen nær forsterkeren eller bruk et lydkort.' },
  { question: 'Hva betyr cent?', answer: 'Avvik fra riktig tone. 100 cent er en halvtone.' },
  { question: 'Hvorfor finner den ikke tonen?', answer: 'Prøv å stemme i et stille rom, slå an strengen tydelig og sjekk at riktig mikrofon er valgt.' },
];

const relatedTools = [
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
  { href: '/calculators/audio/metronome', title: 'Visuell metronom', description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer' },
  { href: '/calculators/audio/key-scale-finder', title: 'Toneart- og skalafinner', description: 'Finn toneart og skala ved å velge toner' },
];

export default function GuitarTunerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="guitar-tuner"
          title="Gitarstemmer"
          description="Stem gitaren med mikrofonen. Støtter flere stemminger og referansetoner. Gratis og uten registrering."
        />

        <section aria-label="Gitarstemmer">
          <GuitarTuner />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
