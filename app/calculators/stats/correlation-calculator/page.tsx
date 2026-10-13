import { Metadata } from 'next';
import { CorrelationCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Korrelasjon – gratis kalkulator på nett',
  description: 'Regn ut Pearsons korrelasjon (r), R² og lineær regresjon. Gratis og uten registrering.',
  keywords: ['korrelasjon', 'Pearson', 'R2', 'lineær regresjon', 'spredningsplott'],
  alternates: { canonical: '/calculators/stats/correlation-calculator' },
  openGraph: {
    title: 'Korrelasjon',
    description: 'Regn ut Pearsons korrelasjon (r), R² og lineær regresjon',
    url: '/calculators/stats/correlation-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Korrelasjon',
  description: 'Regn ut Pearsons korrelasjon (r), R² og lineær regresjon',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn datapar', text: 'Skriv ett X,Y-par per linje, adskilt med semikolon, tabulator eller mellomrom.' },
  { name: 'Les korrelasjonen', text: 'Se r, R² og om sammenhengen er signifikant.' },
  { name: 'Se regresjonslinjen', text: 'Spredningsplottet viser punktene og den lineære trenden.' },
];

const faqs = [
  { question: 'Hva forteller Pearsons r?', answer: 'Hvor sterkt to variabler henger lineært sammen. Verdien går fra -1 (perfekt negativ) via 0 (ingen sammenheng) til +1 (perfekt positiv).' },
  { question: 'Hva er R²?', answer: 'Andelen av variasjonen i Y som kan forklares av X. R² på 0,64 betyr at 64 % av variasjonen forklares.' },
  { question: 'Betyr korrelasjon at det er en årsakssammenheng?', answer: 'Nei. To ting kan henge sammen uten at den ene forårsaker den andre, for eksempel fordi en tredje faktor påvirker begge.' },
  { question: 'Hvor mange datapunkter trenger jeg?', answer: 'Minst to, men med få punkter er resultatet usikkert. Jo flere punkter, desto mer pålitelig er p-verdien.' },
  { question: 'Kan jeg bruke desimalkomma?', answer: 'Ja. Skriv for eksempel 1,5; 2,5 med semikolon mellom tallene, eller 1,5 2,5 med mellomrom.' },
];

const relatedTools = [
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B-test', description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant' },
  { href: '/calculators/stats/p-value-calculator', title: 'P-verdi', description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat' },
];

export default function CorrelationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="correlation-calculator"
          title="Korrelasjon"
          description="Regn ut Pearsons korrelasjonskoeffisient, R², p-verdi og regresjonslinje fra datapar. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Korrelasjon">
          <CorrelationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hvor sterk er korrelasjonen?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
              <p className="font-bold text-green-700">±0,9 til ±1,0</p>
              <p className="text-xs text-green-600">Svært sterk</p>
            </div>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
              <p className="font-bold text-blue-700">±0,7 til ±0,9</p>
              <p className="text-xs text-blue-600">Sterk</p>
            </div>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-center">
              <p className="font-bold text-yellow-700">±0,5 til ±0,7</p>
              <p className="text-xs text-yellow-600">Moderat</p>
            </div>
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center">
              <p className="font-bold text-orange-700">±0,3 til ±0,5</p>
              <p className="text-xs text-orange-600">Svak</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
              <p className="font-bold text-gray-700">0 til ±0,3</p>
              <p className="text-xs text-gray-600">Ingen eller ubetydelig</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Korrelasjon er ikke det samme som årsak</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Viktig:</strong> At to variabler henger sammen, betyr ikke at den ene forårsaker den andre.
              Ta alltid hensyn til:
            </p>
            <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
              <li>Tredjefaktorer som påvirker begge variablene</li>
              <li>Omvendt årsakssammenheng (Y kan påvirke X)</li>
              <li>Tilfeldige sammenhenger</li>
              <li>Skjevt utvalg i dataene dine</li>
            </ul>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
