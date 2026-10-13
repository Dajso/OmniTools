import { Metadata } from 'next';
import { RandomNumberGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tilfeldig tallgenerator – gratis kalkulator på nett',
  description: 'Trekk tilfeldige tall innenfor et intervall. Gratis og uten registrering.',
  keywords: ['tilfeldig tall', 'tallgenerator', 'terning', 'trekning'],
  alternates: { canonical: '/calculators/productivity/random-number-generator' },
  openGraph: {
    title: 'Tilfeldig tallgenerator',
    description: 'Trekk tilfeldige tall innenfor et intervall',
    url: '/calculators/productivity/random-number-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tilfeldig tallgenerator',
  description: 'Trekk tilfeldige tall innenfor et intervall',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg intervall', text: 'Skriv inn minste og største tall.' },
  { name: 'Velg antall', text: 'Hvor mange tall vil du trekke?' },
  { name: 'Velg om like tall er tillatt', text: 'Slå av «Tillat like tall» for unike tall, for eksempel i en trekning.' },
  { name: 'Trekk', text: 'Trykk på knappen og se tallene, sum og gjennomsnitt.' },
];

const faqs = [
  { question: 'Er tallene virkelig tilfeldige?', answer: 'De er tilfeldige nok til spill og trekninger, men ikke egnet til kryptografi eller lotteri med penger.' },
  { question: 'Kan jeg trekke lottotall?', answer: 'Ja. Bruk 1 til 34, trekk 7 tall og slå av gjentakelser for å trekke som i Lotto.' },
  { question: 'Hvorfor får jeg en feilmelding?', answer: 'Hvis du ber om flere unike tall enn det finnes i intervallet, er det umulig. Øk intervallet eller slå på gjentakelser.' },
  { question: 'Kan jeg bruke negative tall?', answer: 'Ja, både minste og største verdi kan være negative.' },
];

const relatedTools = [
  { href: '/calculators/productivity/uuid-generator', title: 'UUID-generator', description: 'Lag unike UUID-er (v4)' },
];

export default function RandomNumberGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="random-number-generator"
          title="Tilfeldig tallgenerator"
          description="Trekk tilfeldige tall innenfor et intervall, med eller uten gjentakelser. Gratis og uten registrering."
        />

        <section aria-label="Tilfeldig tallgenerator">
          <RandomNumberGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
