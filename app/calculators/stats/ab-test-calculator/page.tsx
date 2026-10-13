import { Metadata } from 'next';
import { ABTestCalculator } from '@/components/calculators/stats';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'A/B-test – gratis kalkulator på nett',
  description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant. Gratis og uten registrering.',
  keywords: ['A/B-test', 'signifikans', 'konverteringsrate', 'splitt-test'],
  alternates: { canonical: '/calculators/stats/ab-test-calculator' },
  openGraph: {
    title: 'A/B-test',
    description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant',
    url: '/calculators/stats/ab-test-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'A/B-test',
  description: 'Sjekk om forskjellen i en A/B-test er statistisk signifikant',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Fyll inn kontrollgruppen', text: 'Oppgi antall besøkende og antall konverteringer for variant A.' },
  { name: 'Fyll inn testgruppen', text: 'Oppgi det samme for variant B.' },
  { name: 'Les resultatet', text: 'Se p-verdi, konfidens og økning i konverteringsrate.' },
  { name: 'Vurder om du kan stole på det', text: 'Sjekk om du har nok data før du konkluderer.' },
];

const faqs = [
  { question: 'Hva betyr statistisk signifikans i en A/B-test?', answer: 'At forskjellen mellom variantene neppe skyldes tilfeldigheter. En p-verdi under 0,05 (95 % konfidens) regnes vanligvis som signifikant.' },
  { question: 'Hvor stort utvalg trenger jeg?', answer: 'Det avhenger av dagens konverteringsrate og hvor liten forskjell du vil kunne oppdage. Ofte trengs flere tusen besøkende per variant. Resultatet gir en anbefaling.' },
  { question: 'Hva er forskjellen på relativ og absolutt økning?', answer: 'Absolutt økning er forskjellen i prosentpoeng. Går konverteringen fra 5 % til 6 %, er den absolutte økningen 1 prosentpoeng og den relative økningen 20 %.' },
  { question: 'Kan jeg stoppe testen så snart den er signifikant?', answer: 'Nei. Å avslutte tidlig gir ofte falske positive resultater. Bestem utvalgsstørrelsen på forhånd og kjør testen ferdig.' },
  { question: 'Hva er konfidensintervallet?', answer: 'Intervallet der den sanne forskjellen trolig ligger. Et 95 %-intervall på [1 %, 5 %] betyr at den sanne økningen med 95 % konfidens er mellom 1 og 5 prosentpoeng.' },
];

const relatedTools = [
  { href: '/calculators/stats/sample-size-calculator', title: 'Utvalgsstørrelse', description: 'Regn ut hvor stort utvalg du trenger i undersøkelser' },
  { href: '/calculators/stats/p-value-calculator', title: 'P-verdi', description: 'Regn ut p-verdi for hypotesetesting: z-test, t-test og kjikvadrat' },
  { href: '/calculators/stats/correlation-calculator', title: 'Korrelasjon', description: 'Regn ut Pearsons korrelasjon (r), R² og lineær regresjon' },
];

export default function ABTestCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="ab-test-calculator"
          title="A/B-test"
          description="Sjekk om forskjellen mellom to varianter i en A/B-test er statistisk signifikant, med p-verdi, konfidensintervall og anbefalt utvalgsstørrelse. Gratis og uten registrering."
          colorClass="bg-green-100 text-green-600"
        />

        <section aria-label="A/B-test">
          <ABTestCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Gode råd for A/B-testing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">✓ Gjør dette</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Regn ut utvalgsstørrelse før du starter</li>
                <li>• Kjør testen over hele uker eller en full forretningssyklus</li>
                <li>• Test én ting om gangen</li>
                <li>• Skriv ned hypotesen på forhånd</li>
                <li>• Vurder om forskjellen har praktisk betydning</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-2">✗ Unngå dette</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Avslutte testen så snart den blir signifikant</li>
                <li>• Kjøre flere overlappende tester på de samme besøkende</li>
                <li>• Overse forskjeller mellom segmenter</li>
                <li>• Teste i uvanlige perioder, som Black Friday eller juleferie</li>
                <li>• Ta beslutninger på for små utvalg</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik tolker du resultatet</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">P-verdi</th>
                  <th className="text-left py-2 px-3">Konfidens</th>
                  <th className="text-left py-2 px-3">Tolkning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">&lt; 0,01</td><td className="text-left py-2 px-3">&gt; 99 %</td><td className="text-left py-2 px-3"><span className="text-green-600">Svært sterke holdepunkter</span></td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">0,01–0,05</td><td className="text-left py-2 px-3">95–99 %</td><td className="text-left py-2 px-3"><span className="text-green-600">Sterke holdepunkter</span></td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">0,05–0,10</td><td className="text-left py-2 px-3">90–95 %</td><td className="text-left py-2 px-3"><span className="text-yellow-600">Moderate holdepunkter</span></td></tr>
                <tr><td className="text-left py-2 px-3">&gt; 0,10</td><td className="text-left py-2 px-3">&lt; 90 %</td><td className="text-left py-2 px-3"><span className="text-red-600">Svake eller ingen holdepunkter</span></td></tr>
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
