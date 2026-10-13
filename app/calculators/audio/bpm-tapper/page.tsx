import { Metadata } from 'next';
import { BPMTapper } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'BPM-tapper – gratis kalkulator på nett',
  description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon. Gratis og uten registrering.',
  keywords: ['bpm', 'tap tempo', 'tempo', 'delay-tid', 'musikkproduksjon'],
  alternates: { canonical: '/calculators/audio/bpm-tapper' },
  openGraph: {
    title: 'BPM-tapper',
    description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon',
    url: '/calculators/audio/bpm-tapper',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BPM-tapper',
  description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg modus', text: 'Tapp i takt, eller skriv inn BPM manuelt.' },
  { name: 'Tapp i rytmen', text: 'Trykk på knappen eller mellomromstasten på hvert slag.' },
  { name: 'Les av BPM', text: 'Tempoet regnes ut som gjennomsnitt av de siste tappene.' },
  { name: 'Bruk ekkotidene', text: 'Kopier verdiene inn i delay- eller romklangeffekten din.' },
];

const faqs = [
  { question: 'Hvor mange tapp trenger jeg?', answer: 'Fire til åtte tapp gir som regel et brukbart resultat. Kalkulatoren bruker gjennomsnittet av de siste 8.' },
  { question: 'Hva er BPM?', answer: 'Slag per minutt, altså tempoet i musikken.' },
  { question: 'Hvordan regnes ekkotid ut?', answer: 'En kvartnote varer 60 000 ÷ BPM millisekunder. De andre notelengdene er avledet av den.' },
  { question: 'Hva om jeg bommer på takten?', answer: 'Trykk «Nullstill» og begynn å tappe på nytt.' },
];

const relatedTools = [
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay- og reverb-tid', description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder' },
  { href: '/calculators/audio/metronome', title: 'Visuell metronom', description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer' },
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
];

export default function BPMTapperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="bpm-tapper"
          title="BPM-tapper"
          description="Tapp i takt med musikken og finn tempoet i BPM, med ekkotider for ulike notelengder. Gratis og uten registrering."
        />

        <section aria-label="BPM-tapper">
          <BPMTapper />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
