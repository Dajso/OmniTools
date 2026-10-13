import { Metadata } from 'next';
import { PValueCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'P-verdi – gratis kalkulator på nett',
  description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat. Gratis og uten registrering.',
  keywords: ['p-verdi', 'hypotesetesting', 'z-test', 't-test', 'kjikvadrat', 'signifikans'],
  alternates: { canonical: '/calculators/stats/p-value-calculator' },
  openGraph: {
    title: 'P-verdi',
    description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat',
    url: '/calculators/stats/p-value-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'P-verdi',
  description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg test', text: 'Velg z-test, t-test eller kjikvadrattest.' },
  { name: 'Fyll inn testverdien', text: 'Skriv inn z-, t- eller kjikvadratverdien, og frihetsgrader hvis testen krever det.' },
  { name: 'Les p-verdien', text: 'Se p-verdi og om resultatet er signifikant på 5 %-nivå.' },
];

const faqs = [
  { question: 'Hva er en p-verdi?', answer: 'Sannsynligheten for å få et resultat minst like ekstremt som det du har observert, hvis nullhypotesen er sann.' },
  { question: 'Når er et resultat signifikant?', answer: 'Vanligvis når p er under 0,05. Det betyr at du kan forkaste nullhypotesen på 5 %-nivå.' },
  { question: 'Hva er forskjellen på ensidig og tosidig test?', answer: 'En tosidig test ser på avvik i begge retninger. En ensidig test ser bare på én retning, og bør velges før du ser dataene.' },
  { question: 'Betyr lav p-verdi at effekten er stor?', answer: 'Nei. Med nok data kan selv en svært liten effekt gi lav p-verdi. Vurder alltid effektstørrelsen også.' },
];

const relatedTools = [
  { href: '/calculators/stats/sample-size-calculator', title: 'Utvalgsstørrelse', description: 'Regn ut hvor stort utvalg du trenger i undersøkelser' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B-test', description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
];

export default function PValueCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="p-value-calculator"
          title="P-verdi"
          description="Regn ut p-verdi fra z-verdi, t-verdi eller kjikvadrat, ensidig eller tosidig. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="P-verdi">
          <PValueCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik forstår du p-verdier</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">p &lt; 0,05</h3>
              <p className="text-sm text-muted-foreground">
                Statistisk signifikant. Sterke holdepunkter mot nullhypotesen.
                Det er lite sannsynlig at resultatet skyldes tilfeldigheter.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-700 mb-2">p ≥ 0,05</h3>
              <p className="text-sm text-muted-foreground">
                Ikke statistisk signifikant. Ikke nok holdepunkter til å forkaste nullhypotesen.
                Resultatet kan godt skyldes tilfeldigheter.
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
