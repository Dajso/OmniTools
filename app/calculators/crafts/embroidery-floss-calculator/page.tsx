import { Metadata } from 'next';
import { EmbroideryFlossCalculator } from '@/components/calculators/crafts';
import { ToolPageHeader, FAQSection, HowToSection, RelatedToolsSection } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Brodergarn – gratis kalkulator på nett',
  description: 'Regn ut hvor mye brodergarn du trenger til korssting og broderi. Gratis og uten registrering.',
  keywords: ['brodergarn', 'korssting', 'broderi', 'DMC', 'trådbehov'],
  alternates: { canonical: '/calculators/crafts/embroidery-floss-calculator' },
  openGraph: {
    title: 'Brodergarn',
    description: 'Regn ut hvor mye brodergarn du trenger til korssting og broderi',
    url: '/calculators/crafts/embroidery-floss-calculator',
    siteName: 'Kalkulator',
    locale: 'nb_NO',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Brodergarn',
  description: 'Regn ut hvor mye brodergarn du trenger til korssting og broderi',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  inLanguage: 'nb-NO',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'NOK' },
};

const howToSteps = [
  { name: 'Oppgi antall sting', text: 'Antall sting i fargen du regner på.' },
  { name: 'Velg stoff', text: 'Velg ct-tall, for eksempel 14 ct Aida.' },
  { name: 'Velg type sting og antall tråder', text: 'Korssting bruker vanligvis 2 tråder.' },
  { name: 'Les av resultatet', text: 'Se dokker, trådlengde og anbefalt lengde å klippe.' },
];

const faqs = [
  { question: 'Hva betyr ct?', answer: 'Antall ruter eller tråder per tomme (2,54 cm). Høyere ct-tall betyr mindre sting og mindre garnforbruk.' },
  { question: 'Hvor lang er en dokke?', answer: 'En vanlig dokke brodergarn er rundt 8 meter. Kalkulatoren regner med det og legger til 15 % ekstra.' },
  { question: 'Hvor lange tråder bør jeg klippe?', answer: 'Rundt 45 cm er en grei arbeidslengde. Lengre tråder floker seg og slites.' },
  { question: 'Hvorfor passer ikke tallet helt?', answer: 'Det er et overslag. Forbruket avhenger av hvordan du broderer, og hvor mye du bruker på å feste trådene.' },
];

const relatedTools = [
  { href: '/calculators/crafts/fabric-yardage-calculator', title: 'Stoffbehov', description: 'Regn ut hvor mye stoff du trenger til et sy-prosjekt, i meter' },
  { href: '/calculators/crafts/knitting-stitch-converter', title: 'Strikkeoppskrift til din strikkefasthet', description: 'Regn om oppskriften til din strikkefasthet og finn antall masker å legge opp' },
];

const threadUsageGuide = [
  { fabric: '11 ct Aida', strands: '3', coverage: 'Full dekning' },
  { fabric: '14 ct Aida', strands: '2', coverage: 'Full dekning' },
  { fabric: '16 ct Aida', strands: '2', coverage: 'God dekning' },
  { fabric: '18 ct Aida', strands: '1–2', coverage: 'Lett til full dekning' },
  { fabric: '25 ct, sting over 2 tråder', strands: '2', coverage: 'Full dekning' },
  { fabric: '28 ct, sting over 2 tråder', strands: '2', coverage: 'Full dekning' },
  { fabric: '32 ct, sting over 2 tråder', strands: '1–2', coverage: 'Lett til full dekning' },
];

export default function EmbroideryFlossCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolPageHeader
          toolId="embroidery-floss-calculator"
          title="Brodergarn"
          description="Regn ut hvor mange dokker brodergarn du trenger til korssting og broderi ut fra antall sting, stoff og antall tråder. Gratis og uten registrering."
          colorClass="bg-pink-100 text-pink-600"
        />

        <section aria-label="Brodergarn">
          <EmbroideryFlossCalculator />
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Hvor mange tråder bør du bruke?</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Stoff</th>
                      <th className="text-center py-3 px-4 font-medium">Tråder</th>
                      <th className="text-left py-3 px-4 font-medium">Dekning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threadUsageGuide.map((item, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="py-3 px-4">{item.fabric}</td>
                        <td className="py-3 px-4 text-center">{item.strands}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.coverage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Tips for et godt overslag</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Størrelse på en dokke</h3>
                <p className="text-sm text-muted-foreground">
                  DMC og de fleste andre merker selger dokker på 8 meter med 6 tråder. 
                  Bruker du 2 tråder, får du i praksis tre ganger så lang tråd.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Arbeidslengde</h3>
                <p className="text-sm text-muted-foreground">
                  Klipp tråder på ca. 45 cm for behagelig arbeid. Lengre tråder floker seg og slites.
                  Kortere tråder gjør at du må tre nåla oftere.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Bakstikk bruker mindre</h3>
                <p className="text-sm text-muted-foreground">
                  Konturer i bakstikk bruker omtrent 75 % av tråden som korssting bruker.
                  Franske knuter bruker enda mindre per sting.
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
