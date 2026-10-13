import { Metadata } from 'next';
import { CapRateCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Yield-kalkulator (direkteavkastning) – gratis kalkulator på nett',
  description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig. Gratis og uten registrering.',
  keywords: ['yield', 'direkteavkastning', 'utleiebolig', 'investeringsbolig', 'avkastning'],
  alternates: { canonical: '/calculators/realestate/cap-rate-calculator' },
  openGraph: {
    title: 'Yield-kalkulator (direkteavkastning)',
    description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig',
    url: '/calculators/realestate/cap-rate-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Yield-kalkulator (direkteavkastning)',
  description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi kjøpesum', text: 'Skriv inn hva boligen koster, gjerne inkludert omkostninger.' },
  { name: 'Legg inn leie', text: 'Oppgi samlet leie per år før kostnader.' },
  { name: 'Legg inn kostnader', text: 'Felleskostnader, eiendomsskatt, forsikring, vedlikehold og ledighet.' },
  { name: 'Les yielden', text: 'Se bruttoyield, nettoyield og netto leieinntekt per år.' },
];

const faqs = [
  { question: 'Hva er yield?', answer: 'Yield er årlig avkastning på boligen i prosent av kjøpesummen. Bruttoyield bruker bare leien, nettoyield trekker fra driftskostnader.' },
  { question: 'Hva er en god yield i Norge?', answer: 'I store byer ligger nettoyield ofte på 2–4 %, og enkelte steder noe høyere. Husk at du også får verdistigning (eller fall) og må betale renter.' },
  { question: 'Er renter med i beregningen?', answer: 'Nei. Yield ser på boligen alene, uavhengig av finansieringen. Bruk kalkulatoren for egenkapitalavkastning for å se effekten av lånet.' },
  { question: 'Hvilke kostnader bør jeg ta med?', answer: 'Felleskostnader, kommunale avgifter, eiendomsskatt, forsikring, vedlikehold og et påslag for ledighet mellom leietakere.' },
];

const relatedTools = [
  { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Egenkapitalavkastning', description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig' },
  { href: '/calculators/realestate/gross-rent-multiplier-calculator', title: 'Brutto leiemultiplikator', description: 'Regn ut multiplikator (pris / årlig leie) for å sammenligne utleieboliger' },
];

export default function CapRateCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="cap-rate-calculator"
          title="Yield-kalkulator (direkteavkastning)"
          description="Regn ut brutto- og nettoyield på en utleiebolig ut fra kjøpesum, leie og kostnader. Gratis og uten registrering."
        />

        <section aria-label="Yield-kalkulator (direkteavkastning)">
          <CapRateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
