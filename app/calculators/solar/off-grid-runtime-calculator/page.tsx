import { Metadata } from 'next';
import { OffGridRuntimeCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Driftstid på batteri – gratis kalkulator på nett',
  description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd. Gratis og uten registrering.',
  keywords: ['driftstid', 'reservestrøm', 'strømbrudd', 'UPS', 'nødstrøm'],
  alternates: { canonical: '/calculators/solar/off-grid-runtime-calculator' },
  openGraph: {
    title: 'Driftstid på batteri',
    description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd',
    url: '/calculators/solar/off-grid-runtime-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Driftstid på batteri',
  description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn batteriet', text: 'Oppgi kapasitet i Ah og spenning.' },
  { name: 'Velg utladingsgrad og virkningsgrad', text: 'Utladingsgrad sier hvor mye av batteriet du tør å bruke. Virkningsgraden tar høyde for tap i vekselretteren.' },
  { name: 'Skriv inn forbruket', text: 'Oppgi effekten utstyret trekker, i watt.' },
  { name: 'Les av driftstiden', text: 'Du får hvor mange timer og døgn batteriet varer.' },
];

const faqs = [
  { question: 'Hvor lenge varer et batteri?', answer: 'Kapasiteten (Wh) ganges med utladingsgrad og virkningsgrad og deles på forbruket. Et batteri på 12 V og 200 Ah rommer ca. 2,4 kWh.' },
  { question: 'Hvor mye kan jeg lade ut batteriet?', answer: 'Blybatterier bør ikke gå under 50 %, litium tåler vanligvis 80–100 %. Sjekk databladet til batteriet.' },
  { question: 'Hvorfor blir driftstiden kortere enn regnet?', answer: 'Kulde, alderdom, startstrøm og høy belastning reduserer kapasiteten. Legg inn en margin.' },
  { question: 'Kan jeg drive et kjøleskap?', answer: 'Ja, men sjekk effekten og hvor ofte kompressoren går. Et vanlig kjøleskap bruker ofte 1–2 kWh per døgn.' },
];

const relatedTools = [
  { href: '/calculators/solar/battery-bank-sizing-calculator', title: 'Batteribank', description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid' },
  { href: '/calculators/solar/inverter-size-calculator', title: 'Vekselretter', description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm' },
  { href: '/calculators/solar/dc-power-calculator', title: 'Ampere og watt (DC)', description: 'Regn om mellom ampere, watt og volt for likestrøm' },
];

export default function OffGridRuntimeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="off-grid-runtime-calculator"
          title="Driftstid på batteri"
          description="Regn ut hvor lenge batteriet klarer å drive utstyr ved strømbrudd eller på hytta uten nett. Gratis og uten registrering."
        />

        <section aria-label="Driftstid på batteri">
          <OffGridRuntimeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
