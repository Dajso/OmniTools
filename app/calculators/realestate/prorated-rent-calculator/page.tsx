import { Metadata } from 'next';
import { ProratedRentCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Forholdsmessig husleie – gratis kalkulator på nett',
  description: 'Regn ut husleie når leietaker flytter inn eller ut midt i måneden. Gratis og uten registrering.',
  keywords: ['husleie', 'forholdsmessig leie', 'innflytting', 'dagsleie'],
  alternates: { canonical: '/calculators/realestate/prorated-rent-calculator' },
  openGraph: {
    title: 'Forholdsmessig husleie',
    description: 'Regn ut husleie når leietaker flytter inn eller ut midt i måneden',
    url: '/calculators/realestate/prorated-rent-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Forholdsmessig husleie',
  description: 'Regn ut husleie når leietaker flytter inn eller ut midt i måneden',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi husleien', text: 'Husleie per måned i kroner.' },
  { name: 'Sett innflyttingsdag', text: 'Dagen du flytter inn, og antall dager i måneden.' },
  { name: 'Les resultatet', text: 'Se pris per dag og hva du skal betale for resten av måneden.' },
];

const faqs = [
  { question: 'Hvordan regnes forholdsmessig husleie ut?', answer: 'Månedsleien deles på antall dager i måneden og ganges med dagene du bor der.' },
  { question: 'Er innflyttingsdagen med?', answer: 'Ja, innflyttingsdagen telles som en hel dag.' },
  { question: 'Må jeg bruke denne metoden?', answer: 'Nei, det avtales i leiekontrakten. Noen bruker 30 dager i alle måneder, andre faktisk antall dager.' },
  { question: 'Hva med depositum?', answer: 'Depositum er ikke med. Det kan maksimalt tilsvare seks måneders husleie og skal settes på en depositumskonto.' },
];

const relatedTools = [
  { href: '/calculators/realestate/cap-rate-calculator', title: 'Yield-kalkulator (direkteavkastning)', description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig' },
  { href: '/calculators/realestate/gross-rent-multiplier-calculator', title: 'Brutto leiemultiplikator', description: 'Regn ut multiplikator (pris / årlig leie) for å sammenligne utleieboliger' },
];

export default function ProratedRentCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="prorated-rent-calculator"
          title="Forholdsmessig husleie"
          description="Regn ut husleie for en delvis måned når du flytter inn eller ut midt i måneden. Gratis og uten registrering."
        />

        <section aria-label="Forholdsmessig husleie">
          <ProratedRentCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
