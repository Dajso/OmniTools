import { Metadata } from 'next';
import { MetaTagGenerator } from '@/components/calculators/creator';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Metatag-generator – gratis kalkulator på nett',
  description: 'Lag HTML-metatagger for SEO, Open Graph og Twitter Cards. Gratis og uten registrering.',
  keywords: ['metatagger', 'SEO', 'Open Graph', 'Twitter Card', 'metabeskrivelse'],
  alternates: { canonical: '/calculators/creator/meta-tag-generator' },
  openGraph: {
    title: 'Metatag-generator',
    description: 'Lag HTML-metatagger for SEO, Open Graph og Twitter Cards',
    url: '/calculators/creator/meta-tag-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Metatag-generator',
  description: 'Lag HTML-metatagger for SEO, Open Graph og Twitter Cards',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll ut tittel og beskrivelse', text: 'Sidetittel og kort beskrivelse for søkemotorer.' },
  { name: 'Legg til Open Graph', text: 'Bestemmer hvordan siden vises når den deles.' },
  { name: 'Legg til Twitter Cards', text: 'Tilpass visningen på X/Twitter.' },
  { name: 'Kopier koden', text: 'Lim den inn i head-delen på siden.' },
];

const faqs = [
  { question: 'Hvor lang bør metabeskrivelsen være?', answer: 'Cirka 150–160 tegn, så den ikke avkortes i søkeresultatet.' },
  { question: 'Hva er Open Graph?', answer: 'Et sett metatagger som styrer tittel, beskrivelse og bilde når siden deles på Facebook, LinkedIn og andre.' },
  { question: 'Hva er en kanonisk URL?', answer: 'Adressen du vil at søkemotorene skal regne som hovedversjonen av siden.' },
  { question: 'Trenger jeg nøkkelord?', answer: 'Nei. Søkemotorer som Google bruker dem ikke lenger til rangering.' },
];

const relatedTools = [
  { href: '/calculators/creator/schema-markup-generator', title: 'Schema markup-generator', description: 'Lag JSON-LD strukturerte data for SEO, som FAQ, artikkel og produkt' },
  { href: '/calculators/creator/utm-builder', title: 'UTM-bygger', description: 'Bygg UTM-lenker for sporing av kampanjer i markedsføring og analyse' },
];

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="meta-tag-generator"
          title="Metatag-generator"
          description="Lag HTML-metatagger for SEO, Open Graph og Twitter Cards til nettsiden din. Gratis og uten registrering."
        />

        <section aria-label="Metatag-generator">
          <MetaTagGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
