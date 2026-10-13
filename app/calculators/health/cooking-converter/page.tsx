import { Metadata } from 'next';
import { CookingConverter } from '@/components/calculators/health';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kjøkkenomregner – gratis kalkulator på nett',
  description: 'Regn om mellom dl, ss, ts, gram og amerikanske mål som cups. Gratis og uten registrering.',
  keywords: ['kjøkkenomregner', 'dl', 'spiseskje', 'teskje', 'cups', 'gram', 'oppskrift'],
  alternates: { canonical: '/calculators/health/cooking-converter' },
  openGraph: {
    title: 'Kjøkkenomregner',
    description: 'Regn om mellom dl, ss, ts, gram og amerikanske mål som cups',
    url: '/calculators/health/cooking-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kjøkkenomregner',
  description: 'Regn om mellom dl, ss, ts, gram og amerikanske mål som cups',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn mengden', text: 'For eksempel 1.' },
  { name: 'Velg enheter', text: 'Fra og til.' },
  { name: 'Velg ingrediens', text: 'Kreves når du går mellom volum og vekt.' },
];

const faqs = [
  { question: 'Hvor mange ml er en spiseskje?', answer: 'I Norge er 1 ss 15 ml, 1 ts er 5 ml og 1 krm er 1 ml.' },
  { question: 'Hvor mange dl er en cup?', answer: 'En amerikansk cup er 2,37 dl.' },
  { question: 'Hvor mange gram er 1 dl mel?', answer: 'Ca. 60 g. Sukker veier ca. 85 g per dl.' },
  { question: 'Hvorfor må jeg velge ingrediens?', answer: 'Fordi vekten av 1 dl varierer mellom ingredienser.' },
];

const relatedTools = [
  { href: '/calculators/health/oven-temperature-converter', title: 'Ovnstemperatur', description: 'Regn om ovnstemperatur mellom Celsius, Fahrenheit og gassmerke' },
];

export default function CookingConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cooking-converter"
          title="Kjøkkenomregner"
          description="Regn om mellom dl, ss, ts, krm, gram og utenlandske mål som cups og ounces. Gratis og uten registrering."
        />

        <section aria-label="Kjøkkenomregner">
          <CookingConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
