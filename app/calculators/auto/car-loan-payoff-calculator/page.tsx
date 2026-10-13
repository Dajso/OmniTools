import { Metadata } from 'next';
import { CarLoanPayoffCalculator } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Nedbetaling av billån – gratis kalkulator på nett',
  description: 'Se hvor mye du sparer på å betale ekstra på billånet. Gratis og uten registrering.',
  keywords: ['billån', 'ekstra avdrag', 'nedbetaling', 'renter spart', 'billånskalkulator'],
  alternates: { canonical: '/calculators/auto/car-loan-payoff-calculator' },
  openGraph: {
    title: 'Nedbetaling av billån',
    description: 'Se hvor mye du sparer på å betale ekstra på billånet',
    url: '/calculators/auto/car-loan-payoff-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Nedbetaling av billån',
  description: 'Se hvor mye du sparer på å betale ekstra på billånet',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn lånet', text: 'Lånebeløp, rente og nedbetalingstid i måneder.' },
  { name: 'Legg til ekstra innbetalinger', text: 'Månedlig ekstra beløp og eventuelt en engangsinnbetaling.' },
  { name: 'Les sammenligningen', text: 'Se ny sluttdato og spart rentekostnad.' },
];

const faqs = [
  { question: 'Lønner det seg å betale ekstra?', answer: 'Ja, du betaler mindre renter, men vurder om pengene gir bedre avkastning andre steder. Sjekk også at lånet ikke har gebyr for ekstra nedbetaling.' },
  { question: 'Hva er et annuitetslån?', answer: 'Et lån der terminbeløpet er likt hver måned. Mot slutten er mesteparten avdrag.' },
  { question: 'Er gebyrer med?', answer: 'Nei, kalkulatoren tar ikke med etableringsgebyr og termingebyr. Husk at disse kommer i tillegg.' },
  { question: 'Er renteutgifter fradragsberettiget?', answer: 'Ja, renter på privat gjeld gir skattefradrag på 22 % i alminnelig inntekt.' },
];

const relatedTools = [
  { href: '/calculators/auto/fuel-consumption-converter', title: 'Drivstofforbruk (l/100 km)', description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)' },
  { href: '/calculators/auto/ev-charging-calculator', title: 'Ladetid og ladekostnad for elbil', description: 'Regn ut ladetid og kostnad ut fra ladeeffekt, batteri og strømpris' },
  { href: '/calculators/auto/oil-change-tracker', title: 'Oljeskift og service', description: 'Hold oversikt over oljeskift og service ut fra kilometer eller tid' },
];

export default function CarLoanPayoffCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="car-loan-payoff-calculator"
          title="Nedbetaling av billån"
          description="Se hvor mye du sparer i renter og tid ved å betale ekstra på billånet. Gratis og uten registrering."
        />

        <section aria-label="Nedbetaling av billån">
          <CarLoanPayoffCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
