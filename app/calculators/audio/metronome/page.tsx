import { Metadata } from 'next';
import { VisualMetronome } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Visuell metronom – gratis kalkulator på nett',
  description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer. Gratis og uten registrering.',
  keywords: ['metronom', 'tempo', 'takt', 'musikkøving', 'taktart'],
  alternates: { canonical: '/calculators/audio/metronome' },
  openGraph: {
    title: 'Visuell metronom',
    description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer',
    url: '/calculators/audio/metronome',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Visuell metronom',
  description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg tempo', text: 'Skriv inn BPM, bruk pluss og minus, eller velg et tempovalg.' },
  { name: 'Velg taktart', text: 'For eksempel 4/4 eller 3/4.' },
  { name: 'Trykk start', text: 'Du ser blink og hører klikk i takt.' },
];

const faqs = [
  { question: 'Kan jeg bruke tastatur?', answer: 'Ja, mellomrom starter og stopper.' },
  { question: 'Hva er aksent på første slag?', answer: 'Det første slaget i takten får en annen lyd, så du hører hvor takten begynner.' },
  { question: 'Hvorfor er det litt forskjell i tempoet?', answer: 'Nettlesere kan ha små tidsavvik. For presist studioarbeid bør du bruke en DAW.' },
  { question: 'Fungerer den uten lyd?', answer: 'Ja, du kan bruke bare blinking.' },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
  { href: '/calculators/audio/guitar-tuner', title: 'Gitarstemmer', description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer' },
  { href: '/calculators/audio/delay-reverb-calculator', title: 'Delay- og reverb-tid', description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder' },
];

export default function MetronomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="metronome"
          title="Visuell metronom"
          description="Visuell metronom med blink og lyd, taktart og tempo fra 20 til 300 BPM. Gratis og uten registrering."
        />

        <section aria-label="Visuell metronom">
          <VisualMetronome />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
