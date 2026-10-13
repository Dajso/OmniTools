import { Metadata } from 'next';
import { GeneratorFuelCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Aggregat: drivstofforbruk – gratis kalkulator på nett',
  description: 'Regn ut hvor lenge et aggregat går på en tank, ut fra last og drivstoff. Gratis og uten registrering.',
  keywords: ['aggregat', 'drivstofforbruk', 'driftstid', 'generator', 'bensin'],
  alternates: { canonical: '/calculators/solar/generator-fuel-calculator' },
  openGraph: {
    title: 'Aggregat: drivstofforbruk',
    description: 'Regn ut hvor lenge et aggregat går på en tank, ut fra last og drivstoff',
    url: '/calculators/solar/generator-fuel-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Aggregat: drivstofforbruk',
  description: 'Regn ut hvor lenge et aggregat går på en tank, ut fra last og drivstoff',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn effekten', text: 'Oppgi merkeeffekten på aggregatet i watt.' },
  { name: 'Velg belastning', text: 'Hvor mange prosent av effekten bruker du?' },
  { name: 'Velg tankstørrelse og drivstoff', text: 'Oppgi tanken i liter og velg bensin, diesel eller propan.' },
  { name: 'Les av driftstiden', text: 'Du får driftstid og forbruk i liter per time.' },
];

const faqs = [
  { question: 'Hvor mye bruker et aggregat?', answer: 'Et lite bensinaggregat på 3 kW ved halv last bruker ofte rundt 0,7 liter i timen. Tallet avhenger av modell og last.' },
  { question: 'Hvorfor bruker aggregatet mer enn regnet?', answer: 'Små aggregater har dårlig virkningsgrad ved lav last. Regn tallet som et anslag.' },
  { question: 'Hva er forskjellen på bensin og diesel?', answer: 'Diesel har litt mer energi per liter og er ofte mer økonomisk. Propan er mer ren, men har lavere energi per liter.' },
  { question: 'Er det trygt å bruke aggregat innendørs?', answer: 'Nei. Eksosen inneholder giftig karbonmonoksid. Bruk alltid aggregat utendørs med god avstand til åpninger.' },
];

const relatedTools = [
  { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Driftstid på batteri', description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd' },
  { href: '/calculators/solar/inverter-size-calculator', title: 'Vekselretter', description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm' },
];

export default function GeneratorFuelCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="generator-fuel-calculator"
          title="Aggregat: drivstofforbruk"
          description="Regn ut hvor lenge et aggregat går på en tank, og hvor mange liter det bruker per time. Gratis og uten registrering."
        />

        <section aria-label="Aggregat: drivstofforbruk">
          <GeneratorFuelCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
