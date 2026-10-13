import { Metadata } from 'next';
import { CrochetHatCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Hekle lue – gratis kalkulator på nett',
  description: 'Regn ut mål til hekla luer ut fra hodeomkrets. Gratis og uten registrering.',
  keywords: ['hekle lue', 'lue', 'hodeomkrets', 'størrelse', 'hekling'],
  alternates: { canonical: '/calculators/crafts/crochet-hat-calculator' },
  openGraph: {
    title: 'Hekle lue',
    description: 'Regn ut mål til hekla luer ut fra hodeomkrets',
    url: '/calculators/crafts/crochet-hat-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Hekle lue',
  description: 'Regn ut mål til hekla luer ut fra hodeomkrets',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål hodet', text: 'Mål rundt hodet over ørene og pannen, i cm.' },
  { name: 'Velg luemodell', text: 'Vanlig lue, slouchy, tettsittende eller med ørelapper.' },
  { name: 'Velg negativ ease', text: 'Lua heklet litt mindre enn hodet sitter bedre. Rundt 10 % er vanlig.' },
  { name: 'Les av målene', text: 'Se diameter på bunnen, omkrets, høyde og antall felleomganger.' },
];

const faqs = [
  { question: 'Hva er negativ ease?', answer: 'At lua er litt mindre enn hodet, slik at den sitter godt. Heklet stoff gir etter, så 5–15 % er vanlig.' },
  { question: 'Hvordan måler jeg hodet?', answer: 'Mål med målebånd rundt hodet der lua skal sitte, vanligvis over øyenbrynene og rett over ørene.' },
  { question: 'Hvordan bruker jeg diameteren på bunnen?', answer: 'Hekle en flat sirkel til den har denne diameteren, og hekle deretter rett opp til du når ønsket høyde.' },
  { question: 'Hvor mye garn trenger jeg?', answer: 'Velg standardstørrelse for å se et grovt overslag i meter. Forbruket varierer med garn og fasthet.' },
];

const relatedTools = [
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Garnbytte', description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Strikkeoppskrift til din strikkefasthet', description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp' },
  { href: '/calculators/crafts/socks-size-calculator', title: 'Sokkestørrelse', description: 'Regn ut mål og maskeantall til sokker ut fra fotmål' },
];

const sizeChart = [
  { age: 'Prematur', circ: '30 cm', height: '12,0 cm', crown: '8,6 cm' },
  { age: 'Nyfødt', circ: '36 cm', height: '14,4 cm', crown: '10,3 cm' },
  { age: 'Baby 3–6 mnd', circ: '41 cm', height: '16,4 cm', crown: '11,7 cm' },
  { age: 'Baby 6–12 mnd', circ: '46 cm', height: '18,4 cm', crown: '13,2 cm' },
  { age: 'Småbarn', circ: '48 cm', height: '19,2 cm', crown: '13,8 cm' },
  { age: 'Barn', circ: '51 cm', height: '20,4 cm', crown: '14,6 cm' },
  { age: 'Ungdom', circ: '53 cm', height: '21,2 cm', crown: '15,2 cm' },
  { age: 'Voksen S', circ: '55 cm', height: '22,0 cm', crown: '15,8 cm' },
  { age: 'Voksen M', circ: '57 cm', height: '22,8 cm', crown: '16,3 cm' },
  { age: 'Voksen L', circ: '61 cm', height: '24,4 cm', crown: '17,5 cm' },
];

export default function CrochetHatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="crochet-hat-calculator"
          title="Hekle lue"
          description="Regn ut diameter, omkrets og høyde på heklet lue ut fra hodeomkretsen. Mål i cm. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Hekle lue">
          <CrochetHatCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Standard hodeomkrets og luemål</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Alder / størrelse</th>
                      <th className="text-center py-3 px-4 font-medium">Hodeomkrets</th>
                      <th className="text-center py-3 px-4 font-medium">Luehøyde</th>
                      <th className="text-center py-3 px-4 font-medium">Diameter på bunnen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.age}</td>
                        <td className="py-3 px-4 text-center">{item.circ}</td>
                        <td className="py-3 px-4 text-center">{item.height}</td>
                        <td className="py-3 px-4 text-center">{item.crown}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            * Diameter på bunnen er regnet med 10 % negativ ease. Mål og tall er veiledende.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Luemodeller</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Vanlig lue</h3>
                <p className="text-sm text-muted-foreground">
                  Klassisk lue som dekker ørene. Bruker 10 % negativ ease for en tettsittende passform.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Slouchy</h3>
                <p className="text-sm text-muted-foreground">
                  Løs lue med ekstra lengde som faller bakover. Bruker mindre negativ ease (5 %) 
                  og legger til 5 cm i høyden.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tettsittende</h3>
                <p className="text-sm text-muted-foreground">
                  Veldig tett passform, ofte brukt som skalle- eller sportslue. Bruker mer negativ ease (15 %) 
                  og er litt lavere.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Med ørelapper</h3>
                <p className="text-sm text-muted-foreground">
                  Vanlig lue med ørelapper. Regn ut målene på selve lua først, 
                  og hekle ørelappene for seg.
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
