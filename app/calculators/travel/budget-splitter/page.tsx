import { Metadata } from 'next';
import { TravelBudgetSplitter } from '@/components/calculators/travel/travel-budget-splitter';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Del reiseutgifter – gratis kalkulator på nett',
  description: 'Del utgifter mellom reisefølget og se hvem som skylder hvem. Gratis og uten registrering.',
  keywords: ['del utgifter', 'reisebudsjett', 'felles utgifter', 'oppgjør'],
  alternates: { canonical: '/calculators/travel/budget-splitter' },
  openGraph: {
    title: 'Del reiseutgifter',
    description: 'Del utgifter mellom reisefølget og se hvem som skylder hvem',
    url: '/calculators/travel/budget-splitter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Del reiseutgifter',
  description: 'Del utgifter mellom reisefølget og se hvem som skylder hvem',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn personene', text: 'Skriv inn navn på alle som er med.' },
  { name: 'Legg inn utgiftene', text: 'Skriv inn beskrivelse og beløp i kroner for hver utgift.' },
  { name: 'Velg hvem som betalte', text: 'Velg hvem som la ut pengene, og hvem utgiften skal deles mellom.' },
  { name: 'Se oppgjøret', text: 'Kalkulatoren viser saldo per person og hvem som bør overføre penger til hvem.' },
];

const faqs = [
  { question: 'Må alle dele på alle utgiftene?', answer: 'Nei. Per utgift kan du velge hvem den deles mellom, for eksempel hvis noen ikke var med på middagen.' },
  { question: 'Hvordan regnes oppgjøret ut?', answer: 'Hver utgift deles likt mellom de valgte. Så regnes det ut hvor mye hver person har lagt ut og skylder, og oppgjøret settes opp med så få overføringer som mulig.' },
  { question: 'Kan jeg bruke andre valutaer?', answer: 'Beløpene regnes som norske kroner. Regn om utenlandske beløp først med valutakalkulatoren.' },
  { question: 'Lagres dataene?', answer: 'Nei. Alt beregnes i nettleseren din og forsvinner når du lukker siden.' },
];

const relatedTools = [
  { href: '/calculators/travel/currency-converter', title: 'Valuta på reise', description: 'Regn om mellom norske kroner og andre valutaer, også uten nett, med veiledende kurser' },
  { href: '/calculators/finance/tip-calculator', title: 'Drikkepengekalkulator', description: 'Regn ut drikkepenger og del regningen mellom flere' },
];

export default function BudgetSplitterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="budget-splitter"
          title="Del reiseutgifter"
          description="Fordel reiseutgifter mellom deltakerne og se hvem som skylder hvem, med færrest mulig overføringer. Gratis og uten registrering."
        />

        <section aria-label="Del reiseutgifter">
          <TravelBudgetSplitter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
