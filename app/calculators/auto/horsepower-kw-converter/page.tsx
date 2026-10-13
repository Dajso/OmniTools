import { Metadata } from 'next';
import { HorsepowerKwConverter } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Hestekrefter til kW – gratis kalkulator på nett',
  description: 'Regn om mellom hestekrefter (hk) og kilowatt (kW). Gratis og uten registrering.',
  keywords: ['hk til kW', 'kW til hk', 'hestekrefter', 'motoreffekt', 'bil'],
  alternates: { canonical: '/calculators/auto/horsepower-kw-converter' },
  openGraph: {
    title: 'Hestekrefter til kW',
    description: 'Regn om mellom hestekrefter (hk) og kilowatt (kW)',
    url: '/calculators/auto/horsepower-kw-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hestekrefter til kW',
  description: 'Regn om mellom hestekrefter (hk) og kilowatt (kW)',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn effekten', text: 'Oppgi tallet du har.' },
  { name: 'Velg enhet', text: 'Velg kW, hk/PS, HP eller BHP.' },
  { name: 'Les resultatet', text: 'Se verdien i alle enhetene.' },
];

const faqs = [
  { question: 'Hvor mange hk er 100 kW?', answer: '100 kW er omtrent 136 metriske hk (PS).' },
  { question: 'Hva er forskjellen på hk og HP?', answer: 'Metrisk hestekraft (hk eller PS) er 0,7355 kW, imperial HP er 0,7457 kW. Forskjellen er under to prosent.' },
  { question: 'Hvilken enhet står i vognkortet?', answer: 'I norske vognkort oppgis motoreffekt i kW.' },
  { question: 'Hva er BHP?', answer: 'Brake horsepower er effekt målt ved veivakselen, altså før tap i girkasse og drivverk. Her regnes den lik HP.' },
];

const relatedTools = [
  { href: '/calculators/auto/zero-sixty-estimator', title: '0–100 km/t', description: 'Anslå akselerasjon fra 0 til 100 km/t ut fra effekt og vekt' },
  { href: '/calculators/auto/ev-charging-calculator', title: 'Ladetid og ladekostnad for elbil', description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris' },
  { href: '/calculators/auto/fuel-consumption-converter', title: 'Drivstofforbruk (l/100 km)', description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)' },
];

export default function HorsepowerKwConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="horsepower-kw-converter"
          title="Hestekrefter til kW"
          description="Regn om mellom kilowatt (kW), metriske hestekrefter (hk/PS) og imperiale hestekrefter (HP). Gratis og uten registrering."
        />

        <section aria-label="Hestekrefter til kW">
          <HorsepowerKwConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
