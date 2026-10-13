import { Metadata } from 'next';
import { BoxShadowGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'CSS-skyggegenerator – gratis kalkulator på nett',
  description: 'Lag CSS box-shadow med flere lag og forhåndsvisning. Gratis og uten registrering.',
  keywords: ['box-shadow', 'skygge', 'CSS-skygge', 'drop shadow'],
  alternates: { canonical: '/calculators/productivity/box-shadow-generator' },
  openGraph: {
    title: 'CSS-skyggegenerator',
    description: 'Lag CSS box-shadow med flere lag og forhåndsvisning',
    url: '/calculators/productivity/box-shadow-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CSS-skyggegenerator',
  description: 'Lag CSS box-shadow med flere lag og forhåndsvisning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg et forhåndsvalg', text: 'Start med et ferdig forslag eller bygg fra bunnen.' },
  { name: 'Juster lagene', text: 'Endre forskyvning, uskarphet, utbredelse, farge og gjennomsiktighet.' },
  { name: 'Se forhåndsvisningen', text: 'Skyggen vises på et eksempel.' },
  { name: 'Kopier CSS-koden', text: 'Kopier koden og lim den inn.' },
];

const faqs = [
  { question: 'Hva er box-shadow?', answer: 'En CSS-egenskap som legger skygge rundt et element.' },
  { question: 'Hvorfor flere lag?', answer: 'Flere lag med lav gjennomsiktighet ser mer naturlige ut enn én tung skygge.' },
  { question: 'Hva er innvendig skygge?', answer: 'En skygge inne i elementet, brukt for å få det til å se innfelt ut.' },
  { question: 'Hva betyr utbredelse?', answer: 'Hvor mye skyggen vokser utover elementets kant før den gjøres uskarp.' },
];

const relatedTools = [
  { href: '/calculators/productivity/gradient-generator', title: 'CSS-gradientgenerator', description: 'Lag lineære og radiale CSS-gradienter med forhåndsvisning' },
  { href: '/calculators/productivity/contrast-checker', title: 'Kontrastsjekker (WCAG)', description: 'Sjekk fargekontrast mot WCAG 2.1 AA/AAA for universell utforming' },
];

export default function BoxShadowGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="box-shadow-generator"
          title="CSS-skyggegenerator"
          description="Lag CSS box-shadow med flere lag og forhåndsvisning, og kopier ferdig kode. Gratis og uten registrering."
        />

        <section aria-label="CSS-skyggegenerator">
          <BoxShadowGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
