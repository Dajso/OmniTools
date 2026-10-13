import { Metadata } from 'next';
import { WordCounter } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Ordteller – gratis kalkulator på nett',
  description: 'Tell ord, tegn og setninger i en tekst. Gratis og uten registrering.',
  keywords: ['ordteller', 'tegnteller', 'tekstlengde', 'antall ord'],
  alternates: { canonical: '/calculators/productivity/word-counter' },
  openGraph: {
    title: 'Ordteller',
    description: 'Tell ord, tegn og setninger i en tekst',
    url: '/calculators/productivity/word-counter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ordteller',
  description: 'Tell ord, tegn og setninger i en tekst',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Skriv eller lim inn teksten', text: 'Tallene oppdateres mens du skriver.' },
  { name: 'Les av statistikken', text: 'Du ser ord, tegn med og uten mellomrom, setninger og avsnitt.' },
  { name: 'Sjekk lesetid og taletid', text: 'Lesetid er regnet ut fra 200 ord i minuttet og taletid fra 150 ord i minuttet.' },
];

const faqs = [
  { question: 'Hvordan telles ord?', answer: 'Alt som er skilt med mellomrom eller linjeskift telles som ett ord. Tall og tegnsetting som står alene teller også.' },
  { question: 'Hvor lang er lesetiden?', answer: 'Lesetiden er regnet ut fra 200 ord i minuttet, som er vanlig for voksne ved normal lesing. Teknisk stoff tar ofte lenger tid.' },
  { question: 'Telles ord med æ, ø og å riktig?', answer: 'Ja. Alle bokstaver i teksten din telles som en del av ordene.' },
  { question: 'Lagres teksten min?', answer: 'Nei. Alt skjer i nettleseren din, og ingenting sendes til noen server.' },
];

const relatedTools = [
  { href: '/calculators/productivity/character-counter', title: 'Tegnteller', description: 'Tell tegn med eller uten mellomrom' },
];

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="word-counter"
          title="Ordteller"
          description="Tell ord, tegn, setninger og avsnitt i teksten din, og se lesetid og taletid. Gratis og uten registrering."
        />

        <section aria-label="Ordteller">
          <WordCounter />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
