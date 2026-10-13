import { Metadata } from 'next';
import { SampleSizeCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Utvalgsstørrelse – gratis kalkulator på nett',
  description: 'Regn ut hvor stort utvalg du trenger i undersøkelser. Gratis og uten registrering.',
  keywords: ['utvalgsstørrelse', 'utvalg', 'feilmargin', 'konfidensnivå', 'spørreundersøkelse'],
  alternates: { canonical: '/calculators/stats/sample-size-calculator' },
  openGraph: {
    title: 'Utvalgsstørrelse',
    description: 'Regn ut hvor stort utvalg du trenger i undersøkelser',
    url: '/calculators/stats/sample-size-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Utvalgsstørrelse',
  description: 'Regn ut hvor stort utvalg du trenger i undersøkelser',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg konfidensnivå', text: 'Vanlige valg er 90 %, 95 % og 99 %.' },
  { name: 'Oppgi feilmargin', text: 'Hvor stor usikkerhet du kan akseptere, for eksempel 5 %.' },
  { name: 'Legg inn populasjonen', text: 'Hvis du kjenner den, justeres utvalget for en endelig populasjon.' },
];

const faqs = [
  { question: 'Hvilken formel brukes?', answer: 'n = Z² · p · (1 − p) / E², med korreksjon for endelig populasjon når størrelsen er kjent.' },
  { question: 'Hvorfor bruke 50 % som forventet andel?', answer: 'Det gir størst mulig utvalg, og er trygt når du ikke vet noe på forhånd.' },
  { question: 'Hvor stort utvalg trengs for 95 % konfidens og 5 % feilmargin?', answer: 'Omtrent 385 svar for en stor populasjon.' },
  { question: 'Må utvalget være større for en større populasjon?', answer: 'Bare opp til et punkt. Når populasjonen er stor, har størrelsen liten betydning for hvor stort utvalget må være.' },
];

const relatedTools = [
  { href: '/calculators/stats/p-value-calculator', title: 'P-verdi', description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat' },
  { href: '/calculators/stats/ab-test-calculator', title: 'A/B-test', description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
];

export default function SampleSizeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="sample-size-calculator"
          title="Utvalgsstørrelse"
          description="Regn ut hvor mange svar du trenger i en spørreundersøkelse, ut fra konfidensnivå, feilmargin og populasjonsstørrelse. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Utvalgsstørrelse">
          <SampleSizeCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Veiledende utvalgsstørrelser</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Populasjon</th>
                  <th className="text-center py-2 px-3">±3 % feilmargin</th>
                  <th className="text-center py-2 px-3">±5 % feilmargin</th>
                  <th className="text-center py-2 px-3">±10 % feilmargin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">100</td><td className="text-center py-2 px-3">92</td><td className="text-center py-2 px-3">80</td><td className="text-center py-2 px-3">49</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">500</td><td className="text-center py-2 px-3">341</td><td className="text-center py-2 px-3">217</td><td className="text-center py-2 px-3">81</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 000</td><td className="text-center py-2 px-3">516</td><td className="text-center py-2 px-3">278</td><td className="text-center py-2 px-3">88</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">10 000</td><td className="text-center py-2 px-3">964</td><td className="text-center py-2 px-3">370</td><td className="text-center py-2 px-3">95</td></tr>
                <tr><td className="text-left py-2 px-3">100 000 eller flere</td><td className="text-center py-2 px-3">1 067</td><td className="text-center py-2 px-3">383</td><td className="text-center py-2 px-3">96</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">* Basert på 95 % konfidensnivå og 50 % forventet andel.</p>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
