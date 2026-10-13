import { Metadata } from 'next';
import { DelayReverbCalculator } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Delay- og reverb-tid – gratis kalkulator på nett',
  description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder. Gratis og uten registrering.',
  keywords: ['delay', 'reverb', 'tempo', 'bpm til ms', 'musikkproduksjon'],
  alternates: { canonical: '/calculators/audio/delay-reverb-calculator' },
  openGraph: {
    title: 'Delay- og reverb-tid',
    description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder',
    url: '/calculators/audio/delay-reverb-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Delay- og reverb-tid',
  description: 'Regn ut tempo-synkede delay- og reverb-tider fra BPM i millisekunder',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn BPM', text: 'Bruk tempoet i låten din.' },
  { name: 'Velg romklangens utklingning', text: 'Antall slag romklangen skal vare.' },
  { name: 'Les av tidene', text: 'Du får tider for vanlige, punkterte og triolnoter.' },
  { name: 'Legg inn i pluginen', text: 'Skriv verdiene inn i delay- eller romklangpluginen.' },
];

const faqs = [
  { question: 'Hvorfor synke delay til tempoet?', answer: 'Ekkoene lander da på rytmen og blander seg bedre med resten av miksen i stedet for å skape rot.' },
  { question: 'Hva er pre-delay?', answer: 'Tiden før romklangen starter etter den opprinnelige lyden. En kort pre-delay gir klarere lyd.' },
  { question: 'Hva er punktert note?', answer: 'En note som er 1,5 ganger så lang som normalt. Triolnoter er to tredeler av normalen.' },
  { question: 'Er tidene nøyaktige?', answer: 'De er matematisk riktige, men noen plugins runder av eller bruker egne verdier.' },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
  { href: '/calculators/audio/metronome', title: 'Visuell metronom', description: 'Metronom med visuelle og hørbare signaler, taktarter og tempoer' },
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
];

export default function DelayReverbCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="delay-reverb-calculator"
          title="Delay- og reverb-tid"
          description="Regn ut tempo-synkede delay- og romklangtider i millisekunder ut fra BPM. Gratis og uten registrering."
        />

        <section aria-label="Delay- og reverb-tid">
          <DelayReverbCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
