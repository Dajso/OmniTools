import { Metadata } from 'next';
import { AudioPanningVisualizer } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Panorering-visualisering – gratis kalkulator på nett',
  description: 'Visualiser og test stereopanorering mellom venstre og høyre kanal. Gratis og uten registrering.',
  keywords: ['panorering', 'stereotest', 'høyttalertest', 'hodetelefontest'],
  alternates: { canonical: '/calculators/audio/panning-visualizer' },
  openGraph: {
    title: 'Panorering-visualisering',
    description: 'Visualiser og test stereopanorering mellom venstre og høyre kanal',
    url: '/calculators/audio/panning-visualizer',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Panorering-visualisering',
  description: 'Visualiser og test stereopanorering mellom venstre og høyre kanal',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Trykk spill lyd', text: 'En testtone starter.' },
  { name: 'Juster panoreringen', text: 'Bruk glidebryteren eller hurtigknappene.' },
  { name: 'Prøv autopanorering', text: 'Hør lyden bevege seg mellom høyttalerne.' },
];

const faqs = [
  { question: 'Hva er panorering?', answer: 'Hvor lyden plasseres mellom venstre og høyre kanal i et stereobilde.' },
  { question: 'Bør jeg bruke hodetelefoner?', answer: 'Ja, de gir best stereoopplevelse og viser tydelig forskjellen.' },
  { question: 'Hvilken bølgeform bør jeg velge?', answer: 'Sinus er mykest. Firkant og sagtann er hardere og lettere å lokalisere.' },
  { question: 'Hvorfor hører jeg ikke forskjell?', answer: 'Sjekk at høyttalerne eller hodetelefonene er stereo og at lyden ikke er satt til mono.' },
];

const relatedTools = [
  { href: '/calculators/audio/sample-rate-calculator', title: 'Samplingsrate-kalkulator', description: 'Regn ut lydfilstørrelse og varighet ut fra samplingsrate, bitdybde og kanaler' },
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
  { href: '/calculators/audio/guitar-tuner', title: 'Gitarstemmer', description: 'Gratis gitarstemmer som bruker mikrofonen, med standard, drop D, DADGAD og mer' },
];

export default function PanningVisualizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="panning-visualizer"
          title="Panorering-visualisering"
          description="Test stereopanorering og hør hvordan lyden flytter seg mellom venstre og høyre kanal. Gratis og uten registrering."
        />

        <section aria-label="Panorering-visualisering">
          <AudioPanningVisualizer />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
