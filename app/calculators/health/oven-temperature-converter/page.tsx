import { Metadata } from 'next';
import { OvenTemperatureConverter } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ovnstemperatur – gratis kalkulator på nett',
  description: 'Regn om ovnstemperatur mellom Celsius, Fahrenheit og gassmerke. Gratis og uten registrering.',
  keywords: ['ovnstemperatur', 'ovn', 'celsius', 'fahrenheit', 'stekeovn'],
  alternates: { canonical: '/calculators/health/oven-temperature-converter' },
  openGraph: {
    title: 'Ovnstemperatur',
    description: 'Regn om ovnstemperatur mellom Celsius, Fahrenheit og gassmerke',
    url: '/calculators/health/oven-temperature-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ovnstemperatur',
  description: 'Regn om ovnstemperatur mellom Celsius, Fahrenheit og gassmerke',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg enhet', text: 'Fahrenheit, Celsius eller gas mark.' },
  { name: 'Skriv inn temperatur', text: 'For eksempel 350 °F.' },
  { name: 'Les resultatet', text: 'Se Celsius, varmluft, Fahrenheit og gas mark.' },
];

const faqs = [
  { question: 'Hva er 350 °F i Celsius?', answer: 'Cirka 175 °C.' },
  { question: 'Hvor mye lavere skal jeg stille inn ved varmluft?', answer: 'Trekk fra ca. 20 °C i forhold til vanlig over- og undervarme.' },
  { question: 'Hva er gas mark?', answer: 'En skala som brukes i britiske oppskrifter for gassovner.' },
  { question: 'Hvilke temperaturer er vanlige?', answer: 'Kaker ofte 175–180 °C, brød 200–250 °C.' },
];

const relatedTools = [
  { href: '/calculators/health/cooking-converter', title: 'Kjøkkenomregner', description: 'Regn om mellom dl, ss, ts, gram og amerikanske mål som cups' },
];

export default function OvenTemperatureConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="oven-temperature-converter"
          title="Ovnstemperatur"
          description="Regn om ovnstemperatur mellom Fahrenheit, Celsius og gas mark, og se hva det blir med varmluft. Gratis og uten registrering."
        />

        <section aria-label="Ovnstemperatur">
          <OvenTemperatureConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
