import { Metadata } from 'next';
import { KnittingStitchConverter } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Strikkeoppskrift til din strikkefasthet – gratis kalkulator på nett',
  description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp. Gratis og uten registrering.',
  keywords: ['strikking', 'strikkefasthet', 'masker', 'legge opp', 'oppskrift'],
  alternates: { canonical: '/calculators/crafts/knitting-stitch-converter' },
  openGraph: {
    title: 'Strikkeoppskrift til din strikkefasthet',
    description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp',
    url: '/calculators/crafts/knitting-stitch-converter',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Strikkeoppskrift til din strikkefasthet',
  description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Velg hva du vil gjøre', text: 'Omregn en oppskrift, eller regn ut for en ønsket størrelse.' },
  { name: 'Legg inn oppskriftens fasthet', text: 'Antall masker og pinner per 10 cm i oppskriften.' },
  { name: 'Legg inn din fasthet', text: 'Strikk en prøvelapp og mål masker og pinner per 10 cm.' },
  { name: 'Les av resultatet', text: 'Se nytt antall masker og pinner, eller hvor mange du trenger til ønsket mål.' },
];

const faqs = [
  { question: 'Hvordan måler jeg strikkefastheten?', answer: 'Strikk en prøvelapp på minst 15 × 15 cm, vask og tørk den, og tell masker og pinner over 10 cm.' },
  { question: 'Hvorfor må jeg tilpasse maskeantallet?', answer: 'Strikker du løsere eller strammere enn oppskriften, blir plagget større eller mindre. Nytt maskeantall gir samme mål.' },
  { question: 'Kan jeg bare bytte pinnestørrelse?', answer: 'Ofte ja, men det er ikke alltid nok. Treffer du ikke både masker og pinner, må du regne om oppskriften.' },
  { question: 'Hva om fastheten oppgis per 4 tommer?', answer: '4 tommer er 10,2 cm, så tallene er nesten like. Gang med 0,98 for å få omtrent riktig verdi per 10 cm.' },
];

const relatedTools = [
  { href: '/calculators/crafts/crochet-hat-calculator', title: 'Hekle lue', description: 'Regn ut mål til hekla luer ut fra hodeomkrets' },
  { href: '/calculators/crafts/yarn-substitution-helper', title: 'Garnbytte', description: 'Regn ut hvor mye garn du trenger når du bytter garn i en oppskrift' },
  { href: '/calculators/crafts/socks-size-calculator', title: 'Sokkestørrelse', description: 'Regn ut mål og maskeantall til sokker ut fra fotmål' },
];

const gaugeChart = [
  { weight: 'Lace', stitches: '31–33', rows: '39–43', needle: '1,5–2,25' },
  { weight: 'Sokkegarn', stitches: '27–31', rows: '35–39', needle: '2,25–3,25' },
  { weight: 'Sportsgarn', stitches: '23–26', rows: '30–33', needle: '3,25–3,75' },
  { weight: 'Lett garn (DK)', stitches: '21–24', rows: '26–30', needle: '3,75–4,5' },
  { weight: 'Mellomtykt garn (worsted)', stitches: '16–20', rows: '22–26', needle: '4,5–5,5' },
  { weight: 'Tykt garn', stitches: '12–15', rows: '16–20', needle: '5,5–8' },
  { weight: 'Ekstra tykt garn', stitches: '7–11', rows: '12–16', needle: '8 og opp' },
];

export default function KnittingStitchConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="knitting-stitch-converter"
          title="Strikkeoppskrift til din strikkefasthet"
          description="Regn om maskeantallet i en strikkeoppskrift til din egen strikkefasthet, eller regn ut masker og pinner til en ønsket størrelse. Fasthet per 10 cm. Gratis og uten registrering."
          colorClass="bg-purple-100 text-purple-600"
        />

        <section aria-label="Strikkeoppskrift til din strikkefasthet">
          <KnittingStitchConverter />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Typisk fasthet i glattstrikk (per 10 cm)</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Garntykkelse</th>
                      <th className="text-center py-3 px-4 font-medium">Masker</th>
                      <th className="text-center py-3 px-4 font-medium">Pinner</th>
                      <th className="text-center py-3 px-4 font-medium">Pinner (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gaugeChart.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4 font-medium">{item.weight}</td>
                        <td className="py-3 px-4 text-center">{item.stitches}</td>
                        <td className="py-3 px-4 text-center">{item.rows}</td>
                        <td className="py-3 px-4 text-center">{item.needle}</td>
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
