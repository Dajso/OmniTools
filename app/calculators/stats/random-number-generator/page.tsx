import { Metadata } from 'next';
import { RandomNumberGenerator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Tilfeldige tall (fordelinger) – gratis kalkulator på nett',
  description: 'Lag tilfeldige tall fra uniform-, normal- og eksponentialfordeling. Gratis og uten registrering.',
  keywords: ['tilfeldige tall', 'normalfordeling', 'uniform fordeling', 'eksponentialfordeling'],
  alternates: { canonical: '/calculators/stats/random-number-generator' },
  openGraph: {
    title: 'Tilfeldige tall (fordelinger)',
    description: 'Lag tilfeldige tall fra uniform-, normal- og eksponentialfordeling',
    url: '/calculators/stats/random-number-generator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Tilfeldige tall (fordelinger)',
  description: 'Lag tilfeldige tall fra uniform-, normal- og eksponentialfordeling',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg fordeling', text: 'Velg uniform, normal eller eksponentiell.' },
  { name: 'Oppgi parametere', text: 'Fyll inn minimum og maksimum, eller gjennomsnitt og standardavvik.' },
  { name: 'Generer tallene', text: 'Se tallene og histogrammet, og kopier listen.' },
];

const faqs = [
  { question: 'Hva er forskjellen på fordelingene?', answer: 'Uniform gir like stor sannsynlighet for alle verdier. Normalfordelingen gir flest verdier rundt gjennomsnittet. Eksponentialfordelingen gir mange små og få store verdier.' },
  { question: 'Er tallene virkelig tilfeldige?', answer: 'De er pseudotilfeldige og laget av datamaskinen. De egner seg til simulering og undervisning, men ikke til kryptografi.' },
  { question: 'Hvor mange tall kan jeg lage?', answer: 'Mange tusen om gangen, og du kan kopiere hele listen.' },
];

const relatedTools = [
  { href: '/calculators/stats/coin-flip-simulator', title: 'Myntkast', description: 'Kast mynt og se fordelingen av kron og mynt' },
  { href: '/calculators/stats/dice-probability-calculator', title: 'Terningsannsynlighet', description: 'Regn ut sannsynligheten for bestemte summer med flere terninger' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
];

export default function RandomNumberGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="random-number-generator"
          title="Tilfeldige tall (fordelinger)"
          description="Lag tilfeldige tall med uniform fordeling, normalfordeling eller eksponentialfordeling, med histogram. Gratis og uten registrering."
          colorClass="bg-indigo-100 text-indigo-600"
        />

        <section aria-label="Tilfeldige tall (fordelinger)">
          <RandomNumberGenerator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Typer fordelinger</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">📊 Uniform</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Like stor sannsynlighet for alle verdier i området. Gir et flatt histogram.
              </p>
              <p className="text-xs text-blue-600">
                Bruk til: Tilfeldig trekning, stokking, simuleringer
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">🔔 Normal</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Klokkekurve rundt gjennomsnittet. De fleste verdiene havner nær midten.
              </p>
              <p className="text-xs text-green-600">
                Bruk til: Naturfenomener, prøveresultater, målinger
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-700 mb-2">📉 Eksponentiell</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Raskt fall fra null. Brukes til å modellere tid mellom tilfeldige hendelser.
              </p>
              <p className="text-xs text-orange-600">
                Bruk til: Ventetider, feil på utstyr, nedbrytingsprosesser
              </p>
            </div>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
