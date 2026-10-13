import { Metadata } from 'next';
import { CrownMoldingCalculator } from '@/components/calculators/construction';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Taklist: gjæringsvinkler – gratis kalkulator på nett',
  description: 'Regn ut gjærings- og skråvinkler for montering av taklister. Gratis og uten registrering.',
  keywords: ['taklist', 'gjæringsvinkel', 'skråsnitt', 'lister', 'hjørner'],
  alternates: { canonical: '/calculators/construction/crown-molding-calculator' },
  openGraph: {
    title: 'Taklist: gjæringsvinkler',
    description: 'Regn ut gjærings- og skråvinkler for montering av taklister',
    url: '/calculators/construction/crown-molding-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Taklist: gjæringsvinkler',
  description: 'Regn ut gjærings- og skråvinkler for montering av taklister',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hjørnetype', text: 'Velg innvendig eller utvendig hjørne, og hjørnevinkelen (90° for et vanlig hjørne).' },
  { name: 'Oppgi listens vinkel', text: 'Mål hvor mye listen heller mot veggen (spring angle). Vanlige verdier er 38° og 45°.' },
  { name: 'Les vinklene', text: 'Se gjæringsvinkel (sagbladets sving) og skråvinkel (sagbladets helning).' },
  { name: 'Sag et prøvestykke', text: 'Prøv først på en bit rest, og juster etter hvordan hjørnet faktisk ser ut.' },
];

const faqs = [
  { question: 'Hva er spring angle?', answer: 'Vinkelen mellom baksiden av listen og veggen. Listen står skrått, så den må måles eller leses av på produktet.' },
  { question: 'Hvordan sager jeg liste som ligger flatt på sagbordet?', answer: 'Bruk innstillingene for liggende liste. Hvis listen står opp mot anlegget, brukes de andre vinklene som vises her.' },
  { question: 'Hva om hjørnet ikke er 90°?', answer: 'Skriv inn den faktiske hjørnevinkelen. Hjørner i gamle hus er sjelden helt rette, så mål gjerne først.' },
  { question: 'Må jeg bruke kopiskjøt?', answer: 'Ikke nødvendig, men kopiskjøt i innvendige hjørner gir ofte penere resultat når veggene ikke er rette.' },
];

const relatedTools = [
  { href: '/calculators/home/stair-calculator', title: 'Trappekalkulator', description: 'Beregn trappemål: opptrinn, inntrinn og antall trinn' },
  { href: '/calculators/home/roof-pitch-calculator', title: 'Takvinkelkalkulator', description: 'Beregn takvinkel i grader og prosent' },
];

const quickReferenceTable = [
  { spring: 38, corner: 90, miter: '31.62°', bevel: '33.86°', desc: '38/52 crown, 90° corner (most common)' },
  { spring: 45, corner: 90, miter: '35.26°', bevel: '30.00°', desc: '45/45 crown, 90° corner' },
  { spring: 52, corner: 90, miter: '38.94°', bevel: '25.28°', desc: '52/38 crown, 90° corner' },
  { spring: 38, corner: 135, miter: '19.04°', bevel: '21.47°', desc: '38/52 crown, 135° corner' },
  { spring: 45, corner: 135, miter: '21.47°', bevel: '19.04°', desc: '45/45 crown, 135° corner' },
];

export default function CrownMoldingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="crown-molding-calculator"
          title="Taklist: gjæringsvinkler"
          description="Finn gjæringsvinkler og sagvinkler for taklister (gesims) i innvendige og utvendige hjørner. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Taklist: gjæringsvinkler">
          <CrownMoldingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hurtigoppslag: vanlige vinkler</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Liste og hjørne</th>
                  <th className="text-right py-2 px-3">Gjæring</th>
                  <th className="text-right py-2 px-3">Skråvinkel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="text-left py-2 px-3">38/52-list, 90° hjørne (vanligst)</td><td className="text-right py-2 px-3">31,62°</td><td className="text-right py-2 px-3">33,86°</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">45/45-list, 90° hjørne</td><td className="text-right py-2 px-3">35,26°</td><td className="text-right py-2 px-3">30,00°</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">52/38-list, 90° hjørne</td><td className="text-right py-2 px-3">38,24°</td><td className="text-right py-2 px-3">25,81°</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">38/52-list, 135° hjørne</td><td className="text-right py-2 px-3">14,31°</td><td className="text-right py-2 px-3">46,72°</td></tr>
                <tr className="border-b"><td className="text-left py-2 px-3">45/45-list, 135° hjørne</td><td className="text-right py-2 px-3">16,32°</td><td className="text-right py-2 px-3">40,79°</td></tr>
                <tr><td className="text-left py-2 px-3">38/52-list, 45° hjørne</td><td className="text-right py-2 px-3">56,07°</td><td className="text-right py-2 px-3">17,55°</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Vinklene gjelder når listen står skrått mot vegg og tak, slik den sitter montert. Prøv alltid på en restbit først.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Slik fungerer sammensatte kapp</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Hvorfor to vinkler?</h3>
              <p className="text-sm text-muted-foreground">Taklist står på skrå mellom vegg og tak. Derfor må kappet både svinges (gjæring) og tippes (skråvinkel) for at to lister skal møtes pent i hjørnet.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Gjæring og skråvinkel</h3>
              <p className="text-sm text-muted-foreground">Gjæringsvinkelen er hvor mye sagbordet svinges. Skråvinkelen er hvor mye sagbladet tippes. Begge avhenger av listens vinkel og hjørnevinkelen.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">To måter å sage på</h3>
              <p className="text-sm text-muted-foreground">Enten ligger listen flatt på sagbordet og du bruker begge vinklene, eller du setter den opp mot anlegget i monteringsstilling og kapper bare med gjæring.</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips for pene hjørner</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Mål hjørnet</h3>
              <p className="text-sm text-muted-foreground">Veggene er sjelden helt rette. Mål hjørnevinkelen med en vinkelmåler og skriv den inn i kalkulatoren.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Sag lengre enn nødvendig</h3>
              <p className="text-sm text-muted-foreground">Kapp listene litt for lange og finjuster med kniv eller høvel til de passer.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Kopiskjøt i innvendige hjørner</h3>
              <p className="text-sm text-muted-foreground">En kopiskjøt tåler at hjørnet beveger seg bedre enn en ren gjæring, og ser ofte penere ut.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Lim og fyll</h3>
              <p className="text-sm text-muted-foreground">Bruk monteringslim i skjøtene og akryl i sprekker mot vegg og tak før maling.</p>
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
