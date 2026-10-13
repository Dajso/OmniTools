import { Metadata } from 'next';
import { OilChangeTracker } from '@/components/calculators/auto';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Oljeskift og service – gratis kalkulator på nett',
  description: 'Hold oversikt over oljeskift og service ut fra kilometer eller tid. Gratis og uten registrering.',
  keywords: ['oljeskift', 'service', 'vedlikehold', 'bil', 'kilometerstand'],
  alternates: { canonical: '/calculators/auto/oil-change-tracker' },
  openGraph: {
    title: 'Oljeskift og service',
    description: 'Hold oversikt over oljeskift og service ut fra kilometer eller tid',
    url: '/calculators/auto/oil-change-tracker',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Oljeskift og service',
  description: 'Hold oversikt over oljeskift og service ut fra kilometer eller tid',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn kilometerstand', text: 'Oppgi dagens kilometerstand.' },
  { name: 'Registrer oljeskift', text: 'Legg til dato, kilometerstand og oljetype.' },
  { name: 'Se neste skift', text: 'Kalkulatoren viser når og ved hvilken kilometerstand neste skift er på tide.' },
];

const faqs = [
  { question: 'Hvor ofte bør jeg skifte olje?', answer: 'Følg anbefalingen i serviceheftet. Normalt er det hvert år eller hver 15 000 km for moderne biler.' },
  { question: 'Lagres dataene mine?', answer: 'Ja, men bare lokalt i nettleseren din. De deles ikke og kan forsvinne hvis du tømmer nettleserdata.' },
  { question: 'Hvilken olje bør jeg bruke?', answer: 'Bruk oljekvaliteten og viskositeten som står i instruksjonsboken for bilen.' },
  { question: 'Gjelder dette elbil?', answer: 'Nei, elbiler trenger ikke motorolje.' },
];

const relatedTools = [
  { href: '/calculators/auto/car-loan-payoff-calculator', title: 'Nedbetaling av billån', description: 'Se hvor mye du sparer på å betale ekstra på billånet' },
  { href: '/calculators/auto/tire-size-calculator', title: 'Dekkstørrelse', description: 'Sammenlign dekkstørrelser og regn ut avvik i speedometer' },
  { href: '/calculators/auto/fuel-consumption-converter', title: 'Drivstofforbruk (l/100 km)', description: 'Regn om forbruk mellom l/100 km, l/mil og MPG (US/UK)' },
];

export default function OilChangeTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="oil-change-tracker"
          title="Oljeskift og service"
          description="Hold oversikt over oljeskift og få beskjed om når neste skift nærmer seg. Gratis og uten registrering."
        />

        <section aria-label="Oljeskift og service">
          <OilChangeTracker />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
