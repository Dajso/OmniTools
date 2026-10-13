import { Metadata } from 'next';
import { StandardDeviationCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Standardavvik – gratis kalkulator på nett',
  description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall. Gratis og uten registrering.',
  keywords: ['standardavvik', 'varians', 'gjennomsnitt', 'median', 'typetall', 'statistikk'],
  alternates: { canonical: '/calculators/stats/standard-deviation-calculator' },
  openGraph: {
    title: 'Standardavvik',
    description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall',
    url: '/calculators/stats/standard-deviation-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Standardavvik',
  description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Lim inn tallene', text: 'Skill tallene med mellomrom, semikolon eller linjeskift. Desimalkomma fungerer.' },
  { name: 'Les standardavviket', text: 'Se standardavvik og varians for både utvalg og populasjon.' },
  { name: 'Se resten av statistikken', text: 'Gjennomsnitt, median, typetall, minimum, maksimum og sum vises også.' },
];

const faqs = [
  { question: 'Hva er forskjellen på utvalg og populasjon?', answer: 'For en populasjon deles på N, for et utvalg deles på n − 1 (Bessels korreksjon). Bruk utvalg når dataene er en del av en større gruppe.' },
  { question: 'Hva er varians?', answer: 'Standardavviket i andre potens. Det er gjennomsnittet av de kvadrerte avvikene fra gjennomsnittet.' },
  { question: 'Hva er typetall?', answer: 'Verdien som forekommer oftest i dataene.' },
  { question: 'Hvordan skriver jeg tall med desimaler?', answer: 'Bruk komma som desimaltegn, og skill tallene med mellomrom eller semikolon: 1,5; 2,5; 3.' },
];

const relatedTools = [
  { href: '/calculators/stats/p-value-calculator', title: 'P-verdi', description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat' },
  { href: '/calculators/stats/correlation-calculator', title: 'Korrelasjon', description: 'Regn ut Pearsons korrelasjon (r), R² og lineær regresjon' },
  { href: '/calculators/stats/sample-size-calculator', title: 'Utvalgsstørrelse', description: 'Regn ut hvor stort utvalg du trenger i undersøkelser' },
];

export default function StandardDeviationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="standard-deviation-calculator"
          title="Standardavvik"
          description="Regn ut standardavvik, varians, gjennomsnitt, median, typetall og spredning fra en liste med tall. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Standardavvik">
          <StandardDeviationCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik forstår du standardavvik</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">Lavt standardavvik</h3>
              <p className="text-sm text-muted-foreground">
                Verdiene ligger tett rundt gjennomsnittet. Dataene er jevne og forutsigbare.
              </p>
              <p className="text-xs text-blue-600 mt-2">Eksempel: karakterpoeng 88, 90, 91, 89, 92</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-700 mb-2">Middels standardavvik</h3>
              <p className="text-sm text-muted-foreground">
                Verdiene spriker moderat rundt gjennomsnittet. Det er noe variasjon.
              </p>
              <p className="text-xs text-yellow-600 mt-2">Eksempel: karakterpoeng 75, 85, 90, 95, 80</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-2">Høyt standardavvik</h3>
              <p className="text-sm text-muted-foreground">
                Verdiene ligger langt fra gjennomsnittet. Dataene varierer mye.
              </p>
              <p className="text-xs text-red-600 mt-2">Eksempel: karakterpoeng 50, 70, 90, 100, 65</p>
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
