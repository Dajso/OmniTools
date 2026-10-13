import { Metadata } from 'next';
import { QuiltBindingCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Kantbånd til quilt – gratis kalkulator på nett',
  description: 'Regn ut hvor mye kantbånd du trenger til en quilt. Gratis og uten registrering.',
  keywords: ['quilt', 'kantbånd', 'lappeteppe', 'kantebånd'],
  alternates: { canonical: '/calculators/crafts/quilt-binding-calculator' },
  openGraph: {
    title: 'Kantbånd til quilt',
    description: 'Regn ut hvor mye kantbånd du trenger til en quilt',
    url: '/calculators/crafts/quilt-binding-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Kantbånd til quilt',
  description: 'Regn ut hvor mye kantbånd du trenger til en quilt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg størrelse', text: 'Velg en vanlig størrelse eller legg inn egne mål i cm.' },
  { name: 'Velg type kantbånd', text: 'Dobbelt kantbånd er vanligst.' },
  { name: 'Legg inn stoffbredde', text: 'Brukbar bredde er litt mindre enn bredden på stoffet.' },
  { name: 'Les av resultatet', text: 'Se antall strimler og hvor mange meter stoff du trenger.' },
];

const faqs = [
  { question: 'Hva er forskjellen på enkelt og dobbelt kantbånd?', answer: 'Dobbelt kantbånd brettes dobbelt og gir en kant som er sterkere og holder lenger. Enkelt kantbånd brukes til lettere prosjekter.' },
  { question: 'Hvor bredt bør jeg klippe kantbåndet?', answer: 'Rundt 6,5 cm til dobbelt kantbånd og 5 cm til enkelt. Tykk vatt krever litt bredere strimler.' },
  { question: 'Hvorfor er det lagt til ekstra lengde?', answer: 'Du trenger litt ekstra til skjøting av strimlene og til hjørnene. 30 cm er en trygg margin.' },
  { question: 'Hva er skråbånd?', answer: 'Strimler klippet på skrå, slik at de er elastiske og kan følge runde kanter.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Stoffbehov', description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter' },
  { href: '/calculators/crafts/circle-skirt-calculator', title: 'Sirkelskjørt', description: 'Regn ut radius og stoffbehov til hel-, halv- og kvartsirkelskjørt' },
];

const quiltSizes = [
  { name: 'Babyteppe', dimensions: '70 × 100 cm', perimeter: '340 cm', binding: '4 strimler, ca. 0,3 m' },
  { name: 'Pledd', dimensions: '130 × 170 cm', perimeter: '600 cm', binding: '6 strimler, ca. 0,4 m' },
  { name: 'Enkeltseng (90 cm)', dimensions: '140 × 210 cm', perimeter: '700 cm', binding: '7 strimler, ca. 0,5 m' },
  { name: 'Dobbeltseng (140–160 cm)', dimensions: '200 × 230 cm', perimeter: '860 cm', binding: '9 strimler, ca. 0,6 m' },
  { name: 'Kingsize (180–200 cm)', dimensions: '240 × 250 cm', perimeter: '980 cm', binding: '10 strimler, ca. 0,7 m' },
];

export default function QuiltBindingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="quilt-binding-calculator"
          title="Kantbånd til quilt"
          description="Regn ut lengde på kantbånd, antall strimler og stoffbehov i meter til pledd og quilter. Gratis og uten registrering."
          colorClass="bg-amber-100 text-amber-600"
        />

        <section aria-label="Kantbånd til quilt">
          <QuiltBindingCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Typiske størrelser</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Størrelse</th>
                      <th className="text-center py-3 px-4 font-medium">Mål</th>
                      <th className="text-center py-3 px-4 font-medium">Omkrets</th>
                      <th className="text-center py-3 px-4 font-medium">Kantbånd (omtrent)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quiltSizes.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-center">{item.dimensions}</td>
                        <td className="py-3 px-4 text-center">{item.perimeter}</td>
                        <td className="py-3 px-4 text-center">{item.binding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2">
            * Regnet med 6,5 cm brede strimler fra stoff med 105 cm brukbar bredde og 30 cm ekstra til skjøter og hjørner. Størrelsene er typiske mål, og du kan legge inn egne.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips til kantbånd</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Skjøte strimlene</h3>
                <p className="text-sm text-muted-foreground">
                  Skjøt strimlene i 45° vinkel for å få mindre tykke skjøter. Den diagonale sømmen 
                  fordeler tykkelsen jevnere rundt pleddet.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Hjørner med gjæring</h3>
                <p className="text-sm text-muted-foreground">
                  Stopp sømmen ca. 0,6 cm fra hvert hjørne, brett kantbåndet opp i 45° og deretter 
                  ned igjen, så får du et pent hjørne med gjæring.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Avslutning</h3>
                <p className="text-sm text-muted-foreground">
                  La det være ca. 25 cm usydd i starten. Når du kommer rundt, skjøter du endene 
                  med en diagonal søm, så blir avslutningen nesten usynlig.
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
