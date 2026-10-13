import { Metadata } from 'next';
import { ClosingCostCalculator } from '@/components/calculators/realestate';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Omkostninger ved boligkjøp – gratis kalkulator på nett',
  description: 'Anslå kjøpsomkostninger: dokumentavgift, tinglysing og andre gebyrer. Gratis og uten registrering.',
  keywords: ['dokumentavgift', 'tinglysing', 'kjøpsomkostninger', 'boligkjøp', 'omkostninger'],
  alternates: { canonical: '/calculators/realestate/closing-cost-estimator' },
  openGraph: {
    title: 'Omkostninger ved boligkjøp',
    description: 'Anslå kjøpsomkostninger: dokumentavgift, tinglysing og andre gebyrer',
    url: '/calculators/realestate/closing-cost-estimator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Omkostninger ved boligkjøp',
  description: 'Anslå kjøpsomkostninger: dokumentavgift, tinglysing og andre gebyrer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi kjøpesum og egenkapital', text: 'Skriv inn kjøpesummen og hvor stor egenkapital du har.' },
  { name: 'Velg boligtype', text: 'Selveier har dokumentavgift på 2,5 %. Borettslag og andelsbolig har ikke det.' },
  { name: 'Legg inn etableringsgebyr', text: 'Banken tar vanligvis et gebyr for å opprette lånet.' },
  { name: 'Les resultatet', text: 'Se omkostninger og hvor mye kontanter du trenger totalt.' },
];

const faqs = [
  { question: 'Hva er dokumentavgift?', answer: 'En avgift staten tar på kjøp av selveid fast eiendom. Den er 2,5 % av kjøpesummen og betales ved overtakelse.' },
  { question: 'Betaler jeg dokumentavgift i borettslag?', answer: 'Nei. Dokumentavgift gjelder bare selveiere. Andelsleiligheter har likevel andre kostnader, for eksempel overdragelsesgebyr.' },
  { question: 'Hva koster tinglysing?', answer: 'Tinglysing av skjøte og pantedokument koster hver rundt 585 kr. Sjekk Kartverket for oppdatert sats.' },
  { question: 'Hva er ikke med?', answer: 'Boligkjøperforsikring, egen tilstandsrapport og eventuelle utgifter til flytting og oppussing er ikke inkludert.' },
];

const relatedTools = [
  { href: '/calculators/realestate/house-affordability-calculator', title: 'Hvor mye bolig har jeg råd til?', description: 'Anslå hvor stort lån og hvilken boligpris du kan klare ut fra inntekt, gjeld og egenkapital' },
  { href: '/calculators/realestate/cap-rate-calculator', title: 'Yield-kalkulator (direkteavkastning)', description: 'Regn ut direkteavkastning (yield) for å vurdere en utleiebolig' },
];

export default function ClosingCostEstimatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="closing-cost-estimator"
          title="Omkostninger ved boligkjøp"
          description="Anslå dokumentavgift, tinglysing og andre omkostninger når du kjøper bolig i Norge. Gratis og uten registrering."
        />

        <section aria-label="Omkostninger ved boligkjøp">
          <ClosingCostCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
