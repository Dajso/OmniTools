import { Metadata } from 'next';
import { SalesTaxCalculator } from '@/components/calculators/finance';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'MVA-kalkulator – gratis kalkulator på nett',
  description: 'Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA. Gratis og uten registrering.',
  keywords: ['MVA', 'merverdiavgift', 'moms', 'pris med mva', 'pris uten mva'],
  alternates: { canonical: '/calculators/finance/sales-tax-calculator' },
  openGraph: {
    title: 'MVA-kalkulator',
    description: 'Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA',
    url: '/calculators/finance/sales-tax-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'MVA-kalkulator',
  description: 'Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg om prisen har MVA', text: 'Velg om beløpet du skriver inn er med eller uten MVA.' },
  { name: 'Skriv inn beløpet', text: 'Oppgi prisen i kroner.' },
  { name: 'Velg MVA-sats', text: 'Velg 25 %, 15 %, 12 % eller 0 %, eller skriv inn en egen sats.' },
  { name: 'Les resultatet', text: 'Se pris uten MVA, MVA-beløp og pris med MVA.' },
];

const faqs = [
  { question: 'Hvilke MVA-satser gjelder i Norge?', answer: 'Alminnelig sats er 25 %. Næringsmidler har lavere sats på 15 %. Persontransport, overnatting, kino og kringkasting har 12 %. Noen varer og tjenester, som bøker og aviser, er fritatt. Sjekk alltid Skatteetaten for gjeldende satser.' },
  { question: 'Hvordan regner jeg ut MVA fra en pris med MVA?', answer: 'Del prisen på 1 + satsen. Med 25 % MVA deler du på 1,25. Forskjellen mellom prisen med og uten MVA er MVA-beløpet.' },
  { question: 'Hva er forskjellen på MVA og moms?', answer: 'Ingen. Moms er dagligtale for merverdiavgift (MVA).' },
  { question: 'Kan jeg få tilbake MVA?', answer: 'Registrerte virksomheter kan fradragsføre inngående MVA. Privatpersoner får normalt ikke MVA tilbake.' },
];

const relatedTools = [
  { href: '/calculators/finance/discount-calculator', title: 'Rabattkalkulator', description: 'Regn ut rabatt, tilbudspris og pris med MVA' },
  { href: '/calculators/finance/tip-calculator', title: 'Drikkepengekalkulator', description: 'Regn ut drikkepenger og del regningen mellom flere' },
];

export default function SalesTaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sales-tax-calculator"
          title="MVA-kalkulator"
          description="Regn ut merverdiavgift (25 %, 15 % og 12 %) med og uten MVA"
        />

        <section aria-label="MVA-kalkulator">
          <SalesTaxCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
