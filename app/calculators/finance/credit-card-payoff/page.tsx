import { Metadata } from 'next';
import { CreditCardPayoffCalculator } from '@/components/calculators/finance/credit-card-payoff-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Kalkulator for nedbetaling av kredittkortgjeld – gratis kalkulator på nett',
  description: 'Se hvor lang tid det tar å betale ned kredittkortgjeld med minstebeløp eller fast månedsbeløp. Gratis og uten registrering.',
  keywords: ['kredittkort', 'nedbetaling', 'forbrukslån', 'gjeldskalkulator', 'minstebeløp'],
  alternates: { canonical: '/calculators/finance/credit-card-payoff' },
  openGraph: {
    title: 'Kalkulator for nedbetaling av kredittkortgjeld',
    description: 'Se hvor lang tid det tar å betale ned kredittkortgjeld med minstebeløp eller fast månedsbeløp',
    url: '/calculators/finance/credit-card-payoff',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kalkulator for nedbetaling av kredittkortgjeld',
  description: 'Se hvor lang tid det tar å betale ned kredittkortgjeld med minstebeløp eller fast månedsbeløp',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi gjelden', text: 'Skriv inn hvor mye du skylder på kredittkortet i dag.' },
  { name: 'Legg inn renten', text: 'Bruk effektiv rente per år fra kortutstederen. Kredittkort har ofte over 20 %.' },
  { name: 'Velg månedlig innbetaling', text: 'Oppgi beløpet du kan betale hver måned. Det bør være godt over renten.' },
  { name: 'Se hvor lang tid det tar', text: 'Kalkulatoren viser nedbetalingstid, sum renter og totalbeløp.' },
];

const faqs = [
  { question: 'Hvorfor tar det så lang tid å betale ned kredittkort?', answer: 'Renten er høy, ofte 20–25 % effektivt. Hvis månedsbeløpet bare så vidt dekker renten, går det meste av innbetalingen til renter og ikke til selve gjelden.' },
  { question: 'Hva er forskjellen på nominell og effektiv rente?', answer: 'Nominell rente er den oppgitte årsrenten. Effektiv rente tar med gebyrer og renters rente, og er det som faktisk koster deg. Bruk effektiv rente når du sammenligner.' },
  { question: 'Bør jeg refinansiere kredittkortgjelden?', answer: 'Hvis du kan flytte gjelden til et lån med lavere effektiv rente, vil du som regel spare mye. Regn også med etableringsgebyr og termingebyr før du bestemmer deg.' },
  { question: 'Hva skjer hvis jeg bare betaler minstebeløpet?', answer: 'Du betaler ned veldig sakte og får høye rentekostnader. Prøv å øke månedsbeløpet så mye du kan.' },
];

const relatedTools = [
  { href: '/calculators/finance/debt-snowball-calculator', title: 'Snøballmetoden for gjeld', description: 'Lag en plan for å bli kvitt gjelden med snøballmetoden' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="credit-card-payoff"
          title="Kalkulator for nedbetaling av kredittkortgjeld"
          description="Se hvor lang tid det tar å betale ned kredittkortgjeld med minstebeløp eller fast månedsbeløp"
        />

        <section aria-label="Kalkulator for nedbetaling av kredittkortgjeld">
          <CreditCardPayoffCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
