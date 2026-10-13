import { Metadata } from 'next';
import { TitleCapitalization } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tittelformat – gratis kalkulator på nett',
  description: 'Gjør om tekst til tittelformat, setningsformat og mer. Gratis og uten registrering.',
  keywords: ['tittelformat', 'stor forbokstav', 'overskrift', 'setningsformat'],
  alternates: { canonical: '/calculators/productivity/title-capitalization' },
  openGraph: {
    title: 'Tittelformat',
    description: 'Gjør om tekst til tittelformat, setningsformat og mer',
    url: '/calculators/productivity/title-capitalization',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tittelformat',
  description: 'Gjør om tekst til tittelformat, setningsformat og mer',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn teksten', text: 'Skriv inn tittelen.' },
  { name: 'Velg skrivemåte', text: 'Setningsformat er vanlig på norsk.' },
  { name: 'Kopier', text: 'Kopier resultatet.' },
];

const faqs = [
  { question: 'Skal norske titler ha stor forbokstav i hvert ord?', answer: 'Nei. På norsk skriver man vanligvis bare første ord og egennavn med stor forbokstav. Engelsk tittelformat har stor forbokstav i de fleste ord.' },
  { question: 'Hva er forskjellen på tittelformat og setningsformat?', answer: 'I tittelformat får de fleste ord stor forbokstav. I setningsformat bare første ord.' },
  { question: 'Behandles små ord riktig?', answer: 'I engelsk tittelformat holdes småord som «the», «of» og «and» små.' },
  { question: 'Fungerer det med æ, ø og å?', answer: 'Ja.' },
];

const relatedTools = [
  { href: '/calculators/productivity/lorem-ipsum-generator', title: 'Lorem ipsum-generator', description: 'Lag fylltekst til design og layout' },
];

export default function TitleCapitalizationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="title-capitalization"
          title="Tittelformat"
          description="Gjør om tekst til setningsformat, tittelformat og flere skrivemåter. Gratis og uten registrering."
        />

        <section aria-label="Tittelformat">
          <TitleCapitalization />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
