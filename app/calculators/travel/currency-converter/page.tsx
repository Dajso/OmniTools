import { Metadata } from 'next';
import { CurrencyConverter } from '@/components/calculators/travel/currency-converter';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Valuta på reise – gratis kalkulator på nett',
  description: 'Regn om mellom norske kroner og andre valutaer, også uten nett, med veiledende kurser. Gratis og uten registrering.',
  keywords: ['valuta', 'reise', 'valutakurs', 'vekslingskurs', 'uten nett'],
  alternates: { canonical: '/calculators/travel/currency-converter' },
  openGraph: {
    title: 'Valuta på reise',
    description: 'Regn om mellom norske kroner og andre valutaer, også uten nett, med veiledende kurser',
    url: '/calculators/travel/currency-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Valuta på reise',
  description: 'Regn om mellom norske kroner og andre valutaer, også uten nett, med veiledende kurser',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv inn beløpet', text: 'Skriv inn beløpet du vil regne om, eller bruk hurtigknappene.' },
  { name: 'Velg valutaer', text: 'Velg valutaen du regner fra og til. Norske kroner er valgt som standard.' },
  { name: 'Se resultatet', text: 'Du får beløpet og kursen begge veier med en gang.' },
  { name: 'Bruk hurtigoppslaget', text: 'Tabellen viser vanlige beløp, praktisk når du skal vurdere priser i butikken.' },
  { name: 'Bytt retning', text: 'Trykk på bytteknappen for å snu omregningen.' },
];

const faqs = [
  { question: 'Hvor nøyaktige er kursene?', answer: 'Kursene i kalkulatoren er veiledende og ikke oppdatert i sanntid. De egner seg til å få et bilde av prisnivået. Sjekk kursen i bank- eller betalingsappen din før du veksler eller handler.' },
  { question: 'Fungerer den uten nett?', answer: 'Ja. Kalkulatoren bruker lagrede kurser og trenger ikke internett.' },
  { question: 'Hvilke valutaer støttes?', answer: 'Over 30, blant annet norske, svenske og danske kroner, euro, amerikanske dollar, britiske pund, sveitsiske franc, japanske yen og vanlige feriedestinasjoner som Thailand, Tyrkia og Polen.' },
  { question: 'Hvorfor er kursen i banken en annen?', answer: 'Banker og vekslingskontor legger på et påslag og gebyrer. Kursen her er en midtkurs uten påslag. Vær også oppmerksom på påslag ved kortbetaling og uttak i utlandet.' },
  { question: 'Bør jeg betale i norske kroner eller lokal valuta med kort i utlandet?', answer: 'Velg som regel lokal valuta. Hvis terminalen tilbyr å belaste i norske kroner, inneholder kursen ofte et høyt påslag.' },
];

const relatedTools = [
  { href: '/calculators/travel/budget-splitter', title: 'Del reiseutgifter', description: 'Del utgifter mellom reisefølget og se hvem som skylder hvem' },
];

export default function CurrencyConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="travel-currency-converter"
          title="Valuta på reise"
          description="Regn om mellom norske kroner og over 30 valutaer, også uten nett. Veiledende kurser til planlegging av reisen. Gratis og uten registrering."
        />

        <section aria-label="Valuta på reise">
          <CurrencyConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
