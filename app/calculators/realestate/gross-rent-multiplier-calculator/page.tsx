import { Metadata } from 'next';
import { GRMCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Brutto leiemultiplikator – gratis kalkulator på nett',
  description: 'Regn ut multiplikator (pris / årlig leie) for å sammenligne utleieboliger. Gratis og uten registrering.',
  keywords: ['leiemultiplikator', 'GRM', 'pris til leie', 'utleieanalyse'],
  alternates: { canonical: '/calculators/realestate/gross-rent-multiplier-calculator' },
  openGraph: {
    title: 'Brutto leiemultiplikator',
    description: 'Regn ut multiplikator (pris / årlig leie) for å sammenligne utleieboliger',
    url: '/calculators/realestate/gross-rent-multiplier-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Brutto leiemultiplikator',
  description: 'Regn ut multiplikator (pris / årlig leie) for å sammenligne utleieboliger',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi kjøpesum', text: 'Hva boligen koster.' },
  { name: 'Oppgi årlig leie', text: 'Total leie i året før kostnader.' },
  { name: 'Les multiplikatoren', text: 'Se hvor mange år med leie det tar å dekke kjøpesummen.' },
];

const faqs = [
  { question: 'Hva er brutto leiemultiplikator?', answer: 'Kjøpesum delt på årlig bruttoleie. Lavere tall betyr at boligen er billig i forhold til leien.' },
  { question: 'Hva er en vanlig multiplikator i Norge?', answer: 'I større byer er 20–30 vanlig. Det tilsvarer omtrent en bruttoyield på 3–5 %.' },
  { question: 'Hva mangler i tallet?', answer: 'Kostnader, ledighet, renter og skatt er ikke med. Bruk yield-kalkulatoren for et mer realistisk bilde.' },
];

const relatedTools = [
  { href: '/calculators/realestate/cap-rate-calculator', title: 'Yield-kalkulator (direkteavkastning)', description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig' },
  { href: '/calculators/realestate/cash-on-cash-calculator', title: 'Egenkapitalavkastning', description: 'Regn ut avkastningen på egenkapitalen i en belånt utleiebolig' },
];

export default function GrossRentMultiplierCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="gross-rent-multiplier-calculator"
          title="Brutto leiemultiplikator"
          description="Regn ut brutto leiemultiplikator for en utleiebolig: kjøpesum delt på årlig leie. Gratis og uten registrering."
        />

        <section aria-label="Brutto leiemultiplikator">
          <GRMCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
