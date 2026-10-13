import { Metadata } from 'next';
import { DiceProbabilityCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Terningsannsynlighet – gratis kalkulator på nett',
  description: 'Regn ut sannsynligheten for bestemte summer med flere terninger. Gratis og uten registrering.',
  keywords: ['terning', 'sannsynlighet', 'sum', 'd6', 'd20'],
  alternates: { canonical: '/calculators/stats/dice-probability-calculator' },
  openGraph: {
    title: 'Terningsannsynlighet',
    description: 'Regn ut sannsynligheten for bestemte summer med flere terninger',
    url: '/calculators/stats/dice-probability-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Terningsannsynlighet',
  description: 'Regn ut sannsynligheten for bestemte summer med flere terninger',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg antall terninger', text: 'Velg hvor mange terninger du kaster.' },
  { name: 'Velg terningtype', text: 'Velg for eksempel d6 eller d20.' },
  { name: 'Oppgi ønsket sum', text: 'Velg om du vil ha nøyaktig, minst eller høyst en sum.' },
];

const faqs = [
  { question: 'Hva er mest sannsynlig med to terninger?', answer: 'Summen 7. Den kan komme på seks av 36 måter, altså 16,7 %.' },
  { question: 'Hva betyr 2d6?', answer: 'To seksidige terninger. 3d8 er tre åttesidige terninger.' },
  { question: 'Hvorfor blir fordelingen en klokkekurve?', answer: 'Det finnes flere måter å få summer midt i skalaen på enn ytterpunktene.' },
  { question: 'Hvor mange terninger kan jeg bruke?', answer: 'Opptil 20 terninger med mellom 2 og 100 sider.' },
];

const relatedTools = [
  { href: '/calculators/stats/coin-flip-simulator', title: 'Myntkast', description: 'Kast mynt og se fordelingen av kron og mynt' },
  { href: '/calculators/stats/random-number-generator', title: 'Tilfeldige tall (fordelinger)', description: 'Lag tilfeldige tall fra uniform-, normal- og eksponentialfordeling' },
  { href: '/calculators/stats/standard-deviation-calculator', title: 'Standardavvik', description: 'Regn ut standardavvik, varians, gjennomsnitt, median og typetall' },
];

export default function DiceProbabilityCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="dice-probability-calculator"
          title="Terningsannsynlighet"
          description="Regn ut sannsynligheten for å få en bestemt sum med flere terninger, med fordelingsdiagram. Gratis og uten registrering."
          colorClass="bg-red-100 text-red-600"
        />

        <section aria-label="Terningsannsynlighet">
          <DiceProbabilityCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Vanlige terningkast</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Terninger</th>
                  <th className="text-center py-2 px-3">Minst</th>
                  <th className="text-center py-2 px-3">Størst</th>
                  <th className="text-center py-2 px-3">Snitt</th>
                  <th className="text-center py-2 px-3">Mest sannsynlig</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">1d6</td><td className="text-center py-2 px-3">1</td><td className="text-center py-2 px-3">6</td><td className="text-center py-2 px-3">3,5</td><td className="text-center py-2 px-3">Alle like (16,7 %)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">2d6</td><td className="text-center py-2 px-3">2</td><td className="text-center py-2 px-3">12</td><td className="text-center py-2 px-3">7</td><td className="text-center py-2 px-3">7 (16,7 %)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">3d6</td><td className="text-center py-2 px-3">3</td><td className="text-center py-2 px-3">18</td><td className="text-center py-2 px-3">10,5</td><td className="text-center py-2 px-3">10 og 11 (12,5 %)</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1d20</td><td className="text-center py-2 px-3">1</td><td className="text-center py-2 px-3">20</td><td className="text-center py-2 px-3">10,5</td><td className="text-center py-2 px-3">Alle like (5 %)</td></tr>
                <tr><td className="text-left py-2 px-3">4d6 (dropp laveste)</td><td className="text-center py-2 px-3">3</td><td className="text-center py-2 px-3">18</td><td className="text-center py-2 px-3">12,24</td><td className="text-center py-2 px-3">13 (13,3 %)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
