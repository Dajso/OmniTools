import { Metadata } from 'next';
import { JSONFormatter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'JSON-formaterer og validator – gratis kalkulator på nett',
  description: 'Formater og valider JSON-data. Gratis og uten registrering.',
  keywords: ['JSON', 'JSON-formaterer', 'JSON-validator', 'pretty print'],
  alternates: { canonical: '/calculators/productivity/json-formatter' },
  openGraph: {
    title: 'JSON-formaterer og validator',
    description: 'Formater og valider JSON-data',
    url: '/calculators/productivity/json-formatter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON-formaterer og validator',
  description: 'Formater og valider JSON-data',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn JSON', text: 'Lim inn koden i feltet.' },
  { name: 'Velg innrykk', text: 'To eller fire mellomrom, eller tabulator.' },
  { name: 'Les av resultatet', text: 'Formatert JSON vises, eller en feilmelding.' },
  { name: 'Kopier', text: 'Kopier formatert eller komprimert versjon.' },
];

const faqs = [
  { question: 'Hvorfor er JSON-en min ugyldig?', answer: 'Vanlige feil er enkle anførselstegn, komma etter siste element og manglende anførselstegn rundt nøkler.' },
  { question: 'Sendes dataene mine noe sted?', answer: 'Nei. Alt skjer i nettleseren din.' },
  { question: 'Hva betyr komprimere?', answer: 'Fjerner mellomrom og linjeskift så filen blir mindre.' },
  { question: 'Hva gjør «Sorter nøkler»?', answer: 'Sorterer nøklene alfabetisk i alle nivåer.' },
];

const relatedTools = [
  { href: '/calculators/productivity/base64-converter', title: 'Base64-koding', description: 'Kod og dekod Base64-strenger' },
];

export default function JSONFormatterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="json-formatter"
          title="JSON-formaterer og validator"
          description="Formater, valider og komprimer JSON, med feilmeldinger og statistikk. Gratis og uten registrering."
        />

        <section aria-label="JSON-formaterer og validator">
          <JSONFormatter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
