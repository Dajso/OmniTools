import { Metadata } from 'next';
import { FuelConsumptionConverter } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Drivstofforbruk (l/100 km) – gratis kalkulator på nett',
  description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK). Gratis og uten registrering.',
  keywords: ['drivstofforbruk', 'l/100 km', 'liter per mil', 'MPG', 'bilforbruk'],
  alternates: { canonical: '/calculators/auto/fuel-consumption-converter' },
  openGraph: {
    title: 'Drivstofforbruk (l/100 km)',
    description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)',
    url: '/calculators/auto/fuel-consumption-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Drivstofforbruk (l/100 km)',
  description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn forbruket', text: 'Oppgi tallet i enheten du kjenner.' },
  { name: 'Velg enhet', text: 'Velg l/100 km, km/l eller MPG.' },
  { name: 'Les resultatet', text: 'Se forbruket i alle enhetene.' },
];

const faqs = [
  { question: 'Hvordan regner jeg l/100 km til km/l?', answer: 'Del 100 på l/100 km. 6,5 l/100 km er omtrent 15,4 km/l.' },
  { question: 'Hva er forskjellen på US og UK MPG?', answer: 'En amerikansk gallon er 3,785 liter og en britisk er 4,546 liter, så britiske MPG-tall er høyere for samme forbruk.' },
  { question: 'Hva er et normalt forbruk i Norge?', answer: 'Mange bensinbiler ligger på 6–9 l/100 km, dieselbiler litt lavere. Reelt forbruk er ofte høyere enn oppgitt WLTP-tall.' },
  { question: 'Hva er elbilers forbruk?', answer: 'Oppgis i kWh per 100 km, og kan ikke regnes direkte om til l/100 km uten å ta med energiinnholdet i drivstoffet.' },
];

const relatedTools = [
  { href: '/calculators/auto/tire-size-calculator', title: 'Dekkstørrelse', description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer' },
  { href: '/calculators/auto/ev-charging-calculator', title: 'Ladetid og ladekostnad for elbil', description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris' },
  { href: '/calculators/auto/car-loan-payoff-calculator', title: 'Nedbetaling av billån', description: 'Se hvor mye du sparer på å betale ekstra på billånet' },
];

export default function FuelConsumptionConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fuel-consumption-converter"
          title="Drivstofforbruk (l/100 km)"
          description="Regn om mellom liter per 100 km, km per liter og miles per gallon. Gratis og uten registrering."
        />

        <section aria-label="Drivstofforbruk (l/100 km)">
          <FuelConsumptionConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
