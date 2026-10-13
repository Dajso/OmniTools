import { Metadata } from 'next';
import { ScientificNotationConverter } from '@/components/calculators/academic';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Standardform (vitenskapelig notasjon) – gratis kalkulator på nett',
  description: 'Gjør om tall til og fra standardform. Gratis og uten registrering.',
  keywords: ['standardform', 'vitenskapelig notasjon', 'eksponent', 'tierpotens'],
  alternates: { canonical: '/calculators/academic/scientific-notation-converter' },
  openGraph: {
    title: 'Standardform (vitenskapelig notasjon)',
    description: 'Gjør om tall til og fra standardform',
    url: '/calculators/academic/scientific-notation-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Standardform (vitenskapelig notasjon)',
  description: 'Gjør om tall til og fra standardform',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg retning', text: 'Fra vanlig tall til standardform, eller omvendt.' },
  { name: 'Skriv inn tallet', text: 'Bruk komma som desimaltegn, for eksempel 0,000045.' },
  { name: 'Les av resultatet', text: 'Se standardform, E-notasjon, ingeniørnotasjon og SI-prefiks.' },
];

const faqs = [
  { question: 'Hva er standardform?', answer: 'En måte å skrive svært store eller små tall på: et tall mellom 1 og 10 ganger en tierpotens. 314159 skrives 3,14159 × 10^5.' },
  { question: 'Hva er forskjellen på standardform og ingeniørnotasjon?', answer: 'I ingeniørnotasjon er eksponenten alltid delelig på 3, så den passer med prefikser som kilo, mega og milli.' },
  { question: 'Hva betyr E i 3,14e5?', answer: 'E står for «ganger ti i» og brukes i kalkulatorer og programmering. 3,14e5 er 3,14 × 10^5.' },
];

const relatedTools = [
  { href: '/calculators/academic/fraction-calculator', title: 'Brøkkalkulator', description: 'Legg til, trekk fra, gang, del og forkort brøker' },
];

export default function ScientificNotationConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="scientific-notation-converter"
          title="Standardform (vitenskapelig notasjon)"
          description="Regn om tall til og fra standardform (vitenskapelig notasjon), ingeniørnotasjon og E-notasjon, med SI-prefiks. Bruker norsk desimalkomma. Gratis og uten registrering."
        />

        <section aria-label="Standardform (vitenskapelig notasjon)">
          <ScientificNotationConverter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
