import { Metadata } from 'next';
import { BalusterCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Spilene i rekkverk – gratis kalkulator på nett',
  description: 'Regn ut avstand mellom spiler i rekkverk, med maks åpning. Gratis og uten registrering.',
  keywords: ['rekkverk', 'spiler', 'spileavstand', 'rekkverkshøyde', 'TEK17'],
  alternates: { canonical: '/calculators/construction/baluster-calculator' },
  openGraph: {
    title: 'Spilene i rekkverk',
    description: 'Regn ut avstand mellom spiler i rekkverk, med maks åpning',
    url: '/calculators/construction/baluster-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Spilene i rekkverk',
  description: 'Regn ut avstand mellom spiler i rekkverk, med maks åpning',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål rekkverket', text: 'Oppgi lengden mellom stolpene i millimeter.' },
  { name: 'Oppgi spilens bredde', text: 'Skriv inn bredden på hver spile, eller tykkelsen hvis den er rund.' },
  { name: 'Sett største åpning', text: 'Standard er 100 mm, som er grensen i byggteknisk forskrift (TEK17) for rekkverk der barn ferdes.' },
  { name: 'Les resultatet', text: 'Se antall spiler, nøyaktig mellomrom og om rekkverket tilfredsstiller kravet.' },
];

const faqs = [
  { question: 'Hva er største åpning i et rekkverk?', answer: 'I Norge skal åpninger i rekkverk ikke være større enn 100 mm der barn kan oppholde seg. Sjekk gjeldende TEK17 og eventuelle lokale krav.' },
  { question: 'Hvor høyt skal rekkverket være?', answer: 'Normalt minst 1,0 m. Ved lav fallhøyde kan kravet være lavere. Sjekk TEK17 for ditt tilfelle.' },
  { question: 'Må spilene stå loddrett?', answer: 'Nei, men horisontale elementer kan gi barn mulighet til å klatre og er derfor ikke anbefalt der barn ferdes.' },
  { question: 'Hva er forskjellen på senteravstand og mellomrom?', answer: 'Mellomrommet er den frie åpningen mellom to spiler. Senteravstanden er mellomrommet pluss spilens bredde.' },
];

const relatedTools = [
  { href: '/calculators/home/decking-calculator', title: 'Terrassekalkulator', description: 'Beregn materialer til terrasse: terrassebord, bjelker og skruer' },
  { href: '/calculators/home/stair-calculator', title: 'Trappekalkulator', description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn' },
];

const quickReferenceTable = [
  { span: 24, balusters: 5, gap: '3.25"', compliant: true },
  { span: 30, balusters: 6, gap: '3.43"', compliant: true },
  { span: 36, balusters: 8, gap: '3.33"', compliant: true },
  { span: 42, balusters: 9, gap: '3.45"', compliant: true },
  { span: 48, balusters: 10, gap: '3.55"', compliant: true },
  { span: 60, balusters: 13, gap: '3.54"', compliant: true },
  { span: 72, balusters: 15, gap: '3.56"', compliant: true },
  { span: 96, balusters: 20, gap: '3.57"', compliant: true },
];

export default function BalusterCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="baluster-calculator"
          title="Spilene i rekkverk"
          description="Regn ut antall spiler og mellomrom i rekkverk, med maks åpning på 100 mm etter TEK17. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Spilene i rekkverk">
          <BalusterCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hurtigoppslag: vanlige lengder (spile 40 mm)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Lengde mellom stolper</th>
                  <th className="text-right py-2 px-3">Antall spiler</th>
                  <th className="text-right py-2 px-3">Mellomrom</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">600 mm</td><td className="text-right py-2 px-3">4</td><td className="text-right py-2 px-3">88,0 mm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">900 mm</td><td className="text-right py-2 px-3">7</td><td className="text-right py-2 px-3">77,5 mm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 200 mm</td><td className="text-right py-2 px-3">8</td><td className="text-right py-2 px-3">97,8 mm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 500 mm</td><td className="text-right py-2 px-3">11</td><td className="text-right py-2 px-3">88,3 mm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">1 800 mm</td><td className="text-right py-2 px-3">13</td><td className="text-right py-2 px-3">91,4 mm</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">2 400 mm</td><td className="text-right py-2 px-3">18</td><td className="text-right py-2 px-3">88,4 mm</td></tr>
                <tr><td className="text-left py-2 px-3">3 000 mm</td><td className="text-right py-2 px-3">22</td><td className="text-right py-2 px-3">92,2 mm</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Mellomrommet er fri åpning mellom spilene og skal ikke overstige 100 mm. Tallene er avrundet.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Kravet til åpninger i rekkverk</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">100 mm-regelen</h3>
              <p className="text-sm text-muted-foreground">Byggteknisk forskrift (TEK17) setter 100 mm som største åpning i rekkverk der barn ferdes, slik at et barn ikke kan komme gjennom eller sette fast hodet.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Formelen</h3>
              <p className="text-sm text-muted-foreground">Antall spiler n må oppfylle (lengde − n × spilebredde) ÷ (n + 1) ≤ 100 mm. Kalkulatoren finner minste n og fordeler mellomrommene jevnt.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Høyde og andre krav</h3>
              <p className="text-sm text-muted-foreground">Rekkverket skal normalt være minst 1,0 m høyt, og det er egne krav til styrke og til klatremuligheter. Sjekk TEK17 og kommunens krav for ditt tilfelle.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips til monteringen</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Planlegg fra midten</h3>
              <p className="text-sm text-muted-foreground">Start fra midten og legg ut spilene symmetrisk, slik at mellomrommene ser like ut fra begge sider.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Bruk en avstandsklosse</h3>
              <p className="text-sm text-muted-foreground">Lag en klosse som er like bred som mellomrommet, så får du jevn avstand uten å måle hver gang.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Mål etterpå</h3>
              <p className="text-sm text-muted-foreground">Kontrollmål den største åpningen når rekkverket er ferdig, også nederst ved håndlist og bunnrekke.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Valg av materiale</h3>
              <p className="text-sm text-muted-foreground">Tre er rimelig og lett å bearbeide, men trenger vedlikehold utendørs. Metallspiler holder lenge og kan være slankere.</p>
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
