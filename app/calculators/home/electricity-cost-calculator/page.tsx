import { Metadata } from 'next';
import { ElectricityCostCalculator } from '@/components/calculators/home';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Strømkostnad – gratis kalkulator på nett',
  description: 'Regn ut hva det koster å bruke elektriske apparater, med strømpris i øre per kWh. Gratis og uten registrering.',
  keywords: ['strømkostnad', 'strømpris', 'kWh', 'øre per kWh', 'apparat', 'forbruk'],
  alternates: { canonical: '/calculators/home/electricity-cost-calculator' },
  openGraph: {
    title: 'Strømkostnad',
    description: 'Regn ut hva det koster å bruke elektriske apparater, med strømpris i øre per kWh',
    url: '/calculators/home/electricity-cost-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Strømkostnad',
  description: 'Regn ut hva det koster å bruke elektriske apparater, med strømpris i øre per kWh',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg apparat eller skriv inn effekt', text: 'Trykk på et vanlig apparat, eller skriv inn watt fra typeskiltet.' },
  { name: 'Oppgi bruk', text: 'Fyll inn timer per dag og dager per måned.' },
  { name: 'Legg inn priser', text: 'Skriv inn strømpris og nettleie i øre per kWh inkludert mva. Du finner dem på strømregningen.' },
  { name: 'Les resultatet', text: 'Se forbruk i kWh og kostnad per dag, måned og år.' },
];

const faqs = [
  { question: 'Hvordan regner jeg ut strømforbruk?', answer: 'Forbruk i kWh er effekt i watt ganger timer, delt på 1 000. Et apparat på 2 000 W som går i 3 timer bruker 6 kWh.' },
  { question: 'Hva er Norgespris?', answer: 'Norgespris er en frivillig ordning for husholdninger med fast strømpris på 50 øre per kWh inkludert mva. (40 øre uten mva.), opptil 5 000 kWh i måneden. Sjekk gjeldende vilkår hos strømleverandøren eller NVE.' },
  { question: 'Hva er nettleie?', answer: 'Nettleien er det du betaler nettselskapet for å få strømmen levert. Den består av et fastledd og et energiledd per kWh. Kalkulatoren bruker bare energileddet.' },
  { question: 'Hvorfor er resultatet annerledes enn på strømregningen?', answer: 'Apparater bruker ikke alltid full effekt, og kalkulatoren regner ikke med fastledd, avgifter som er bundet til fast beløp, eller timepriser som varierer gjennom døgnet.' },
];

const relatedTools = [
  { href: '/calculators/home/solar-panel-calculator', title: 'Solcellekalkulator', description: 'Beregn behov, produksjon og innsparing for solcelleanlegg med norske strømpriser' },
  { href: '/calculators/home/btu-calculator', title: 'Varmepumpekalkulator', description: 'Anslå hvor stor varmepumpe (kW) rommet trenger til oppvarming og kjøling' },
];

export default function ElectricityCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="electricity-cost-calculator"
          title="Strømkostnad"
          description="Regn ut hva et apparat koster å bruke per dag, måned og år, med strømpris og nettleie i øre per kWh. Gratis og uten registrering."
        />

        <section aria-label="Strømkostnad">
          <ElectricityCostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
