import { Metadata } from 'next';
import { YarnSubstitutionHelper } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Garnbytte – gratis kalkulator på nett',
  description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift. Gratis og uten registrering.',
  keywords: ['garnbytte', 'garn', 'løpelengde', 'strikking', 'hekling'],
  alternates: { canonical: '/calculators/crafts/yarn-substitution-helper' },
  openGraph: {
    title: 'Garnbytte',
    description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift',
    url: '/calculators/crafts/yarn-substitution-helper',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Garnbytte',
  description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Legg inn garnet i oppskriften', text: 'Garntykkelse, meter og gram per nøste, og antall nøster.' },
  { name: 'Legg inn garnet du vil bruke', text: 'Garntykkelse, meter og gram per nøste.' },
  { name: 'Les av antall nøster', text: 'Regnet ut fra total lengde i meter.' },
  { name: 'Sjekk råd om fasthet', text: 'Se om garntykkelsene passer sammen, og hvilke pinner du bør prøve.' },
];

const faqs = [
  { question: 'Hvorfor regner dere i meter og ikke gram?', answer: 'To garn med lik vekt kan ha veldig ulik lengde. Meter gir riktig sammenligning.' },
  { question: 'Kan jeg bytte til hvilket garn som helst?', answer: 'Velg garn i samme tykkelse og fra samme type fiber, ellers kan resultatet bli annerledes. Strikk alltid en prøvelapp.' },
  { question: 'Hva er meter per 50 g?', answer: 'Et mål på hvor tykt og lett garnet er. Høyere tall betyr tynnere garn.' },
  { question: 'Bør jeg kjøpe litt ekstra?', answer: 'Ja, kjøp gjerne ett nøste ekstra eller sjekk at du får samme partinummer. Fargen kan variere mellom partier.' },
];

const relatedTools = [
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Strikkeoppskrift til din strikkefasthet', description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp' },
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Hekle lue', description: 'Regn ut mål til hekla luer ut fra hodeomkrets' },
  { href: '/calculators/crafts/socks-size-calculator', title: 'Sokkestørrelse', description: 'Regn ut mål og maskeantall til sokker ut fra fotmål' },
];

const yarnWeights = [
  { cyc: '0', name: 'Lace (tynt)', aliases: 'cobweb, tråd', gauge: '32–39', needle: '2–2,25' },
  { cyc: '1', name: 'Sokkegarn', aliases: 'fingering, babygarn', gauge: '27–31', needle: '2,25–3,25' },
  { cyc: '2', name: 'Sportsgarn', aliases: 'sport, babygarn', gauge: '23–26', needle: '3,25–3,75' },
  { cyc: '3', name: 'Lett garn', aliases: 'DK, light worsted', gauge: '21–24', needle: '3,75–4,5' },
  { cyc: '4', name: 'Mellomtykt garn', aliases: 'worsted, aran', gauge: '16–20', needle: '4,5–5,5' },
  { cyc: '5', name: 'Tykt garn', aliases: 'chunky', gauge: '12–15', needle: '5,5–8' },
  { cyc: '6', name: 'Ekstra tykt garn', aliases: 'super chunky, roving', gauge: '7–11', needle: '8–12,75' },
  { cyc: '7', name: 'Jumbogarn', aliases: 'roving, armstrikking', gauge: '1–6', needle: '12,75–25' },
];

export default function YarnSubstitutionHelperPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="yarn-substitution-helper"
          title="Garnbytte"
          description="Regn ut hvor mange nøster du trenger når du bytter garn i en oppskrift. Sammenlign meter per 50 g og se anbefalt pinnestørrelse. Gratis og uten registrering."
          colorClass="bg-violet-100 text-violet-600"
        />

        <section aria-label="Garnbytte">
          <YarnSubstitutionHelper />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Garntykkelser (internasjonal standard, CYC)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-center py-3 px-4 font-medium">CYC</th>
                      <th className="text-left py-3 px-4 font-medium">Navn</th>
                      <th className="text-left py-3 px-4 font-medium">Også kalt</th>
                      <th className="text-center py-3 px-4 font-medium">Masker per 10 cm</th>
                      <th className="text-center py-3 px-4 font-medium">Pinner (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yarnWeights.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 text-center font-mono">{item.cyc}</td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.aliases}</td>
                        <td className="py-3 px-4 text-center">{item.gauge}</td>
                        <td className="py-3 px-4 text-center">{item.needle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips når du bytter garn</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Se på meter, ikke gram</h3>
                <p className="text-sm text-muted-foreground">
                  100 g bomullsgarn kan ha 165 m, mens 100 g ullgarn kan ha 200 m.
                  Regn alltid ut fra total lengde du trenger.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tenk på fibertypen</h3>
                <p className="text-sm text-muted-foreground">
                  Ulike fibre oppfører seg forskjellig. Bomull gir lite etter, ull er spenstig, 
                  og akryl er slitesterkt. Tenk på hvordan fibrene påvirker det ferdige plagget.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Strikk alltid en prøvelapp</h3>
                <p className="text-sm text-muted-foreground">
                  Selv i samme tykkelse kan garn gi ulik fasthet.
                  Strikk alltid en prøvelapp før du begynner på prosjektet.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <HowToSection steps={howToSteps} />
        <FAQSection faqs={faqs} />
        <RelatedToolsSection tools={relatedTools} />
      </main>
    </>
  );
}
