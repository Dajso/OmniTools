import { Metadata } from 'next';
import { DateDifferenceCalculator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dager mellom to datoer – gratis kalkulator på nett',
  description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder. Gratis og uten registrering.',
  keywords: ['dager mellom datoer', 'datoforskjell', 'nedtelling', 'datoregning'],
  alternates: { canonical: '/calculators/productivity/date-difference' },
  openGraph: {
    title: 'Dager mellom to datoer',
    description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder',
    url: '/calculators/productivity/date-difference',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Dager mellom to datoer',
  description: 'Regn ut forskjellen mellom to datoer i dager, uker og måneder',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg startdato', text: 'Velg datoen du regner fra.' },
  { name: 'Velg sluttdato', text: 'Velg datoen du regner til.' },
  { name: 'Velg om sluttdatoen skal telles med', text: 'Slå på «Ta med sluttdatoen» hvis begge dagene skal telle.' },
  { name: 'Les av resultatet', text: 'Du ser dager, uker, måneder, timer og virkedager.' },
];

const faqs = [
  { question: 'Hva er virkedager her?', answer: 'Mandag til fredag. Helligdager er ikke trukket fra. Bruk «Virkedager» under tid for å ta med norske helligdager.' },
  { question: 'Telles begge datoene med?', answer: 'Som standard telles ikke sluttdatoen. Slå på «Ta med sluttdatoen» for å telle begge dagene.' },
  { question: 'Hvor mange dager er det til jul?', answer: 'Sett julaften (24. desember) som sluttdato og i dag som startdato.' },
  { question: 'Kan jeg regne bakover?', answer: 'Ja, sluttdatoen kan være før startdatoen.' },
];

const relatedTools = [
  { href: '/calculators/productivity/age-calculator', title: 'Alderskalkulator', description: 'Regn ut nøyaktig alder ut fra fødselsdato' },
  { href: '/calculators/productivity/timestamp-converter', title: 'Tidsstempel-omregner', description: 'Gjør om Unix-tidsstempler til lesbare datoer' },
];

export default function DateDifferencePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="date-difference"
          title="Dager mellom to datoer"
          description="Regn ut forskjellen mellom to datoer i dager, uker, måneder og virkedager. Gratis og uten registrering."
        />

        <section aria-label="Dager mellom to datoer">
          <DateDifferenceCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
