import { Metadata } from 'next';
import { SQLFormatter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'SQL-formaterer – gratis kalkulator på nett',
  description: 'Formater SQL-spørringer med riktig innrykk. Gratis og uten registrering.',
  keywords: ['SQL', 'SQL-formaterer', 'formater SQL', 'pretty print'],
  alternates: { canonical: '/calculators/productivity/sql-formatter' },
  openGraph: {
    title: 'SQL-formaterer',
    description: 'Formater SQL-spørringer med riktig innrykk',
    url: '/calculators/productivity/sql-formatter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SQL-formaterer',
  description: 'Formater SQL-spørringer med riktig innrykk',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn spørringen', text: 'Lim inn SQL eller last inn et eksempel.' },
  { name: 'Velg dialekt og innrykk', text: 'Standard SQL, MySQL, PostgreSQL eller SQLite.' },
  { name: 'Velg store bokstaver', text: 'Slå på «Store bokstaver i nøkkelord» om ønskelig.' },
  { name: 'Kopier', text: 'Kopier den formaterte spørringen.' },
];

const faqs = [
  { question: 'Endrer formateringen hvordan spørringen virker?', answer: 'Nei, bare mellomrom og store/små bokstaver i nøkkelord endres.' },
  { question: 'Hvilke dialekter støttes?', answer: 'Standard SQL, MySQL, PostgreSQL og SQLite.' },
  { question: 'Sendes spørringen min til en server?', answer: 'Nei, alt kjører i nettleseren.' },
  { question: 'Kan jeg formatere flere spørringer?', answer: 'Ja, skill dem med semikolon.' },
];

const relatedTools = [
  { href: '/calculators/productivity/json-formatter', title: 'JSON-formaterer og validator', description: 'Formater og valider JSON-data' },
];

export default function SQLFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sql-formatter"
          title="SQL-formaterer"
          description="Formater SQL-spørringer med innrykk og store bokstaver i nøkkelord. Støtter flere dialekter. Gratis og uten registrering."
        />

        <section aria-label="SQL-formaterer">
          <SQLFormatter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
