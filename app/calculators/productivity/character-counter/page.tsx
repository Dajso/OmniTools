import { Metadata } from 'next';
import { CharacterCounter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tegnteller – gratis kalkulator på nett',
  description: 'Tell tegn med eller uten mellomrom. Gratis og uten registrering.',
  keywords: ['tegnteller', 'bokstaver', 'tekstlengde', 'antall tegn'],
  alternates: { canonical: '/calculators/productivity/character-counter' },
  openGraph: {
    title: 'Tegnteller',
    description: 'Tell tegn med eller uten mellomrom',
    url: '/calculators/productivity/character-counter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tegnteller',
  description: 'Tell tegn med eller uten mellomrom',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv eller lim inn teksten', text: 'Begynn å skrive i feltet.' },
  { name: 'Velg om mellomrom skal telles', text: 'Slå av eller på «Ta med mellomrom i tellingen».' },
  { name: 'Les av tallene', text: 'Du får tegn, bokstaver, sifre, spesialtegn og linjer.' },
];

const faqs = [
  { question: 'Hva regnes som et tegn?', answer: 'Hver bokstav, tall, mellomrom og tegnsetting er ett tegn. Linjeskift telles som mellomrom.' },
  { question: 'Teller emoji som ett tegn?', answer: 'Mange emoji består av flere tegn i teksten, så tellingen kan være høyere enn du forventer.' },
  { question: 'Hva er grensene for SMS?', answer: 'En SMS med vanlige tegn rommer 160 tegn. Bruker du tegn utenfor standard tegnsett, for eksempel emoji, blir grensen 70 tegn per melding.' },
  { question: 'Telles æ, ø og å som bokstaver?', answer: 'Ja, alle bokstaver telles som bokstaver.' },
];

const relatedTools = [
  { href: '/calculators/productivity/word-counter', title: 'Ordteller', description: 'Tell ord, tegn og setninger i en tekst' },
];

export default function CharacterCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="character-counter"
          title="Tegnteller"
          description="Tell tegn med og uten mellomrom, og se antall bokstaver, sifre og spesialtegn. Nyttig for SMS, innlegg og søknader. Gratis og uten registrering."
        />

        <section aria-label="Tegnteller">
          <CharacterCounter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
