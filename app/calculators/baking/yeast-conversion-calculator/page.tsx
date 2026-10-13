import { Metadata } from 'next';
import { YeastConversionCalculator } from '@/components/calculators/baking';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Gjær: omregner – gratis kalkulator på nett',
  description: 'Regn om mellom fersk gjær, tørrgjær og instant gjær. Gratis og uten registrering.',
  keywords: ['gjær', 'fersk gjær', 'tørrgjær', 'instant gjær', 'gjærerstatning'],
  alternates: { canonical: '/calculators/baking/yeast-conversion-calculator' },
  openGraph: {
    title: 'Gjær: omregner',
    description: 'Regn om mellom fersk gjær, tørrgjær og instant gjær',
    url: '/calculators/baking/yeast-conversion-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Gjær: omregner',
  description: 'Regn om mellom fersk gjær, tørrgjær og instant gjær',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg gjærtype', text: 'Velg typen oppskriften oppgir.' },
  { name: 'Oppgi mengde', text: 'Skriv inn gram.' },
  { name: 'Les resultatet', text: 'Se tilsvarende mengde av de andre typene.' },
];

const faqs = [
  { question: 'Hvor mye tørrgjær tilsvarer 50 g fersk gjær?', answer: 'Cirka 20 g tørrgjær. Kalkulatoren regner 0,4 g tørrgjær per gram fersk gjær og 0,33 g instant gjær. Mange pakker oppgir 1/3, så sjekk anbefalingen på pakken.' },
  { question: 'Hva er forskjellen på tørrgjær og instant gjær?', answer: 'Instant gjær kan blandes rett i melet. Tørrgjær bør løses opp i litt lunkent vann først. Instant gjær er noe sterkere.' },
  { question: 'Hvor stor er en pakke fersk gjær?', answer: 'Pakken i norske butikker er 50 g.' },
];

const relatedTools = [
  { href: '/calculators/baking/sourdough-hydration-calculator', title: 'Surdeig: hydrering', description: 'Regn ut hydrering i surdeigsbrød, med surdeigsstarter, grovt mel og rug' },
  { href: '/calculators/baking/bakers-percentage-calculator', title: 'Bakerprosent', description: 'Gjør oppskriften om til bakerprosent med mel som 100 % og skaler til ønsket mengde' },
];

export default function YeastConversionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="yeast-conversion-calculator"
          title="Gjær: omregner"
          description="Regn om mellom fersk gjær, tørrgjær og instant gjær. Gratis og uten registrering."
        />

        <section aria-label="Gjær: omregner">
          <YeastConversionCalculator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
