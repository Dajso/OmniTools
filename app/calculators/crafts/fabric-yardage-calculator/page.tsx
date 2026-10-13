import { Metadata } from 'next';
import { FabricYardageCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Stoffbehov – gratis kalkulator på nett',
  description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter. Gratis og uten registrering.',
  keywords: ['stoffbehov', 'stoff', 'sying', 'meter stoff', 'plagg'],
  alternates: { canonical: '/calculators/crafts/fabric-yardage-calculator' },
  openGraph: {
    title: 'Stoffbehov',
    description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter',
    url: '/calculators/crafts/fabric-yardage-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Stoffbehov',
  description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg plagg', text: 'Kjole, skjørt, bukse, bluse, jakke eller kåpe.' },
  { name: 'Velg størrelse', text: 'Fra XS til 3XL.' },
  { name: 'Velg stoffbredde', text: 'Vanlige bredder er 110 og 150 cm.' },
  { name: 'Angi retning og mønster', text: 'Stoff med retning eller mønsterraport krever litt ekstra.' },
];

const faqs = [
  { question: 'Hvor mange meter stoff trenger jeg?', answer: 'Det avhenger av plagg, størrelse og stoffbredde. Sjekk alltid mønsterets egen oppgave når du har den.' },
  { question: 'Hvorfor krever smalt stoff mer?', answer: 'Mønsterdelene skal ligge innenfor stoffbredden, så smalere stoff gir flere rader og dermed større lengde.' },
  { question: 'Hva er retning i stoffet?', answer: 'Stoff med luv, for eksempel fløyel, eller mønster som peker én vei må klippes samme vei. Det gir omtrent 15 % ekstra.' },
  { question: 'Hva er mønsterraport?', answer: 'Avstanden før mønsteret gjentar seg. Du må legge til litt stoff for å få mønsteret til å møtes i sømmene.' },
];

const relatedTools = [
  { href: '/calculators/crafts/circle-skirt-calculator', title: 'Sirkelskjørt', description: 'Regn ut radius og stoffbehov til hel-, halv- og kvartsirkelskjørt' },
  { href: '/calculators/crafts/quilt-binding-calculator', title: 'Kantbånd til quilt', description: 'Regn ut hvor mye kantbånd du trenger til en quilt' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Strikkeoppskrift til din strikkefasthet', description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp' },
];

const yardageChart = [
  { garment: 'Kort kjole', xs: '1,9', m: '2,3', xl: '2,8' },
  { garment: 'Midikjole', xs: '2,3', m: '2,8', xl: '3,3' },
  { garment: 'Maxikjole', xs: '3,3', m: '3,7', xl: '4,2' },
  { garment: 'Bukse', xs: '1,9', m: '2,3', xl: '2,8' },
  { garment: 'Bluse', xs: '1,4', m: '1,9', xl: '2,3' },
  { garment: 'Jakke', xs: '2,3', m: '2,8', xl: '3,3' },
];

export default function FabricYardageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="fabric-yardage-calculator"
          title="Stoffbehov"
          description="Regn ut hvor mange meter stoff du trenger til kjoler, skjørt, bukser, bluser og jakker, ut fra størrelse og stoffbredde. Gratis og uten registrering."
          colorClass="bg-pink-100 text-pink-600"
        />

        <section aria-label="Stoffbehov">
          <FabricYardageCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hurtigtabell (110 cm bredt stoff)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Plagg</th>
                      <th className="text-center py-3 px-4 font-medium">XS</th>
                      <th className="text-center py-3 px-4 font-medium">M</th>
                      <th className="text-center py-3 px-4 font-medium">XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yardageChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.garment}</td>
                        <td className="py-3 px-4 text-center">{item.xs} m</td>
                        <td className="py-3 px-4 text-center">{item.m} m</td>
                        <td className="py-3 px-4 text-center">{item.xl} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
