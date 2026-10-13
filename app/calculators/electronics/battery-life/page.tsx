import { Metadata } from 'next';
import { BatteryLifeCalculator } from '@/components/calculators/electronics';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Batterilevetid – gratis kalkulator på nett',
  description: 'Regn ut hvor lenge et batteri varer ut fra kapasitet og strømforbruk. Gratis og uten registrering.',
  keywords: ['batterilevetid', 'batteri', 'driftstid', 'mAh', 'kapasitet'],
  alternates: { canonical: '/calculators/electronics/battery-life' },
  openGraph: {
    title: 'Batterilevetid',
    description: 'Regn ut hvor lenge et batteri varer ut fra kapasitet og strømforbruk',
    url: '/calculators/electronics/battery-life',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Batterilevetid',
  description: 'Regn ut hvor lenge et batteri varer ut fra kapasitet og strømforbruk',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg batteri', text: 'Velg en vanlig type eller legg inn egen kapasitet.' },
  { name: 'Legg inn strømforbruket', text: 'Gjennomsnittlig strøm fra enheten i milliampere.' },
  { name: 'Juster virkningsgrad og driftsandel', text: 'Ta hensyn til tap og hvor mye av tiden enheten er på.' },
  { name: 'Les av levetiden', text: 'Se timer, dager og minutter.' },
];

const faqs = [
  { question: 'Hvordan regnes batterilevetid ut?', answer: 'Tid i timer = kapasitet i mAh ÷ strøm i mA. Kalkulatoren justerer for virkningsgrad og driftsandel.' },
  { question: 'Hvorfor varer batteriet kortere i praksis?', answer: 'Kapasiteten oppgis ved lav belastning og romtemperatur. Kulde, høy strøm og aldring gir lavere kapasitet.' },
  { question: 'Hva er driftsandel?', answer: 'Hvor stor del av tiden enheten er på. En sensor som sover 99 % av tiden, har 1 % driftsandel.' },
  { question: 'Er kapasitetene i listen nøyaktige?', answer: 'Nei, de er typiske verdier. Se databladet til batteriet ditt.' },
];

const relatedTools = [
  { href: '/calculators/electronics/ohms-law-calculator', title: 'Ohms lov', description: 'Regn ut spenning, strøm, motstand og effekt med Ohms lov' },
  { href: '/calculators/electronics/555-timer', title: '555-timer', description: 'Regn ut frekvens og tider for 555-kretser, astabil og monostabil' },
  { href: '/calculators/electronics/heat-sink', title: 'Kjøleribbe', description: 'Regn ut nødvendig termisk motstand for kjøleribbe' },
];

export default function BatteryLifePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="battery-life"
          title="Batterilevetid"
          description="Regn ut hvor lenge et batteri varer ut fra kapasitet i mAh og strømforbruk i mA, med virkningsgrad og driftsandel. Gratis og uten registrering."
        />

        <section aria-label="Batterilevetid">
          <BatteryLifeCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
