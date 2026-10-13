import { Metadata } from 'next';
import { LoremIpsumGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Lorem ipsum-generator – gratis kalkulator på nett',
  description: 'Lag fylltekst til design og layout. Gratis og uten registrering.',
  keywords: ['lorem ipsum', 'fylltekst', 'plassholdertekst', 'dummytekst'],
  alternates: { canonical: '/calculators/productivity/lorem-ipsum-generator' },
  openGraph: {
    title: 'Lorem ipsum-generator',
    description: 'Lag fylltekst til design og layout',
    url: '/calculators/productivity/lorem-ipsum-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Lorem ipsum-generator',
  description: 'Lag fylltekst til design og layout',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg type', text: 'Velg avsnitt, setninger eller ord.' },
  { name: 'Velg antall', text: 'Skriv inn hvor mye tekst du trenger.' },
  { name: 'Velg start', text: 'Slå på «Start med Lorem ipsum» hvis teksten skal begynne klassisk.' },
  { name: 'Lag og kopier', text: 'Trykk på knappen og kopier teksten.' },
];

const faqs = [
  { question: 'Hva er lorem ipsum?', answer: 'Fylltekst som brukes i design for å vise hvordan tekst vil se ut, uten at innholdet distraherer. Teksten har røtter i latin.' },
  { question: 'Hvorfor ikke bruke ekte tekst?', answer: 'Ekte tekst trekker oppmerksomheten bort fra layouten. Lorem ipsum gir en jevn tekstfordeling.' },
  { question: 'Kan jeg bruke teksten kommersielt?', answer: 'Ja, fylltekst er ikke opphavsrettsbeskyttet i praksis.' },
  { question: 'Finnes det norsk fylltekst?', answer: 'Denne generatoren lager klassisk latinsk fylltekst. Bytt til ekte norsk tekst før publisering.' },
];

const relatedTools = [
  { href: '/calculators/productivity/word-counter', title: 'Ordteller', description: 'Tell ord, tegn og setninger i en tekst' },
];

export default function LoremIpsumGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="lorem-ipsum-generator"
          title="Lorem ipsum-generator"
          description="Lag lorem ipsum-fylltekst i avsnitt, setninger eller ord til design og layout. Gratis og uten registrering."
        />

        <section aria-label="Lorem ipsum-generator">
          <LoremIpsumGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
