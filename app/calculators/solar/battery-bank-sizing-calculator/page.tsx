import { Metadata } from 'next';
import { BatteryBankSizingCalculator } from '@/components/calculators/solar';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Batteribank – gratis kalkulator på nett',
  description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid. Gratis og uten registrering.',
  keywords: ['batteribank', 'off-grid', 'hytte', '12V', 'utladningsdybde', 'solbatteri'],
  alternates: { canonical: '/calculators/solar/battery-bank-sizing-calculator' },
  openGraph: {
    title: 'Batteribank',
    description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid',
    url: '/calculators/solar/battery-bank-sizing-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Batteribank',
  description: 'Regn ut hvor mange batterier du trenger til hytte eller off-grid',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn forbruket', text: 'Oppgi hvor mange watt-timer (Wh) du bruker per døgn.' },
  { name: 'Velg antall døgn uten lading', text: 'Hvor lenge skal batteriene klare seg uten sol eller aggregat? To døgn er et vanlig utgangspunkt.' },
  { name: 'Velg batterityper og spenning', text: 'Velg blybatteri, AGM, gel eller litium (LiFePO4), og systemspenning på 12, 24 eller 48 V.' },
  { name: 'Les av antall batterier', text: 'Du får total kapasitet og hvordan batteriene bør kobles i serie og parallell.' },
];

const faqs = [
  { question: 'Hvorfor trenger jeg mer kapasitet enn forbruket?', answer: 'Bly-baserte batterier bør ikke lades ut mer enn ca. 50 %, ellers går levetiden ned. Litium tåler ca. 80 % eller mer. Kalkulatoren tar høyde for dette.' },
  { question: 'Hva er forskjellen på 12, 24 og 48 V?', answer: 'Høyere spenning gir lavere strøm for samme effekt. Det betyr tynnere kabler og mindre tap, og er smart for større anlegg.' },
  { question: 'Er litium verdt prisen?', answer: 'Litium koster mer, men tåler dypere utlading, veier mindre og varer ofte mange ganger flere sykluser. Over tid kan det komme billigere ut.' },
  { question: 'Fungerer batterier i kulde?', answer: 'Ytelsen går ned i kulde, og litium kan ikke lades under 0 °C uten oppvarming. Plasser batteriene frostfritt.' },
];

const relatedTools = [
  { href: '/calculators/solar/off-grid-runtime-calculator', title: 'Driftstid på batteri', description: 'Regn ut hvor lenge reservestrøm klarer å drive utstyr ved strømbrudd' },
  { href: '/calculators/solar/inverter-size-calculator', title: 'Vekselretter', description: 'Regn ut nødvendig størrelse på inverter ut fra effektbehov og startstrøm' },
  { href: '/calculators/solar/dc-power-calculator', title: 'Ampere og watt (DC)', description: 'Regn om mellom ampere, watt og volt for likestrøm' },
];

export default function BatteryBankSizingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="battery-bank-sizing-calculator"
          title="Batteribank"
          description="Regn ut hvor mange batterier du trenger til hytte, bobil eller båt, ut fra forbruk og antall døgn uten lading. Gratis og uten registrering."
        />

        <section aria-label="Batteribank">
          <BatteryBankSizingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
