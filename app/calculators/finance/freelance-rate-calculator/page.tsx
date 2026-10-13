import { Metadata } from 'next';
import { FreelanceRateCalculator } from '@/components/calculators/finance/freelance-rate-calculator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Timepris for frilansere – gratis kalkulator på nett',
  description: 'Beregn hvilken timepris du bør ta som frilanser eller selvstendig. Gratis og uten registrering.',
  keywords: ['frilans', 'timepris', 'konsulent', 'selvstendig næringsdrivende', 'honorar'],
  alternates: { canonical: '/calculators/finance/freelance-rate-calculator' },
  openGraph: {
    title: 'Timepris for frilansere',
    description: 'Beregn hvilken timepris du bør ta som frilanser eller selvstendig',
    url: '/calculators/finance/freelance-rate-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Timepris for frilansere',
  description: 'Beregn hvilken timepris du bør ta som frilanser eller selvstendig',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi ønsket inntekt', text: 'Skriv inn hva du vil sitte igjen med etter skatt i året.' },
  { name: 'Fyll inn kostnader', text: 'Oppgi årlige driftskostnader som regnskapsfører, programvare og kontor.' },
  { name: 'Legg inn arbeidstid', text: 'Oppgi fakturerbare timer per uke og arbeidsuker i året.' },
  { name: 'Legg inn skattesats', text: 'Oppgi anslått skattesats, og se anbefalt timepris.' },
];

const faqs = [
  { question: 'Hvorfor må timeprisen være mye høyere enn timelønn?', answer: 'Som selvstendig betaler du selv for sykdom, ferie, pensjon, forsikring og administrasjon, og du kan ikke fakturere alle timene du jobber.' },
  { question: 'Er MVA med i timeprisen?', answer: 'Nei. Hvis du er MVA-registrert, legger du 25 % MVA oppå timeprisen på fakturaen.' },
  { question: 'Hva er fakturerbare timer?', answer: 'Timer du faktisk kan fakturere kunder for. Salg, administrasjon og kompetanseheving er ikke fakturerbare, så tallet er ofte 50–70 % av arbeidstiden.' },
];

const relatedTools = [
  { href: '/calculators/finance/hourly-salary-calculator', title: 'Timelønn til årslønn', description: 'Regn om mellom timelønn, månedslønn og årslønn' },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="freelance-rate-calculator"
          title="Timepris for frilansere"
          description="Beregn hvilken timepris du bør ta som frilanser eller selvstendig"
        />

        <section aria-label="Timepris for frilansere">
          <FreelanceRateCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
