import { Metadata } from 'next';
import { EVChargingCalculator } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ladetid og ladekostnad for elbil – gratis kalkulator på nett',
  description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris. Gratis og uten registrering.',
  keywords: ['elbil', 'lading', 'ladetid', 'ladekostnad', 'kWh', 'hjemmelading'],
  alternates: { canonical: '/calculators/auto/ev-charging-calculator' },
  openGraph: {
    title: 'Ladetid og ladekostnad for elbil',
    description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris',
    url: '/calculators/auto/ev-charging-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ladetid og ladekostnad for elbil',
  description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg bil eller skriv inn batteriet', text: 'Velg modell, eller oppgi batterikapasiteten i kWh.' },
  { name: 'Sett ladenivå', text: 'Oppgi hvor mye batteri du har nå, og hvor mye du vil lade til.' },
  { name: 'Velg lader', text: 'Fra vanlig stikkontakt til hurtiglader.' },
  { name: 'Skriv inn strømpris', text: 'Pris i kroner per kWh.' },
];

const faqs = [
  { question: 'Hvor lang tid tar det å lade hjemme?', answer: 'Med en enfaset 7,4 kW-lader tar det rundt 8–10 timer å lade et stort batteri fra lavt nivå. Ladeboks gir langt raskere lading enn vanlig stikkontakt.' },
  { question: 'Hva koster hjemmelading?', answer: 'Det avhenger av strømavtalen din. Norgespris gir 50 øre/kWh inkl. mva. for forbruk opp til 5 000 kWh i måneden i husholdninger.' },
  { question: 'Hvorfor går hurtiglading saktere over 80 %?', answer: 'Bilen reduserer ladefarten for å skåne batteriet. Det er vanligst å lade til 80 % på reise.' },
  { question: 'Hvilken lader må jeg ha?', answer: 'Det kommer an på bilen, strømnettet og anlegget. Få en elektriker til å vurdere sikringer og nettype før du installerer.' },
];

const relatedTools = [
  { href: '/calculators/auto/horsepower-kw-converter', title: 'Hestekrefter til kW', description: 'Regn om mellom hestekrefter (hk) og kilowatt (kW)' },
  { href: '/calculators/auto/fuel-consumption-converter', title: 'Drivstofforbruk (l/100 km)', description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)' },
  { href: '/calculators/auto/car-loan-payoff-calculator', title: 'Nedbetaling av billån', description: 'Se hvor mye du sparer på å betale ekstra på billånet' },
];

export default function EVChargingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ev-charging-calculator"
          title="Ladetid og ladekostnad for elbil"
          description="Regn ut hvor lang tid det tar å lade elbilen, og hva det koster. Gratis og uten registrering."
        />

        <section aria-label="Ladetid og ladekostnad for elbil">
          <EVChargingCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
