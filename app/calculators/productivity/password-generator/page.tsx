import { Metadata } from 'next';
import { PasswordGenerator } from '@/components/calculators/productivity';
import { ToolPageHeader, HowToSection, FAQSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Passordgenerator – gratis kalkulator på nett',
  description: 'Lag sterke passord med styrkeindikator. Gratis og uten registrering.',
  keywords: ['passordgenerator', 'sikkert passord', 'tilfeldig passord', 'sterkt passord'],
  alternates: { canonical: '/calculators/productivity/password-generator' },
  openGraph: {
    title: 'Passordgenerator',
    description: 'Lag sterke passord med styrkeindikator',
    url: '/calculators/productivity/password-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Passordgenerator',
  description: 'Lag sterke passord med styrkeindikator',
  applicationCategory: 'SecurityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg lengde', text: 'Lengre er sterkere. Bruk minst 16 tegn.' },
  { name: 'Velg tegntyper', text: 'Store og små bokstaver, tall og symboler.' },
  { name: 'Lag passordet', text: 'Trykk på knappen for å lage nytt passord, og kopier det.' },
  { name: 'Lagre det trygt', text: 'Bruk en passordbehandler, og ikke gjenbruk passord.' },
];

const faqs = [
  { question: 'Hvor langt bør et passord være?', answer: 'Minst 12 tegn, og helst 16 eller mer. Lengde betyr mer enn spesialtegn.' },
  { question: 'Er passordet trygt?', answer: 'Passordet lages i nettleseren din med tilfeldige tall fra nettleserens sikre generator. Det sendes aldri til noen server.' },
  { question: 'Hva er entropi?', answer: 'Et mål på hvor uforutsigbart passordet er, i bit. Jo høyere tall, jo sterkere passord.' },
  { question: 'Hva er «tid for å knekke»?', answer: 'Et grovt anslag på hvor lang tid det tar å gjette passordet ved et raskt angrep. Det er et grovt estimat.' },
  { question: 'Bør jeg bruke passordfrase?', answer: 'Flere tilfeldige ord etter hverandre kan være både sterke og lettere å huske. Bruk likevel en passordbehandler.' },
];

const relatedTools = [
  { href: '/calculators/productivity/uuid-generator', title: 'UUID-generator', description: 'Lag unike UUID-er (v4)' },
];

export default function PasswordGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="password-generator"
          title="Passordgenerator"
          description="Lag sterke, tilfeldige passord med valgfri lengde og tegn, og se hvor sterkt passordet er. Gratis og uten registrering."
        />

        <section aria-label="Passordgenerator">
          <PasswordGenerator />
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
