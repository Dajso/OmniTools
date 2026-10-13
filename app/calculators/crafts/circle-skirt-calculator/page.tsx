import { Metadata } from 'next';
import { CircleSkirtCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Sirkelskjørt – gratis kalkulator på nett',
  description: 'Regn ut radius og stoffbehov til hel-, halv- og kvartsirkelskjørt. Gratis og uten registrering.',
  keywords: ['sirkelskjørt', 'skjørt', 'radius', 'midjemål', 'sying'],
  alternates: { canonical: '/calculators/crafts/circle-skirt-calculator' },
  openGraph: {
    title: 'Sirkelskjørt',
    description: 'Regn ut radius og stoffbehov til hel-, halv- og kvartsirkelskjørt',
    url: '/calculators/crafts/circle-skirt-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Sirkelskjørt',
  description: 'Regn ut radius og stoffbehov til hel-, halv- og kvartsirkelskjørt',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Mål midjen', text: 'Mål rundt der skjørtet skal sitte, i cm.' },
  { name: 'Bestem lengden', text: 'Mål fra midjen og ned til der skjørtet skal slutte.' },
  { name: 'Velg type skjørt', text: 'Hel, 3/4, halv eller kvart sirkel, ut fra hvor vidt du vil ha det.' },
  { name: 'Legg inn sømmonn og fald', text: 'Vanlig sømmonn er 1–1,5 cm, og vanlig fald er 2–3 cm.' },
  { name: 'Klipp stoffet', text: 'Bruk radiene til å tegne og klippe mønsteret, og se hvor mye stoff du trenger.' },
];

const faqs = [
  { question: 'Hva er forskjellen på sirkelskjørtene?', answer: 'Hel sirkel (360°) gir mest vidde og sving. Halv sirkel (180°) er litt smalere, men fortsatt vid. Kvart sirkel (90°) er smalest og ligner mer et A-skjørt.' },
  { question: 'Hvordan klipper jeg et sirkelskjørt?', answer: 'Brett stoffet i fire, merk radien for midjen fra hjørnet og deretter radien for nedre kant. Klipp langs begge buene. Ved halv og kvart sirkel klipper du flere stykker.' },
  { question: 'Hvorfor blir midjen for trang?', answer: 'Bruk det faktiske midjemålet ditt, ikke buksestørrelsen. Legg til 2–4 cm hvis stoffet ikke har strekk.' },
  { question: 'Hvor mye stoff trenger jeg?', answer: 'Til hel sirkel trenger du stoff som er minst dobbelt så bredt som radien i fald. Kalkulatoren viser meter for 110 og 150 cm bredt stoff.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Stoffbehov', description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter' },
  { href: '/calculators/crafts/quilt-binding-calculator', title: 'Kantbånd til quilt', description: 'Regn ut hvor mye kantbånd du trenger til en quilt' },
];

const skirtTypes = [
  { type: 'Hel sirkel', angle: '360°', fullness: 'Størst', panels: '1', best: 'Festkjoler, dans og svingskjørt' },
  { type: '3/4 sirkel', angle: '270°', fullness: 'Stor', panels: '1–2', best: 'Pent hverdagsskjørt' },
  { type: 'Halv sirkel', angle: '180°', fullness: 'Middels', panels: '2', best: 'Hverdag og jobb' },
  { type: 'Kvart sirkel', angle: '90°', fullness: 'Liten', panels: '4', best: 'A-formet skjørt som bruker mindre stoff' },
];

export default function CircleSkirtCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="circle-skirt-calculator"
          title="Sirkelskjørt"
          description="Regn ut radius i midjen og i fald, og hvor mye stoff du trenger til hel-, tre-kvart-, halv- og kvartsirkelskjørt. Mål i cm og stoff i meter. Gratis og uten registrering."
          colorClass="bg-rose-100 text-rose-600"
        />

        <section aria-label="Sirkelskjørt">
          <CircleSkirtCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Sammenligning av skjørttypene</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-center py-3 px-4 font-medium">Vinkel</th>
                      <th className="text-center py-3 px-4 font-medium">Vidde</th>
                      <th className="text-center py-3 px-4 font-medium">Stykker</th>
                      <th className="text-left py-3 px-4 font-medium">Passer til</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skirtTypes.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.type}</td>
                        <td className="py-3 px-4 text-center">{item.angle}</td>
                        <td className="py-3 px-4 text-center">{item.fullness}</td>
                        <td className="py-3 px-4 text-center">{item.panels}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.best}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Regnestykket bak sirkelskjørt</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Sirkelskjørt bruker sammenhengen mellom omkrets og radius:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-4">
                Omkrets = 2 × π × radius
                <br />
                Altså: radius = omkrets ÷ (2 × π)
              </div>
              <p className="text-sm text-muted-foreground">
                I et skjørt med hel sirkel er midjemålet ditt omkretsen av den indre sirkelen.
                Ved halv og kvart sirkel ganger vi midjemålet med en faktor for å få samme åpning
                med mindre stoff.
              </p>
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
