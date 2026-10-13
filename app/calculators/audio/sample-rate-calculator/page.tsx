import { Metadata } from 'next';
import { SampleRateCalculator } from '@/components/calculators/audio';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Samplingsrate-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut lydfilstørrelse og varighet ut fra samplingsrate, bitdybde og kanaler. Gratis og uten registrering.',
  keywords: ['samplingsrate', 'lydfilstørrelse', 'bitdybde', 'nyquist', 'wav'],
  alternates: { canonical: '/calculators/audio/sample-rate-calculator' },
  openGraph: {
    title: 'Samplingsrate-kalkulator',
    description: 'Regn ut lydfilstørrelse og varighet ut fra samplingsrate, bitdybde og kanaler',
    url: '/calculators/audio/sample-rate-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Samplingsrate-kalkulator',
  description: 'Regn ut lydfilstørrelse og varighet ut fra samplingsrate, bitdybde og kanaler',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil regne ut', text: 'Størrelse, varighet eller bare tekniske data.' },
  { name: 'Velg kvalitet', text: 'Bruk et ferdig valg som CD-kvalitet, eller still inn selv.' },
  { name: 'Oppgi varighet eller størrelse', text: 'Avhengig av hva du regner ut.' },
  { name: 'Les av resultatet', text: 'Du får størrelse, bitrate og Nyquist-frekvens.' },
];

const faqs = [
  { question: 'Hva er samplingsfrekvens?', answer: 'Hvor mange ganger per sekund lyden måles. CD bruker 44,1 kHz.' },
  { question: 'Hva er bitdybde?', answer: 'Hvor mange bit hvert mål lagres med. Høyere bitdybde gir større dynamikkområde.' },
  { question: 'Hva er Nyquist-frekvensen?', answer: 'Halvparten av samplingsfrekvensen. Den er den høyeste frekvensen som kan gjengis.' },
  { question: 'Gjelder størrelsen komprimerte filer?', answer: 'Nei, tallene gjelder ukomprimert WAV. MP3 og AAC blir vanligvis mye mindre.' },
];

const relatedTools = [
  { href: '/calculators/audio/bpm-tapper', title: 'BPM-tapper', description: 'Tapp i takt for å finne tempo og delay-tider i musikkproduksjon' },
  { href: '/calculators/audio/note-frequency', title: 'Tone til frekvens', description: 'Regn om mellom toner og frekvens i Hz, med ulike stemmetoner og cent' },
  { href: '/calculators/audio/panning-visualizer', title: 'Panorering-visualisering', description: 'Visualiser og test stereopanorering mellom venstre og høyre kanal' },
];

export default function SampleRateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sample-rate-calculator"
          title="Samplingsrate-kalkulator"
          description="Regn ut filstørrelse, varighet og tekniske data for lyd ut fra samplingsfrekvens, bitdybde og antall kanaler. Gratis og uten registrering."
        />

        <section aria-label="Samplingsrate-kalkulator">
          <SampleRateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
